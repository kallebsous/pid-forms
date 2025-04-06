/*
  # Fix RLS policies for inscricoes table

  1. Changes
    - Drop existing policies that aren't working correctly
    - Create new policies that properly allow authenticated users to:
      - Insert new registrations
      - Read all registrations
  
  2. Security
    - Maintains RLS enabled
    - Allows authenticated users to insert and read registrations
    - No restrictions on which authenticated users can perform these operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own registrations" ON inscricoes;
DROP POLICY IF EXISTS "Users can read their own registrations" ON inscricoes;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users" 
ON inscricoes FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users" 
ON inscricoes FOR SELECT 
TO authenticated 
USING (true);