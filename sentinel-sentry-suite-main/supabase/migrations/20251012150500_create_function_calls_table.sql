-- Migration: create function_calls table to store executed function logs
create table if not exists public.function_calls (
  id uuid primary key default gen_random_uuid(),
  function_name text not null,
  input jsonb,
  output jsonb,
  status text,
  created_at timestamptz default now()
);
