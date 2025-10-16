/**
 * App Router Security Adapter
 * Adapts Next.js App Router Request objects to work with the Pages Router security middleware
 */

import secureApiEndpoint from './apiSecurity';

/**
 * Secure an App Router API endpoint
 * @param request - Next.js App Router Request object
 * @returns Security check result
 */
export function secureAppRouterEndpoint(request: Request) {
  // Adapt App Router Request to Pages Router format for security check
  const url = new URL(request.url);
  const adaptedReq = {
    url: url.pathname,
    method: request.method,
    headers: {
      authorization: request.headers.get('authorization') || request.headers.get('Authorization'),
    },
  };

  // Apply security checks
  return secureApiEndpoint(adaptedReq as any, null as any);
}
