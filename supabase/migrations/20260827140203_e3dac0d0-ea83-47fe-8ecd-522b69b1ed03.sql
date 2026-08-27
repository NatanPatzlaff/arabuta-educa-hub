-- Migration pendente: 20260808120000_presencas_admin_checkin.sql
grant insert, delete on public.presencas to authenticated;

create policy "presencas_insert_admin" on public.presencas
  for insert to authenticated
  with check (public.is_admin());

create policy "presencas_delete_admin" on public.presencas
  for delete to authenticated
  using (public.is_admin());

-- Sincronização das migrations já aplicadas no banco
insert into supabase_migrations.schema_migrations (version)
values
  ('20260808130000'),
  ('20260808140000'),
  ('20260808150000'),
  ('20260810120000'),
  ('20260827130000')
on conflict (version) do nothing;