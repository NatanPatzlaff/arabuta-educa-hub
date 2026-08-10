import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Caixa, LinkArquivo, Rolagem, campoAdmin, rotuloCampo, td, th } from "@/components/admin/base";
import { ROTULO_CATEGORIA, baixarCsv, dataHora } from "@/lib/admin-formatos";
import type { Database } from "@/integrations/supabase/types";

type RelatoPalco = Pick<
  Database["public"]["Tables"]["relatos_mostra"]["Row"],
  "id" | "codigo" | "titulo" | "categoria" | "arquivo_docx_path" | "arquivo_pdf_path" | "created_at"
>;
type Avaliacao = Database["public"]["Tables"]["avaliacoes_mostra"]["Row"];

const CRITERIOS = [
  { chave: "nota_resultados" as const, rotulo: "Resultados demonstrados", peso: 25 },
  { chave: "nota_clareza" as const, rotulo: "Clareza do relato", peso: 20 },
  { chave: "nota_replicacao" as const, rotulo: "Possibilidade de replicação", peso: 20 },
  { chave: "nota_intencionalidade" as const, rotulo: "Intencionalidade, criatividade e participação", peso: 20 },
  { chave: "nota_normas" as const, rotulo: "Cumprimento das normas", peso: 15 },
];

const notaVazia = () => ({
  nota_resultados: "",
  nota_clareza: "",
  nota_replicacao: "",
  nota_intencionalidade: "",
  nota_normas: "",
});

