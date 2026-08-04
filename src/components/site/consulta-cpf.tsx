import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { consultarInscricao } from "@/lib/consulta-inscricao.functions";
import { cpfValido, mascaraCPF } from "@/lib/formatos";
import { salvarSessaoRelato, type SessaoRelato } from "@/lib/sessao-relato";

export const WHATS_ORG = "(49) 99927-1442";
export const WHATS_LINK = "https://wa.me/5549999271442";

export const MSG_CONSULTA = {
  cpf_invalido: "Esse CPF não parece válido. Confira os números.",
  muitas_tentativas: "Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.",
  indisponivel: `Não conseguimos consultar sua inscrição agora. Tente de novo em instantes ou fale com a organização pelo WhatsApp ${WHATS_ORG}.`,
};

export function ConsultaCpf({
  onEncontrado,
  onNaoEncontrado,
}: {
  onEncontrado: (sessao: SessaoRelato) => void;
  onNaoEncontrado: () => void;
}) {
  const consultar = useServerFn(consultarInscricao);
  const [cpf, setCpf] = React.useState("");
  const [erro, setErro] = React.useState("");
  const [carregando, setCarregando] = React.useState(false);

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErro("");
    if (!cpfValido(cpf)) {
      setErro(MSG_CONSULTA.cpf_invalido);
      return;
    }
    setCarregando(true);
    try {
      const resposta = await consultar({ data: { cpf } });
      if ("erro" in resposta) {
        setErro(MSG_CONSULTA[resposta.erro] ?? MSG_CONSULTA.indisponivel);
        return;
      }
      if (!resposta.encontrado || !resposta.inscricao_id) {
        onNaoEncontrado();
        return;
      }
      const sessao: SessaoRelato = {
        inscricao_id: resposta.inscricao_id,
        primeiro_nome: resposta.primeiro_nome ?? "",
        pode_mostra: resposta.pode_mostra,
        pode_proleei: resposta.pode_proleei,
        nao_vai_enviar: resposta.nao_vai_enviar,
        ...(resposta.modo_participacao_preferido
          ? { modo_participacao_preferido: resposta.modo_participacao_preferido }
          : {}),
      };
      salvarSessaoRelato(sessao);
      onEncontrado(sessao);
    } catch {
      setErro(MSG_CONSULTA.indisponivel);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form noValidate onSubmit={enviar}>
      <label htmlFor="cpf-consulta" className="block text-base font-semibold text-tinta">
        CPF
      </label>
      <input
        id="cpf-consulta"
        value={cpf}
        inputMode="numeric"
        autoComplete="off"
        placeholder="000.000.000-00"
        aria-invalid={!!erro}
        aria-describedby={erro ? "erro-cpf-consulta" : undefined}
        onChange={(e) => setCpf(mascaraCPF(e.target.value))}
        className={`mt-2 h-14 w-full rounded-xl border bg-background px-4 text-base text-tinta outline-none transition-colors placeholder:text-ferro focus:border-tinta ${
          erro ? "border-listel" : "border-cinza"
        }`}
      />
      {erro && (
        <p id="erro-cpf-consulta" role="alert" className="mt-2 text-sm font-semibold text-listel">
          {erro}
        </p>
      )}
      <Button type="submit" variant="acao" size="xl" disabled={carregando} className="mt-5 w-full">
        {carregando ? "Consultando..." : "Continuar"}
      </Button>
    </form>
  );
}
