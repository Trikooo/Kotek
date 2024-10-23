import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { type NextRequestWithAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token
    console.log("Middleware token:", token) // Debug log

    if (token?.role !== "ADMIN") {
      console.log("Non-admin access attempted:", token?.role) // Debug log
      return NextResponse.redirect(new URL("/access-denied", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*"]
}