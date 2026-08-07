-- §12: submissões abrem em 05/08/2026. Só o fechamento (23/08) era validado.
create or replace function public.valida_prazo_submissao()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if now() < (timestamp '2026-08-05 00:00:00' at time zone 'America/Sao_Paulo') then
    raise exception 'prazo_nao_aberto';
  end if;
  if now() > (timestamp '2026-08-23 23:59:59' at time zone 'America/Sao_Paulo') then
    raise exception 'prazo_encerrado';
  end if;
  return new;
end;
$$;
