import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const auth = request.cookies.get('kairo-auth')
  if (!auth || auth.value !== 'granted') {
    return NextResponse.redirect('https://meetkairo.ai/password')
  }

  return NextResponse.next()
}

export const config = {
  // Run on all routes except Next.js internals and static assets
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.ico$|manifest\\.json$|sw\\.js$).*)',
  ],
}
