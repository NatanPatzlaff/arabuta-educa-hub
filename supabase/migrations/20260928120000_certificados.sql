-- Certificados finais: um PDF por participante em certificados/<cpf>.pdf.
-- Bucket privado: o público só baixa via signed URL gerada no servidor (consulta por CPF).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('certificados', 'certificados', false, 5242880, array['application/pdf'])
on conflict (id) do nothing;

create policy "certificados_select_admin" on storage.objects for select to authenticated
using (bucket_id = 'certificados' and public.is_admin());

create policy "certificados_insert_admin" on storage.objects for insert to authenticated
with check (bucket_id = 'certificados' and public.is_admin());

create policy "certificados_update_admin" on storage.objects for update to authenticated
using (bucket_id = 'certificados' and public.is_admin())
with check (bucket_id = 'certificados' and public.is_admin());

create policy "certificados_delete_admin" on storage.objects for delete to authenticated
using (bucket_id = 'certificados' and public.is_admin());
