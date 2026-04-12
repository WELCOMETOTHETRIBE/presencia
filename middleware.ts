export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/children/:path*",
    "/observe/:path*",
    "/guide/:path*",
    "/learn/:path*",
    "/routines/:path*",
    "/settings/:path*",
    "/api/children/:path*",
    "/api/observations/:path*",
    "/api/milestones/:path*",
    "/api/routines/:path*",
    "/api/ai/:path*",
  ],
}
