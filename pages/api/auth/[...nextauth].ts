import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_MUSICKIT_TOKEN as string,
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      // session.user.name = user.name;
      return session;
    },
  },
});
