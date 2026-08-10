import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LinkArquivo } from "@/components/admin/base";
import { Login } from "@/components/admin/login";
import type { Database } from "@/integrations/supabase/types";

type RelatoMostra = {
  id: string;
  codigo: string;
  titulo: string;
  categoria: string;
  arquivo_docx_path: string;
  arquivo_pdf_path: string | null;
  imagens: string[];
};

type RelatoProleei = {
  id: string;
  codigo: string;
  nome_unidade: string;
  titulo: string;
  arquivo_docx_path: string;
  imagens: string[];
};

type Critério = {
  chave: "nota_resultados" | "nota_clareza" | "nota_replicacao" | "nota_intencionalidade" | "nota_normas";
  rotulo: string;
  peso: number;
};

const CRITERIOS: Critério[] = [
  { chave: "nota_resultados", rotulo: "Resultados demonstrados", peso: 25 },
  { chave: "nota_clareza", rotulo: "Clareza do relato", peso: 20 },
  { chave: "nota_replicacao", rotulo: "Possibilidade de replicação", peso: 20 },
  { chave: "nota_intencionalidade", rotulo: "Intencionalidade, criatividade e participação", peso: 20 },
  { chave: "nota_normas", rotulo: "Cumprimento das normas", peso: 15 },
];

const notaVazia = () => ({
  nota_resultados: "",
  nota_clareza: "",
  nota_replicacao: "",
  nota_intencionalidade: "",
  nota_normas: "",
});

