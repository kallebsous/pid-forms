/*
  # Update RLS policies for inscricoes table

  1. Changes
    - Add policy to allow anonymous users to insert rows into inscricoes table
    - Keep existing policies for authenticated users

  2. Security
    - Enable anonymous inserts for public registration form
    - Maintain read access only for authenticated users
*/

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON inscricoes;

-- Create new policy to allow anonymous inserts
CREATE POLICY "Enable insert for anyone" 
ON inscricoes
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Keep the existing select policy for authenticated users
-- No changes needed for the read policy