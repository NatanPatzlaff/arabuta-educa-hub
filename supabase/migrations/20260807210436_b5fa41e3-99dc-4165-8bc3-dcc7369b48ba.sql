ALTER TABLE public.relatos_mostra
  ADD COLUMN IF NOT EXISTS email_confirmacao_enviado_em timestamptz,
  ADD COLUMN IF NOT EXISTS email_confirmacao_erro text;

ALTER TABLE public.relatos_proleei
  ADD COLUMN IF NOT EXISTS email_confirmacao_enviado_em timestamptz,
  ADD COLUMN IF NOT EXISTS email_confirmacao_erro text;