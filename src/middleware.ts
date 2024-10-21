import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const token = req.nextauth.token;

    // Handle unauthenticated users
    // if (!token) {
    //   return NextResponse.redirect(new URL("/access-denied", req.url));
    // }

    // Handle authenticated users with insufficient permissions
    console.log(token);
    if (token?.role === "USER" || !token) {
      return NextResponse.redirect(new URL("/access-denied", req.url));
    }

    // Allow access for other roles (assuming they have permission)
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // This determines if the middleware function will be called
        // Return true to always run the middleware function
        return true;
      },
    },
    pages: {
      signIn: "/login",
      error: "/login",
    },
    secret: secret,
  }
);

export const config = { matcher: "/admin/:path*" };
