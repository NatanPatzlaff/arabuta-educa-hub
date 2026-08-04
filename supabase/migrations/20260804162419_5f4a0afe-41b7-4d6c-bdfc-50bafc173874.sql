create or replace function public.submeter_relato_proleei(
  p_inscricao_id uuid,
  p_nome_unidade text,
  p_titulo text,
  p_docx_path text,
  p_imagens text[],
  p_declaracao boolean,
  p_participantes jsonb
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ok boolean;
  v_id uuid;
  v_codigo text;
  v_total int;
  v_item jsonb;
begin
  select i.quer_proleei into v_ok
  from public.inscricoes i
  where i.id = p_inscricao_id;

  if v_ok is null or v_ok = false then
    raise exception 'inscricao_nao_habilitada';
  end if;

  if now() > (timestamp '2026-08-23 23:59:59' at time zone 'America/Sao_Paulo') then
    raise exception 'prazo_encerrado';
  end if;

  v_total := coalesce(jsonb_array_length(coalesce(p_participantes, '[]'::jsonb)), 0);
  if v_total < 1 then
    raise exception 'sem_participantes';
  end if;

  insert into public.relatos_proleei (
    inscricao_id, nome_unidade, titulo, arquivo_docx_path, imagens, declaracao_protecao_dados
  ) values (
    p_inscricao_id, p_nome_unidade, p_titulo, p_docx_path,
    coalesce(p_imagens, '{}'::text[]), coalesce(p_declaracao, false)
  )
  returning id, codigo into v_id, v_codigo;

  for v_item in select * from jsonb_array_elements(p_participantes)
  loop
    insert into public.participantes_proleei (relato_proleei_id, nome_completo, cpf)
    values (
      v_id,
      v_item->>'nome_completo',
      regexp_replace(coalesce(v_item->>'cpf',''), '\D', '', 'g')
    );
  end loop;

  return v_codigo;
end;
$$;

grant execute on function public.submeter_relato_proleei(uuid, text, text, text, text[], boolean, jsonb) to anon, authenticated, service_role;

drop policy if exists relatos_proleei_insert_publico on public.relatos_proleei;
drop policy if exists participantes_insert_publico on public.participantes_proleei;
revoke insert on public.relatos_proleei from anon;
revoke insert on public.participantes_proleei from anon;