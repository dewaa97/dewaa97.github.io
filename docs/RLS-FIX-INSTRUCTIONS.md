# Supabase RLS Fix for Article Creation

You're getting "new row violates row-level security policy" error. 

## Quick Fix (Go to Supabase Dashboard)

1. Open Supabase Dashboard: https://app.supabase.com/
2. Select project: dewaa97.github.io
3. Go to **SQL Editor** (left sidebar)
4. Run the SQL from `docs/supabase-rls-fix.sql`

OR manually disable RLS:

1. Go to **Tables Editor** (left sidebar)
2. Select **articles** table
3. Click **RLS** button (top right)
4. Toggle RLS **OFF** for now

Then try creating an article again. It should work now.

After MVP testing, we'll set up proper authentication and RLS policies.
