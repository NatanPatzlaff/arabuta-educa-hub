import { createFileRoute } from "@tanstack/react-router";
import { AvaliacaoRelatos } from "@/components/site/avaliacao-relatos";

const DESC = "Painel de avaliação anônima dos relatos do Summit de Educação de Arabutã.";

export const Route = createFileRoute("/avaliacao")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Avaliação dos relatos — Summit de Educação de Arabutã" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Avaliação dos relatos — Summit de Educação de Arabutã" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AvaliacaoRelatos,
});
