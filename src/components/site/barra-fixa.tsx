import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

/** Barra fina fixa no topo, visível somente depois que o hero sai da tela. */
export function BarraFixa() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisivel(!entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visivel}
      className={`fixed inset-x-0 top-0 z-50 border-b border-cinza bg-background shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-opacity duration-200 ${
        visivel ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-2">
        <span className="hidden text-sm font-semibold text-tinta sm:block">
          Summit de Educação de Arabutã
        </span>
        <Button asChild variant="acao" size="sm" className="h-9 w-full px-5 text-sm sm:w-auto">
          <Link to="/inscricao">Quero me inscrever</Link>
        </Button>
      </div>
    </div>
  );
}
