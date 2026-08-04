import { createFileRoute, Link } from "@tanstack/react-router";
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

const programacao: { texto: string; hora?: string; pausa?: boolean }[] = [
  { texto: "Recepção e apresentação cultural de abertura" },
  { texto: "ProLEEI — falas dos participantes" },
  { texto: "Coffee break", pausa: true },
  {
    texto:
      "Palestra sobre alfabetização na educação infantil: neurociência, consciência fonológica e atraso de linguagem, com atividades práticas",
  },
  { texto: "Apresentação das práticas exitosas selecionadas" },
  { texto: "Almoço", pausa: true },
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

function Index() {
  return (
      <main className="bg-background">
      <BarraFixa />
      {/* 1. HERO */}
      <header
        id="hero"
        className="relative overflow-hidden bg-tinta px-6 pb-16 pt-14 text-tinta-foreground sm:pt-16"
      >
        <RaiosDeSol className="pointer-events-none absolute -top-6 left-1/2 h-16 w-56 -translate-x-1/2 text-sol/60" />
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
        <OndaJacutinga className="absolute inset-x-0 bottom-0 h-6 w-full text-white/15" />
      </header>

      {/* 2. EPÍGRAFE */}
      <section className="bg-neve px-6 py-14">
        <blockquote className="mx-auto max-w-2xl text-center">
          <p className="epigrafe text-2xl leading-relaxed text-tinta sm:text-3xl">
            “Nos exemplos do passado construímos o amanhã.”
          </p>
          <footer className="mt-4 text-sm text-tinta">
            — Hino de Arabutã, José Acácio Santana
          </footer>
        </blockquote>
      </section>

      {/* 3. O QUE É O SUMMIT */}
      <section className="px-6 section-pad">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl text-tinta sm:text-3xl">O que é o Summit</h2>
          <p className="mt-5 text-lg leading-relaxed text-tinta">
            Um dia inteiro de formação para os profissionais da educação de Arabutã. A programação
            reúne palestras, a apresentação de práticas desenvolvidas por professores da própria
            rede e a premiação das experiências selecionadas. Quem participar dos dois períodos
            recebe certificado de 8 horas.
          </p>
        </div>
      </section>

      <FolhaDivisor />

      {/* 4. PROGRAMAÇÃO */}
      <section className="px-6 section-pad">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl text-tinta sm:text-3xl">Programação</h2>
          <p className="mt-3 inline-block rounded-md bg-sol-suave px-3 py-1.5 border-l-4 border-sol text-sm font-semibold text-sol-foreground">
            Programação preliminar, sujeita a ajustes.
          </p>
          <ol className="relative mt-8 border-l border-cinza pl-6">
            {programacao.map((item, i) => (
              <li key={i} className={item.pausa ? "relative py-3 pl-2" : "relative py-4"}>
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
                {item.hora && (
                  <p className="text-sm font-bold text-listel">{item.hora}</p>
                )}
                <p
                  className={
                    item.pausa
                      ? "text-sm text-ferro"
                      : "text-base font-medium leading-relaxed text-tinta"
                  }
                >
                  {item.texto}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. MOSTRA DE PRÁTICAS EXITOSAS + 6. ProLEEI */}
      <section className="bg-neve px-6 section-pad">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl text-tinta sm:text-3xl">Mostra de Práticas Exitosas</h2>
          <p className="mt-5 text-lg leading-relaxed text-tinta">
            Se você desenvolveu uma prática que deu certo na sua sala ou na sua unidade, conte para
            a gente. Quem tem o relato selecionado recebe{" "}
            <mark className="bg-sol-suave px-1 font-semibold text-sol-foreground">
              certificado de 15 horas
            </mark>{" "}
            em vez de 8, tem o trabalho publicado no e-book do Summit e a chance de apresentar no
            palco.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {/* TODO: trocar o botão desabilitado por <a href="/docs/regulamento.pdf" download> quando o PDF estiver disponível */}
            <div className="flex-1">
              <Button variant="contorno" size="xl" className="w-full" disabled>
                Baixar o Regulamento (PDF)
              </Button>
              <p className="mt-2 text-center text-sm text-muted-foreground">Disponível em breve</p>
            </div>
            {/* TODO: trocar por <a href="/docs/convite.pdf" download> quando o PDF estiver disponível */}
            <div className="flex-1">
              <Button variant="contorno" size="xl" className="w-full" disabled>
                Baixar o Convite (PDF)
              </Button>
              <p className="mt-2 text-center text-sm text-muted-foreground">Disponível em breve</p>
            </div>
          </div>

          <p className="mt-8 rounded-xl border-l-4 border-listel bg-card p-5 text-base font-semibold text-tinta">
            O relato só é aceito pela aba de submissão deste site. Não são aceitos relatos por
            WhatsApp, e-mail ou impressos.
          </p>

          {/* 6. Bloco ProLEEI */}
          <div className="mt-10 rounded-2xl border-2 border-cinza bg-card p-6">
            <h3 className="text-xl text-tinta">ProLEEI</h3>
            <p className="mt-3 text-base leading-relaxed text-tinta">
              Unidades de educação infantil que fizeram a formação do ProLEEI enviam um relato
              institucional por unidade, com formato livre e caminho próprio.
            </p>
            {/* TODO: trocar por <a href="/docs/convite-proleei.pdf" download> quando o PDF estiver disponível */}
            <Button variant="contorno" size="xl" className="mt-6 w-full sm:w-auto" disabled>
              Baixar o Convite do ProLEEI (PDF)
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">Disponível em breve</p>
            <p className="mt-4">
              <a href="#mostra-regulamento" className="font-semibold text-listel underline">
                Ver a seção 3 do regulamento
              </a>
            </p>
          </div>
          <span id="mostra-regulamento" />
        </div>
      </section>

      {/* 7. COMO ESCREVER SEU RELATO */}
      <section className="px-6 section-pad">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl text-tinta sm:text-3xl">Como escrever seu relato</h2>
          <p className="mt-5 text-lg text-tinta">
            O relato tem sete partes. Vá seguindo na ordem, com calma:
          </p>
          <ol className="mt-6 space-y-3">
            {partesRelato.map((parte, i) => (
              <li key={parte} className="flex items-center gap-4 border-b border-border pb-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tinta text-base font-semibold text-tinta-foreground">
                  {i + 1}
                </span>
                <span className="text-base font-medium text-tinta">{parte}</span>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-xl bg-neve p-5">
            <p className="text-base font-semibold text-tinta">
              Limite de 450 a 700 palavras · formato .docx obrigatório
            </p>
          </div>

          {/* TODO: trocar por <a href="/docs/modelo-relato.docx" download> quando o arquivo estiver disponível */}
          <Button variant="contorno" size="xl" className="mt-8 w-full sm:w-auto" disabled>
            Baixar o modelo de relato em Word
          </Button>
          <p className="mt-2 text-sm text-muted-foreground">Disponível em breve</p>

          <p className="mt-8">
            <a
              href="https://chatgpt.com/g/g-6a6dedf3f8248191b04949dfd3a3221f-praticas-exitosas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold text-listel underline"
            >
              Converse com o agente de apoio
            </a>
          </p>
        </div>
      </section>

      <FolhaDivisor />

      {/* 8. DATAS IMPORTANTES */}
      <section className="px-6 section-pad">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl text-tinta sm:text-3xl">Datas importantes</h2>
          <ol className="mt-10 flex flex-col gap-6 md:flex-row md:gap-4">
            {datas.map((d) => (
              <li
                key={d.dia}
                className="flex flex-1 items-center gap-4 border-l-4 border-listel pl-4 md:flex-col md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:text-center"
              >
                <span className="text-2xl font-bold text-listel">{d.dia}</span>
                <span className="text-base text-tinta">{d.texto}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 9. ÁREA DE ENVIO DE RELATO */}
      <section id="envio-relato" className="scroll-mt-6 bg-neve px-6 section-pad">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl text-tinta sm:text-3xl">Enviar meu relato</h2>
          <p className="mt-5 text-lg leading-relaxed text-tinta">
            Para começar, informe o seu CPF. Ele serve só para identificar o seu envio e conferir os
            seus dados — nada aparece publicamente no site.
          </p>
          <div className="mt-8">
            <Label htmlFor="cpf" className="text-base font-semibold text-tinta">
              CPF
            </Label>
            <Input
              id="cpf"
              name="cpf"
              inputMode="numeric"
              autoComplete="off"
              placeholder="000.000.000-00"
              className="mt-2 h-14 rounded-xl bg-background text-base"
            />
            {/* Validação e envio serão implementados na próxima etapa. */}
            <Button variant="acao" size="xl" className="mt-5 w-full" disabled>
              Continuar
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">Disponível em breve</p>
          </div>
        </div>
      </section>

      {/* 10. RODAPÉ */}
      <footer className="bg-tinta px-6 py-14 text-tinta-foreground">
        <div className="mx-auto max-w-3xl">
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

          {/* TODO: substituir os placeholders pelos logos reais:
              brasão do município, Secretaria Municipal de Educação de Arabutã e Gen-Z Educação */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {["Brasão de Arabutã", "Secretaria Municipal de Educação", "Gen-Z Educação"].map(
              (nome) => (
                <div
                  key={nome}
                  className="flex h-24 items-center justify-center rounded-xl border border-tinta-foreground/25 bg-tinta-foreground/10 px-3 text-center text-sm"
                >
                  {nome}
                </div>
              ),
            )}
          </div>

          <OndaJacutinga className="mt-10 h-5 w-full text-tinta-foreground/20" />

          <p className="mt-8 text-sm">
            <Link to="/privacidade" className="underline">
              Privacidade
            </Link>
          </p>
          <p className="mt-4 text-sm text-tinta-foreground/85">
            Comissão Organizadora — Summit de Educação de Arabutã · Gen-Z Educação · Secretaria
            Municipal de Educação de Arabutã
          </p>
        </div>
      </footer>
    </main>
  );
}
