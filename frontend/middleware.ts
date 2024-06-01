import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const userType = request.cookies.get("userType")?.value;
  const userId = request.cookies.get("userId")?.value
  if (
    typeof userId !== "string" &&
    pathname.includes("/marks")
  ) {
    return NextResponse.redirect(new URL('http://localhost:3000/auth', request.url))
  }
  if (
    (typeof userType !== "string" ||
      userType !== 'teacher') &&
    (
      pathname.endsWith("/redactor") ||
      pathname.endsWith("/redactor/elements") ||
      pathname.includes("/edit/")
    )
  ) {
    return NextResponse.redirect(new URL('http://localhost:3000/not-permitted', request.url))
  }

}