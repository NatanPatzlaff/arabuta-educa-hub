/** Sessão do portal de relato — sessionStorage apenas (computadores compartilhados). */

export type SessaoRelato = {
  inscricao_id: string;
  primeiro_nome: string;
  pode_mostra: boolean;
  pode_proleei: boolean;
  nao_vai_enviar: boolean;
  modo_participacao_preferido?: "palco" | "ebook";
};

const CHAVE = "summit:relato";

export function lerSessaoRelato(): SessaoRelato | null {
  if (typeof window === "undefined") return null;
  try {
    const bruto = window.sessionStorage.getItem(CHAVE);
    return bruto ? (JSON.parse(bruto) as SessaoRelato) : null;
  } catch {
    return null;
  }
}

export function salvarSessaoRelato(sessao: SessaoRelato) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CHAVE, JSON.stringify(sessao));
  } catch {
    /* ignora */
  }
}

export function limparSessaoRelato() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(CHAVE);
  } catch {
    /* ignora */
  }
}
