import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

/**
 * Escudo do hero: aparece grande no load, fica pinned (`position: sticky` +
 * `animation-timeline: view()` nativo) durante um trecho de scroll enquanto encolhe
 * pra tamanho de logo e o título/data/CTA aparecem ao redor. Exceção pontual à regra
 * "sem scroll-jacking" do projeto — ver specs/design.md e memoria.md (08/08/2026).
 * Sem suporte a scroll-driven animation (ou prefers-reduced-motion) o layout cai pro
 * estado final, estático, sem pin — nunca esconde conteúdo.
 */
export function EscudoHero() {
  return (
    <div className="escudo-track">
      <div className="escudo-pin">
        {/* O halo é filho do wrapper da imagem (não do fundo do hero) pra ficar
            grudado no escudo em qualquer estado do pin — grande, encolhido ou parado. */}
        <span className="escudo-halo">
          <img
            src="/brasao-arabuta.png"
            alt="Brasão do município de Arabutã"
            width={900}
            height={1044}
            fetchPriority="high"
            decoding="async"
            className="escudo-img"
          />
        </span>
        <div className="escudo-conteudo mx-auto max-w-3xl text-center">
          <h1 className="mt-6 text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            1º Summit de Educação de Arabutã
          </h1>
          <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-tinta-foreground/60">
            2º Seminário ProLEEI
          </p>
          <p className="epigrafe mt-6 text-lg text-tinta-foreground/90 sm:text-xl">
            Encontro de pessoas, práticas e ideias que movimentam a educação
          </p>
          <p className="mt-6 text-base text-tinta-foreground/75">
            8 de setembro de 2026 · Centro Educacional Esportivo e Cultural · Arabutã (SC)
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild variant="acao" size="xl" className="w-full sm:w-auto">
              <Link to="/inscricao">Quero me inscrever</Link>
            </Button>
            <Button
              asChild
              variant="contorno"
              size="xl"
              className="w-full border-tinta-foreground/25 bg-transparent text-tinta-foreground hover:bg-tinta-foreground/10 sm:w-auto"
            >
              <a href="#envio-relato">Enviar meu relato</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
