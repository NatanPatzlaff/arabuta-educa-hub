import * as React from "react";

/**
 * Revela o conteúdo com fade + leve deslocamento quando entra na tela.
 * Único gesto de movimento reaproveitado no site inteiro (ver .revela em styles.css).
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        // `top < 0` cobre o bloco que já passou da tela: com rolagem rápida (ou âncora
        // direto pro meio da página) o elemento pode entrar e sair entre dois frames e
        // nunca satisfazer o threshold — sem isso ele fica invisível pra sempre.
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          setVisivel(true);
          obs.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`revela ${visivel ? "revela-visivel" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
