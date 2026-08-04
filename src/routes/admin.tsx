import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { campoAdmin, rotuloCampo } from "@/components/admin/base";
import { Contadores } from "@/components/admin/contadores";
import { ListaInscritos } from "@/components/admin/inscritos";
import { ListaRelatos } from "@/components/admin/relatos";

const DESC = "Área da comissão organizadora do Summit de Educação de Arabutã.";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Área administrativa — Summit de Educação de Arabutã" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Área administrativa — Summit de Educação de Arabutã" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PaginaAdmin,
});

function Login({ aviso }: { aviso: string }) {
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
        <h1 className="text-2xl text-tinta">Área da organização</h1>
        <p className="mt-2 text-sm text-ferro">
          Acesso restrito à comissão organizadora do Summit.
        </p>

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

type Estado = "carregando" | "deslogado" | "admin";

function PaginaAdmin() {
  const [estado, setEstado] = React.useState<Estado>("carregando");
  const [email, setEmail] = React.useState("");
  const [aviso, setAviso] = React.useState("");

  const avaliar = React.useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setEstado("deslogado");
      setEmail("");
      return;
    }
    const { data: ehAdmin, error } = await supabase.rpc("is_admin");
    if (error || !ehAdmin) {
      await supabase.auth.signOut();
      setAviso("Este acesso é restrito à comissão organizadora.");
      setEstado("deslogado");
      return;
    }
    setAviso("");
    setEmail(data.user.email ?? "");
    setEstado("admin");
  }, []);

  React.useEffect(() => {
    void avaliar();
    const { data: sub } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === "SIGNED_IN" || evento === "SIGNED_OUT" || evento === "USER_UPDATED") {
        void avaliar();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [avaliar]);

  if (estado === "carregando") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neve">
        <p className="text-sm text-ferro">Carregando...</p>
      </main>
    );
  }

  if (estado === "deslogado") return <Login aviso={aviso} />;

  return (
    <div className="min-h-screen bg-neve">
      <header className="sticky top-0 z-40 border-b border-cinza bg-background">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="text-base font-semibold text-tinta">
            Summit de Educação de Arabutã
            <span className="ml-2 text-xs font-normal uppercase tracking-wide text-ferro">
              Painel da organização
            </span>
          </p>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ferro sm:inline">{email}</span>
            <Button size="sm" variant="contorno" onClick={() => void supabase.auth.signOut()}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="space-y-8 px-4 py-6 sm:px-6">
        <Contadores />
        <ListaInscritos />
        <ListaRelatos />
      </main>
    </div>
  );
}
