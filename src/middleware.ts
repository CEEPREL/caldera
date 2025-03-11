"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(req: NextRequest) {
  function redirectToLogin(req: NextRequest) {
    if (req.nextUrl.pathname === "/login") {
      return NextResponse.next(); // Allow access to login page
    }

    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.set("token", "", { maxAge: 0, path: "/" }); // Expire token
    return response;
  }

  const token = req.cookies.get("token")?.value;

  if (!token || !isValidToken(token)) {
    return redirectToLogin(req);
  }

  // Decode the token
  // try {
  //   const decoded: any = jwtDecode(token);
  //   console.log("Decoded Token:", decoded);

  //   const userRole = decoded?.role;
  //   console.log("User Role:", userRole || "No role found");

  //   if (!userRole) {
  //     console.log("No role found in token, redirecting to login.");
  //     return redirectToLogin(req);
  //   }

  //   // Ensure users don't get redirected infinitely
  //   if (userRole !== "admin") {
  //     return NextResponse.redirect(new URL("/report", req.url));
  //   }
  //   if (userRole !== "staff") {
  //     return NextResponse.redirect(new URL("/admin", req.url));
  //   }
  // } catch (error) {
  //   console.error("Error decoding token:", error);
  //   return redirectToLogin(req);
  // }

  return NextResponse.next();
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/report/:path*"], // Middleware won't run on /login
};
