-- Separar dados de autoria do conteúdo do relato para avaliação às cegas.

alter table public.relatos_mostra
  add column if not exists autor_nome text not null default '',
  add column if not exists autor_cpf text not null default '';

drop function if exists public.submeter_relato_mostra(
  uuid, text, categoria_relato, modo_participacao, text, text, text[],
  origem_imagem, boolean, boolean, boolean, text, boolean, jsonb
);

drop function if exists public.submeter_relato_mostra(
  uuid, text, text, text, categoria_relato, modo_participacao, text, text, text[],
  origem_imagem, boolean, boolean, boolean, text, boolean, jsonb
);

create function public.submeter_relato_mostra(
  p_inscricao_id uuid,
  p_titulo text,
  p_autor_nome text,
  p_autor_cpf text,
  p_categoria categoria_relato,
  p_modo modo_participacao,
  p_docx_path text,
  p_pdf_path text,
  p_imagens text[],
  p_origem origem_imagem,
  p_autorizacao boolean,
  p_declaracao_coautoria boolean,
  p_declaracao_originalidade boolean,
  p_contribuicao_autor_principal text,
  p_declaracao_direitos_autorais boolean,
  p_coautores jsonb
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
  v_existentes int;
  v_item jsonb;
  v_ordem smallint := 1;
begin
  select (i.quer_palco or i.quer_ebook) into v_ok
  from public.inscricoes i
  where i.id = p_inscricao_id;

  if v_ok is null or v_ok = false then
    raise exception 'inscricao_nao_habilitada';
  end if;

  if now() < (timestamp '2026-08-05 00:00:00' at time zone 'America/Sao_Paulo') then
    raise exception 'prazo_nao_aberto';
  end if;

  if now() > (timestamp '2026-08-23 23:59:59' at time zone 'America/Sao_Paulo') then
    raise exception 'prazo_encerrado';
  end if;

  select count(*) into v_existentes
  from public.relatos_mostra
  where inscricao_id = p_inscricao_id;

  if v_existentes >= 2 then
    raise exception 'limite_relatos_excedido';
  end if;

  v_total := coalesce(jsonb_array_length(coalesce(p_coautores, '[]'::jsonb)), 0);
  if v_total > 2 then
    raise exception 'coautores_excedidos';
  end if;

  insert into public.relatos_mostra (
    inscricao_id, titulo, autor_nome, autor_cpf, categoria, modo_participacao,
    arquivo_docx_path, arquivo_pdf_path, imagens, origem_imagens,
    autorizacao_imagem, declaracao_coautoria, declaracao_originalidade,
    contribuicao_autor_principal, declaracao_direitos_autorais
  ) values (
    p_inscricao_id, p_titulo, coalesce(p_autor_nome, ''), regexp_replace(coalesce(p_autor_cpf, ''), '\D', '', 'g'), p_categoria, p_modo,
    p_docx_path, nullif(p_pdf_path, ''), coalesce(p_imagens, '{}'::text[]), p_origem,
    coalesce(p_autorizacao, false), coalesce(p_declaracao_coautoria, false), p_declaracao_originalidade,
    coalesce(p_contribuicao_autor_principal, ''), coalesce(p_declaracao_direitos_autorais, false)
  )
  returning id, codigo into v_id, v_codigo;

  for v_item in select * from jsonb_array_elements(coalesce(p_coautores, '[]'::jsonb))
  loop
    insert into public.coautores (relato_mostra_id, nome, cpf, email, contribuicao, ordem)
    values (
      v_id,
      v_item->>'nome',
      regexp_replace(coalesce(v_item->>'cpf',''), '\D', '', 'g'),
      v_item->>'email',
      v_item->>'contribuicao',
      v_ordem
    );
    v_ordem := v_ordem + 1;
  end loop;

  return v_codigo;
end;
$$;

revoke all on function public.submeter_relato_mostra(
  uuid, text, text, text, categoria_relato, modo_participacao, text, text, text[],
  origem_imagem, boolean, boolean, boolean, text, boolean, jsonb
) from public;
grant execute on function public.submeter_relato_mostra(
  uuid, text, text, text, categoria_relato, modo_participacao, text, text, text[],
  origem_imagem, boolean, boolean, boolean, text, boolean, jsonb
) to anon, authenticated, service_role;
