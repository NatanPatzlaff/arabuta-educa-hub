import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Caixa, LinkArquivo, Rolagem, Selo, td, th } from "@/components/admin/base";
import {
  ROTULO_CATEGORIA,
  ROTULO_MODO,
  baixarCsv,
  dataHora,
  mascaraCpfExibicao,
} from "@/lib/admin-formatos";
import type { Database } from "@/integrations/supabase/types";

type Coautor = { nome: string; cpf: string; email: string; contribuicao: string; ordem: number };
type StatusHabilitacao = Database["public"]["Enums"]["status_habilitacao"];

const ROTULO_STATUS: Record<StatusHabilitacao, string> = {
  nao_avaliado: "Não avaliado",
  habilitado: "Habilitado",
  pendente_correcao: "Pendente de correção",
  inabilitado: "Inabilitado",
};

type RelatoMostra = {
  id: string;
  codigo: string;
  titulo: string;
  categoria: string;
  modo_participacao: string;
  status_habilitacao: StatusHabilitacao;
  created_at: string;
  inscricao_id: string;
  autor_nome: string;
  autor_cpf: string;
  arquivo_docx_path: string;
  arquivo_pdf_path: string | null;
  imagens: string[];
  inscricoes: { nome_completo: string; email: string; cpf: string } | null;
  coautores: Coautor[];
};

type Participante = { nome_completo: string; cpf: string };

const DURACAO_LINK_PLANILHA = 60 * 60 * 24 * 7;

async function linkTemporario(bucket: string, caminho: string | null | undefined): Promise<string> {
  if (!caminho) return "";
  const { data } = await supabase.storage
    .from(bucket)
    .createSignedUrl(caminho, DURACAO_LINK_PLANILHA);
  return data?.signedUrl ?? "";
}

type RelatoProleei = {
  id: string;
  codigo: string;
  nome_unidade: string;
  titulo: string;
  status_habilitacao: StatusHabilitacao;
  created_at: string;
  inscricao_id: string;
  arquivo_docx_path: string;
  imagens: string[];
  inscricoes: { nome_completo: string; email: string } | null;
  participantes_proleei: Participante[];
};

/** Numera os envios repetidos do mesmo autor, do mais antigo para o mais novo. */
function ordinalPorAutor<T extends { id: string; inscricao_id: string; created_at: string }>(
  linhas: T[],
): Record<string, number> {
  const mapa: Record<string, number> = {};
  const porAutor = new Map<string, T[]>();
  for (const l of linhas) {
    const atual = porAutor.get(l.inscricao_id) ?? [];
    atual.push(l);
    porAutor.set(l.inscricao_id, atual);
  }
  for (const lista of porAutor.values()) {
    if (lista.length < 2) continue;
    [...lista]
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .forEach((l, i) => {
        mapa[l.id] = i + 1;
      });
  }
  return mapa;
}

function seloEnvio(n: number | undefined): string | null {
  if (!n) return null;
  return `${n}º envio deste autor`;
}

