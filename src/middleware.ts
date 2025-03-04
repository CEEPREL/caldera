import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(req: NextRequest) {
  console.log("Middleware executed for:", req.nextUrl.pathname);

  function redirectToLogin(req: NextRequest) {
    const response = NextResponse.redirect(new URL("/login", req.url));

    // Expire the token
    response.cookies.set("token", "", {
      maxAge: 0,
      path: "/",
    });

    return response;
  }

  let token = req.cookies.get("token")?.value;
  console.log("Token:", token || "No token found");

  if (token) {
    // Remove "Bearer " prefix if it exists
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }
  }

  if (!isValidToken(token)) {
    console.log("Invalid or expired token, redirecting to login.");
    return redirectToLogin(req);
  }

  return NextResponse.next();
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    console.log(
      "Decoded Token Expiry:",
      decoded.exp,
      "| Current Time:",
      currentTime
    );

    return decoded.exp > currentTime; // Ensure token hasn't expired
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
