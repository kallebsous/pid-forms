/*
  # Fix RLS policies for inscricoes table

  1. Changes
    - Drop existing policies that might be causing conflicts
    - Create new policies with proper security rules
    - Enable both read and write access as needed
    
  2. Security
    - Allow anyone (including unauthenticated users) to insert records
    - Allow anyone to read records (since this appears to be a public registration system)
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for anyone" ON inscricoes;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON inscricoes;

-- Create new policies
CREATE POLICY "Enable insert for anyone" 
ON inscricoes FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Enable read access for anyone" 
ON inscricoes FOR SELECT 
TO public 
USING (true);