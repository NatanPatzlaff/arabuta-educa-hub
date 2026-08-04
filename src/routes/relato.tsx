import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { FolhaDivisor } from "@/components/site/graficos";
import { ConsultaCpf, WHATS_LINK, WHATS_ORG } from "@/components/site/consulta-cpf";
import { FormularioMostra, type ResultadoMostra } from "@/components/site/formulario-mostra";
import { FormularioProleei, type ResultadoProleei } from "@/components/site/formulario-proleei";
import { lerSessaoRelato, limparSessaoRelato, type SessaoRelato } from "@/lib/sessao-relato";

const DESC =
  "Envio de relato para a Mostra de Práticas Exitosas do Summit de Educação de Arabutã.";

// 23/08/2026 23:59:59 em America/Sao_Paulo (UTC-3)
const PRAZO = new Date("2026-08-24T02:59:59Z");

export const Route = createFileRoute("/relato")({
  head: () => ({
    meta: [
      { title: "Envio de relato — Summit de Educação de Arabutã" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Envio de relato — Summit de Educação de Arabutã" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaginaRelato,
});

function AvisoPrazo() {
  const [agora, setAgora] = React.useState<number | null>(null);

  React.useEffect(() => {
    setAgora(Date.now());
    const t = window.setInterval(() => setAgora(Date.now()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  const restante = agora === null ? null : PRAZO.getTime() - agora;

  if (restante !== null && restante <= 0) {
    return (
      <p className="mt-6 rounded-xl border border-listel bg-background p-4 text-base font-semibold text-listel">
        O prazo de submissão encerrou em 23 de agosto de 2026.
      </p>
    );
  }

  if (restante !== null && restante < 7 * 24 * 60 * 60 * 1000) {
    const dias = Math.floor(restante / (24 * 60 * 60 * 1000));
    const horas = Math.floor((restante % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    return (
      <p className="mt-6 rounded-xl border border-listel bg-background p-4 text-base font-semibold text-listel">
        Faltam {dias} {dias === 1 ? "dia" : "dias"} e {horas} {horas === 1 ? "hora" : "horas"} para
        o fim das submissões.
      </p>
    );
  }

  return (
    <p className="mt-6 text-base font-semibold text-tinta">
      As submissões encerram em 23 de agosto de 2026, às 23h59.
    </p>
  );
}

function Saudacao({ nome, aoTrocar }: { nome: string; aoTrocar: () => void }) {
  return (
    <div className="mb-6">
      <p className="text-lg font-semibold text-tinta">Olá, {nome}</p>
      <button
        type="button"
        onClick={aoTrocar}
        className="mt-1 text-sm text-ferro underline underline-offset-4 hover:text-tinta"
      >
        Não é você? Consultar outro CPF
      </button>
    </div>
  );
}

const ROTULO_CATEGORIA: Record<string, string> = {
  gestao: "Gestão",
  educacao_infantil: "Educação Infantil",
  ensino_fundamental: "Ensino Fundamental",
};

const ROTULO_MODO: Record<string, string> = {
  palco: "Quero concorrer à apresentação",
  ebook: "Só quero aparecer no e-book",
};

function SucessoMostra({
  resultado,
  podeProleei,
  aoEnviarOutro,
  aoIrProleei,
}: {
  resultado: ResultadoMostra;
  podeProleei: boolean;
  aoEnviarOutro: () => void;
  aoIrProleei: () => void;
}) {
  return (
    <div>
      <div className="rounded-xl bg-tinta p-6 text-center sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
          Código do seu relato
        </p>
        <p className="mt-2 text-5xl font-bold text-sol sm:text-6xl">{resultado.codigo}</p>
        <p className="mt-4 text-base text-white">
          Guarde este código. É por ele que a organização identifica o seu relato.
        </p>
      </div>

      <dl className="mt-6 space-y-3 text-base">
        <div>
          <dt className="text-sm font-semibold text-ferro">Título enviado</dt>
          <dd className="text-tinta">{resultado.titulo}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-ferro">Categoria</dt>
          <dd className="text-tinta">{ROTULO_CATEGORIA[resultado.categoria]}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-ferro">Participação</dt>
          <dd className="text-tinta">{ROTULO_MODO[resultado.modo]}</dd>
        </div>
      </dl>

      <p className="medida mt-6 text-base text-ferro">
        O e-mail automático de confirmação será enviado assim que o endereço oficial do evento
        estiver ativo. Enquanto isso, este código é o comprovante do seu envio. Em caso de dúvida,
        fale com a organização pelo WhatsApp {WHATS_ORG}.
      </p>

      <div className="mt-6 flex flex-wrap gap-4">
        <Button variant="acao" size="xl" onClick={aoEnviarOutro}>
          Enviar outro relato
        </Button>
        {podeProleei && (
          <Button variant="contorno" size="xl" onClick={aoIrProleei}>
            Enviar o relato do ProLEEI
          </Button>
        )}
      </div>
    </div>
  );
}

type Escolha = "mostra" | "proleei" | null;

function PaginaRelato() {
  const [sessao, setSessao] = React.useState<SessaoRelato | null>(null);
  const [naoEncontrado, setNaoEncontrado] = React.useState(false);
  const [escolha, setEscolha] = React.useState<Escolha>(null);
  const [prazoEncerrado, setPrazoEncerrado] = React.useState(false);
  const [sucesso, setSucesso] = React.useState<ResultadoMostra | null>(null);

  React.useEffect(() => {
    setSessao(lerSessaoRelato());
    setPrazoEncerrado(Date.now() > PRAZO.getTime());
  }, []);

  const trocarCpf = () => {
    limparSessaoRelato();
    setSessao(null);
    setEscolha(null);
    setNaoEncontrado(false);
    setSucesso(null);
  };

  const conteudo = () => {
    if (naoEncontrado) {
      return (
        <div className="rounded-xl border border-cinza bg-neve p-6 sm:p-8">
          <p className="medida text-lg text-tinta">
            Você precisa se inscrever no Summit antes de enviar o relato.
          </p>
          <Button asChild variant="acao" size="xl" className="mt-5">
            <Link to="/inscricao">Quero me inscrever</Link>
          </Button>
          <div className="mt-5">
            <button
              type="button"
              onClick={trocarCpf}
              className="text-sm text-ferro underline underline-offset-4 hover:text-tinta"
            >
              Não é você? Consultar outro CPF
            </button>
          </div>
        </div>
      );
    }

    if (!sessao) {
      return (
        <div className="rounded-xl border border-cinza bg-neve p-6 sm:p-8">
          <h2 className="text-2xl text-tinta">Confirme sua inscrição</h2>
          <p className="medida mt-3 text-base text-ferro">
            Informe o CPF usado na inscrição. Ele serve só para identificar o seu envio.
          </p>
          <div className="mt-5">
            <ConsultaCpf
              onEncontrado={(s) => {
                setSessao(s);
                setNaoEncontrado(false);
              }}
              onNaoEncontrado={() => setNaoEncontrado(true)}
            />
          </div>
        </div>
      );
    }

    if (sessao.nao_vai_enviar || (!sessao.pode_mostra && !sessao.pode_proleei)) {
      return (
        <div>
          <Saudacao nome={sessao.primeiro_nome} aoTrocar={trocarCpf} />
          <div className="rounded-xl border border-cinza bg-neve p-6 sm:p-8">
            <p className="medida text-lg text-tinta">
              Sua inscrição não prevê envio de relato. Fale com a organização pelo WhatsApp{" "}
              <a
                href={WHATS_LINK}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-listel underline underline-offset-4"
              >
                {WHATS_ORG}
              </a>{" "}
              se quiser alterar.
            </p>
          </div>
        </div>
      );
    }

    const corpo = () => {
      if (prazoEncerrado) {
        return (
          <div className="rounded-xl border border-listel bg-background p-6 sm:p-8">
            <p className="text-lg font-semibold text-listel">
              O prazo de submissão encerrou em 23 de agosto de 2026.
            </p>
          </div>
        );
      }

      const mostraSo = sessao.pode_mostra && !sessao.pode_proleei;
      const proleeiSo = sessao.pode_proleei && !sessao.pode_mostra;

      if (mostraSo || escolha === "mostra") {
        if (sucesso) {
          return (
            <SucessoMostra
              resultado={sucesso}
              podeProleei={sessao.pode_proleei}
              aoEnviarOutro={() => setSucesso(null)}
              aoIrProleei={() => {
                setSucesso(null);
                setEscolha("proleei");
              }}
            />
          );
        }
        return <FormularioMostra sessao={sessao} onSucesso={setSucesso} />;
      }
      if (proleeiSo || escolha === "proleei") return <Placeholder titulo="Formulário do ProLEEI" />;

      return (
        <div>
          <p className="medida text-base text-ferro">
            Você pode enviar os dois relatos. Eles são independentes e podem ser feitos em momentos
            diferentes — quem enviar um continua podendo enviar o outro depois.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-cinza bg-neve p-6">
              <h3 className="text-lg text-tinta">Relato individual da Mostra</h3>
              <p className="mt-2 text-sm text-ferro">
                Sua prática exitosa, com autoria sua e de até dois coautores.
              </p>
              <Button
                variant="acao"
                size="xl"
                className="mt-4 w-full"
                onClick={() => setEscolha("mostra")}
              >
                Enviar meu relato da Mostra
              </Button>
            </div>
            <div className="rounded-xl border border-cinza bg-neve p-6">
              <h3 className="text-lg text-tinta">Relato do ProLEEI</h3>
              <p className="mt-2 text-sm text-ferro">
                O relato institucional da sua unidade, com a lista de participantes.
              </p>
              <Button
                variant="acao"
                size="xl"
                className="mt-4 w-full"
                onClick={() => setEscolha("proleei")}
              >
                Enviar o relato da minha unidade
              </Button>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div>
        <Saudacao nome={sessao.primeiro_nome} aoTrocar={trocarCpf} />
        {corpo()}
      </div>
    );
  };

  return (
    <main className="bg-background section-pad">
      <div className="container-site grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <FolhaDivisor className="mb-6" />
          <h1 className="text-3xl text-tinta sm:text-4xl">Enviar meu relato</h1>
          <AvisoPrazo />
          <p className="medida mt-4 text-base text-ferro">
            O relato só é aceito por este site. Não são aceitos relatos por WhatsApp, e-mail ou
            impressos.
          </p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">{conteudo()}</div>
      </div>
    </main>
  );
}
