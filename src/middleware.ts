import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(req: NextRequest) {
  console.log("Middleware executed for:", req.nextUrl.pathname); // Log every request

  const token = req.cookies.get("token")?.value;
  console.log("Token:", token); // Check if token exists

  if (!token) {
    console.log("No token found, redirecting to login.");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      console.log("Token expired, redirecting to login.");
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("Middleware passed, allowing request.");
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
