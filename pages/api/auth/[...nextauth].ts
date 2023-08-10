import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
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

// import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { prisma } from "../../../lib/global/prisma";
// import GoogleProvider from "next-auth/providers/google";
// import { NextApiHandler } from "next";

// const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
// export default authHandler;

// const prismaAdapter = PrismaAdapter(prisma);

// //Initialize connection to Google Database
// const options = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//   ],
//   adapter: prismaAdapter,
//   secret: process.env.SECRET,
//   callbacks: {
//     async session({ session, user }) {
//       session.user.id = user.id;
//       session.user.name = user.name;
//       return session;
//     },
//   },
// };
