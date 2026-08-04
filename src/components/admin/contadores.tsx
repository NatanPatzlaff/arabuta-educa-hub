import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { horaCurta } from "@/lib/admin-formatos";

type Numeros = {
  inscritos: number;
  palco: number;
  ebook: number;
  proleei: number;
  naoEnvia: number;
  unidadesEnviaram: number;
  unidadesEsperadas: number;
  relatos: number;
  relatosPalco: number;
  relatosEbook: number;
};

const zero: Numeros = {
  inscritos: 0,
  palco: 0,
  ebook: 0,
  proleei: 0,
  naoEnvia: 0,
  unidadesEnviaram: 0,
  unidadesEsperadas: 0,
  relatos: 0,
  relatosPalco: 0,
  relatosEbook: 0,
};

async function contar(
  tabela: "inscricoes" | "relatos_mostra" | "relatos_proleei",
  filtro?: (q: any) => any,
): Promise<number> {
  let consulta: any = supabase.from(tabela).select("id", { count: "exact", head: true });
  if (filtro) consulta = filtro(consulta);
  const { count } = await consulta;
  return count ?? 0;
}

function Cartao({
  rotulo,
  valor,
  destaque,
}: {
  rotulo: string;
  valor: string;
  destaque?: boolean;
}) {
  return (
    <div className="rounded-xl border border-cinza bg-background p-4">
      <p
        className={`text-3xl font-bold leading-none ${destaque ? "text-listel" : "text-tinta"}`}
      >
        {valor}
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ferro">{rotulo}</p>
    </div>
  );
}

export function Contadores() {
  const [n, setN] = React.useState<Numeros>(zero);
  const [atualizadoEm, setAtualizadoEm] = React.useState<Date | null>(null);
  const [carregando, setCarregando] = React.useState(false);

  const carregar = React.useCallback(async () => {
    setCarregando(true);
    try {
      const [
        inscritos,
        palco,
        ebook,
        proleei,
        naoEnvia,
        relatosMostra,
        relatosProleei,
        relatosPalco,
        relatosEbook,
        unidades,
      ] = await Promise.all([
        contar("inscricoes"),
        contar("inscricoes", (q) => q.eq("quer_palco", true)),
        contar("inscricoes", (q) => q.eq("quer_ebook", true)),
        contar("inscricoes", (q) => q.eq("quer_proleei", true)),
        contar("inscricoes", (q) => q.eq("nao_vai_enviar", true)),
        contar("relatos_mostra"),
        contar("relatos_proleei"),
        contar("relatos_mostra", (q) => q.eq("modo_participacao", "palco")),
        contar("relatos_mostra", (q) => q.eq("modo_participacao", "ebook")),
        supabase.from("relatos_proleei").select("nome_unidade"),
      ]);

      const distintas = new Set(
        (unidades.data ?? []).map((r) => (r.nome_unidade ?? "").trim().toLowerCase()),
      );
      distintas.delete("");

      setN({
        inscritos,
        palco,
        ebook,
        proleei,
        naoEnvia,
        unidadesEnviaram: distintas.size,
        unidadesEsperadas: proleei,
        relatos: relatosMostra + relatosProleei,
        relatosPalco,
        relatosEbook,
      });
      setAtualizadoEm(new Date());
    } finally {
      setCarregando(false);
    }
  }, []);

  React.useEffect(() => {
    void carregar();
    const t = window.setInterval(() => void carregar(), 30_000);
    return () => window.clearInterval(t);
  }, [carregar]);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg text-tinta">Panorama</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ferro">
            {atualizadoEm ? `Última leitura às ${horaCurta(atualizadoEm)}` : "Carregando..."}
          </span>
          <Button size="sm" variant="contorno" onClick={() => void carregar()} disabled={carregando}>
            {carregando ? "Atualizando..." : "Atualizar"}
          </Button>
        </div>
      </div>

      <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-ferro">
        Declarado na inscrição
      </h3>
      <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Cartao rotulo="Total de inscritos" valor={String(n.inscritos)} destaque />
        <Cartao rotulo="Pretendem apresentar no palco" valor={String(n.palco)} />
        <Cartao rotulo="Querem só o e-book" valor={String(n.ebook)} />
        <Cartao rotulo="Vão pelo ProLEEI" valor={String(n.proleei)} />
        <Cartao rotulo="Não pretendem enviar" valor={String(n.naoEnvia)} />
      </div>

      <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-ferro">
        Relatos recebidos
      </h3>
      <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        <Cartao
          rotulo="Unidades do ProLEEI que já enviaram"
          valor={`${n.unidadesEnviaram} de ${n.unidadesEsperadas}`}
        />
        <Cartao rotulo="Total de relatos recebidos" valor={String(n.relatos)} destaque />
        <Cartao rotulo="Relatos concorrendo ao palco" valor={String(n.relatosPalco)} />
        <Cartao rotulo="Relatos só para o e-book" valor={String(n.relatosEbook)} />
      </div>

      <p className="mt-3 max-w-[68ch] text-xs text-ferro">
        Os cartões de cima contam a intenção declarada na inscrição; os de baixo contam relatos
        efetivamente recebidos. São números diferentes e não devem bater.
      </p>
    </section>
  );
}
