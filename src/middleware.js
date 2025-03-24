import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { authUtils } from "./lib/utils";

export async function middleware(request) {
  const user = await authUtils;

  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
