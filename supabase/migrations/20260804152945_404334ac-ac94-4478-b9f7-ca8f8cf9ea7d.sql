revoke execute on function public.gera_codigo_mostra() from anon, authenticated, public;
revoke execute on function public.gera_codigo_proleei() from anon, authenticated, public;
revoke execute on function public.valida_prazo_submissao() from anon, authenticated, public;
revoke execute on function public.limita_coautores() from anon, authenticated, public;
revoke execute on function public.is_admin() from anon, public;
grant execute on function public.is_admin() to authenticated, service_role;