import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded: { exp: number } = jwtDecode(token); // Decode token
    const currentTime = Date.now() / 1000; // Convert to seconds

    if (decoded.exp < currentTime) {
      // Token expired, redirect to login
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token"); // Remove expired token
      return response;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
