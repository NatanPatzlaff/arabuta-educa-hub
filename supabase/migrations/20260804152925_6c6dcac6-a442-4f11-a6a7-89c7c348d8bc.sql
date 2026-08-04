-- ENUMS
create type public.funcao_inscrito as enum ('professor','gestao','outro');
create type public.categoria_relato as enum ('gestao','educacao_infantil','ensino_fundamental');
create type public.modo_participacao as enum ('palco','ebook');
create type public.origem_imagem as enum ('foto_pratica','gerada_ia');
create type public.status_habilitacao as enum ('nao_avaliado','habilitado','pendente_correcao','inabilitado');
create type public.periodo_presenca as enum ('manha','tarde');

-- ADMINS + is_admin
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  criado_em timestamptz not null default now()
);
grant select on public.admins to authenticated;
grant all on public.admins to service_role;
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

create policy "admins_select_admin" on public.admins for select to authenticated using (public.is_admin());

-- INSCRICOES
create table public.inscricoes (
  id uuid primary key default gen_random_uuid(),
  nome_completo text not null,
  cpf text not null unique,
  email text not null,
  whatsapp text not null,
  escola text not null,
  funcao public.funcao_inscrito not null,
  quer_palco boolean not null default false,
  quer_ebook boolean not null default false,
  quer_proleei boolean not null default false,
  nao_vai_enviar boolean not null default false,
  aceite_lgpd boolean not null,
  created_at timestamptz not null default now(),
  constraint inscricoes_cpf_digitos check (cpf ~ '^[0-9]{11}$'),
  constraint inscricoes_whatsapp_digitos check (whatsapp ~ '^[0-9]{10,11}$'),
  constraint inscricoes_email_formato check (email ~* '^[^@\s]+@[^@\s]+\.[a-z]{2,}$'),
  constraint inscricoes_aceite_lgpd check (aceite_lgpd),
  constraint inscricoes_palco_xor_ebook check (not (quer_palco and quer_ebook)),
  constraint inscricoes_nao_vai_enviar check (not nao_vai_enviar or (not quer_palco and not quer_ebook and not quer_proleei)),
  constraint inscricoes_pelo_menos_uma check (quer_palco or quer_ebook or quer_proleei or nao_vai_enviar)
);
grant insert on public.inscricoes to anon, authenticated;
grant select, update, delete on public.inscricoes to authenticated;
grant all on public.inscricoes to service_role;
alter table public.inscricoes enable row level security;
create policy "inscricoes_insert_publico" on public.inscricoes for insert to anon, authenticated with check (true);
create policy "inscricoes_select_admin" on public.inscricoes for select to authenticated using (public.is_admin());
create policy "inscricoes_update_admin" on public.inscricoes for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "inscricoes_delete_admin" on public.inscricoes for delete to authenticated using (public.is_admin());

-- SEQUENCES + CODIGO
create sequence public.seq_codigo_mostra;
create sequence public.seq_codigo_proleei;

create or replace function public.gera_codigo_mostra()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.codigo := 'R' || lpad(nextval('public.seq_codigo_mostra')::text, 3, '0');
  return new;
end;
$$;

create or replace function public.gera_codigo_proleei()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.codigo := 'P' || lpad(nextval('public.seq_codigo_proleei')::text, 3, '0');
  return new;
end;
$$;

create or replace function public.valida_prazo_submissao()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if now() > (timestamp '2026-08-23 23:59:59' at time zone 'America/Sao_Paulo') then
    raise exception 'O prazo de submissão encerrou em 23 de agosto de 2026.';
  end if;
  return new;
end;
$$;

-- RELATOS MOSTRA
create table public.relatos_mostra (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  inscricao_id uuid not null references public.inscricoes(id) on delete restrict,
  titulo text not null check (char_length(titulo) <= 120),
  categoria public.categoria_relato not null,
  modo_participacao public.modo_participacao not null,
  arquivo_docx_path text not null,
  arquivo_pdf_path text,
  imagens text[] not null default '{}' check (array_length(imagens,1) is null or array_length(imagens,1) <= 2),
  origem_imagens public.origem_imagem,
  autorizacao_imagem boolean not null default false,
  declaracao_coautoria boolean not null default false,
  declaracao_originalidade boolean not null check (declaracao_originalidade),
  status_habilitacao public.status_habilitacao not null default 'nao_avaliado',
  created_at timestamptz not null default now(),
  constraint relatos_mostra_origem_obrigatoria check (array_length(imagens,1) is null or origem_imagens is not null),
  constraint relatos_mostra_autorizacao_foto check (origem_imagens is distinct from 'foto_pratica' or autorizacao_imagem)
);
create index idx_relatos_mostra_inscricao on public.relatos_mostra(inscricao_id);
grant insert on public.relatos_mostra to anon, authenticated;
grant select, update, delete on public.relatos_mostra to authenticated;
grant all on public.relatos_mostra to service_role;
grant usage on sequence public.seq_codigo_mostra to anon, authenticated, service_role;
alter table public.relatos_mostra enable row level security;
create policy "relatos_mostra_insert_publico" on public.relatos_mostra for insert to anon, authenticated with check (true);
create policy "relatos_mostra_select_admin" on public.relatos_mostra for select to authenticated using (public.is_admin());
create policy "relatos_mostra_update_admin" on public.relatos_mostra for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "relatos_mostra_delete_admin" on public.relatos_mostra for delete to authenticated using (public.is_admin());

