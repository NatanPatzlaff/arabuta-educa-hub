/** Fundo do hero: aurora vermelha em deriva lenta + grão sutil, tudo dentro da paleta da marca. */
export function FundoHero() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="fundo-aurora" />
      <div className="grao absolute inset-0" />
    </div>
  );
}
