create policy "certificados_select_admin" on storage.objects for select to authenticated
using (bucket_id = 'certificados' and public.is_admin());

create policy "certificados_insert_admin" on storage.objects for insert to authenticated
with check (bucket_id = 'certificados' and public.is_admin());

create policy "certificados_update_admin" on storage.objects for update to authenticated
using (bucket_id = 'certificados' and public.is_admin())
with check (bucket_id = 'certificados' and public.is_admin());

create policy "certificados_delete_admin" on storage.objects for delete to authenticated
using (bucket_id = 'certificados' and public.is_admin());