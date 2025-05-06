// filepath: d:\Full Stack [middleware.js](http://_vscodecontentref_/4)
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"], // Matches all routes except static files and Next.js internals
};