function Arquivos({
  docx,
  pdf,
  imagens,
}: {
  docx: string;
  pdf?: string | null;
  imagens: string[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <LinkArquivo bucket="relatos" caminho={docx} rotulo="Word" />
      {pdf && <LinkArquivo bucket="relatos" caminho={pdf} rotulo="PDF" />}
      {imagens.map((caminho, i) => (
        <LinkArquivo
          key={caminho}
          bucket="imagens-relatos"
          caminho={caminho}
          rotulo={`Imagem ${i + 1}`}
        />
      ))}
    </div>
  );
}

function SeletorHabilitacao({
  status,
  disabled,
  onAlterar,
}: {
  status: StatusHabilitacao;
  disabled: boolean;
  onAlterar: (status: StatusHabilitacao) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Selo texto={ROTULO_STATUS[status]} />
      <select
        value={status}
        disabled={disabled}
        onChange={(e) => onAlterar(e.target.value as StatusHabilitacao)}
        className="h-8 rounded-lg border border-cinza bg-background px-2 text-xs text-tinta outline-none focus:border-tinta"
      >
        {(Object.keys(ROTULO_STATUS) as StatusHabilitacao[]).map((s) => (
          <option key={s} value={s}>
            {ROTULO_STATUS[s]}
          </option>
        ))}
      </select>
    </div>
  );
}

function AbaMostra() {
  const [linhas, setLinhas] = React.useState<RelatoMostra[]>([]);
  const [carregando, setCarregando] = React.useState(true);
  const [alterando, setAlterando] = React.useState<string | null>(null);
  const [exportando, setExportando] = React.useState(false);

  React.useEffect(() => {
    let ativo = true;
    (async () => {
      const { data } = await supabase
        .from("relatos_mostra")
        .select(
          "id, codigo, titulo, categoria, modo_participacao, status_habilitacao, created_at, inscricao_id, autor_nome, autor_cpf, arquivo_docx_path, arquivo_pdf_path, imagens, inscricoes(nome_completo, email, cpf), coautores(nome, cpf, email, contribuicao, ordem)",
        )
        .order("created_at", { ascending: false });
      if (!ativo) return;
      setLinhas((data ?? []) as unknown as RelatoMostra[]);
      setCarregando(false);
    })();
    return () => {
      ativo = false;
    };
  }, []);

  const ordinais = React.useMemo(() => ordinalPorAutor(linhas), [linhas]);

  const alterarStatus = async (id: string, status: StatusHabilitacao) => {
    setAlterando(id);
    const { error } = await supabase
      .from("relatos_mostra")
      .update({ status_habilitacao: status })
      .eq("id", id);
    if (!error) {
      setLinhas((atual) => atual.map((r) => (r.id === id ? { ...r, status_habilitacao: status } : r)));
    }
    setAlterando(null);
  };

  const exportar = async () => {
    setExportando(true);
    const arquivos = await Promise.all(
      linhas.map(async (r) => ({
        word: await linkTemporario("relatos", r.arquivo_docx_path),
        pdf: await linkTemporario("relatos", r.arquivo_pdf_path),
        imagens: await Promise.all(
          r.imagens.map((caminho) => linkTemporario("imagens-relatos", caminho)),
        ),
      })),
    );
    baixarCsv(
      "relatos-mostra",
      [
        "Código",
        "Título",
        "Categoria",
        "Autor responsável",
        "CPF do autor",
        "E-mail do autor",
        "Coautores",
        "CPF dos coautores",
        "Opção de participação",
        "Situação do relato",
        "Link do Word",
        "Link do PDF",
        "Links das imagens",
        "Envio",
      ],
      linhas.map((r, indice) => [
        r.codigo,
        r.titulo,
        ROTULO_CATEGORIA[r.categoria] ?? r.categoria,
        r.autor_nome || r.inscricoes?.nome_completo || "",
        mascaraCpfExibicao(r.autor_cpf || r.inscricoes?.cpf),
        r.inscricoes?.email ?? "",
        [...r.coautores].sort((a, b) => a.ordem - b.ordem).map((c) => c.nome).join("; "),
        [...r.coautores]
          .sort((a, b) => a.ordem - b.ordem)
          .map((c) => mascaraCpfExibicao(c.cpf))
          .join("; "),
        ROTULO_MODO[r.modo_participacao] ?? r.modo_participacao,
        ROTULO_STATUS[r.status_habilitacao],
        arquivos[indice]?.word ?? "",
        arquivos[indice]?.pdf ?? "",
        (arquivos[indice]?.imagens ?? []).filter(Boolean).join("; "),
        dataHora(r.created_at),
      ]),
    );
    setExportando(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ferro">
          Mostrando {linhas.length} {linhas.length === 1 ? "relato" : "relatos"}
        </p>
        <Button
          size="sm"
          variant="acao"
          onClick={() => void exportar()}
          disabled={linhas.length === 0 || exportando}
        >
          {exportando ? "Gerando links..." : "Baixar planilha com nomes e arquivos (CSV)"}
        </Button>
      </div>

      <p className="mt-2 text-sm text-ferro">
        A lista para o e-book traz o título, o autor responsável, os coautores e a situação de
        cada relato, com links para baixar Word, PDF e imagens. Por segurança, os links da
        planilha ficam disponíveis por 7 dias.
      </p>

      <div className="mt-3">
        <Rolagem>
          <thead>
            <tr>
              <th className={th}>Código</th>
              <th className={th}>Título</th>
              <th className={th}>Categoria</th>
              <th className={th}>Autor responsável</th>
              <th className={th}>Coautores</th>
              <th className={th}>Participação</th>
              <th className={th}>Envio</th>
              <th className={th}>Arquivos</th>
              <th className={th}>Habilitação</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((r) => (
              <tr key={r.id}>
                <td className={`${td} font-semibold`}>{r.codigo}</td>
                <td className={td}>
                  <span className="block max-w-[38ch] whitespace-normal">{r.titulo}</span>
                </td>
                <td className={td}>{ROTULO_CATEGORIA[r.categoria] ?? r.categoria}</td>
                <td className={td}>
                  {r.autor_nome || r.inscricoes?.nome_completo || "—"}
                  {seloEnvio(ordinais[r.id]) && <Selo texto={seloEnvio(ordinais[r.id])!} />}
                </td>
                <td className={td}>
                  {r.coautores.length === 0
                    ? "—"
                    : [...r.coautores].sort((a, b) => a.ordem - b.ordem).map((c) => c.nome).join(", ")}
                </td>
                <td className={td}>{ROTULO_MODO[r.modo_participacao] ?? r.modo_participacao}</td>
                <td className={td}>{dataHora(r.created_at)}</td>
                <td className={td}>
                  <Arquivos docx={r.arquivo_docx_path} pdf={r.arquivo_pdf_path} imagens={r.imagens} />
                </td>
                <td className={td}>
                  <SeletorHabilitacao
                    status={r.status_habilitacao}
                    disabled={alterando === r.id}
                    onAlterar={(status) => void alterarStatus(r.id, status)}
                  />
                </td>
              </tr>
            ))}
            {!carregando && linhas.length === 0 && (
              <tr>
                <td className={`${td} text-ferro`} colSpan={9}>
                  Nenhum relato da Mostra recebido até agora.
                </td>
              </tr>
            )}
            {carregando && (
              <tr>
                <td className={`${td} text-ferro`} colSpan={9}>
                  Carregando...
                </td>
              </tr>
            )}
          </tbody>
        </Rolagem>
      </div>
    </>
  );
}

function AbaProleei() {
  const [linhas, setLinhas] = React.useState<RelatoProleei[]>([]);
  const [carregando, setCarregando] = React.useState(true);
  const [aberta, setAberta] = React.useState<string | null>(null);
  const [alterando, setAlterando] = React.useState<string | null>(null);
  const [exportando, setExportando] = React.useState(false);

  React.useEffect(() => {
    let ativo = true;
    (async () => {
      const { data } = await supabase
        .from("relatos_proleei")
        .select(
          "id, codigo, nome_unidade, titulo, status_habilitacao, created_at, inscricao_id, arquivo_docx_path, imagens, inscricoes(nome_completo, email), participantes_proleei(nome_completo, cpf)",
        )
        .order("created_at", { ascending: false });
      if (!ativo) return;
      setLinhas((data ?? []) as unknown as RelatoProleei[]);
      setCarregando(false);
    })();
    return () => {
      ativo = false;
    };
  }, []);

  const ordinais = React.useMemo(() => ordinalPorAutor(linhas), [linhas]);

  const alterarStatus = async (id: string, status: StatusHabilitacao) => {
    setAlterando(id);
    const { error } = await supabase
      .from("relatos_proleei")
      .update({ status_habilitacao: status })
      .eq("id", id);
    if (!error) {
      setLinhas((atual) => atual.map((r) => (r.id === id ? { ...r, status_habilitacao: status } : r)));
    }
    setAlterando(null);
  };

  const exportar = async () => {
    setExportando(true);
    const arquivos = await Promise.all(
      linhas.map(async (r) => ({
        word: await linkTemporario("relatos", r.arquivo_docx_path),
        imagens: await Promise.all(
          r.imagens.map((caminho) => linkTemporario("imagens-relatos", caminho)),
        ),
      })),
    );
    baixarCsv(
      "relatos-proleei",
      [
        "Código",
        "Unidade",
        "Título",
        "Responsável pelo envio",
        "E-mail do responsável",
        "Participantes",
        "Nomes dos participantes",
        "CPF dos participantes",
        "Situação do relato",
        "Link do Word",
        "Links das imagens",
        "Envio",
      ],
      linhas.map((r, indice) => [
        r.codigo,
        r.nome_unidade,
        r.titulo,
        r.inscricoes?.nome_completo ?? "",
        r.inscricoes?.email ?? "",
        r.participantes_proleei.length,
        r.participantes_proleei.map((p) => p.nome_completo).join("; "),
        r.participantes_proleei.map((p) => mascaraCpfExibicao(p.cpf)).join("; "),
        ROTULO_STATUS[r.status_habilitacao],
        arquivos[indice]?.word ?? "",
        (arquivos[indice]?.imagens ?? []).filter(Boolean).join("; "),
        dataHora(r.created_at),
      ]),
    );
    setExportando(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ferro">
          Mostrando {linhas.length} {linhas.length === 1 ? "relato" : "relatos"}
        </p>
        <Button
          size="sm"
          variant="acao"
          onClick={() => void exportar()}
          disabled={linhas.length === 0 || exportando}
        >
          {exportando ? "Gerando links..." : "Baixar planilha com nomes e arquivos (CSV)"}
        </Button>
      </div>

      <p className="mt-2 text-sm text-ferro">
        A lista para o e-book traz a unidade, o responsável pelo envio, todos os participantes e
        a situação de cada relato, com links para baixar o documento e as imagens. Por segurança,
        os links da planilha ficam disponíveis por 7 dias.
      </p>

      <div className="mt-3">
        <Rolagem>
          <thead>
            <tr>
              <th className={th}>Código</th>
              <th className={th}>Unidade</th>
              <th className={th}>Título</th>
              <th className={th}>Responsável</th>
              <th className={th}>Participantes</th>
              <th className={th}>Envio</th>
              <th className={th}>Arquivos</th>
              <th className={th}>Habilitação</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((r) => (
              <React.Fragment key={r.id}>
                <tr>
                  <td className={`${td} font-semibold`}>{r.codigo}</td>
                  <td className={td}>{r.nome_unidade}</td>
                  <td className={td}>
                    <span className="block max-w-[38ch] whitespace-normal">{r.titulo}</span>
                  </td>
                  <td className={td}>
                    {r.inscricoes?.nome_completo ?? "—"}
                    {seloEnvio(ordinais[r.id]) && <Selo texto={seloEnvio(ordinais[r.id])!} />}
                  </td>
                  <td className={td}>
                    <button
                      type="button"
                      aria-expanded={aberta === r.id}
                      onClick={() => setAberta((a) => (a === r.id ? null : r.id))}
                      className="text-sm font-semibold text-listel underline underline-offset-4 hover:text-listel-forte"
                    >
                      {r.participantes_proleei.length}{" "}
                      {r.participantes_proleei.length === 1 ? "participante" : "participantes"}
                      {aberta === r.id ? " — ocultar" : " — ver lista"}
                    </button>
                  </td>
                  <td className={td}>{dataHora(r.created_at)}</td>
                  <td className={td}>
                    <Arquivos docx={r.arquivo_docx_path} imagens={r.imagens} />
                  </td>
                  <td className={td}>
                    <SeletorHabilitacao
                      status={r.status_habilitacao}
                      disabled={alterando === r.id}
                      onAlterar={(status) => void alterarStatus(r.id, status)}
                    />
                  </td>
                </tr>
                {aberta === r.id && (
                  <tr>
                    <td className={td} colSpan={8}>
                      <ul className="space-y-1">
                        {r.participantes_proleei.map((p, i) => (
                          <li key={`${r.id}-${i}`} className="text-sm text-tinta">
                            {i + 1}. {p.nome_completo} — {mascaraCpfExibicao(p.cpf)}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {!carregando && linhas.length === 0 && (
              <tr>
                <td className={`${td} text-ferro`} colSpan={8}>
                  Nenhum relato do ProLEEI recebido até agora.
                </td>
              </tr>
            )}
            {carregando && (
              <tr>
                <td className={`${td} text-ferro`} colSpan={8}>
                  Carregando...
                </td>
              </tr>
            )}
          </tbody>
        </Rolagem>
      </div>
    </>
  );
}

export function ListaRelatos() {
  const [aba, setAba] = React.useState<"mostra" | "proleei">("mostra");

  const botao = (valor: "mostra" | "proleei", rotulo: string) => (
    <button
      type="button"
      onClick={() => setAba(valor)}
      aria-current={aba === valor}
      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
        aba === valor ? "bg-tinta text-tinta-foreground" : "text-ferro hover:bg-neve"
      }`}
    >
      {rotulo}
    </button>
  );

  return (
    <Caixa
      titulo="Relatos"
      acoes={
        <div className="flex items-center gap-1 rounded-lg border border-cinza p-1">
          {botao("mostra", "Mostra")}
          {botao("proleei", "ProLEEI")}
        </div>
      }
    >
      {aba === "mostra" ? <AbaMostra /> : <AbaProleei />}
    </Caixa>
  );
}
