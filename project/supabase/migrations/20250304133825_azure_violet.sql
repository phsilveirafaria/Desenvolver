/*
  # Initial Schema Setup for Desenvolver Coworking

  1. New Tables
    - `rooms` - Stores information about coworking rooms
      - `id` (uuid, primary key)
      - `name` (text)
      - `capacity` (integer)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamptz)
    
    - `bookings` - Stores room booking information
      - `id` (uuid, primary key)
      - `room_id` (uuid, foreign key to rooms)
      - `user_id` (uuid, foreign key to auth.users)
      - `user_name` (text)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `status` (text, enum: 'pending', 'approved', 'rejected')
      - `notes` (text, nullable)
      - `created_at` (timestamptz)
    
    - `profiles` - Stores user profile information
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `name` (text)
      - `is_admin` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
    - Add policies for admins to manage all data
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  capacity integer NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Rooms policies
-- Anyone can view rooms
CREATE POLICY "Anyone can view rooms"
  ON rooms
  FOR SELECT
  USING (true);

-- Only admins can create/update/delete rooms
CREATE POLICY "Admins can manage rooms"
  ON rooms
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Bookings policies
-- Users can view their own bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
  ON bookings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Users can create their own bookings
CREATE POLICY "Users can create their own bookings"
  ON bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings
CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Users can delete their own bookings
CREATE POLICY "Users can delete their own bookings"
  ON bookings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can manage all bookings
CREATE POLICY "Admins can manage all bookings"
  ON bookings
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Profiles policies
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND is_admin = false);

-- Insert sample data for rooms
INSERT INTO rooms (name, capacity, description, image_url)
VALUES
  ('Sala Inovação', 8, 'Sala de reunião equipada com projetor e quadro branco, ideal para brainstorming e apresentações.', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'),
  ('Sala Criatividade', 4, 'Espaço aconchegante para pequenas reuniões e trabalho em equipe.', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'),
  ('Sala Colaboração', 12, 'Amplo espaço para workshops e eventos, com configuração flexível de mesas.', 'https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'),
  ('Sala Foco', 2, 'Sala privativa para reuniões confidenciais ou trabalho que exige concentração.', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')
ON CONFLICT DO NOTHING;

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, is_admin)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();