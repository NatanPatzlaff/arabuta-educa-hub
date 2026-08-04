/** Rótulos, formatação e geração de CSV do painel administrativo. */

export const ROTULO_FUNCAO: Record<string, string> = {
  professor: "Professor(a)",
  gestao: "Equipe gestora",
  outro: "Outro",
};

export const ROTULO_CATEGORIA: Record<string, string> = {
  gestao: "Gestão",
  educacao_infantil: "Educação Infantil",
  ensino_fundamental: "Ensino Fundamental",
};

export const ROTULO_MODO: Record<string, string> = {
  palco: "Quero concorrer à apresentação",
  ebook: "Só quero aparecer no e-book",
};

export const ROTULO_HABILITACAO: Record<string, string> = {
  nao_avaliado: "Não avaliado",
  habilitado: "Habilitado",
  pendente_correcao: "Pendente de correção",
  inabilitado: "Inabilitado",
};

export function simNao(valor: boolean | null | undefined): string {
  return valor ? "Sim" : "Não";
}

/** dd/mm/aaaa hh:mm no fuso de São Paulo. */
export function dataHora(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const partes = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const p = (t: string) => partes.find((x) => x.type === t)?.value ?? "";
  return `${p("day")}/${p("month")}/${p("year")} ${p("hour")}:${p("minute")}`;
}

export function horaCurta(data: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(data);
}

export function mascaraCpfExibicao(valor: string | null | undefined): string {
  const d = (valor ?? "").replace(/\D/g, "");
  if (d.length !== 11) return valor ?? "";
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function celula(valor: unknown): string {
  const texto = valor === null || valor === undefined ? "" : String(valor);
  if (/[";\n\r]/.test(texto)) return `"${texto.replace(/"/g, '""')}"`;
  return texto;
}

/** CSV com BOM UTF-8 e separador ponto e vírgula (padrão do Excel pt-BR). */
export function baixarCsv(nomeBase: string, cabecalho: string[], linhas: unknown[][]) {
  const corpo = [cabecalho, ...linhas].map((l) => l.map(celula).join(";")).join("\r\n");
  const blob = new Blob(["\uFEFF" + corpo], { type: "text/csv;charset=utf-8;" });
  const hoje = new Date();
  const iso = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(hoje);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nomeBase}-${iso}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
