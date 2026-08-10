import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { campoAdmin, rotuloCampo } from "@/components/admin/base";

export function Login({
  aviso,
  titulo = "Área da organização",
  descricao = "Acesso restrito à comissão organizadora do Summit.",
}: {
  aviso: string;
  titulo?: string;
  descricao?: string;
}) {
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [erro, setErro] = React.useState("");
  const [entrando, setEntrando] = React.useState(false);

  const entrar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErro("");
    setEntrando(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    });
    setEntrando(false);
    if (error) setErro("E-mail ou senha não conferem.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-neve px-6 py-16">
      <div className="w-full max-w-sm rounded-xl border border-cinza bg-background p-6">
        <h1 className="text-2xl text-tinta">{titulo}</h1>
        <p className="mt-2 text-sm text-ferro">{descricao}</p>

        {aviso && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-listel bg-background p-3 text-sm font-semibold text-listel"
          >
            {aviso}
          </p>
        )}

        <form noValidate onSubmit={entrar} className="mt-5 space-y-4">
          <div>
            <label htmlFor="email" className={rotuloCampo}>
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={campoAdmin}
            />
          </div>
          <div>
            <label htmlFor="senha" className={rotuloCampo}>
              Senha
            </label>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={campoAdmin}
            />
          </div>

          {erro && (
            <p role="alert" className="text-sm font-semibold text-listel">
              {erro}
            </p>
          )}

          <Button type="submit" variant="acao" size="lg" className="w-full" disabled={entrando}>
            {entrando ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </main>
  );
}
