import { createFileRoute } from "@tanstack/react-router";
import { EmConstrucao } from "@/components/site/em-construcao";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Privacidade — Summit de Educação de Arabutã" },
      { name: "description", content: "Política de privacidade do Summit de Educação de Arabutã." },
      { property: "og:title", content: "Privacidade — Summit de Educação de Arabutã" },
      { property: "og:description", content: "Política de privacidade do Summit de Educação de Arabutã." },
    ],
  }),
  component: () => (
    <EmConstrucao
      titulo="Privacidade"
      texto="A política de privacidade e o tratamento de dados dos participantes serão publicados aqui."
    />
  ),
});
