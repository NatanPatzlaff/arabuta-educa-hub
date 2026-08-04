ALTER TABLE public.inscricoes
  ADD COLUMN IF NOT EXISTS email_confirmacao_enviado_em timestamptz,
  ADD COLUMN IF NOT EXISTS email_confirmacao_erro text;