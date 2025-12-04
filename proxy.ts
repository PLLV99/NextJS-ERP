import { NextRequest, NextResponse } from "next/server";
import { Config } from "./app/Config";

// Proxy function that replaces the deprecated middleware convention
export function proxy(request: NextRequest) {
  const token = request.cookies.get(Config.tokenKey)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// Apply this proxy only to routes that start with /erp
export const config = {
  matcher: ["/erp/:path*"],
};
