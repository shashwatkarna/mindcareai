-- Existing query
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

UPDATE profiles SET is_premium = FALSE WHERE is_premium IS NULL;

-- NEW: Visitor Counter
create table if not exists site_stats (
  id int primary key default 1,
  visits bigint default 0
);

-- Initialize
insert into site_stats (id, visits) values (1, 0) on conflict do nothing;

-- Function to increment safely
create or replace function increment_visitor()
returns void as $$
begin
  update site_stats set visits = visits + 1 where id = 1;
end;
$$ language plpgsql;
