import { createFileRoute, Link } from "@tanstack/react-router";
import { FolhaDivisor } from "@/components/site/graficos";

const DESC =
  "Como funciona o controle de presença do Summit de Educação de Arabutã, 8 de setembro de 2026.";

export const Route = createFileRoute("/presenca")({
  head: () => ({
    meta: [
      { title: "Presença — Summit de Educação de Arabutã" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Presença — Summit de Educação de Arabutã" },
      { property: "og:description", content: DESC },
    ],
  }),
  component: PaginaPresenca,
});

function PaginaPresenca() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neve px-6 py-20 text-center">
      <FolhaDivisor className="mb-8" />
      <p className="text-sm font-semibold uppercase tracking-widest text-listel">
        Summit de Educação de Arabutã
      </p>
      <h1 className="mt-3 text-3xl text-tinta sm:text-4xl">Controle de presença</h1>

      <p className="medida mt-4 max-w-md text-base text-tinta">
        O controle de presença é feito pela organização no próprio local, na entrada da manhã e
        na entrada da tarde. Você não precisa fazer nada nesta página — basta comparecer e
        confirmar sua presença com a equipe do Summit em cada período.
      </p>
      <p className="medida mt-4 max-w-md text-base text-tinta">
        Quem cumprir a presença nos dois períodos recebe o certificado de 8 horas. Quem também
        tem relato habilitado recebe o certificado de 15 horas, nas condições do regulamento.
      </p>
      <p className="medida mt-4 max-w-md text-sm text-ferro">
        Dúvidas sobre o registro de presença: WhatsApp (49) 99927-1442 — Maricelia.
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex h-14 items-center justify-center rounded-xl bg-tinta px-8 text-base font-semibold text-tinta-foreground transition-colors hover:bg-tinta/90"
      >
        Voltar para a página inicial
      </Link>
    </main>
  );
}
