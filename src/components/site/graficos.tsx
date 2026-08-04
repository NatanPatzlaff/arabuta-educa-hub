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

export function FolhaDivisor({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-cinza/30 sm:w-28" />
      <svg viewBox="0 0 32 40" className="h-8 w-6 text-tinta" fill="currentColor">
        <path d="M16 2c8 6 12 13 12 20 0 8-5.4 14-12 16C9.4 36 4 30 4 22 4 15 8 8 16 2Z" opacity="0.9" />
        <path d="M16 6v30" stroke="var(--areia)" strokeWidth="1.5" fill="none" />
        <path
          d="M16 14 9 11M16 20l-8-3M16 16l7-3M16 23l7-3"
          stroke="var(--areia)"
          strokeWidth="1.2"
          fill="none"
        />
      </svg>
      <span className="h-px w-16 bg-cinza/30 sm:w-28" />
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
        opacity="0.4"
      />
    </svg>
  );
}