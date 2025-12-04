import { NextRequest, NextResponse } from "next/server";
import { Config } from "./app/Config";

// Middleware function to check authentication token in cookies
export function middleware(request: NextRequest) {
  // Get the token value from cookies using the configured token key
  const token = request.cookies.get(Config.tokenKey)?.value;

  // If token does not exist, redirect the user to the home page
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// Apply this middleware only to routes that start with /erp
export const config = {
  matcher: ["/erp/:path*"],
};
