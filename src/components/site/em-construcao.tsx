import { Link } from "@tanstack/react-router";
import { FolhaDivisor } from "./graficos";

export function EmConstrucao({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-areia px-6 py-20 text-center">
      <FolhaDivisor className="mb-8" />
      <p className="text-sm font-semibold uppercase tracking-widest text-campo">
        Summit de Educação de Arabutã
      </p>
      <h1 className="mt-3 text-3xl text-mata sm:text-4xl">{titulo}</h1>
      <p className="mt-4 max-w-md text-base text-grafite">{texto}</p>
      <p className="mt-2 text-sm font-semibold text-terra">Em construção</p>
      <Link
        to="/"
        className="mt-8 inline-flex h-14 items-center justify-center rounded-xl bg-mata px-8 text-base font-semibold text-mata-foreground transition-colors hover:bg-mata/90"
      >
        Voltar para a página inicial
      </Link>
    </main>
  );
}