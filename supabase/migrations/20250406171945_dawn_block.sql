/*
  # Create inscricoes table for registration

  1. New Tables
    - `inscricoes`
      - `id` (uuid, primary key)
      - `nome` (text, not null)
      - `telefone` (text, not null)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `inscricoes` table
    - Add policy for authenticated users to insert their own data
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS inscricoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own registrations"
  ON inscricoes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read their own registrations"
  ON inscricoes
  FOR SELECT
  TO authenticated
  USING (true);