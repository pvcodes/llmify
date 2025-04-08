'use server';
import {
  ApiError,
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
} from '@paypal/paypal-server-sdk';
import { BillingLevel, PaypalOrderStatus } from '@prisma/client';
import { z } from 'zod';

import db from '@/db';
import { logger } from '@/lib/logger';

import { getAuthenticatedUser } from './misc';

// Zod Validations
const createOrderSchema = z.object({
  tier: z.enum([BillingLevel.FREE, BillingLevel.PREMIUM, BillingLevel.ENTERPRISE]),
});

const captureOrderSchema = z.object({
  orderId: z.string().min(1),
});

// Create a PayPal Order and Store Details
export async function createOrder(input: { tier: BillingLevel }) {
  try {
    // Validate input
    const { tier } = createOrderSchema.parse(input);

    if (tier === BillingLevel.FREE) {
      throw new Error('Free tier does not require payment');
    }

    const user = await getAuthenticatedUser();

    // Initialize PayPal client and controllers for each request
    const client = initPayPalClient();
    const ordersController = new OrdersController(client);

    const requestBody = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: 'USD',
              value: TierPrice[tier],
            },
            description: `${tier} subscription - Monthly`,
          },
        ],
        application_context: {
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
        },
      },
      prefer: 'return=minimal',
    };

    logger.info(`Creating PayPal order for user ${user.id}, tier ${tier}`);
    const { result } = await ordersController.createOrder(requestBody);

    if (!result.id) {
      logger.error('PayPal order creation failed: No order ID returned');
      throw new Error('Payment processing error');
    }

    // Store order in database with idempotency key
    await db.paypalOrderDetails.create({
      data: {
        orderId: result.id,
        tier,
        userId: user.id,
        status: PaypalOrderStatus.CREATED,
      },
    });

    logger.info(`Created PayPal order ${result.id} for user ${user.id}`);
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Validation error in createOrder:', error.errors);
      throw new Error(`Invalid input: ${error.errors[0]?.message || 'validation failed'}`);
    }

    if (error instanceof ApiError) {
      logger.error('PayPal API error in createOrder:', error.result);
      throw new Error('Payment service error');
    }

    logger.error('Error in createOrder:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('An unexpected error occurred');
  }
}

// Capture Order and Update Billing
export async function captureOrderAndUpdateBilling(input: { orderId: string }) {
  // Start a transaction for atomic operations
  return db.$transaction(async (tx) => {
    try {
      // Validate input
      const { orderId } = captureOrderSchema.parse(input);

      const user = await getAuthenticatedUser();
      logger.info(`Capturing order ${orderId} for user ${user.id}`);

      // Fetch order details with locking to prevent race conditions
      const orderDetails = await tx.paypalOrderDetails.findUnique({
        where: { orderId },
      });

      if (!orderDetails) {
        logger.warn(`Order not found: ${orderId}`);
        throw new Error('Order not found');
      }

      if (orderDetails.userId !== user.id) {
        logger.warn(`User ${user.id} attempted to capture another user's order ${orderId}`);
        throw new Error('Unauthorized access');
      }

      if (orderDetails.status === PaypalOrderStatus.COMPLETED) {
        logger.info(`Order ${orderId} already captured, returning existing billing`);
        // Return existing billing info instead of failing
        const billing = await tx.billing.findUnique({
          where: { userId: user.id },
        });
        return { success: true, billing, alreadyProcessed: true };
      }

      // Initialize PayPal client for this request
      const client = initPayPalClient();
      const ordersController = new OrdersController(client);

      // Capture the order via PayPal
      const { result } = await ordersController.captureOrder({
        id: orderId,
        prefer: 'return=minimal',
      });

      if (result.status !== 'COMPLETED') {
        await tx.paypalOrderDetails.update({
          where: { orderId },
          data: { status: PaypalOrderStatus.FAILED },
        });
        logger.error(`Order capture failed with status: ${result.status}`);
        throw new Error('Payment capture failed');
      }

      // Update order status to COMPLETED
      await tx.paypalOrderDetails.update({
        where: { orderId },
        data: {
          status: PaypalOrderStatus.COMPLETED,
        },
      });

      // Calculate billing dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(startDate.getMonth() + 1); // 1-month subscription

      // Update or create billing record using tier from order details
      const billing = await tx.billing.upsert({
        where: { userId: user.id },
        update: {
          level: orderDetails.tier,
          startDate,
          endDate,
          isValid: true,
          paymentOrderId: orderId,
          tokenUsage: 0, // Reset token usage
        },
        create: {
          userId: user.id,
          level: orderDetails.tier,
          startDate,
          endDate,
          isValid: true,
          paymentOrderId: orderId,
          tokenUsage: 0,
        },
      });

      logger.info(`Successfully processed payment for order ${orderId}, user ${user.id}`);
      return { success: true, billing };
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error('Validation error in captureOrderAndUpdateBilling:', error.errors);
        throw new Error(`Invalid input: ${error.errors[0]?.message || 'validation failed'}`);
      }

      if (error instanceof ApiError) {
        logger.error('PayPal API error in captureOrderAndUpdateBilling:', error.result);
        throw new Error('Payment service error');
      }

      logger.error('Error in captureOrderAndUpdateBilling:', error);

      // We're in a transaction so we don't need explicit rollback
      if (error instanceof Error) {
        throw error;
      }

      throw new Error('An unexpected error occurred');
    }
  });
}

// Tier pricing - move to a configuration file
const TierPrice: Record<BillingLevel, string> = {
  [BillingLevel.FREE]: '0',
  [BillingLevel.PREMIUM]: '2.99',
  [BillingLevel.ENTERPRISE]: '9.99',
} as const;

// Initialize PayPal client
const initPayPalClient = () => {
  const config = {
    clientId: process.env.PAYPAL_CLIENT_ID!,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
    environment: process.env.NODE_ENV!,
  };
  return new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: config.clientId,
      oAuthClientSecret: config.clientSecret,
    },
    timeout: 30000, // 30 seconds timeout instead of unlimited
    environment: config.environment === 'production' ? Environment.Production : Environment.Sandbox,
    logging: {
      logLevel: process.env.NODE_ENV === 'production' ? LogLevel.Error : LogLevel.Info,
      logRequest: { logBody: process.env.NODE_ENV !== 'production' },
      logResponse: { logHeaders: process.env.NODE_ENV !== 'production' },
    },
  });
};
