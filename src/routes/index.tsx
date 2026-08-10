import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Award, BookOpen, Mic, TriangleAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FolhaDivisor, OndaJacutinga } from "@/components/site/graficos";
import { BarraFixa } from "@/components/site/barra-fixa";
import { ConsultaCpf } from "@/components/site/consulta-cpf";
import { FundoHero } from "@/components/site/fundo-hero";
import { ParticulasHero } from "@/components/site/particulas-hero";
import { EscudoHero } from "@/components/site/escudo-hero";
import { Reveal } from "@/components/site/reveal";

const DESC =
  "Um dia inteiro de formação para os profissionais da educação de Arabutã (SC). 8 de setembro de 2026, no Centro Educacional Esportivo e Cultural.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Summit de Educação de Arabutã · 8 de setembro de 2026" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Summit de Educação de Arabutã · 8 de setembro de 2026" },
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
  "Título",
  "Contexto",
  "O que foi feito",
  "Resultados",
  "Aprendizados",
  "Frase de destaque",
  "Palavras-chave (3)",
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
const cell = (tom: "branco" | "neve" | "preto", interativo = false) =>
  [
    "rounded-xl border p-6 lg:p-8 transition-[box-shadow,transform] duration-300 ease-out",
    tom === "branco" && "border-cinza bg-card sombra-card",
    tom === "neve" && "border-cinza bg-neve",
    tom === "preto" && "border-tinta bg-tinta text-tinta-foreground sombra-card",
    interativo && "hover:-translate-y-1 hover:sombra-card-hover",
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
  const navigate = useNavigate();
  return (
    <main className="bg-background">
      <BarraFixa />
      {/* 1. HERO */}
      <header
        id="hero"
        className="relative w-full bg-tinta pb-16 text-tinta-foreground"
      >
        {/* overflow-hidden isolado aqui (não no header): um header com overflow-hidden
            vira "scroll container" para efeitos de view-timeline, o que quebra o pin
            do EscudoHero (ver memoria.md, 08/08/2026).
            O header tem ~200vh (trilho do pin), então uma camada `absolute inset-0`
            rolaria embora e desencontraria do escudo pinado. O wrapper externo fica
            fora do fluxo (não empurra nem sobrepõe as seções seguintes) e o filho
            sticky trava a camada no viewport junto com o escudo. O overflow-hidden
            mora no próprio elemento sticky — num ancestral ele viraria scroll
            container e mataria tanto o sticky quanto a view-timeline do pin. */}
        <div className="pointer-events-none absolute inset-0">
          <div className="sticky top-0 h-svh overflow-hidden">
            <FundoHero />
            <ParticulasHero />
          </div>
        </div>
        <div className="container-site relative z-[2]">
          <EscudoHero />
        </div>
        <OndaJacutinga className="absolute inset-x-0 bottom-0 z-[1] h-6 w-full text-white/15" />
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
          <Reveal>
            <h2 className="text-2xl text-tinta sm:text-3xl">O que é o Summit</h2>
          </Reveal>
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
              <span className="mt-3 text-sm text-ferro">
                para quem tem relato habilitado, mesmo sem ir ao palco
              </span>
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
          <Reveal className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-2xl text-tinta sm:text-3xl">Programação</h2>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-sol-suave px-3.5 py-1.5 text-sm font-semibold text-sol-foreground">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sol" />
              Programação preliminar, sujeita a ajustes.
            </p>
          </Reveal>

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
          <Reveal>
            <h2 className="text-2xl text-tinta sm:text-3xl">Mostra de Práticas Exitosas</h2>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
            <div className={`${cell("branco")} flex items-center sm:col-span-2 lg:col-span-6`}>
              <p className="medida text-lg leading-relaxed text-tinta">
                Se você desenvolveu uma prática que deu certo na sua sala ou na sua unidade, conte
                para a gente. Quem tem o relato habilitado recebe{" "}
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
                className={`${cell("branco", true)} flex flex-col justify-center gap-3 lg:col-span-2`}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sol-suave text-listel"
                >
                  <Icone className="h-5 w-5" />
                </span>
                <span className="text-base font-medium leading-snug text-tinta">{texto}</span>
              </div>
            ))}

            {/* TODO: trocar o botão do convite por <a href="/docs/convite.pdf" download> quando o PDF estiver disponível */}
            <div className={`${cell("branco")} sm:col-span-2 lg:col-span-12`}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Button asChild variant="contorno" size="xl" className="w-full">
                    <Link to="/regulamento">Ler o regulamento completo</Link>
                  </Button>
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
              className={`${cell("preto")} flex items-start gap-4 sm:col-span-2 lg:col-span-12`}
            >
              <TriangleAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-sol" />
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
                    <Link
                      to="/regulamento"
                      hash="secao-3"
                      className="font-semibold text-listel underline"
                    >
                      Ver a seção 3 do regulamento
                    </Link>
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
        </div>
      </section>

      {/* 7. COMO ESCREVER SEU RELATO */}
      <section className="section-pad">
        <div className="container-site">
          <Reveal>
            <h2 className="text-2xl text-tinta sm:text-3xl">Como escrever seu relato</h2>
            <p className="medida mt-5 text-lg text-tinta">
              O relato tem sete partes. Vá seguindo na ordem, com calma:
            </p>
          </Reveal>

          <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {partesRelato.map((parte, i) => (
              <li
                key={parte}
                className={`${cell("neve", true)} flex items-start gap-4 p-6 lg:p-6 ${
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

          <div className="mt-4 flex items-start gap-4 rounded-xl border border-cinza bg-neve p-5">
            <TriangleAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-listel" />
            <div>
              <p className="text-base font-semibold text-tinta">
                Não escreva seu nome dentro do arquivo do relato.
              </p>
              <p className="medida mt-2 text-sm text-ferro">
                A autoria é registrada aqui no site, no formulário de envio — é de lá que sai tudo,
                inclusive o seu nome no e-book e no certificado. Manter o arquivo sem nome serve só
                para que os avaliadores leiam sem saber quem escreveu; nenhuma informação se perde.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-4 rounded-xl border border-cinza bg-neve p-5">
            <TriangleAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-listel" />
            <div>
              <p className="text-base font-semibold text-tinta">
                Ao usar o agente de IA, não informe dados de estudantes.
              </p>
              <p className="medida mt-2 text-sm text-ferro">
                Não informe nomes, iniciais, diagnósticos, condições de saúde ou situações
                familiares. Use descrições gerais, como "um estudante" ou "parte do grupo".
              </p>
            </div>
          </div>
        </div>
      </section>

      <FolhaDivisor />

      {/* 7.5 PROTEÇÃO DOS ESTUDANTES */}
      <section className="section-pad">
        <div className="container-site">
          <Reveal>
            <h2 className="text-2xl text-tinta sm:text-3xl">Proteção dos estudantes</h2>
            <p className="medida mt-5 text-lg leading-relaxed text-tinta">
              O e-book é uma publicação digital e aberta, distribuída por QR code e link, sem
              versão impressa. Por isso, ao escrever o relato e escolher as fotos:
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className={cell("neve")}>
              <h3 className="text-lg text-tinta">No texto</h3>
              <p className="medida mt-3 text-base leading-relaxed text-tinta">
                Não identifique estudantes — nem nome completo, nem inicial. Escreva "uma aluna",
                "um estudante do 3º ano" ou use nome fictício. Não descreva diagnósticos,
                condições de saúde ou situações familiares que permitam reconhecer alguém.
              </p>
            </div>
            <div className={cell("neve")}>
              <h3 className="text-lg text-tinta">Nas fotos</h3>
              <p className="medida mt-3 text-base leading-relaxed text-tinta">
                Fotografias com estudantes identificáveis só podem ser enviadas com autorização
                válida para publicação em materiais institucionais digitais de acesso público.
                Havendo dúvida sobre a abrangência do documento, não envie a imagem.
              </p>
            </div>
          </div>

          <div className={`${cell("preto")} mt-6 flex items-center gap-4`}>
            <ShieldCheck aria-hidden="true" className="h-5 w-5 shrink-0 text-sol" />
            <p className="text-base font-semibold text-tinta-foreground">
              O mesmo vale para colegas de trabalho.
            </p>
          </div>
        </div>
      </section>

      <FolhaDivisor />

      {/* 8. DATAS IMPORTANTES */}
      <section className="section-pad">
        <div className="container-site">
          <Reveal as="div" className="text-center">
            <h2 className="text-2xl text-tinta sm:text-3xl">Datas importantes</h2>
          </Reveal>
          {/* Trilho contínuo atrás dos marcos (só no desktop, onde as datas ficam lado a
              lado): sem ele os pontos ficam soltos e a sequência não se lê como linha
              do tempo. `before` é o trilho; cada marco tampa a própria fatia com o fundo. */}
          <ol className="relative mt-10 grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-4 md:before:absolute md:before:inset-x-[10%] md:before:top-5 md:before:h-px md:before:bg-cinza">
            {datas.map((d) => {
              const destaque = d.dia === "23/08";
              return (
                <li
                  key={d.dia}
                  className={
                    destaque
                      ? "relative flex items-center gap-4 rounded-xl bg-tinta p-4 sombra-card transition-transform duration-300 hover:-translate-y-1 md:flex-col md:text-center"
                      : "relative flex items-center gap-4 rounded-xl p-4 transition-transform duration-300 hover:-translate-y-1 md:flex-col md:text-center"
                  }
                >
                  {!destaque && (
                    <span
                      aria-hidden="true"
                      className="hidden h-2 w-2 rounded-full bg-listel ring-4 ring-background md:block"
                    />
                  )}
                  <span
                    className={
                      destaque
                        ? "font-display text-2xl font-bold tabular-nums text-sol"
                        : "font-display text-2xl font-bold tabular-nums text-listel"
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
          <Reveal className="lg:col-span-5">
            <h2 className="text-2xl text-tinta sm:text-3xl">Submeter prática exitosa</h2>
            <p className="medida mt-5 text-lg leading-relaxed text-tinta">
              Para começar, informe o seu CPF. Ele serve só para identificar o seu envio e conferir
              os seus dados — nada aparece publicamente no site.
            </p>
          </Reveal>

          <div className={`${cell("branco")} lg:col-span-6 lg:col-start-7`}>
            <ConsultaCpf
              onEncontrado={() => navigate({ to: "/relato" })}
              onNaoEncontrado={() => navigate({ to: "/relato" })}
            />
          </div>
        </div>
      </section>

      {/* 10. RODAPÉ */}
      <footer className="relative bg-tinta py-10 text-tinta-foreground">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-listel to-transparent"
        />
        <div className="container-site">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6">
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

            <div className="md:text-right">
              <p className="text-sm">
                <Link to="/regulamento" className="underline">
                  Regulamento
                </Link>
              </p>
              <p className="mt-2 text-sm">
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

          <OndaJacutinga className="mt-8 h-5 w-full text-white/15" />
        </div>
      </footer>
    </main>
  );
}
