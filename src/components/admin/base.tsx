import * as React from "react";
import { supabase } from "@/integrations/supabase/client";

export const rotuloCampo = "block text-xs font-semibold uppercase tracking-wide text-ferro";
export const campoAdmin =
  "mt-1 h-10 w-full rounded-lg border border-cinza bg-background px-3 text-sm text-tinta outline-none transition-colors placeholder:text-ferro focus:border-tinta";

export function Caixa({
  titulo,
  acoes,
  children,
}: {
  titulo: string;
  acoes?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-cinza bg-background">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-cinza px-4 py-3">
        <h2 className="text-lg text-tinta">{titulo}</h2>
        <div className="flex flex-wrap items-center gap-2">{acoes}</div>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Rolagem({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-cinza">
      <table className="w-full min-w-max border-collapse text-sm">{children}</table>
    </div>
  );
}

export const th =
  "whitespace-nowrap border-b border-cinza bg-neve px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-ferro";
export const td = "whitespace-nowrap border-b border-cinza px-3 py-2 align-top text-tinta";

export function Selo({ texto }: { texto: string }) {
  return (
    <span className="ml-2 inline-block rounded-full border border-cinza bg-neve px-2 py-0.5 text-[11px] font-semibold text-ferro">
      {texto}
    </span>
  );
}

/** Gera a signed URL só no clique, com validade de 1 hora. */
export function LinkArquivo({
  bucket,
  caminho,
  rotulo,
}: {
  bucket: string;
  caminho: string;
  rotulo: string;
}) {
  const [erro, setErro] = React.useState(false);
  const [carregando, setCarregando] = React.useState(false);

  const abrir = async () => {
    setErro(false);
    setCarregando(true);
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(caminho, 3600);
    setCarregando(false);
    if (error || !data?.signedUrl) {
      setErro(true);
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={abrir}
      className="text-sm font-semibold text-listel underline underline-offset-4 hover:text-listel-forte"
    >
      {carregando ? "Gerando..." : erro ? "Tentar de novo" : rotulo}
    </button>
  );
}
