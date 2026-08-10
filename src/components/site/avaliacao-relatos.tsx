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

type AvaliacaoMostra = Database["public"]["Tables"]["avaliacoes_mostra"]["Row"];

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

const CHAVE_AVALIADOR = "avaliacao-relatos-avaliador-nome";

function normalizarNome(valor: string) {
  return valor.trim().toLowerCase();
}

function CampoNota({
  rotulo,
  peso,
  valor,
  onChange,
  disabled = false,
}: {
  rotulo: string;
  peso: number;
  valor: string;
  onChange: (valor: string) => void;
  disabled?: boolean;
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
        disabled={disabled}
        className="mt-2 h-11 w-full rounded-xl border border-cinza bg-background px-3 text-sm text-tinta outline-none focus:border-tinta disabled:cursor-not-allowed disabled:bg-neve disabled:text-ferro"
        placeholder="0"
      />
    </label>
  );
}

function Badge({ texto }: { texto: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-sol bg-sol-suave px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-sol-foreground">
      {texto}
    </span>
  );
}

function CardMostra({
  relato,
  avaliadorNome,
  jaAvaliado,
  aberto,
  onAlternar,
  onAvaliacaoSalva,
}: {
  relato: RelatoMostra;
  avaliadorNome: string;
  jaAvaliado: boolean;
  aberto: boolean;
  onAlternar: () => void;
  onAvaliacaoSalva: () => Promise<void>;
}) {
  const [notas, setNotas] = React.useState(notaVazia());
  const [erro, setErro] = React.useState("");
  const [sucesso, setSucesso] = React.useState("");
  const [salvando, setSalvando] = React.useState(false);

  React.useEffect(() => {
    if (jaAvaliado) {
      setErro("");
      setSucesso("");
      setNotas(notaVazia());
    }
  }, [jaAvaliado]);

  const salvar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErro("");
    setSucesso("");

    if (jaAvaliado) {
      setErro("Este relato já foi avaliado por você.");
      return;
    }

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

    setNotas(notaVazia());
    setSucesso("Avaliação salva.");
    await onAvaliacaoSalva();
  };

  const bloqueado = jaAvaliado || !normalizarNome(avaliadorNome) || salvando;

  return (
    <article className="overflow-hidden rounded-xl border border-cinza bg-neve">
      <button
        type="button"
        onClick={onAlternar}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-background"
      >
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-base font-semibold uppercase tracking-wide text-tinta">{relato.codigo}</p>
          {jaAvaliado && <Badge texto="Avaliado" />}
          {!normalizarNome(avaliadorNome) && <Badge texto="Digite seu nome" />}
        </div>
        <span className="text-sm font-semibold text-ferro">
          {aberto ? "Recolher" : "Expandir"}
        </span>
      </button>

      {aberto && (
        <form onSubmit={salvar} className="border-t border-cinza p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-ferro">
                {relato.categoria ? `Categoria: ${relato.categoria}` : "Categoria não informada"}
              </p>
              <p className="mt-1 text-sm text-ferro">
                Avaliador: {normalizarNome(avaliadorNome) ? avaliadorNome.trim() : "—"}
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

          {jaAvaliado && (
            <p className="mt-4 rounded-xl border border-sol bg-sol-suave px-4 py-3 text-sm font-semibold text-sol-foreground">
              Este relato já foi avaliado por você. As notas ficam bloqueadas.
            </p>
          )}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {CRITERIOS.map((criterio) => (
              <CampoNota
                key={criterio.chave}
                rotulo={criterio.rotulo}
                peso={criterio.peso}
                valor={notas[criterio.chave]}
                disabled={bloqueado}
                onChange={(valor) => setNotas((atual) => ({ ...atual, [criterio.chave]: valor }))}
              />
            ))}
          </div>

          {erro && <p className="mt-4 text-sm font-semibold text-listel">{erro}</p>}
          {sucesso && <p className="mt-4 text-sm font-semibold text-sol-foreground">{sucesso}</p>}

          <Button
            type="submit"
            variant="acao"
            size="lg"
            className="mt-5"
            disabled={bloqueado}
          >
            {jaAvaliado ? "Avaliado" : salvando ? "Salvando..." : "Salvar avaliação"}
          </Button>
        </form>
      )}
    </article>
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
  const [avaliacoesMostra, setAvaliacoesMostra] = React.useState<AvaliacaoMostra[]>([]);
  const [avaliadorNome, setAvaliadorNome] = React.useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(CHAVE_AVALIADOR) ?? "";
  });
  const [abertoId, setAbertoId] = React.useState<string | null>(null);
  const [carregando, setCarregando] = React.useState(true);
  const [erro, setErro] = React.useState("");
  const [acesso, setAcesso] = React.useState<"carregando" | "deslogado" | "liberado">("carregando");
  const [aviso, setAviso] = React.useState("");

  const verificarAcesso = React.useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setAcesso("deslogado");
      return;
    }
    const { data: ehAdmin, error } = await supabase.rpc("is_admin");
    if (error || !ehAdmin) {
      await supabase.auth.signOut();
      setAviso("Este acesso é restrito à comissão organizadora e aos avaliadores cadastrados.");
      setAcesso("deslogado");
      return;
    }
    setAviso("");
    setAcesso("liberado");
  }, []);

  React.useEffect(() => {
    void verificarAcesso();
    const { data: sub } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === "SIGNED_IN" || evento === "SIGNED_OUT" || evento === "USER_UPDATED") {
        void verificarAcesso();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [verificarAcesso]);

  React.useEffect(() => {
    window.localStorage.setItem(CHAVE_AVALIADOR, avaliadorNome);
  }, [avaliadorNome]);

  React.useEffect(() => {
    if (acesso !== "liberado") return;
    let ativo = true;
    (async () => {
      setCarregando(true);
      setErro("");
      const [
        { data: dMostra, error: eMostra },
        { data: dProleei, error: eProleei },
        { data: dAvaliacoes, error: eAvaliacoes },
      ] = await Promise.all([
        supabase
          .from("relatos_mostra")
          .select("id, codigo, titulo, categoria, arquivo_docx_path, arquivo_pdf_path, imagens")
          .eq("modo_participacao", "palco")
          .neq("status_habilitacao", "inabilitado")
          .order("created_at", { ascending: true }),
        supabase
          .from("relatos_proleei")
          .select("id, codigo, nome_unidade, titulo, arquivo_docx_path, imagens")
          .order("created_at", { ascending: true }),
        supabase.from("avaliacoes_mostra").select("id, relato_mostra_id, avaliador_nome, criado_em"),
      ]);
      if (!ativo) return;
      if (eMostra || eProleei || eAvaliacoes) {
        setErro("Não foi possível carregar os relatos para avaliação.");
        setCarregando(false);
        return;
      }
      setRelatosMostra((dMostra ?? []) as RelatoMostra[]);
      setRelatosProleei((dProleei ?? []) as RelatoProleei[]);
      setAvaliacoesMostra((dAvaliacoes ?? []) as AvaliacaoMostra[]);
      setCarregando(false);
    })();
    return () => {
      ativo = false;
    };
  }, [acesso]);

  if (acesso === "carregando") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neve">
        <p className="text-sm text-ferro">Carregando...</p>
      </main>
    );
  }

  if (acesso === "deslogado") {
    return (
      <Login
        aviso={aviso}
        titulo="Avaliação dos relatos"
        descricao="Entre com o acesso fornecido pela organização para avaliar os relatos."
      />
    );
  }

  const nomeAtual = normalizarNome(avaliadorNome);

  const avaliadosPorAtual = React.useMemo(() => {
    const ids = new Set<string>();
    if (!nomeAtual) return ids;
    for (const avaliacao of avaliacoesMostra) {
      if (normalizarNome(avaliacao.avaliador_nome) === nomeAtual) {
        ids.add(avaliacao.relato_mostra_id);
      }
    }
    return ids;
  }, [avaliacoesMostra, nomeAtual]);

  React.useEffect(() => {
    if (abertoId && avaliadosPorAtual.has(abertoId)) {
      setAbertoId(null);
    }
  }, [abertoId, avaliadosPorAtual]);

  const recarregarAvaliacoes = React.useCallback(async () => {
    const { data, error } = await supabase
      .from("avaliacoes_mostra")
      .select("id, relato_mostra_id, avaliador_nome, criado_em");
    if (error) return;
    setAvaliacoesMostra((data ?? []) as AvaliacaoMostra[]);
  }, []);

  return (
    <main className="min-h-screen bg-neve px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-cinza bg-background p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-ferro">Avaliação anônima</p>
          <h1 className="mt-2 text-3xl text-tinta">Painel de avaliação dos relatos</h1>
          <p className="mt-3 max-w-3xl text-base text-ferro">
            Os relatos ficam recolhidos por padrão. Clique no código para expandir, avaliar e
            revisar os documentos. Quando você já tiver avaliado um relato, ele volta a recolher e
            ganha a marcação de avaliado.
          </p>

          <div className="mt-5 max-w-md">
            <label htmlFor="avaliador-nome-global" className="text-sm font-semibold text-tinta">
              Seu nome de avaliador
            </label>
            <input
              id="avaliador-nome-global"
              value={avaliadorNome}
              onChange={(e) => {
                setAvaliadorNome(e.target.value);
                setAbertoId(null);
              }}
              className="mt-2 h-11 w-full rounded-xl border border-cinza bg-background px-3 text-sm text-tinta outline-none focus:border-tinta"
              placeholder="Digite seu nome para registrar as avaliações"
            />
            <p className="mt-2 text-sm text-ferro">
              Este nome identifica quais relatos você já avaliou e bloqueia novas alterações.
            </p>
          </div>

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
                  relatosMostra.map((relato) => (
                    <CardMostra
                      key={relato.id}
                      relato={relato}
                      avaliadorNome={avaliadorNome}
                      jaAvaliado={avaliadosPorAtual.has(relato.id)}
                      aberto={abertoId === relato.id && !avaliadosPorAtual.has(relato.id)}
                      onAlternar={() =>
                        setAbertoId((atual) => (atual === relato.id ? null : relato.id))
                      }
                      onAvaliacaoSalva={recarregarAvaliacoes}
                    />
                  ))
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
