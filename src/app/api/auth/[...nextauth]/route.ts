import NextAuth, { DefaultSession, Account, User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "../../APIservices/lib/prisma";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    role?: "ADMIN" | "MOD" | "USER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: "ADMIN" | "MOD" | "USER";
  }
}

const ADMIN_EMAIL = "trikooplays@gmail.com";
export const authOptions = {
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
  events: {
    createUser: async ({ user }: { user: User }) => {
      if (user.email === ADMIN_EMAIL) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" },
        });
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "USER" },
        });
      }
    },
  },
  callbacks: {
    async session({ session }: { session: Session }) {
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email as string },
        select: { role: true },
      });
      session.role = user?.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
