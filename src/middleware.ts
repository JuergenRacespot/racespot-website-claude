import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Redirect www.racespot.tv → racespot.tv (301 permanent redirect).
 * This runs at the edge before any page/API route.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''

  // Redirect www to non-www
  if (host.startsWith('www.')) {
    const nonWwwHost = host.replace(/^www\./, '')
    const url = request.nextUrl.clone()
    url.host = nonWwwHost
    url.port = '' // drop any port
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

// Run on all routes except static files and Next.js internals
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.*|icon-.*|apple-touch-icon|site\\.webmanifest|og-.*|fonts/).*)',
  ],
}
