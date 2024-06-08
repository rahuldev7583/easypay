import { NextAuthOptions } from "next-auth";
import Github from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@repo/database";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "email",
          required: true,
        },
        password: { label: "Password", type: "password", required: true },
      },
      // TODO: User credentials type from next-aut
      async authorize(credentials: any): Promise<any> {
        // Do zod validation, OTP validation here
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          },
        });

        if (existingUser) {
          // Check email verification status
          if (!existingUser.isVerified) {
            throw new Error(
              "Please verify your email address before signing in."
            );
          }
          const passwordValidation = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              email: existingUser.email,
            };
          }
          return null;
        }

        return null;
      },
    }),
  ],
  pages: {},
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token to the token right after signin
      // if (account) {
      //   token.accessToken = account.access_token;
      // }
      if (account && account.provider) {
        const user = await prisma.user.findFirst({
          where: {
            email: profile?.email,
          },
        });

        if (!user) {
          try {
            const newUser = await prisma.user.create({
              data: {
                email: profile?.email,
                name: profile?.name,
                provider: account.provider,
                isVerified: true,
              },
            });

            token.user = newUser;
          } catch (error) {
            console.error("Error creating user:", error);
          }
        }
      }
      return token;
    },
    // TODO:  fix the session type here
    async session({ token, session }: any) {
      session.user.id = token.sub;

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
