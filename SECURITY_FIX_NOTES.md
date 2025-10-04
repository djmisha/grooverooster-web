# Security Fix for Domain Redirect Issue

## Problem
After changing the domain from `grooverooster.com` to `www.grooverooster.com`, API calls were failing with:
```
Error: API call failed: 401 - {"error":"Unauthorized: Missing authentication token"}
```

## Root Causes
1. **Missing Endpoint in Whitelist**: The `/api/sdhm/` endpoint was not in the `FRONTEND_OPEN_ENDPOINTS` list
2. **Domain Redirect Issues**: Server-side redirects can strip `Authorization` headers
3. **Path Matching Issues**: Query parameters were not being stripped before matching endpoints

## Fixes Applied

### 1. Updated `utils/apiSecurity.js`
- ✅ Added `/api/sdhm` to the `FRONTEND_OPEN_ENDPOINTS` array
- ✅ Improved `isFrontendOpenEndpoint()` to strip query parameters before matching
- ✅ Enhanced pattern matching to support exact matches and path prefixes
- ✅ Added comprehensive logging to debug security checks:
  - Logs path, method, auth status, host, referer, and origin
  - Logs when endpoints are allowed (frontend open)
  - Warns when auth headers are missing or invalid
  - Confirms when tokens are validated successfully

### 2. Created `vercel.json`
- ✅ Configured proper redirect from non-www to www using **308 status code**
  - 308 preserves HTTP method and body (unlike 301/302)
  - This ensures `Authorization` headers are maintained during redirects
- ✅ Added CORS headers for all `/api/*` endpoints
- ✅ Configured proper `Access-Control-Allow-Headers` to include `Authorization`

## How to Monitor
After deployment, check your Vercel logs for these messages:
- `[API Security Check]` - Shows every security check with request details
- `[API Security] Endpoint allowed (frontend open)` - Confirms endpoint is whitelisted
- `[API Security] Missing auth header for` - Warning when auth is missing
- `[API Security] Token validated successfully for` - Confirms authenticated requests

## Testing Checklist
- [ ] Deploy changes to Vercel
- [ ] Test API calls to `/api/sdhm/81/San%20Diego`
- [ ] Verify redirect from `grooverooster.com` to `www.grooverooster.com` works
- [ ] Check Vercel logs for security check messages
- [ ] Ensure other frontend endpoints still work:
  - `/api/supabase/gettopartists`
  - `/api/saveTags`
  - `/api/frontend/events`

## Additional Notes
- All frontend-accessible endpoints are now properly whitelisted
- Server-side redirects now preserve authentication headers
- Enhanced logging will help debug any future security issues
- If you see 401 errors after this fix, check the logs to see which path is being requested
