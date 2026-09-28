import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { FolhaDivisor } from "@/components/site/graficos";
import { MSG_CONSULTA, WHATS_LINK, WHATS_ORG } from "@/components/site/consulta-cpf";
import { consultarCertificado } from "@/lib/consulta-certificado.functions";
import { cpfValido, mascaraCPF } from "@/lib/formatos";

const DESC = "Baixe o seu certificado do Summit de Educação de Arabutã, 8 de setembro de 2026.";

export const Route = createFileRoute("/certificado")({
  head: () => ({
    meta: [
      { title: "Certificado — Summit de Educação de Arabutã" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Certificado — Summit de Educação de Arabutã" },
      { property: "og:description", content: DESC },
    ],
  }),
  component: PaginaCertificado,
});

type Estado = { tipo: "form" } | { tipo: "encontrado"; url: string } | { tipo: "nao_encontrado" };

function PaginaCertificado() {
  const consultar = useServerFn(consultarCertificado);
  const [cpf, setCpf] = React.useState("");
  const [erro, setErro] = React.useState("");
  const [carregando, setCarregando] = React.useState(false);
  const [estado, setEstado] = React.useState<Estado>({ tipo: "form" });

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
      if ("erro" in resposta) setErro(MSG_CONSULTA[resposta.erro] ?? MSG_CONSULTA.indisponivel);
      else if (resposta.encontrado) setEstado({ tipo: "encontrado", url: resposta.url });
      else setEstado({ tipo: "nao_encontrado" });
    } catch {
      setErro(MSG_CONSULTA.indisponivel);
    } finally {
      setCarregando(false);
    }
  };

  const outroCpf = () => {
    setCpf("");
    setEstado({ tipo: "form" });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neve px-6 py-20 text-center">
      <FolhaDivisor className="mb-8" />
      <p className="text-sm font-semibold uppercase tracking-widest text-listel">
        Summit de Educação de Arabutã
      </p>
      <h1 className="mt-3 text-3xl text-tinta sm:text-4xl">Seu certificado</h1>

      <div className="mt-8 w-full max-w-md text-left">
        {estado.tipo === "form" && (
          <>
            <p className="medida mb-6 text-center text-base text-tinta">
              Digite o CPF usado no Summit para baixar o seu certificado em PDF.
            </p>
            <form noValidate onSubmit={enviar}>
              <label htmlFor="cpf-certificado" className="block text-base font-semibold text-tinta">
                CPF
              </label>
              <input
                id="cpf-certificado"
                value={cpf}
                inputMode="numeric"
                autoComplete="off"
                placeholder="000.000.000-00"
                aria-invalid={!!erro}
                aria-describedby={erro ? "erro-cpf-certificado" : undefined}
                onChange={(e) => setCpf(mascaraCPF(e.target.value))}
                className={`mt-2 h-14 w-full rounded-xl border bg-background px-4 text-base text-tinta outline-none transition-colors placeholder:text-ferro focus:border-tinta ${
                  erro ? "border-listel" : "border-cinza"
                }`}
              />
              {erro && (
                <p id="erro-cpf-certificado" role="alert" className="mt-2 text-sm font-semibold text-listel">
                  {erro}
                </p>
              )}
              <Button type="submit" variant="acao" size="xl" disabled={carregando} className="mt-5 w-full">
                {carregando ? "Consultando..." : "Buscar certificado"}
              </Button>
            </form>
          </>
        )}

        {estado.tipo === "encontrado" && (
          <div className="text-center" role="status">
            <p className="text-base text-tinta">Seu certificado está pronto.</p>
            <Button asChild variant="acao" size="xl" className="mt-5 w-full">
              <a href={estado.url}>Baixar certificado (PDF)</a>
            </Button>
          </div>
        )}

        {estado.tipo === "nao_encontrado" && (
          <p className="text-center text-base text-tinta" role="status">
            Não encontramos certificado para esse CPF. Se você participou do Summit, fale com a
            organização pelo WhatsApp{" "}
            <a href={WHATS_LINK} className="font-semibold text-listel underline underline-offset-4">
              {WHATS_ORG}
            </a>
            .
          </p>
        )}

        {estado.tipo !== "form" && (
          <button
            type="button"
            onClick={outroCpf}
            className="mx-auto mt-4 block text-sm text-ferro underline underline-offset-4 hover:text-tinta"
          >
            Consultar outro CPF
          </button>
        )}
      </div>

      <Link
        to="/"
        className="mt-10 text-sm text-ferro underline underline-offset-4 hover:text-tinta"
      >
        Voltar para a página inicial
      </Link>
    </main>
  );
}
