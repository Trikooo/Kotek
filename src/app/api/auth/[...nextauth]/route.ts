import NextAuth, {
  DefaultSession,
  User,
  Session,
  NextAuthOptions,
  Account,
  Profile,
} from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import prisma from "../../APIservices/lib/prisma";
import { AdapterUser } from "next-auth/adapters";
import { createTransport } from "nodemailer";

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

type Role = "ADMIN" | "MOD" | "USER";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [];

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        const { host } = new URL(url);
        const transport = createTransport(server);
        try {
          const result = await transport.sendMail({
            to: email,
            from: from,
            subject: `Sign in to ${host}`,
            text: `Sign in to ${host}\n${url}\n\n`,
            html: `
              <body>
                <div style="background-color: #f9f9f9; padding: 20px;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Sign in to ${host}</h2>
                    <p style="color: #666; text-align: center; margin-bottom: 30px;">Click the button below to sign in to your account.</p>
                    <div style="text-align: center; margin-bottom: 30px;">
                      <a href="${url}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Sign in</a>
                    </div>
                    <p style="color: #999; text-align: center; font-size: 14px;">If you didn't request this email, you can safely ignore it.</p>
                  </div>
                </div>
              </body>
            `,
          });
          const failed = result.rejected.concat(result.pending).filter(Boolean);
          if (failed.length) {
            throw new Error(
              `Email(s) (${failed.join(", ")}) could not be sent`
            );
          }
        } catch (error) {
          console.error("Failed to send verification email", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  events: {
    createUser: async ({ user }: { user: User }) => {
      if (user.email && ADMIN_EMAILS.includes(user.email)) {
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
    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT;
      user?: User;
      account: Account | null;
    }) {
      if (user && user.email) {
        // First time jwt callback is run, user object is available
        token.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { role: true, accounts: true },
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
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile;
    }) {
      if (user && user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { role: true, accounts: true, id: true },
        });
        const providerExists = dbUser?.accounts.some(
          (a) => a.provider === account?.provider
        );
        if (account && account.provider && dbUser && !providerExists) {
          const data = {
            userId: dbUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refresh_token: account.refresh_token ?? null,
            access_token: account.access_token ?? null,
            expires_at: account.expires_at ?? null,
            token_type: account.token_type ?? null,
            scope: account.scope ?? null,
            id_token: account.id_token ?? null,
            session_state: account.session_state ?? null,
          };
          await prisma.account.create({
            data: data,
          });
        }
      }
      return true;
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
