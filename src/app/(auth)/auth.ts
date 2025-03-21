import db from "@/db";
// import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextAuthOptions } from "next-auth";

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		GithubProvider({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async session({ session, token }) {
			if (session?.user) {
				session.user.image = token.picture;
			}
			return session;
		},
		async signIn({ user }) {
			try {
				// Check if the user exists in the database
				let existingUser = await db.user.findFirst({
					where: {
						email: user.email!,
					},
				});

				// If the user does not exist, create a new user
				if (!existingUser) {
					const randomPassword = crypto
						.randomBytes(16)
						.toString("hex");
					const hashedPassword = await bcrypt.hash(
						randomPassword,
						10
					);

					existingUser = await db.user.create({
						data: {
							email: user.email!,
							name: user.name!,
							img_url: user.image,
							password: hashedPassword,
						},
					});
					// default billing
					await db.billing.create({
						data: { userId: existingUser.id },
					});
				}

				// Proceed with the sign-in process
				return true;
			} catch (error) {
				console.error("Error during sign-in:", error);
				return false;
			}
		},
	},
	secret: process.env.NEXTAUTH_SECRET || "secr3t",
	pages: {
		signIn: "/signin",
	},
} satisfies NextAuthOptions;
