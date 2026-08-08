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
      (entries) => setVisivel(!(entries[0]?.isIntersecting ?? true)),
      { threshold: 0 },
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visivel}
      className={`fixed inset-x-0 top-0 z-50 border-b border-cinza/70 bg-background/85 backdrop-blur-md sombra-card transition-all duration-300 ${
        visivel ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
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
