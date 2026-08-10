import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Login } from "@/components/admin/login";
import { Avaliacao } from "@/components/admin/avaliacao";
import { Contadores } from "@/components/admin/contadores";
import { ListaInscritos } from "@/components/admin/inscritos";
import { ListaPresencas } from "@/components/admin/presencas";
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

type Estado = "carregando" | "deslogado" | "admin";

function PaginaAdmin() {
  const [estado, setEstado] = React.useState<Estado>("carregando");
  const [email, setEmail] = React.useState("");
  const [aviso, setAviso] = React.useState("");

  const avaliar = React.useCallback(async () => {
    const { data: sessao } = await supabase.auth.getSession();
    const usuarioSessao = sessao.session?.user;
    if (!usuarioSessao) {
      setEstado("deslogado");
      setEmail("");
      return;
    }

    const { data } = await supabase.auth.getUser();
    const usuario = data.user ?? usuarioSessao;
    const { data: ehAdmin, error } = await supabase.rpc("is_admin");
    if (error || !ehAdmin) {
      await supabase.auth.signOut();
      setAviso("Este acesso é restrito à comissão organizadora.");
      setEstado("deslogado");
      return;
    }
    setAviso("");
    setEmail(usuario.email ?? "");
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
        <ListaPresencas />
        <ListaRelatos />
        <Avaliacao />
      </main>
    </div>
  );
}
