/*
  # Fix infinite recursion in profiles policies

  1. Changes
    - Fix the "Admins can view all profiles" policy that was causing infinite recursion
    - The policy was referencing itself, creating an infinite loop
    - Replace with a direct check against a constant value for admin status
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a fixed version of the policy
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  USING (
    is_admin = true
  );