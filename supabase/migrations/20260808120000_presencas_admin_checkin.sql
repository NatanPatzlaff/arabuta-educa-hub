-- Permite que a comissão organizadora (is_admin()) registre e desfaça presença
-- pelo painel /admin. Antes só o service_role podia escrever em presencas.
grant insert, delete on public.presencas to authenticated;

create policy "presencas_insert_admin" on public.presencas
  for insert to authenticated
  with check (public.is_admin());

create policy "presencas_delete_admin" on public.presencas
  for delete to authenticated
  using (public.is_admin());