function CampoNota({
  rotulo,
  peso,
  valor,
  onChange,
}: {
  rotulo: string;
  peso: number;
  valor: string;
  onChange: (valor: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-tinta">
        {rotulo} <span className="text-ferro">(0 a {peso})</span>
      </span>
      <input
        inputMode="decimal"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-cinza bg-background px-3 text-sm text-tinta outline-none focus:border-tinta"
        placeholder="0"
      />
    </label>
  );
}

function CardMostra({ relato }: { relato: RelatoMostra }) {
  const [avaliadorNome, setAvaliadorNome] = React.useState("");
  const [notas, setNotas] = React.useState(notaVazia());
  const [erro, setErro] = React.useState("");
  const [sucesso, setSucesso] = React.useState("");
  const [salvando, setSalvando] = React.useState(false);

  const salvar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErro("");
    setSucesso("");

    if (!avaliadorNome.trim()) {
      setErro("Informe o seu nome para registrar a avaliação.");
      return;
    }

    const valores: Record<string, number> = {};
    for (const c of CRITERIOS) {
      const bruto = notas[c.chave].replace(",", ".").trim();
      const valor = bruto === "" ? NaN : Number(bruto);
      if (Number.isNaN(valor) || valor < 0 || valor > c.peso) {
        setErro(`A nota de "${c.rotulo}" precisa ser um número entre 0 e ${c.peso}.`);
        return;
      }
      valores[c.chave] = valor;
    }

    setSalvando(true);
    const { error } = await supabase.from("avaliacoes_mostra").insert({
      relato_mostra_id: relato.id,
      avaliador_nome: avaliadorNome.trim(),
      nota_resultados: valores['nota_resultados'] ?? 0,
      nota_clareza: valores['nota_clareza'] ?? 0,
      nota_replicacao: valores['nota_replicacao'] ?? 0,
      nota_intencionalidade: valores['nota_intencionalidade'] ?? 0,
      nota_normas: valores['nota_normas'] ?? 0,
      observacao: null,
    });
    setSalvando(false);

    if (error) {
      setErro("Não foi possível salvar essa avaliação agora. Tente de novo.");
      return;
    }

    setAvaliadorNome("");
    setNotas(notaVazia());
    setSucesso("Avaliação salva.");
  };

  return (
    <form onSubmit={salvar} className="rounded-xl border border-cinza bg-neve p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ferro">{relato.codigo}</p>
          <p className="mt-1 text-sm text-ferro">
            {relato.categoria ? `Categoria: ${relato.categoria}` : "Categoria não informada"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkArquivo bucket="relatos" caminho={relato.arquivo_docx_path} rotulo="Abrir Word" />
          {relato.arquivo_pdf_path && (
            <LinkArquivo bucket="relatos" caminho={relato.arquivo_pdf_path} rotulo="Abrir PDF" />
          )}
          {relato.imagens.map((caminho, index) => (
            <LinkArquivo
              key={`${caminho}-${index}`}
              bucket="imagens-relatos"
              caminho={caminho}
              rotulo={`Imagem ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="text-sm font-semibold text-tinta">Seu nome</span>
          <input
            value={avaliadorNome}
            onChange={(e) => setAvaliadorNome(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-cinza bg-background px-3 text-sm text-tinta outline-none focus:border-tinta"
            placeholder="Nome do avaliador"
          />
        </label>
        {CRITERIOS.map((criterio) => (
          <CampoNota
            key={criterio.chave}
            rotulo={criterio.rotulo}
            peso={criterio.peso}
            valor={notas[criterio.chave]}
            onChange={(valor) => setNotas((atual) => ({ ...atual, [criterio.chave]: valor }))}
          />
        ))}
      </div>

      {erro && <p className="mt-4 text-sm font-semibold text-listel">{erro}</p>}
      {sucesso && <p className="mt-4 text-sm font-semibold text-sol-foreground">{sucesso}</p>}

      <Button type="submit" variant="acao" size="lg" className="mt-5" disabled={salvando}>
        {salvando ? "Salvando..." : "Salvar avaliação"}
      </Button>
    </form>
  );
}

function CardProleei({ relato }: { relato: RelatoProleei }) {
  return (
    <div className="rounded-xl border border-cinza bg-neve p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ferro">{relato.codigo}</p>
          <p className="mt-1 text-sm text-ferro">Unidade: {relato.nome_unidade}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkArquivo bucket="relatos" caminho={relato.arquivo_docx_path} rotulo="Abrir Word" />
          {relato.imagens.map((caminho, index) => (
            <LinkArquivo
              key={`${caminho}-${index}`}
              bucket="imagens-relatos"
              caminho={caminho}
              rotulo={`Imagem ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm text-ferro">
        Os relatos do ProLEEI não entram nesta etapa de avaliação por notas. Esta aba serve só para
        visualizar os documentos e manter a lista organizada.
      </p>
    </div>
  );
}

export function AvaliacaoRelatos() {
  const [aba, setAba] = React.useState<"mostra" | "proleei">("mostra");
  const [relatosMostra, setRelatosMostra] = React.useState<RelatoMostra[]>([]);
  const [relatosProleei, setRelatosProleei] = React.useState<RelatoProleei[]>([]);
  const [carregando, setCarregando] = React.useState(true);
  const [erro, setErro] = React.useState("");

  React.useEffect(() => {
    let ativo = true;
    (async () => {
      setCarregando(true);
      setErro("");
      const [{ data: dMostra, error: eMostra }, { data: dProleei, error: eProleei }] = await Promise.all([
        supabase
          .from("relatos_mostra")
          .select("id, codigo, titulo, categoria, arquivo_docx_path, arquivo_pdf_path, imagens")
          .eq("modo_participacao", "palco")
          .eq("status_habilitacao", "habilitado")
          .order("created_at", { ascending: true }),
        supabase
          .from("relatos_proleei")
          .select("id, codigo, nome_unidade, titulo, arquivo_docx_path, imagens")
          .order("created_at", { ascending: true }),
      ]);
      if (!ativo) return;
      if (eMostra || eProleei) {
        setErro("Não foi possível carregar os relatos para avaliação.");
        setCarregando(false);
        return;
      }
      setRelatosMostra((dMostra ?? []) as RelatoMostra[]);
      setRelatosProleei((dProleei ?? []) as RelatoProleei[]);
      setCarregando(false);
    })();
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-neve px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-cinza bg-background p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-ferro">Avaliação anônima</p>
          <h1 className="mt-2 text-3xl text-tinta">Painel de avaliação dos relatos</h1>
          <p className="mt-3 max-w-3xl text-base text-ferro">
            Aqui os avaliadores veem apenas o código do relato, os documentos e os critérios de
            avaliação. O nome do autor não aparece nesta tela.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setAba("mostra")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                aba === "mostra"
                  ? "bg-tinta text-white"
                  : "border border-cinza bg-background text-tinta"
              }`}
            >
              Mostra de Práticas
            </button>
            <button
              type="button"
              onClick={() => setAba("proleei")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                aba === "proleei"
                  ? "bg-tinta text-white"
                  : "border border-cinza bg-background text-tinta"
              }`}
            >
              ProLEEI
            </button>
          </div>

          {erro && <p className="mt-6 text-sm font-semibold text-listel">{erro}</p>}

          {carregando ? (
            <p className="mt-6 text-sm text-ferro">Carregando relatos...</p>
          ) : (
            <div className="mt-6 space-y-4">
              {aba === "mostra" ? (
                relatosMostra.length === 0 ? (
                  <p className="text-sm text-ferro">Nenhum relato da Mostra está disponível para avaliação.</p>
                ) : (
                  relatosMostra.map((relato) => <CardMostra key={relato.id} relato={relato} />)
                )
              ) : relatosProleei.length === 0 ? (
                <p className="text-sm text-ferro">Nenhum relato do ProLEEI foi enviado.</p>
              ) : (
                relatosProleei.map((relato) => <CardProleei key={relato.id} relato={relato} />)
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
