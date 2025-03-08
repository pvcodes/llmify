import db from "@/db";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextAuthOptions } from "next-auth";

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text", placeholder: "" },
				password: {
					label: "Password",
					type: "password",
					placeholder: "",
				},
			},
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			async authorize(credentials: any) {
				try {
					if (!credentials) return null;
					const user = await db.user.findFirst({
						where: {
							email: credentials.email,
						},
					});

					if (
						user &&
						(await bcrypt.compare(
							credentials.password,
							user.password
						))
					) {
						return {
							id: user.id,
							email: user.email,
							name: user.name,
							image: user.img_url,
						};
					}
				} catch (error) {
					console.error(error, "123213");
					return null;
				}
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async session({ session, token }) {
			console.log(session, token);
			if (session?.user) {
				session.user.id = parseInt(token.sub as string, 10);
				session.user.image = token.picture;
			}
			return session;
		},
		async signIn({ user, account, profile, email, credentials }) {
			try {
				// Check if the user exists in the database
				let existingUser = await db.user.findFirst({
					where: {
						email: user.email,
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
							email: user.email,
							name: user.name,
							img_url: user.image,
							password: hashedPassword,
						},
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
		// signIn: "/signin",
	},
} satisfies NextAuthOptions;
