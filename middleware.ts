import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/uploadthing'])

export default clerkMiddleware((auth, request) => {

  if (!isPublicRoute(request)) {
    auth().protect()
  }
  publicRoutes: ["/api/uploadthing"]

  async function catchBlank(request: NextRequest) {
    const response = NextResponse.next(); // Proceed to the next middleware or route
  
    // Log response details and check for blank responses
    if (!response.body) {
      console.error(`[ERROR] Empty response body for URL: ${request.url}`);
    } else {
      console.log(`[RESPONSE] Status: ${response.status} - URL: ${request.url}`);
    }
  
    return response; // Return the response
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}