import { createFileRoute } from "@tanstack/react-router";
import { EmConstrucao } from "@/components/site/em-construcao";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Área administrativa — Summit de Educação de Arabutã" },
      { name: "description", content: "Área da comissão organizadora do Summit de Educação de Arabutã." },
      { property: "og:title", content: "Área administrativa — Summit de Educação de Arabutã" },
      { property: "og:description", content: "Área da comissão organizadora do Summit de Educação de Arabutã." },
    ],
  }),
  component: () => (
    <EmConstrucao
      titulo="Área administrativa"
      texto="A área da comissão organizadora será disponibilizada em breve."
    />
  ),
});
