/**
 * API Security Middleware for Next Events Application
 *
 * This utility provides security for API endpoints by:
 * 1. Validating bearer tokens for all requests (except frontend-only endpoints)
 * 2. Supporting both development and production environments
 *
 * Usage: Import and call secureApiEndpoint at the beginning of your API handler
 */

import { NextApiRequest, NextApiResponse } from "next";

// Endpoints that remain open for frontend calls (no token required)
const FRONTEND_OPEN_ENDPOINTS = [
  "/api/supabase/gettopartists",
  "/api/supabase/posttopartists",
  "/api/saveTags",
  "/api/frontend/events",
  // "/api/sdhm",
];

interface SecurityResult {
  allowed: boolean;
  error?: string;
  isPreflight?: boolean;
}

/**
 * Check if endpoint should remain open for frontend calls
 */
function isFrontendOpenEndpoint(path: string): boolean {
  // Remove query parameters for matching
  const cleanPath = path.split("?")[0];

  return FRONTEND_OPEN_ENDPOINTS.some((endpoint) => {
    // Exact match or starts with the endpoint path
    return cleanPath === endpoint || cleanPath.startsWith(endpoint + "/");
  });
}

/**
 * Get allowed tokens from environment variables
 */
function getAllowedTokens(): string[] {
  const tokensEnv = process.env.API_ALLOWED_TOKENS;
  if (!tokensEnv) {
    console.warn("API_ALLOWED_TOKENS environment variable not set");
    return [];
  }
  return tokensEnv.split(",").map((token) => token.trim());
}

/**
 * Validates bearer token format and authenticity
 */
function validateBearerToken(token: string): boolean {
  if (!token) return false;

  // Remove 'Bearer ' prefix if present
  const cleanToken = token.replace(/^Bearer\s+/i, "");

  // Get allowed tokens from environment variables
  const allowedTokens = getAllowedTokens();

  // Strict token validation - only allow explicitly whitelisted tokens
  // This prevents bypassing authentication with pattern-matching tokens
  return allowedTokens.includes(cleanToken);
}

/**
 * Main security function to be called at the beginning of each API endpoint
 */
function secureApiEndpoint(
  req: NextApiRequest,
  res: NextApiResponse
): SecurityResult {
  const authHeader = req.headers.authorization;
  const requestPath = req.url || "";

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return { allowed: true, isPreflight: true };
  }

  // Check if this endpoint should remain open for frontend calls
  if (isFrontendOpenEndpoint(requestPath)) {
    return { allowed: true };
  }

  // All other endpoints require bearer token
  if (!authHeader) {
    return {
      allowed: false,
      error: "Unauthorized: Missing authentication token",
    };
  }

  if (!validateBearerToken(authHeader)) {
    return {
      allowed: false,
      error: "Unauthorized: Invalid authentication token",
    };
  }

  // Token is valid
  return { allowed: true };
}

/**
 * Higher-order function that wraps API handlers with security
 */
export function withApiSecurity(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<any>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const security = secureApiEndpoint(req, res);

    // Handle preflight requests
    if (security.isPreflight) {
      return res.status(200).end();
    }

    // Check if request is allowed
    if (!security.allowed) {
      return res.status(401).json({
        error: security.error || "Unauthorized access",
      });
    }

    // Call the original handler
    return handler(req, res);
  };
}

// Export both named and default
export default secureApiEndpoint;
