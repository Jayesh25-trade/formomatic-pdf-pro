create table public.challans (
  id uuid primary key default gen_random_uuid(),
  pc_no text not null default '',
  pc_number integer,
  date date,
  party_name text not null default '',
  material_type text not null default 'coal',
  truck_no text not null default '',
  quantity text not null default '',
  freight_rate text not null default '',
  lr_no text not null default '',
  lr_of text not null default '',
  purchase_order_no text not null default '',
  purchase_order_dated text not null default '',
  total_freight_amount text not null default '',
  advance text not null default '',
  balance_to_pay text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index challans_created_at_idx on public.challans (created_at);

create table public.pc_sequence (
  id integer primary key default 1 check (id = 1),
  last_pc_no integer not null default 210,
  updated_at timestamptz not null default now()
);

insert into public.pc_sequence (id, last_pc_no) values (1, 210) on conflict (id) do nothing;

create or replace function public.touch_pc_sequence()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  n := coalesce(substring(new.pc_no from '[0-9]+')::integer, new.pc_number, 0);
  if n > 0 then
    update public.pc_sequence
      set last_pc_no = greatest(last_pc_no, n), updated_at = now()
      where id = 1;
  end if;
  return new;
end $$;

create trigger challan_pc_sequence_trigger
after insert or update of pc_no, pc_number on public.challans
for each row execute function public.touch_pc_sequence();

grant select, insert, update, delete on public.challans to anon, authenticated;
grant all on public.challans to service_role;
grant select, update on public.pc_sequence to anon, authenticated;
grant all on public.pc_sequence to service_role;

alter table public.challans enable row level security;
alter table public.pc_sequence enable row level security;

create policy "Public read write challans" on public.challans
  for all to anon, authenticated using (true) with check (true);
create policy "Public read pc sequence" on public.pc_sequence
  for select to anon, authenticated using (true);
create policy "Public update pc sequence" on public.pc_sequence
  for update to anon, authenticated using (true) with check (true);