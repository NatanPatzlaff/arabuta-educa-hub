import { createFileRoute } from "@tanstack/react-router";
import { EmConstrucao } from "@/components/site/em-construcao";

export const Route = createFileRoute("/relato")({
  head: () => ({
    meta: [
      { title: "Envio de relato — Summit de Educação de Arabutã" },
      { name: "description", content: "Envio de relato para a Mostra de Práticas Exitosas do Summit de Educação de Arabutã." },
      { property: "og:title", content: "Envio de relato — Summit de Educação de Arabutã" },
      { property: "og:description", content: "Envio de relato para a Mostra de Práticas Exitosas do Summit de Educação de Arabutã." },
    ],
  }),
  component: () => (
    <EmConstrucao
      titulo="Envio de relato"
      texto="A submissão dos relatos de práticas exitosas será aberta em breve nesta página."
    />
  ),
});
