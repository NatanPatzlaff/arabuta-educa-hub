REVOKE ALL ON FUNCTION public.gera_codigo_mostra() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.gera_codigo_proleei() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.limita_coautores() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.valida_prazo_submissao() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.gera_codigo_mostra() TO service_role;
GRANT EXECUTE ON FUNCTION public.gera_codigo_proleei() TO service_role;
GRANT EXECUTE ON FUNCTION public.limita_coautores() TO service_role;
GRANT EXECUTE ON FUNCTION public.valida_prazo_submissao() TO service_role;