function media(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function notaTotal(a: Avaliacao): number {
  return (
    a.nota_resultados + a.nota_clareza + a.nota_replicacao + a.nota_intencionalidade + a.nota_normas
  );
}

export function Avaliacao() {
  const [relatos, setRelatos] = React.useState<RelatoPalco[]>([]);
  const [avaliacoes, setAvaliacoes] = React.useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = React.useState(true);
  const [erro, setErro] = React.useState("");

  const [relatoId, setRelatoId] = React.useState("");
  const [avaliadorNome, setAvaliadorNome] = React.useState("");
  const [notas, setNotas] = React.useState(notaVazia());
  const [observacao, setObservacao] = React.useState("");
  const [salvando, setSalvando] = React.useState(false);
  const [erroForm, setErroForm] = React.useState("");

  const carregar = React.useCallback(async () => {
    setCarregando(true);
    setErro("");
    const [{ data: dRelatos, error: eRelatos }, { data: dAvaliacoes, error: eAvaliacoes }] =
      await Promise.all([
        supabase
          .from("relatos_mostra")
          .select("id, codigo, titulo, categoria, arquivo_docx_path, arquivo_pdf_path, created_at")
          .eq("modo_participacao", "palco")
          .eq("status_habilitacao", "habilitado")
          .order("created_at", { ascending: true }),
        supabase.from("avaliacoes_mostra").select("*"),
      ]);
    if (eRelatos || eAvaliacoes) {
      setErro("Não conseguimos carregar os dados de avaliação.");
      setCarregando(false);
      return;
    }
    setRelatos(dRelatos ?? []);
    setAvaliacoes(dAvaliacoes ?? []);
    setCarregando(false);
  }, []);

  React.useEffect(() => {
    void carregar();
  }, [carregar]);

  const avaliacoesPorRelato = React.useMemo(() => {
    const mapa = new Map<string, Avaliacao[]>();
    for (const a of avaliacoes) {
      const lista = mapa.get(a.relato_mostra_id) ?? [];
      lista.push(a);
      mapa.set(a.relato_mostra_id, lista);
    }
    return mapa;
  }, [avaliacoes]);

  const ranking = React.useMemo(() => {
    const linhas = relatos.map((r) => {
      const avals = avaliacoesPorRelato.get(r.id) ?? [];
      return {
        relato: r,
        quantidade: avals.length,
        notaFinal: media(avals.map(notaTotal)),
        mediaResultados: media(avals.map((a) => a.nota_resultados)),
        mediaReplicacao: media(avals.map((a) => a.nota_replicacao)),
        mediaClareza: media(avals.map((a) => a.nota_clareza)),
      };
    });
    return [...linhas].sort((a, b) => {
      if (b.notaFinal !== a.notaFinal) return b.notaFinal - a.notaFinal;
      if (b.mediaResultados !== a.mediaResultados) return b.mediaResultados - a.mediaResultados;
      if (b.mediaReplicacao !== a.mediaReplicacao) return b.mediaReplicacao - a.mediaReplicacao;
      if (b.mediaClareza !== a.mediaClareza) return b.mediaClareza - a.mediaClareza;
      return new Date(a.relato.created_at).getTime() - new Date(b.relato.created_at).getTime();
    });
  }, [relatos, avaliacoesPorRelato]);

  const exportarAnonimo = () => {
    baixarCsv(
      "avaliacao-relatos-mostra-anonimo",
      ["Código", "Categoria", "Enviado em"],
      relatos.map((r) => [
        r.codigo,
        ROTULO_CATEGORIA[r.categoria] ?? r.categoria,
        dataHora(r.created_at),
      ]),
    );
  };

  const salvarAvaliacao = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErroForm("");

    if (!relatoId) {
      setErroForm("Escolha o relato pelo código.");
      return;
    }
    if (!avaliadorNome.trim()) {
      setErroForm("Diga o nome do avaliador.");
      return;
    }

    const valores: Record<string, number> = {};
    for (const c of CRITERIOS) {
      const bruto = notas[c.chave].replace(",", ".").trim();
      const valor = bruto === "" ? NaN : Number(bruto);
      if (Number.isNaN(valor) || valor < 0 || valor > c.peso) {
        setErroForm(`A nota de "${c.rotulo}" precisa ser um número entre 0 e ${c.peso}.`);
        return;
      }
      valores[c.chave] = valor;
    }

    setSalvando(true);
    const { error } = await supabase.from("avaliacoes_mostra").insert({
      relato_mostra_id: relatoId,
      avaliador_nome: avaliadorNome.trim(),
      nota_resultados: valores["nota_resultados"]!,
      nota_clareza: valores["nota_clareza"]!,
      nota_replicacao: valores["nota_replicacao"]!,
      nota_intencionalidade: valores["nota_intencionalidade"]!,
      nota_normas: valores["nota_normas"]!,
      observacao: observacao.trim() || null,
    });
    setSalvando(false);

    if (error) {
      setErroForm("Não conseguimos salvar essa nota agora. Tente de novo.");
      return;
    }

    setAvaliadorNome("");
    setNotas(notaVazia());
    setObservacao("");
    void carregar();
  };

  return (
    <Caixa
      titulo="Avaliação dos relatos concorrentes"
      acoes={
        <Button size="sm" variant="acao" onClick={exportarAnonimo} disabled={relatos.length === 0}>
          Exportar lista anônima (CSV)
        </Button>
      }
    >
      <p className="medida max-w-[68ch] text-sm text-ferro">
        Só entram aqui os relatos habilitados que optaram por concorrer ("quero apresentar no
        palco"). A lista exibida e o CSV não mostram título nem autoria — apenas o código do
        relato, o documento e os critérios de avaliação para o parecer. As notas devolvidas por eles
        são lançadas manualmente abaixo, por código do relato.
      </p>

      {erro && <p className="mt-4 text-sm font-semibold text-listel">{erro}</p>}

      <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-ferro">
        Ranking (nota final = média das avaliações; critérios de desempate já aplicados)
      </h3>
      <div className="mt-2">
        <Rolagem>
          <thead>
            <tr>
              <th className={th}>#</th>
              <th className={th}>Código</th>
              <th className={th}>Categoria</th>
              <th className={th}>Avaliações</th>
              <th className={th}>Nota final</th>
              <th className={th}>Arquivos</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((l, i) => (
              <tr key={l.relato.id} className={i < 5 ? "bg-sol-suave/40" : i === 5 ? "bg-neve" : ""}>
                <td className={`${td} font-semibold`}>
                  {i + 1}
                  {i < 5 && <span className="ml-2 text-xs font-semibold text-sol-foreground">palco</span>}
                  {i === 5 && <span className="ml-2 text-xs font-semibold text-ferro">suplente</span>}
                </td>
                <td className={`${td} font-semibold`}>{l.relato.codigo}</td>
                <td className={td}>{ROTULO_CATEGORIA[l.relato.categoria] ?? l.relato.categoria}</td>
                <td className={td}>{l.quantidade}</td>
                <td className={`${td} font-semibold`}>
                  {l.quantidade > 0 ? l.notaFinal.toFixed(1) : "—"}
                </td>
                <td className={td}>
                  <div className="flex flex-col gap-1">
                    <LinkArquivo bucket="relatos" caminho={l.relato.arquivo_docx_path} rotulo="Word" />
                    {l.relato.arquivo_pdf_path && (
                      <LinkArquivo bucket="relatos" caminho={l.relato.arquivo_pdf_path} rotulo="PDF" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!carregando && ranking.length === 0 && (
              <tr>
                <td className={`${td} text-ferro`} colSpan={7}>
                  Nenhum relato habilitado concorrendo ao palco até agora.
                </td>
              </tr>
            )}
            {carregando && (
              <tr>
                <td className={`${td} text-ferro`} colSpan={7}>
                  Carregando...
                </td>
              </tr>
            )}
          </tbody>
        </Rolagem>
      </div>

      <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-ferro">
        Lançar nota de um avaliador
      </h3>
      <form noValidate onSubmit={salvarAvaliacao} className="mt-3 space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="relato-avaliado" className={rotuloCampo}>
              Relato (por código)
            </label>
            <select
              id="relato-avaliado"
              value={relatoId}
              onChange={(e) => setRelatoId(e.target.value)}
              className={campoAdmin}
            >
              <option value="">Escolha o relato</option>
              {relatos.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.codigo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="avaliador-nome" className={rotuloCampo}>
              Nome do avaliador
            </label>
            <input
              id="avaliador-nome"
              value={avaliadorNome}
              onChange={(e) => setAvaliadorNome(e.target.value)}
              className={campoAdmin}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CRITERIOS.map((c) => (
            <div key={c.chave}>
              <label htmlFor={c.chave} className={rotuloCampo}>
                {c.rotulo} (0–{c.peso})
              </label>
              <input
                id={c.chave}
                inputMode="decimal"
                value={notas[c.chave]}
                onChange={(e) => setNotas((a) => ({ ...a, [c.chave]: e.target.value }))}
                className={campoAdmin}
              />
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="observacao-avaliacao" className={rotuloCampo}>
            Observação (opcional)
          </label>
          <textarea
            id="observacao-avaliacao"
            value={observacao}
            rows={2}
            onChange={(e) => setObservacao(e.target.value)}
            className="mt-1 w-full rounded-lg border border-cinza bg-background px-3 py-2 text-sm text-tinta outline-none transition-colors placeholder:text-ferro focus:border-tinta"
          />
        </div>

        {erroForm && <p className="text-sm font-semibold text-listel">{erroForm}</p>}

        <Button type="submit" size="sm" variant="acao" disabled={salvando}>
          {salvando ? "Salvando..." : "Lançar nota"}
        </Button>
      </form>
    </Caixa>
  );
}
