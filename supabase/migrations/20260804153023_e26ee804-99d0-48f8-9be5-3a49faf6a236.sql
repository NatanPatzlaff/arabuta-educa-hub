create policy "relatos_upload_publico" on storage.objects for insert to anon, authenticated
with check (bucket_id in ('relatos','imagens-relatos'));

create policy "relatos_select_admin" on storage.objects for select to authenticated
using (bucket_id in ('relatos','imagens-relatos') and public.is_admin());

create policy "relatos_delete_admin" on storage.objects for delete to authenticated
using (bucket_id in ('relatos','imagens-relatos') and public.is_admin());