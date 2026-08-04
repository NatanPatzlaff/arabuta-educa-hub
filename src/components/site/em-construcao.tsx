import { Link } from "@tanstack/react-router";
import { FolhaDivisor } from "./graficos";

export function EmConstrucao({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neve px-6 py-20 text-center">
      <FolhaDivisor className="mb-8" />
      <p className="text-sm font-semibold uppercase tracking-widest text-listel">
        Summit de Educação de Arabutã
      </p>
      <h1 className="mt-3 text-3xl text-tinta sm:text-4xl">{titulo}</h1>
      <p className="mt-4 max-w-md text-base text-tinta">{texto}</p>
      <p className="mt-2 text-sm font-semibold text-tinta">Em construção</p>
      <Link
        to="/"
        className="mt-8 inline-flex h-14 items-center justify-center rounded-xl bg-tinta px-8 text-base font-semibold text-tinta-foreground transition-colors hover:bg-tinta/90"
      >
        Voltar para a página inicial
      </Link>
    </main>
  );
}