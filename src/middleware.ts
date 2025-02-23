import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(req: NextRequest) {
  console.log("Middleware executed for:", req.nextUrl.pathname);

  const token = req.cookies.get("token")?.value;
  console.log("Token:", token || "No token found");

  if (!token) {
    console.log("No token found, redirecting to login.");
    return redirectToLogin(req);
  }

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      console.log("Token expired, redirecting to login.");
      return redirectToLogin(req);
    }
  } catch (error) {
    console.error("Invalid token:", error);
    return redirectToLogin(req);
  }

  console.log("Middleware passed, allowing request.");
  return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", req.url));

  // Manually expire the token
  response.cookies.set("token", "", {
    expires: new Date(100 * 60 * 60 * 12),
    path: "/",
  });

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
