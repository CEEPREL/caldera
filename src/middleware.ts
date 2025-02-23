import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(req: NextRequest) {
  console.log("Middleware executed for:", req.nextUrl.pathname);

  function redirectToLogin(req: NextRequest) {
    const response = NextResponse.redirect(new URL("/login", req.url));

    // Manually expire the token
    response.cookies.set("token", "", {
      expires: new Date(0),
      path: "/",
    });

    return response;
  }

  const token = req.cookies.get("token")?.value;
  console.log("Token:", token || "No token found");

  if (!isValidToken(token)) {
    console.log("Invalid or missing token, redirecting to login.");
    return redirectToLogin(req);
  }

  console.log("Middleware passed, allowing request.");
  return NextResponse.next();
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp >= currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
