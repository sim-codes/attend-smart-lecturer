import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function middleware(request) {
  const cookieStore = await cookies();
  const user = cookieStore.get("user");

  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
