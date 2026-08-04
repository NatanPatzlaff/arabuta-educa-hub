import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, BookOpen, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolhaDivisor, OndaJacutinga, RaiosDeSol } from "@/components/site/graficos";
import { BarraFixa } from "@/components/site/barra-fixa";

const DESC =
  "Um dia inteiro de formação para os profissionais da educação de Arabutã (SC). 8 de setembro de 2026, no Centro Educacional Esportivo e Cultural.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Summit de Educação de Arabutã · 8 de setembro de 2026" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Summit de Educação de Arabutã" },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Index,
});

type ItemPrograma = { texto: string; hora?: string; pausa?: boolean };

const manha: ItemPrograma[] = [
  { texto: "Recepção e apresentação cultural de abertura" },
  { texto: "ProLEEI — falas dos participantes" },
  { texto: "Coffee break", pausa: true },
  {
    texto:
      "Palestra sobre alfabetização na educação infantil: neurociência, consciência fonológica e atraso de linguagem, com atividades práticas",
  },
  { texto: "Apresentação das práticas exitosas selecionadas" },
  { texto: "Almoço", pausa: true },
];

const tarde: ItemPrograma[] = [
  {
    hora: "13h30 às 14h30",
    texto:
      "Aplicações práticas de IA, gamificação, comportamento e mediação em sala de aula, com Maricelia Rossi de Oliveira",
  },
  {
    hora: "14h30 às 15h30",
    texto:
      "Tendências futuras da educação e metodologias em desenvolvimento, com Beatriz Bonadiman",
  },
  { texto: "Encerramento: menções honrosas, troféus e homenagem ao ProLEEI" },
];

const partesRelato = [
  "Identificação",
  "Contexto",
  "Objetivos",
  "Descrição da prática",
  "Resultados",
  "Reflexão",
  "Referências",
];

const datas = [
  { dia: "05/08", texto: "Abertura das submissões" },
  { dia: "10/08", texto: "Aula de apoio" },
  { dia: "23/08", texto: "Encerramento das submissões" },
  { dia: "03/09", texto: "Divulgação dos selecionados" },
  { dia: "08/09", texto: "Summit de Educação" },
];

const beneficios = [
  { icone: Award, texto: "Certificado de 15 horas" },
  { icone: BookOpen, texto: "Publicação no e-book" },
  { icone: Mic, texto: "Apresentação no palco" },
];

/** Cell padrão do bento. `tom` define o fundo em relação ao fundo da seção. */
const cell = (tom: "branco" | "neve" | "preto") =>
  [
    "rounded-xl border p-6 lg:p-8",
    tom === "branco" && "border-cinza bg-card",
    tom === "neve" && "border-cinza bg-neve",
    tom === "preto" && "border-tinta bg-tinta text-tinta-foreground shadow-sm",
  ]
    .filter(Boolean)
    .join(" ");

function LinhaPrograma({ item }: { item: ItemPrograma }) {
  return (
    <li className={item.pausa ? "relative py-3 pl-2" : "relative py-4"}>
      <span
        aria-hidden="true"
        className={
          item.pausa
            ? "absolute -left-[1.6rem] top-[1.15rem] h-2 w-2 rounded-full bg-cinza"
            : item.hora
              ? "absolute -left-[1.84rem] top-[1.35rem] h-3 w-3 rounded-full bg-listel"
              : "absolute -left-[1.84rem] top-[1.35rem] h-3 w-3 rounded-full border-2 border-listel bg-background"
        }
      />
      {item.hora && <p className="text-sm font-bold text-listel">{item.hora}</p>}
      <p
        className={
          item.pausa
            ? "text-sm text-ferro"
            : "medida text-base font-medium leading-relaxed text-tinta"
        }
      >
        {item.texto}
      </p>
    </li>
  );
}

function RotuloPeriodo({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ferro">
        {children}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-cinza" />
    </div>
  );
}

