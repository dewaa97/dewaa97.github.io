# Setting up Proper RLS for Articles

Follow these steps to set up proper Row Level Security:

## Step 1: Update Database Schema

1. Go to Supabase Dashboard: https://app.supabase.com/
2. Select your project
3. Go to **SQL Editor**
4. Copy entire SQL from `docs/supabase-rls-proper.sql`
5. Paste and run it

This will:
- Add `user_id` column to articles table
- Enable RLS with proper policies
- Allow authenticated users to create articles
- Allow public viewing of published articles
- Restrict updates/deletes to article owners

## Step 2: Test It

1. In your app, try creating an article with title and content
2. The article will be saved to the currently authenticated user
3. For MVP, app uses anonymous authentication (automatic)

## What's Protected

✅ Only article owners can edit their articles
✅ Only article owners can delete their articles
✅ Everyone can view published articles
✅ Only owners can view their own draft articles
✅ Categories can be viewed by everyone

## When Ready for Real Auth

Later we can replace anonymous auth with:
- GitHub login
- Google login  
- Email/password
- etc.
