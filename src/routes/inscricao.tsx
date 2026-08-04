import { createFileRoute } from "@tanstack/react-router";
import { EmConstrucao } from "@/components/site/em-construcao";

export const Route = createFileRoute("/inscricao")({
  head: () => ({
    meta: [
      { title: "Inscrição — Summit de Educação de Arabutã" },
      {
        name: "description",
        content: "Inscrições para o Summit de Educação de Arabutã, 8 de setembro de 2026.",
      },
      { property: "og:title", content: "Inscrição — Summit de Educação de Arabutã" },
      {
        property: "og:description",
        content: "Inscrições para o Summit de Educação de Arabutã, 8 de setembro de 2026.",
      },
    ],
  }),
  component: () => (
    <EmConstrucao
      titulo="Inscrição"
      texto="O formulário de inscrição estará disponível em breve nesta página."
    />
  ),
});