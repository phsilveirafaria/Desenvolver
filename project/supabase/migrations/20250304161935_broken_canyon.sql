/*
  # Fix bookings access and add sample data

  This migration ensures bookings can be properly accessed and adds sample data
  to demonstrate the booking functionality.
*/

-- Ensure bookings are publicly readable
DROP POLICY IF EXISTS "Anyone can view bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;

-- Create a simple policy that allows anyone to view bookings
CREATE POLICY "Anyone can view bookings"
  ON bookings
  FOR SELECT
  USING (true);

-- Add sample bookings if none exist
INSERT INTO bookings (room_id, user_id, user_name, start_time, end_time, status, notes)
SELECT 
  r.id as room_id,
  '00000000-0000-0000-0000-000000000000' as user_id,
  'Sistema' as user_name,
  (CURRENT_DATE + (n || ' days')::interval + '10:00:00'::interval) as start_time,
  (CURRENT_DATE + (n || ' days')::interval + '12:00:00'::interval) as end_time,
  'approved' as status,
  'Reserva automática' as notes
FROM 
  rooms r,
  generate_series(0, 7) as n
WHERE 
  NOT EXISTS (SELECT 1 FROM bookings LIMIT 1)
LIMIT 10;

-- Add some pending bookings
INSERT INTO bookings (room_id, user_id, user_name, start_time, end_time, status, notes)
SELECT 
  r.id as room_id,
  '00000000-0000-0000-0000-000000000000' as user_id,
  'Visitante' as user_name,
  (CURRENT_DATE + (n || ' days')::interval + '14:00:00'::interval) as start_time,
  (CURRENT_DATE + (n || ' days')::interval + '16:00:00'::interval) as end_time,
  'pending' as status,
  'Aguardando aprovação' as notes
FROM 
  rooms r,
  generate_series(0, 3) as n
WHERE 
  NOT EXISTS (SELECT 1 FROM bookings WHERE status = 'pending' LIMIT 1)
LIMIT 5;