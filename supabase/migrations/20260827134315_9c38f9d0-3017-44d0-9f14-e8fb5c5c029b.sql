-- §8: habilitação também vale para o ProLEEI ("Todos os relatos passam por
-- conferência de habilitação"). A coluna já existe em relatos_mostra; faltava
-- em relatos_proleei. Policies de update por admin já existem.

alter table public.relatos_proleei
  add column if not exists status_habilitacao public.status_habilitacao not null default 'nao_avaliado';