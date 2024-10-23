import NextAuth, {
  DefaultSession,
  User,
  Session,
  NextAuthOptions,
} from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "../../APIservices/lib/prisma";

// Extend the built-in session types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id?: string;
      role?: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
  }
}

// Extend the built-in JWT types
declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    id?: string;
  }
}

// Define the Role type to ensure consistency
type Role = "ADMIN" | "MOD" | "USER";

const ADMIN_EMAIL = "trikooplays@gmail.com";

export const authOptions: NextAuthOptions = {
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
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  events: {
    createUser: async ({ user }: { user: User }) => {
      if (user.email === ADMIN_EMAIL) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" as Role },
        });
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "USER" as Role },
        });
      }
    },
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        // First time jwt callback is run, user object is available
        token.id = user.id;

        const dbUser = await prisma.user.findUnique({
          where: { email: user.email as string },
          select: { role: true },
        });

        token.role = dbUser?.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Redirect to home after login
      return baseUrl; // baseUrl is your root ("/")
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
