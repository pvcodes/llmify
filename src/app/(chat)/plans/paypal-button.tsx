'use client';
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { type BillingLevel } from '@prisma/client';
import { Loader, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { captureOrderAndUpdateBilling, createOrder } from '@/actions/paypal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

// Types
interface PaypalButtonProps {
  paypalClientId: string;
  environment: 'sandbox' | 'production';
  tier: BillingLevel;
  variant?: 'default' | 'upgrade' | 'renewal';
  onSuccess?: () => void;
}

// Payment status type
type PaymentStatus =
  | 'idle'
  | 'loading'
  | 'creating'
  | 'created'
  | 'approving'
  | 'success'
  | 'error'
  | 'cancelled';

// Main export component
export function PaypalButton({
  paypalClientId,
  environment,
  tier,
  variant = 'default',
}: PaypalButtonProps) {
  // Validate inputs
  if (!paypalClientId) {
    console.error('PayPal client ID is required');
    return <div className='text-red-500'>PayPal configuration error</div>;
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency: 'USD',
        intent: 'capture',
        dataNamespace: 'paypal-sdk',
        dataUserIdToken: undefined,
        vault: false,
        components: 'buttons',
        commit: true, // Show "Pay Now" instead of "Continue" in the PayPal popup
        environment,
      }}
    >
      <PaymentComponent tier={tier} variant={variant} />
    </PayPalScriptProvider>
  );
}

// Payment component with all logic
const PaymentComponent = ({
  tier,
  variant = 'default',
}: {
  tier: BillingLevel;
  variant?: 'default' | 'upgrade' | 'renewal';
}) => {
  const router = useRouter();
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');

  // Handle script loading errors
  useEffect(() => {
    if (isRejected) {
      setPaymentStatus('error');
      setErrorMessage('Failed to load PayPal script. Please try again later.');
    }
  }, [isRejected]);

  // Create order handler
  const handleCreateOrder = async () => {
    try {
      setPaymentStatus('creating');

      const order = await createOrder({ tier });

      if (!order?.id) {
        throw new Error('Order creation failed: No order ID returned');
      }

      setOrderId(order.id);
      setPaymentStatus('created');
      return order.id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error creating order';

      console.error('Error creating order:', message);
      setErrorMessage(message);
      setPaymentStatus('error');

      toast.error('Unable to create payment. Please try again.');
      throw new Error(message);
    }
  };

  // Payment approval handler
  const handleApprove = async (data: { orderID: string }) => {
    try {
      setPaymentStatus('approving');

      await captureOrderAndUpdateBilling({ orderId: data.orderID });

      setPaymentStatus('success');

      // Show appropriate success message based on variant
      if (variant === 'upgrade') {
        toast.success('Upgrade successful! Your premium features are now active.');
      } else if (variant === 'renewal') {
        toast.success('Renewal successful! Your subscription has been extended.');
      } else {
        toast.success('Billing successful! Enjoy your subscription.');
      }

      // Refresh page to reflect new subscription status after a delay
      setTimeout(() => {
        router.push('/new');
      }, 2000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error capturing order';

      console.error('Error capturing order:', message);
      setErrorMessage(message);
      setPaymentStatus('error');

      toast.error(
        `Payment processing failed. If you were charged, please contact support with Order ID: ${data.orderID}`
      );
      throw new Error(message);
    }
  };

  // Error handler
  const handleError = (err: unknown) => {
    const message = err instanceof Error ? err.message : 'Unknown PayPal error';

    setErrorMessage(message);
    setPaymentStatus('error');

    toast.error(`Payment error: Please try again later`);
  };

  // Cancel handler
  const handleCancel = () => {
    setPaymentStatus('cancelled');
    toast.info('Payment cancelled. Try Again');
  };

  // Reset error state
  const handleRetry = () => {
    setPaymentStatus('idle');
    setErrorMessage('');
  };

  // Get button text based on tier and variant
  const getButtonText = () => {
    if (variant === 'upgrade') {
      return `Upgrade to ${tier.charAt(0) + tier.slice(1).toLowerCase()}`;
    } else if (variant === 'renewal') {
      return `Renew ${tier.charAt(0) + tier.slice(1).toLowerCase()} Subscription`;
    } else {
      return `Subscribe to ${tier.charAt(0) + tier.slice(1).toLowerCase()}`;
    }
  };

  // Show different content based on payment status
  const renderContent = () => {
    // Loading state when PayPal script is loading
    if (isPending) {
      return (
        <div className='flex flex-col items-center justify-center p-4'>
          <Loader className='w-6 h-6 animate-spin mb-2 text-primary' />
          <p className='text-sm'>Loading payment options...</p>
        </div>
      );
    }

    // Success state
    if (paymentStatus === 'success') {
      return (
        <div className='flex flex-col items-center justify-center p-4'>
          <CheckCircle className='w-10 h-10 text-green-500 mb-2' />
          <h3 className='font-medium text-lg'>Payment Successful!</h3>
          <p className='text-sm mt-1'>
            {variant === 'upgrade'
              ? 'Your account has been upgraded successfully.'
              : 'Your subscription has been activated.'}
          </p>
          <p className='text-xs text-muted-foreground mt-3'>Redirecting to your dashboard...</p>
        </div>
      );
    }

    // Error state
    if (paymentStatus === 'error') {
      return (
        <div className='flex flex-col items-center justify-center p-4'>
          <AlertCircle className='w-10 h-10 text-red-500 mb-2' />
          <h3 className='font-medium text-lg'>Payment Failed</h3>
          <p className='text-sm text-muted-foreground mt-1'>
            {errorMessage || "We couldn't process your payment."}
          </p>
          <Button onClick={handleRetry} variant='outline' className='mt-4'>
            Try Again
          </Button>
        </div>
      );
    }

    // Default state - show PayPal buttons
    return (
      <>
        <div className='mb-3 text-center'>
          <span className='text-sm font-medium'>{getButtonText()}</span>

          {paymentStatus === 'creating' || paymentStatus === 'approving' ? (
            <div className='flex items-center justify-center mt-2 text-sm text-muted-foreground'>
              <Loader className='w-4 h-4 animate-spin mr-2' />
              {paymentStatus === 'creating' ? 'Creating order...' : 'Processing payment...'}
            </div>
          ) : (
            <p className='text-xs text-muted-foreground mt-1'>
              Click the PayPal button below to complete your payment
            </p>
          )}
        </div>

        {/* PayPal Buttons */}
        <div
          className={
            paymentStatus === 'creating' || paymentStatus === 'approving' ? 'opacity-50' : ''
          }
        >
          <PayPalButtons
            style={{
              layout: 'horizontal',
              color: 'gold',
              shape: 'rect',
              height: 45,
            }}
            disabled={paymentStatus === 'creating' || paymentStatus === 'approving'}
            createOrder={handleCreateOrder}
            onApprove={handleApprove}
            onError={handleError}
            onCancel={handleCancel}
          />
        </div>

        {/* Order ID display if available */}
        {orderId && (
          <p className='text-xs mt-3 text-center text-muted-foreground'>Order ID: {orderId}</p>
        )}
      </>
    );
  };

  return (
    <Card className='w-full shadow-sm'>
      <CardContent className='pt-6'>{renderContent()}</CardContent>
      <CardFooter className='flex justify-center items-center gap-2 border-t pt-4 pb-4 text-xs text-muted-foreground'>
        <ShieldCheck className='h-3 w-3' />
        Secure payment processed by PayPal
      </CardFooter>
    </Card>
  );
};
