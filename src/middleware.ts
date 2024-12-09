import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { type NextRequestWithAuth } from "next-auth/middleware";
import { toast } from "sonner";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token;

    // Check for the `/admin` route
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/access-denied", req.url));
      }
    }

    // Check for the `/settings` route
    if (req.nextUrl.pathname.startsWith("/settings")) {
      if (!token) {
        return NextResponse.redirect(
          new URL("/login?access_denied=settings", req.url)
        ); // Or any other route you prefer
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token; // Ensure that there is a token (i.e., user is authenticated)
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/settings/:path*"],
};
