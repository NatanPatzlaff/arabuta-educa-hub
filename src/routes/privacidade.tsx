import { createFileRoute, Link } from "@tanstack/react-router";
import { FolhaDivisor } from "@/components/site/graficos";

const DESC =
  "Como a Secretaria Municipal de Educação de Arabutã trata os dados pessoais dos participantes, e os direitos autorais sobre os relatos enviados ao Summit.";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Privacidade — Summit de Educação de Arabutã" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Privacidade — Summit de Educação de Arabutã" },
      { property: "og:description", content: DESC },
    ],
  }),
  component: PaginaPrivacidade,
});

function PaginaPrivacidade() {
  return (
    <main className="bg-background section-pad">
      <div className="container-site grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <FolhaDivisor className="mb-6" />
          <h1 className="text-3xl text-tinta sm:text-4xl">Privacidade e direitos autorais</h1>
          <p className="medida mt-4 text-base text-ferro">
            Dúvidas ou solicitações relacionadas a dados pessoais: WhatsApp{" "}
            <a
              href="https://wa.me/5549999271442"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-listel underline underline-offset-4"
            >
              (49) 99927-1442
            </a>{" "}
            — Maricelia.
          </p>
          <p className="mt-6">
            <Link to="/" className="text-sm text-ferro underline underline-offset-4 hover:text-tinta">
              Voltar para a página inicial
            </Link>
          </p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="rounded-xl border border-cinza bg-card p-6 lg:p-8">
            <section>
              <h2 className="text-xl text-tinta">Proteção de dados pessoais</h2>
              <div className="medida mt-4 space-y-4 text-base leading-relaxed text-tinta">
                <p>
                  A Secretaria Municipal de Educação de Arabutã, responsável pelo evento, utiliza
                  os dados pessoais para inscrição, comunicação, controle de presença, avaliação,
                  publicação e certificação, com acesso restrito às equipes e prestadores
                  necessários a essas atividades, observadas medidas de segurança e
                  confidencialidade.
                </p>
                <p>
                  O CPF é usado exclusivamente para identificação e certificação e não será
                  publicado no e-book ou em materiais de divulgação.
                </p>
                <p>
                  O participante pode solicitar informações, acesso, correção e, quando legalmente
                  aplicável, exclusão de seus dados. Alguns dados são conservados pelo período
                  necessário à emissão e comprovação dos certificados e ao cumprimento de
                  obrigações legais.
                </p>
                <p>
                  Solicitações relacionadas a dados pessoais: WhatsApp (49) 99927-1442 —
                  Maricelia.
                </p>
              </div>
            </section>

            <section className="mt-9 border-t border-cinza pt-7">
              <h2 className="text-xl text-tinta">Direitos autorais</h2>
              <div className="medida mt-4 space-y-4 text-base leading-relaxed text-tinta">
                <p>
                  O relato continua sendo seu. Ao submeter, você autoriza a organização a
                  publicá-lo no e-book e nos materiais do Summit de forma gratuita e não
                  exclusiva, sempre com crédito de autoria, e permanece livre para usar,
                  republicar ou apresentar o texto onde quiser. A distribuição é gratuita: a
                  organização não pode vender o e-book nem o relato.
                </p>
                <p>
                  Os autores são responsáveis pela originalidade do relato e pela autorização de
                  uso de fotografias, ilustrações, tabelas e outros materiais de terceiros,
                  informando autoria e fonte quando aplicável. Ao enviar imagem gerada por IA, o
                  autor é responsável por ter usado ferramenta de uso permitido para essa
                  finalidade.
                </p>
              </div>
            </section>

            <section className="mt-9 border-t border-cinza pt-7">
              <h2 className="text-xl text-tinta">Observações finais</h2>
              <div className="medida mt-4 space-y-4 text-base leading-relaxed text-tinta">
                <p>Casos não previstos são decididos pela comissão organizadora.</p>
                <p>
                  Dúvidas e solicitações: WhatsApp (49) 99927-1442 — Maricelia.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