create trigger trg_relatos_mostra_codigo before insert on public.relatos_mostra
for each row execute function public.gera_codigo_mostra();
create trigger trg_relatos_mostra_prazo before insert on public.relatos_mostra
for each row execute function public.valida_prazo_submissao();

-- COAUTORES
create table public.coautores (
  id uuid primary key default gen_random_uuid(),
  relato_mostra_id uuid not null references public.relatos_mostra(id) on delete cascade,
  nome text not null,
  cpf text not null check (cpf ~ '^[0-9]{11}$'),
  email text not null,
  contribuicao text not null,
  ordem smallint not null
);
create index idx_coautores_relato on public.coautores(relato_mostra_id);
grant insert on public.coautores to anon, authenticated;
grant select, update, delete on public.coautores to authenticated;
grant all on public.coautores to service_role;
alter table public.coautores enable row level security;
create policy "coautores_insert_publico" on public.coautores for insert to anon, authenticated with check (true);
create policy "coautores_select_admin" on public.coautores for select to authenticated using (public.is_admin());
create policy "coautores_update_admin" on public.coautores for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "coautores_delete_admin" on public.coautores for delete to authenticated using (public.is_admin());

create or replace function public.limita_coautores()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  total int;
begin
  select count(*) into total from public.coautores where relato_mostra_id = new.relato_mostra_id;
  if total >= 2 then
    raise exception 'Cada relato pode ter no máximo 2 coautores.';
  end if;
  return new;
end;
$$;
create trigger trg_coautores_limite before insert on public.coautores
for each row execute function public.limita_coautores();

-- RELATOS PROLEEI
create table public.relatos_proleei (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  nome_unidade text not null,
  inscricao_id uuid not null references public.inscricoes(id) on delete restrict,
  titulo text not null check (char_length(titulo) <= 120),
  arquivo_docx_path text not null,
  imagens text[] not null default '{}',
  declaracao_protecao_dados boolean not null check (declaracao_protecao_dados),
  created_at timestamptz not null default now()
);
create index idx_relatos_proleei_inscricao on public.relatos_proleei(inscricao_id);
grant insert on public.relatos_proleei to anon, authenticated;
grant select, update, delete on public.relatos_proleei to authenticated;
grant all on public.relatos_proleei to service_role;
grant usage on sequence public.seq_codigo_proleei to anon, authenticated, service_role;
alter table public.relatos_proleei enable row level security;
create policy "relatos_proleei_insert_publico" on public.relatos_proleei for insert to anon, authenticated with check (true);
create policy "relatos_proleei_select_admin" on public.relatos_proleei for select to authenticated using (public.is_admin());
create policy "relatos_proleei_update_admin" on public.relatos_proleei for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "relatos_proleei_delete_admin" on public.relatos_proleei for delete to authenticated using (public.is_admin());

create trigger trg_relatos_proleei_codigo before insert on public.relatos_proleei
for each row execute function public.gera_codigo_proleei();
create trigger trg_relatos_proleei_prazo before insert on public.relatos_proleei
for each row execute function public.valida_prazo_submissao();

-- PARTICIPANTES PROLEEI
create table public.participantes_proleei (
  id uuid primary key default gen_random_uuid(),
  relato_proleei_id uuid not null references public.relatos_proleei(id) on delete cascade,
  nome_completo text not null,
  cpf text not null check (cpf ~ '^[0-9]{11}$')
);
create index idx_participantes_proleei_cpf on public.participantes_proleei(cpf);
create index idx_participantes_proleei_relato on public.participantes_proleei(relato_proleei_id);
grant insert on public.participantes_proleei to anon, authenticated;
grant select, update, delete on public.participantes_proleei to authenticated;
grant all on public.participantes_proleei to service_role;
alter table public.participantes_proleei enable row level security;
create policy "participantes_insert_publico" on public.participantes_proleei for insert to anon, authenticated with check (true);
create policy "participantes_select_admin" on public.participantes_proleei for select to authenticated using (public.is_admin());
create policy "participantes_update_admin" on public.participantes_proleei for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "participantes_delete_admin" on public.participantes_proleei for delete to authenticated using (public.is_admin());

-- PRESENCAS
create table public.presencas (
  id uuid primary key default gen_random_uuid(),
  inscricao_id uuid not null references public.inscricoes(id) on delete cascade,
  periodo public.periodo_presenca not null,
  registrado_em timestamptz not null default now(),
  unique (inscricao_id, periodo)
);
grant all on public.presencas to service_role;
alter table public.presencas enable row level security;
create policy "presencas_select_admin" on public.presencas for select to authenticated using (public.is_admin());
grant select on public.presencas to authenticated;

-- CONSULTAS CPF
create table public.consultas_cpf (
  id uuid primary key default gen_random_uuid(),
  ip text not null,
  criado_em timestamptz not null default now()
);
create index idx_consultas_cpf_ip_criado on public.consultas_cpf(ip, criado_em);
grant all on public.consultas_cpf to service_role;
alter table public.consultas_cpf enable row level security;