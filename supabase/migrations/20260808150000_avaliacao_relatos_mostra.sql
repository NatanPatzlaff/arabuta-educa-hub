-- §9: avaliação dos relatos concorrentes (modo_participacao = 'palco').
-- Sem login de avaliador (decisão da organização, 08/08): a comissão repassa
-- as notas manualmente depois de compartilhar os relatos de forma anônima.
-- Pesos somam 100: Resultados 25, Clareza 20, Replicação 20, Intencionalidade 20, Normas 15.

create table public.avaliacoes_mostra (
  id uuid primary key default gen_random_uuid(),
  relato_mostra_id uuid not null references public.relatos_mostra(id) on delete cascade,
  avaliador_nome text not null,
  nota_resultados numeric not null check (nota_resultados >= 0 and nota_resultados <= 25),
  nota_clareza numeric not null check (nota_clareza >= 0 and nota_clareza <= 20),
  nota_replicacao numeric not null check (nota_replicacao >= 0 and nota_replicacao <= 20),
  nota_intencionalidade numeric not null check (nota_intencionalidade >= 0 and nota_intencionalidade <= 20),
  nota_normas numeric not null check (nota_normas >= 0 and nota_normas <= 15),
  observacao text,
  criado_em timestamptz not null default now()
);

create index idx_avaliacoes_mostra_relato on public.avaliacoes_mostra(relato_mostra_id);

alter table public.avaliacoes_mostra enable row level security;

grant select, insert, update, delete on public.avaliacoes_mostra to authenticated;
grant all on public.avaliacoes_mostra to service_role;

create policy "avaliacoes_mostra_select_admin" on public.avaliacoes_mostra
  for select to authenticated using (public.is_admin());
create policy "avaliacoes_mostra_insert_admin" on public.avaliacoes_mostra
  for insert to authenticated with check (public.is_admin());
create policy "avaliacoes_mostra_update_admin" on public.avaliacoes_mostra
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "avaliacoes_mostra_delete_admin" on public.avaliacoes_mostra
  for delete to authenticated using (public.is_admin());
