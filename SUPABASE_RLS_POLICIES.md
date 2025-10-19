# Supabase Row Level Security (RLS) Policies

This document outlines the Row Level Security policies that should be implemented in Supabase to protect user data and ensure proper authorization at the database level.

## Overview

Row Level Security (RLS) is a PostgreSQL feature that allows you to control which rows users can access in a table. When RLS is enabled, all queries are automatically filtered based on the defined policies.

## Implementation Status

⚠️ **Action Required:** These policies need to be implemented in your Supabase dashboard or via SQL migrations.

## Prerequisites

Before implementing these policies, ensure:

1. You have access to the Supabase dashboard (https://app.supabase.com)
2. You have the necessary permissions to modify database policies
3. You have backed up your database

## How to Implement

### Via Supabase Dashboard:

1. Navigate to your Supabase project
2. Go to "Database" → "Policies"
3. Select the table you want to protect
4. Click "Enable RLS" if not already enabled
5. Add policies using the "New Policy" button

### Via SQL Editor:

1. Navigate to "SQL Editor" in Supabase dashboard
2. Copy and paste the SQL commands below
3. Execute the queries

---

## Required RLS Policies

### 1. Artists Table

The `artists` table stores information about music artists. Implement the following policies:

```sql
-- Enable RLS on artists table
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to all artists
CREATE POLICY "Public read access for artists"
  ON artists
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert artists
CREATE POLICY "Authenticated users can insert artists"
  ON artists
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Users can only update artists they created (if user_id column exists)
-- Note: Adjust this based on your schema
CREATE POLICY "Users can update own artists"
  ON artists
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Only service role can delete artists
CREATE POLICY "Service role can delete artists"
  ON artists
  FOR DELETE
  USING (auth.role() = 'service_role');
```

### 2. User Profiles Table (if exists)

If you have a user profiles or user data table:

```sql
-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users cannot delete their profile (optional)
-- Remove this if you want to allow profile deletion
CREATE POLICY "Prevent profile deletion"
  ON profiles
  FOR DELETE
  USING (false);
```

### 3. User Favorites/Bookmarks Table (if exists)

If you have a table for user favorites or bookmarks:

```sql
-- Enable RLS on user_favorites table
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own favorites
CREATE POLICY "Users can view own favorites"
  ON user_favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own favorites
CREATE POLICY "Users can insert own favorites"
  ON user_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own favorites
CREATE POLICY "Users can delete own favorites"
  ON user_favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Users can update their own favorites
CREATE POLICY "Users can update own favorites"
  ON user_favorites
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 4. Events Table (if exists)

For events data that may have different visibility levels:

```sql
-- Enable RLS on events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access for published events
CREATE POLICY "Public read access for published events"
  ON events
  FOR SELECT
  USING (is_published = true OR auth.uid() = created_by);

-- Policy: Authenticated users can create events
CREATE POLICY "Authenticated users can create events"
  ON events
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = created_by);

-- Policy: Users can update their own events
CREATE POLICY "Users can update own events"
  ON events
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Policy: Users can delete their own events
CREATE POLICY "Users can delete own events"
  ON events
  FOR DELETE
  USING (auth.uid() = created_by);
```

---

## Testing RLS Policies

After implementing RLS policies, test them thoroughly:

### 1. Test Unauthenticated Access

```sql
-- This should fail if RLS is properly configured
SELECT * FROM profiles WHERE id != auth.uid();
```

### 2. Test Authenticated Access

Log in as a user and verify:

- They can read their own data
- They cannot read other users' data
- They can only modify their own records

### 3. Test Service Role Access

The service role should bypass RLS and have full access to all data.

### 4. Automated Testing

Create integration tests that:

1. Attempt unauthorized access (should fail)
2. Attempt authorized access (should succeed)
3. Verify data isolation between users

---

## Common Pitfalls

### 1. Forgetting to Enable RLS

```sql
-- Always check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### 2. Service Role Bypassing RLS

The service role bypasses RLS by default. Use it carefully and only in backend code.

### 3. Missing Policies

If RLS is enabled but no policies exist, all queries will be denied by default.

### 4. Policy Conflicts

Multiple policies are combined with OR logic. Ensure policies don't conflict.

---

## Monitoring and Auditing

### Check Current Policies

```sql
-- View all policies for a table
SELECT * FROM pg_policies WHERE tablename = 'artists';
```

### Monitor Policy Performance

```sql
-- Check if policies are impacting query performance
EXPLAIN ANALYZE SELECT * FROM artists WHERE user_id = auth.uid();
```

### Audit Logging

Consider implementing audit logging for sensitive operations:

```sql
-- Create an audit log table
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  old_data JSONB,
  new_data JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Maintenance

### Regular Reviews

- Review RLS policies quarterly
- Audit access patterns and adjust policies accordingly
- Test policies after any schema changes

### Policy Updates

When updating policies:

1. Test in development environment first
2. Document the changes
3. Deploy during low-traffic periods
4. Monitor for errors after deployment

### Policy Removal

To remove a policy:

```sql
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

To disable RLS (not recommended in production):

```sql
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

---

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)

---

## Support

If you encounter issues implementing these policies:

1. Check Supabase logs in the dashboard
2. Review the PostgreSQL error messages
3. Test policies in isolation
4. Consult the Supabase community or documentation

---

**Last Updated:** 2025-10-18  
**Status:** Pending Implementation  
**Owner:** Database Administrator / DevOps Team
