import NextAuth, { DefaultSession, Account, User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import DiscordProvider from "next-auth/providers/discord";
import {PrismaAdapter} from "@auth/prisma-adapter"
import prisma from "../../APIservices/lib/prisma";


declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "email public_profile user_birthday user_location",
        },
      },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "identify email guilds",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET as string,
  pages: {
    signIn: "/login",
    error: '/login'
  }
});

export { handler as GET, handler as POST };