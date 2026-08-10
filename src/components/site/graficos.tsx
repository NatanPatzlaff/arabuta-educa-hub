// Elementos gráficos discretos inspirados em Arabutã.
// Folha de pau-brasil, onda do Rio Jacutinga e raios de sol.

export function RaiosDeSol({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 60"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="100" cy="52" r="14" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const a = Math.PI + (i * Math.PI) / 8;
        return (
          <line
            key={i}
            x1={100 + Math.cos(a) * 20}
            y1={52 + Math.sin(a) * 20}
            x2={100 + Math.cos(a) * 34}
            y2={52 + Math.sin(a) * 34}
          />
        );
      })}
    </svg>
  );
}

/**
 * Divisor de seções: livro aberto com as páginas virando pontos de uma rede — os dois
 * temas do Summit (prática registrada e escrita + as pessoas que trocam entre si) num
 * símbolo só. Mesma linguagem de traço dos outros gráficos do site.
 */
export function FolhaDivisor({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-cinza sm:w-28" />
      <svg
        viewBox="0 0 44 34"
        className="h-8 w-11 text-listel"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* constelação saindo da lombada */}
        <path d="M13 9 22 3l9 6" opacity="0.9" />
        <circle cx="13" cy="9" r="1.8" fill="currentColor" stroke="none" />
        <circle cx="22" cy="3" r="1.8" fill="currentColor" stroke="none" />
        <circle cx="31" cy="9" r="1.8" fill="currentColor" stroke="none" />
        {/* livro aberto */}
        <path d="M22 17c-3.2-2.6-8-4-15-4v14c7 0 11.8 1.4 15 4" />
        <path d="M22 17c3.2-2.6 8-4 15-4v14c-7 0-11.8 1.4-15 4" />
        <path d="M22 17v14" />
      </svg>
      <span className="h-px w-16 bg-cinza sm:w-28" />
    </div>
  );
}

export function OndaJacutinga({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M0 20c60-16 120-16 180 0s120 16 180 0 120-16 180 0 120 16 180 0 120-16 180 0 120 16 180 0 120-16 180 0" />
      <path
        d="M0 30c60-16 120-16 180 0s120 16 180 0 120-16 180 0 120 16 180 0 120-16 180 0 120 16 180 0 120-16 180 0"
        opacity="0.5"
      />
    </svg>
  );
}