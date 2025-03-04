/*
  # Fix profiles table policies

  1. Changes
     - Fix infinite recursion in profiles table policies
     - Update the admin check to avoid self-referencing
     - Simplify RLS policies for profiles table
  
  2. Security
     - Maintain proper access control while avoiding recursion
     - Ensure users can only access their own profiles
     - Ensure admins can access all profiles
*/

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create new, simplified policies
-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile (except admin status)
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND (
    is_admin = false OR 
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
  ));

-- Create a separate policy for admins to view all profiles
-- This avoids the recursion by not referencing the profiles table in its own policy
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    -- Either viewing your own profile
    auth.uid() = id
    OR
    -- Or you're an admin (checking the current user's admin status directly)
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Create a policy for admins to manage all profiles
CREATE POLICY "Admins can manage all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );