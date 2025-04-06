/*
  # Add admin authentication policy

  1. Changes
    - Update RLS policies to allow authenticated admin users to view all registrations
    - Keep public insert policy for registrations
    
  2. Security
    - Only authenticated users can read registrations
    - Anyone can still submit registrations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for anyone" ON inscricoes;
DROP POLICY IF EXISTS "Enable read access for anyone" ON inscricoes;

-- Create new policies
CREATE POLICY "Enable insert for anyone" 
ON inscricoes FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users only" 
ON inscricoes FOR SELECT 
TO authenticated 
USING (true);