function Index() {
  return (
    <main className="bg-background">
      <BarraFixa />
      {/* 1. HERO */}
      <header
        id="hero"
        className="relative w-full overflow-hidden bg-tinta pb-16 pt-14 text-tinta-foreground sm:pt-16"
      >
        <RaiosDeSol className="pointer-events-none absolute -top-6 left-1/2 h-16 w-56 -translate-x-1/2 text-sol/60" />
        <div className="container-site">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mt-6 text-4xl leading-tight sm:text-5xl">
              Summit de Educação de Arabutã
            </h1>
            <p className="mt-4 text-lg text-tinta-foreground/90">
              Encontro de pessoas, práticas e ideias que movimentam a educação
            </p>
            <p className="mt-6 text-base text-tinta-foreground/80">
              8 de setembro de 2026 · Centro Educacional Esportivo e Cultural · Arabutã (SC)
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild variant="acao" size="xl" className="w-full sm:w-auto">
                <Link to="/inscricao">Quero me inscrever</Link>
              </Button>
              <Button asChild variant="contorno" size="xl" className="w-full sm:w-auto">
                <a href="#envio-relato">Enviar meu relato</a>
              </Button>
            </div>
          </div>
        </div>
        <OndaJacutinga className="absolute inset-x-0 bottom-0 h-6 w-full text-white/15" />
      </header>

      {/* 2. EPÍGRAFE */}
      <section className="bg-neve py-14">
        <div className="container-site">
          <blockquote className="mx-auto max-w-2xl text-center">
            <p className="epigrafe text-2xl leading-relaxed text-tinta sm:text-3xl">
              “Nos exemplos do passado construímos o amanhã.”
            </p>
            <footer className="mt-4 text-sm text-tinta">
              — Hino de Arabutã, José Acácio Santana
            </footer>
          </blockquote>
        </div>
      </section>

      {/* 3. O QUE É O SUMMIT */}
      <section className="section-pad">
        <div className="container-site">
          <h2 className="text-2xl text-tinta sm:text-3xl">O que é o Summit</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className={`${cell("neve")} flex items-center lg:col-span-7 lg:row-span-2`}>
              <p className="medida text-lg leading-relaxed text-tinta">
                Um dia inteiro de formação para os profissionais da educação de Arabutã. A
                programação reúne palestras, a apresentação de práticas desenvolvidas por
                professores da própria rede e a premiação das experiências selecionadas. Quem
                participar dos dois períodos recebe certificado de 8 horas.
              </p>
            </div>
            <div className={`${cell("preto")} flex flex-col justify-center lg:col-span-5`}>
              <span className="font-display text-5xl font-bold leading-none text-sol">8h</span>
              <span className="mt-3 text-sm text-tinta-foreground/85">
                de certificado para quem participa dos dois períodos
              </span>
            </div>
            <div className={`${cell("neve")} flex flex-col justify-center lg:col-span-3`}>
              <span className="font-display text-4xl font-bold leading-none text-listel">15h</span>
              <span className="mt-3 text-sm text-ferro">para quem tem relato selecionado</span>
            </div>
            <div className={`${cell("neve")} flex flex-col justify-center lg:col-span-2`}>
              <span className="font-display text-3xl font-bold leading-none text-listel">
                08/09
              </span>
              <span className="mt-3 text-sm text-ferro">2026</span>
            </div>
          </div>
        </div>
      </section>

      <FolhaDivisor />

      {/* 4. PROGRAMAÇÃO */}
      <section className="section-pad">
        <div className="container-site grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-2xl text-tinta sm:text-3xl">Programação</h2>
            <p className="mt-3 inline-block rounded-md border-l-4 border-sol bg-sol-suave px-3 py-1.5 text-sm font-semibold text-sol-foreground">
              Programação preliminar, sujeita a ajustes.
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <RotuloPeriodo>Manhã</RotuloPeriodo>
            <ol className="relative mt-4 border-l border-cinza pl-6">
              {manha.map((item, i) => (
                <LinhaPrograma key={`m-${i}`} item={item} />
              ))}
            </ol>

            <div className="mt-8">
              <RotuloPeriodo>Tarde</RotuloPeriodo>
            </div>
            <ol className="relative mt-4 border-l border-cinza pl-6">
              {tarde.map((item, i) => (
                <LinhaPrograma key={`t-${i}`} item={item} />
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 5. MOSTRA DE PRÁTICAS EXITOSAS + 6. ProLEEI */}
      <section className="bg-neve section-pad">
        <div className="container-site">
          <h2 className="text-2xl text-tinta sm:text-3xl">Mostra de Práticas Exitosas</h2>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
            <div className={`${cell("branco")} flex items-center sm:col-span-2 lg:col-span-6`}>
              <p className="medida text-lg leading-relaxed text-tinta">
                Se você desenvolveu uma prática que deu certo na sua sala ou na sua unidade, conte
                para a gente. Quem tem o relato selecionado recebe{" "}
                <mark className="bg-sol-suave px-1 font-semibold text-sol-foreground">
                  certificado de 15 horas
                </mark>{" "}
                em vez de 8, tem o trabalho publicado no e-book do Summit e a chance de apresentar
                no palco.
              </p>
            </div>

            {beneficios.map(({ icone: Icone, texto }) => (
              <div
                key={texto}
                className={`${cell("branco")} flex flex-col justify-center gap-3 lg:col-span-2`}
              >
                <Icone aria-hidden="true" className="h-6 w-6 shrink-0 text-listel" />
                <span className="text-base font-medium leading-snug text-tinta">{texto}</span>
              </div>
            ))}

            {/* TODO: trocar os botões desabilitados por <a href="/docs/*.pdf" download> quando os PDFs estiverem disponíveis */}
            <div className={`${cell("branco")} sm:col-span-2 lg:col-span-12`}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Button variant="contorno" size="xl" className="w-full" disabled>
                    Baixar o Regulamento (PDF)
                  </Button>
                  <p className="mt-2 text-center text-sm text-ferro">Disponível em breve</p>
                </div>
                <div>
                  <Button variant="contorno" size="xl" className="w-full" disabled>
                    Baixar o Convite (PDF)
                  </Button>
                  <p className="mt-2 text-center text-sm text-ferro">Disponível em breve</p>
                </div>
              </div>
            </div>

            <div
              className={`${cell("preto")} border-l-4 border-l-listel sm:col-span-2 lg:col-span-12`}
            >
              <p className="text-base font-semibold text-tinta-foreground">
                O relato só é aceito pela aba de submissão deste site. Não são aceitos relatos por
                WhatsApp, e-mail ou impressos.
              </p>
            </div>

            {/* 6. Bloco ProLEEI */}
            <div className={`${cell("branco")} sm:col-span-2 lg:col-span-12`}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <h3 className="text-xl text-tinta">ProLEEI</h3>
                  <p className="medida mt-3 text-base leading-relaxed text-tinta">
                    Unidades de educação infantil que fizeram a formação do ProLEEI enviam um relato
                    institucional por unidade, com formato livre e caminho próprio.
                  </p>
                  <p className="mt-4">
                    <a href="#mostra-regulamento" className="font-semibold text-listel underline">
                      Ver a seção 3 do regulamento
                    </a>
                  </p>
                </div>
                <div className="lg:col-span-5">
                  {/* TODO: trocar por <a href="/docs/convite-proleei.pdf" download> quando o PDF estiver disponível */}
                  <Button variant="contorno" size="xl" className="w-full" disabled>
                    Baixar o Convite do ProLEEI (PDF)
                  </Button>
                  <p className="mt-2 text-sm text-ferro">Disponível em breve</p>
                </div>
              </div>
            </div>
          </div>
          <span id="mostra-regulamento" />
        </div>
      </section>

      {/* 7. COMO ESCREVER SEU RELATO */}
      <section className="section-pad">
        <div className="container-site">
          <h2 className="text-2xl text-tinta sm:text-3xl">Como escrever seu relato</h2>
          <p className="medida mt-5 text-lg text-tinta">
            O relato tem sete partes. Vá seguindo na ordem, com calma:
          </p>

          <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {partesRelato.map((parte, i) => (
              <li
                key={parte}
                className={`${cell("neve")} flex items-start gap-4 p-6 lg:p-6 ${
                  i === partesRelato.length - 1 ? "sm:col-span-2" : ""
                }`}
              >
                <span className="font-display text-2xl font-bold leading-none text-listel">
                  {i + 1}
                </span>
                <span className="text-base font-medium text-tinta">{parte}</span>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-xl border border-cinza bg-neve p-6 lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-base font-semibold text-tinta">
                Limite de 450 a 700 palavras · formato .docx obrigatório
              </p>
              <div className="shrink-0">
                {/* TODO: trocar por <a href="/docs/modelo-relato.docx" download> quando o arquivo estiver disponível */}
                <Button variant="contorno" size="xl" className="w-full sm:w-auto" disabled>
                  Baixar o modelo de relato em Word
                </Button>
                <p className="mt-2 text-sm text-ferro">Disponível em breve</p>
              </div>
              <a
                href="https://chatgpt.com/g/g-6a6dedf3f8248191b04949dfd3a3221f-praticas-exitosas"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-base font-semibold text-listel underline"
              >
                Converse com o agente de apoio
              </a>
            </div>
          </div>
        </div>
      </section>

      <FolhaDivisor />

      {/* 8. DATAS IMPORTANTES */}
      <section className="section-pad">
        <div className="container-site">
          <h2 className="text-center text-2xl text-tinta sm:text-3xl">Datas importantes</h2>
          <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-4">
            {datas.map((d) => {
              const destaque = d.dia === "23/08";
              return (
                <li
                  key={d.dia}
                  className={
                    destaque
                      ? "flex items-center gap-4 rounded-xl bg-tinta p-4 md:flex-col md:text-center"
                      : "flex items-center gap-4 border-l-4 border-listel pl-4 md:flex-col md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:text-center"
                  }
                >
                  <span
                    className={
                      destaque
                        ? "font-display text-2xl font-bold text-sol"
                        : "font-display text-2xl font-bold text-listel"
                    }
                  >
                    {d.dia}
                  </span>
                  <span
                    className={destaque ? "text-base text-tinta-foreground" : "text-base text-tinta"}
                  >
                    {d.texto}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 9. ÁREA DE ENVIO DE RELATO */}
      <section id="envio-relato" className="scroll-mt-6 bg-neve section-pad">
        <div className="container-site grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <h2 className="text-2xl text-tinta sm:text-3xl">Enviar meu relato</h2>
            <p className="medida mt-5 text-lg leading-relaxed text-tinta">
              Para começar, informe o seu CPF. Ele serve só para identificar o seu envio e conferir
              os seus dados — nada aparece publicamente no site.
            </p>
          </div>

          <div className={`${cell("branco")} lg:col-span-6 lg:col-start-7`}>
            <ConsultaCpf
              onEncontrado={() => navigate({ to: "/relato" })}
              onNaoEncontrado={() => navigate({ to: "/relato" })}
            />
          </div>
        </div>
      </section>

      {/* 10. RODAPÉ */}
      <footer className="bg-tinta py-14 text-tinta-foreground">
        <div className="container-site">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
            <div>
              <h2 className="text-xl">Fale com a organização</h2>
              <p className="mt-3 text-base">
                <a
                  href="https://wa.me/5549999271442"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline"
                >
                  WhatsApp (49) 99927-1442 — Maricelia
                </a>
              </p>
            </div>

            {/* TODO: substituir os placeholders pelos logos reais:
                brasão do município, Secretaria Municipal de Educação de Arabutã e Gen-Z Educação */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-1">
              {["Brasão de Arabutã", "Secretaria Municipal de Educação", "Gen-Z Educação"].map(
                (nome) => (
                  <div
                    key={nome}
                    className="flex h-20 items-center justify-center rounded-xl border border-tinta-foreground/25 bg-tinta-foreground/10 px-3 text-center text-sm"
                  >
                    {nome}
                  </div>
                ),
              )}
            </div>

            <div className="md:text-right">
              <p className="text-sm">
                <Link to="/privacidade" className="underline">
                  Privacidade
                </Link>
              </p>
              <p className="mt-4 text-sm text-tinta-foreground/85">
                Comissão Organizadora — Summit de Educação de Arabutã · Gen-Z Educação · Secretaria
                Municipal de Educação de Arabutã
              </p>
            </div>
          </div>

          <OndaJacutinga className="mt-10 h-5 w-full text-white/15" />
        </div>
      </footer>
    </main>
  );
}
