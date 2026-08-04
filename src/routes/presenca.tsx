import { createFileRoute } from "@tanstack/react-router";
import { EmConstrucao } from "@/components/site/em-construcao";

export const Route = createFileRoute("/presenca")({
  head: () => ({
    meta: [
      { title: "Presença — Summit de Educação de Arabutã" },
      { name: "description", content: "Registro de presença do Summit de Educação de Arabutã, 8 de setembro de 2026." },
      { property: "og:title", content: "Presença — Summit de Educação de Arabutã" },
      { property: "og:description", content: "Registro de presença do Summit de Educação de Arabutã, 8 de setembro de 2026." },
    ],
  }),
  component: () => (
    <EmConstrucao
      titulo="Presença"
      texto="O registro de presença do dia do evento ficará disponível aqui."
    />
  ),
});
