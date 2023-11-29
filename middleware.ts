import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const userType = request.cookies.get("userType")?.value;
  console.log(userType)
  if (
    (typeof userType !== "string" || 
    decodeURI(userType) !== 'Преподаватель') &&
    pathname.endsWith("/redactor")
    ) {
    return NextResponse.redirect(new URL('http://localhost:3000/not-permitted', request.url))
  }
}