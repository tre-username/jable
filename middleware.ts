import { clerkMiddleware, createRouteMatcher, authMiddleware } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/uploadthing'])

export default clerkMiddleware((auth, request) => {
  try {
    if (!isPublicRoute(request)) {
      auth().protect()
    }
    // Continue normally for public routes
    publicRoutes: ["/api/uploadthing"]
  } catch (error) {
    console.error("Lambda error caught:", error);
    // Return a dummy response to handle the error gracefully
    return new Response(JSON.stringify({ message: 'An error occurred, but continuing...' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
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
