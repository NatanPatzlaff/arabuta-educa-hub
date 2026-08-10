/**
 * Camada decorativa do hero: ícones de linha (livro aberto, nós de rede) flutuando
 * bem sutis atrás do escudo — remete a educação/livros e tecnologia sem virar
 * ilustração literal. Estático se `prefers-reduced-motion` (ver .particula-flutua
 * em styles.css); nunca compete com o escudo/texto (opacity baixa, pointer-events-none).
 */

type IconeProps = { className?: string; style?: React.CSSProperties };

function LivroAberto({ className = "", style }: IconeProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 44"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M32 8C27 4 19 2 4 2v34c15 0 23 2 28 6" />
      <path d="M32 8c5-4 13-6 28-6v34c-15 0-23 2-28 6" />
      <path d="M32 8v40" />
      <path d="M10 12h14M10 19h14M10 26h11" opacity="0.7" />
      <path d="M40 12h14M40 19h14M40 26h11" opacity="0.7" />
    </svg>
  );
}

function NoDeRede({ className = "", style }: IconeProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M10 46 26 22h20l8 14" />
      <path d="M26 22 38 8" />
      <circle cx="10" cy="46" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="26" cy="22" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="46" cy="22" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="54" cy="36" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="38" cy="8" r="3.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * `soDesktop`: no celular a mesma quantidade de ícones cai num espaço muito menor e
 * vira poluição em volta do escudo — metade some abaixo de `sm`.
 */
const PARTICULAS = [
  { Icone: LivroAberto, top: "12%", left: "9%", size: "3.5rem", duracao: "17s", atraso: "0s" },
  { Icone: NoDeRede, top: "66%", left: "13%", size: "3rem", duracao: "20s", atraso: "-6s" },
  { Icone: NoDeRede, top: "8%", left: "83%", size: "3.25rem", duracao: "18s", atraso: "-11s" },
  { Icone: LivroAberto, top: "70%", left: "80%", size: "3rem", duracao: "22s", atraso: "-4s" },
  { Icone: NoDeRede, top: "40%", left: "5%", size: "2.25rem", duracao: "15s", atraso: "-9s" },
  { Icone: LivroAberto, top: "38%", left: "91%", size: "2.5rem", duracao: "19s", atraso: "-14s" },
  // fmt: metade só no desktop
  { Icone: LivroAberto, top: "26%", left: "20%", size: "2rem", duracao: "16s", atraso: "-3s", soDesktop: true },
  { Icone: NoDeRede, top: "84%", left: "34%", size: "2.5rem", duracao: "21s", atraso: "-8s", soDesktop: true },
  { Icone: NoDeRede, top: "20%", left: "68%", size: "2.75rem", duracao: "17s", atraso: "-13s", soDesktop: true },
  { Icone: LivroAberto, top: "86%", left: "63%", size: "2.25rem", duracao: "23s", atraso: "-2s", soDesktop: true },
  { Icone: NoDeRede, top: "54%", left: "92%", size: "2rem", duracao: "18s", atraso: "-16s", soDesktop: true },
  { Icone: LivroAberto, top: "56%", left: "3%", size: "2.25rem", duracao: "20s", atraso: "-10s", soDesktop: true },
] as const;

export function ParticulasHero() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {PARTICULAS.map(({ Icone, top, left, size, duracao, atraso, ...resto }, i) => (
        <Icone
          key={i}
          className={`particula-flutua absolute text-tinta-foreground/[0.13] ${
            "soDesktop" in resto ? "hidden sm:block" : ""
          }`}
          style={
            {
              top,
              left,
              width: size,
              height: size,
              animationDuration: duracao,
              animationDelay: atraso,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
