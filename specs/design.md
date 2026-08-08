# Spec — Design

Este arquivo documenta a identidade visual **realmente implementada** hoje (baseline, lida em `src/styles.css` e nos componentes) e a direção desejada daqui para frente. A paleta original descrita no `README.md` (verde-campo, verde-mata, azul-céu etc., extraída do brasão) foi **substituída** em produção por uma paleta mais sóbria — trate o `README.md` como histórico, não como estado atual.

## Direção visual

Sóbria e contemporânea, com referência sutil à origem alemã de Arabutã — nunca como tema decorativo explícito.

**Evitar explicitamente:**
- Estética bávara/tirolesa (enxaimel decorativo, losangos, cores vermelho-branco-azul "festa alemã").
- Clip-art de imigrante, ilustração folclórica, desenho de fazenda.
- Tipografia "germânica" estereotipada (blackletter/fraktur).
- Estética de template genérico de evento corporativo.

A referência alemã, quando entrar, deve aparecer como detalhe sutil (ex.: um traço de paleta, uma textura discreta, um detalhe tipográfico) — nunca como cenário ou motivo repetido.

Para valores exatos de easing/duração/hex extraídos de sites de referência (não para copiar 1:1, mas como base de padrões de movimento e tipografia), ver [`docs/referencia-visual.md`](../docs/referencia-visual.md).

## Paleta atual em produção (`src/styles.css`, tokens em OKLCH)

Paleta reduzida — branco, preto, cinza, vermelho e amarelo — mais sóbria que a original do README:

| Token | Uso | Valor |
|---|---|---|
| `tinta` | texto principal, fundos escuros de destaque | `oklch(0.18 0.01 60)` (quase preto) |
| `ferro` | texto secundário/muted | `oklch(0.46 0.008 60)` (cinza médio) |
| `cinza` | bordas, divisores | `oklch(0.9 0.004 60)` |
| `neve` | fundos de seção suaves | `oklch(0.975 0.003 80)` (quase branco) |
| `listel` | cor de ação/primária (botões, links, progresso) | `oklch(0.52 0.19 27)` (vermelho) |
| `listel-forte` | hover/ativo sobre `listel` | `oklch(0.43 0.16 27)` |
| `sol` | destaque pontual/accent | `oklch(0.84 0.165 88)` (amarelo) |
| `sol-suave` | fundo de destaque suave | `oklch(0.965 0.045 92)` |

Mapeamento semântico shadcn: `primary` = `listel`, `secondary`/`muted` = `neve`, `accent` = `sol`, `destructive` = `listel-forte`, `background`/`card` = branco puro. **Site é só claro** — `.dark` repete exatamente os valores de `:root` (dark mode não implementado/ativado).

Regra do projeto (já em `README.md`): definir tudo como tokens semânticos em `index.css`, nunca cor solta em componente.

## Tipografia

- **Títulos** (`h1`–`h4`): Sora, peso 700, `letter-spacing: -0.015em` (`--font-display`).
- **Texto corrido**: Inter, 16px base, `line-height: 1.65` (`--font-sans`).
- **Epígrafe/citações**: Lora itálico (`--font-serif`, utility `.epigrafe`).
- Medida de leitura: texto corrido limitado a 68ch (utility `.medida`).

## Espaçamento

- Padding vertical de seção padrão: `4.5rem` (utility `.section-pad`).
- Container central (`.container-site`): `max-width 1200px`, padding lateral `1.5rem` (mobile) → `2.5rem` (≥1024px); `max-width 1320px` em ≥1440px.
- Muito espaço em branco entre seções (regra do README, mantida).

## Bordas e raios

- `--radius: 0.625rem` como base; escala `sm`→`4xl` derivada por soma/subtração (`radius-sm` a `radius-4xl`).
- Cards e inputs em geral usam `rounded-xl`; botões usam `rounded-md` (variante `xl` usa `rounded-xl`).
- Bordas finas em `cinza`/`border-input`.
- Sombras com offset e blur reais (utilities `sombra-card`, `sombra-card-hover`, `sombra-acao` em `styles.css`) — nunca halo de offset zero. `sombra-acao` usa a cor `listel` para dar peso ao botão primário; as demais usam `tinta` em baixa opacidade.

## Botões (`components/ui/button.tsx`)

Variantes shadcn padrão (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`) **mais** três variantes específicas do site:

- `acao` — fundo `listel` (vermelho), texto branco, hover `listel-forte`. Uso: ações primárias/urgência ("Quero me inscrever").
- `tinta` — fundo `tinta` (quase preto), texto branco. Uso: ação secundária de peso.
- `contorno` — borda dupla cinza, fundo transparente, hover `neve`. Uso: ação terciária.

Tamanhos: `default` (h-9), `sm`, `lg`, `xl` (h-14, `rounded-xl`, usado nos CTAs do hero). Transição só de cor (`transition-colors`), sem animação de escala/sombra.

## Cards

Padrão bento observado na home (`cell()` em `index.tsx`): `rounded-xl border p-6 lg:p-8`, três tons — `branco` (`bg-card`/`border-cinza`), `neve` (`bg-neve`), `preto` (`bg-tinta text-tinta-foreground`, para destaque forte). `components/ui/card.tsx` fornece o primitivo shadcn subjacente.

## Imagens

- Sem fotos/ilustração cheia: elementos gráficos são **SVG inline discretos** (`components/site/graficos.tsx` — `FolhaDivisor`, `OndaJacutinga`, `RaiosDeSol`), usados como divisores/detalhes, nunca como cenário.
- Logos (brasão do município, Secretaria, Gen-Z Educação) — placeholders neutros no rodapé até os arquivos reais chegarem (ver README original); nenhuma foto de participante/estudante é usada.

## Movimento e animação

- Regra explícita do projeto: **sem carrossel, sem animação pesada, sem pop-up**.
- **Aurora de fundo** (`.fundo-aurora`, `src/components/site/fundo-hero.tsx`): gradientes radiais em `listel`/`listel-forte`/`sol`, opacidade baixa, deriva lenta de 26s via `@keyframes` (`transform: translate + scale`), atrás do conteúdo do hero. Usada só no hero — não espalhar pelo site inteiro.
- **Grão** (`.grao`, mesmo componente): textura de ruído SVG (`feTurbulence`) a 5% de opacidade, `mix-blend-mode: overlay`, para quebrar a planura característica de fundo "gerado por IA". Puramente decorativo, não interfere em contraste de texto.
- **Revelação ao rolar** (`.revela`/`.revela-visivel`, `src/components/site/reveal.tsx`): fade + `translateY(14px→0)`, `IntersectionObserver`, dispara uma vez. É o único gesto de entrada do site — reaproveitado nos títulos de seção da home, não reinventado por seção.
- **Microinterações de botão**: variantes `acao`/`tinta`/`contorno` sobem `-translate-y-0.5` no hover com sombra de offset real (`sombra-acao`/`sombra-card`), voltam ao normal no `active`.
- Tudo respeita `prefers-reduced-motion: reduce` (regra global em `styles.css`, desativa animação/transição).
- Fora isso: transições simples de cor (`transition-colors`) nos demais componentes. Nada de scroll-jacking, parallax ou carrossel — **exceto** a exceção pontual abaixo, registrada em `memoria.md` (08/08/2026).
- **Escudo do hero pinned (`src/components/site/escudo-hero.tsx`)** — única exceção à regra acima, escopo único: o escudo municipal do hero da home. `position: sticky` + `animation-timeline: view()` (CSS nativo, sem lib nova): aparece grande/centralizado no load, fica pinned por ~1 viewport de scroll enquanto encolhe pra tamanho de logo e o título/data/CTA fazem fade-in ao redor via `Reveal`; depois libera scroll normal. Easing `cubic-bezier(0.645, 0.045, 0.355, 1)` (mesma assinatura de `docs/referencia-visual.md`). Fallback via `@supports not (animation-timeline: view())` e `prefers-reduced-motion: reduce`: escudo estático, já no tamanho final, sem pin. Não espalhar esse padrão pra outras seções.

## Avisos e callouts

- **Nunca usar borda lateral grossa colorida** (`border-l-4`) em card/callout/alerta — é o antipadrão "side-tab accent border", o tell mais reconhecível de UI gerada por IA (confirmado pelo detector mecânico do `impeccable`, `scripts/detect.mjs`). Removido de 6 ocorrências na home em 08/08/2026.
- Padrão atual: ícone lucide (`TriangleAlert` para avisos obrigatórios, `ShieldCheck` para reforço positivo) ao lado do texto, dentro de um card com sombra (`sombra-card`) ou fundo sólido (`tinta`/`neve`) — sem borda de destaque lateral.

## Regras desktop / mobile

- Mobile-first: botões grandes (`h-14` nos CTAs e campos de formulário), um campo por linha, alvo de toque generoso.
- Breakpoints do container em 1024px (padding maior) e 1440px (largura máxima maior) — sem breakpoint dedicado de tablet além disso.
- Timeline de datas: horizontal no desktop, vertical no celular (regra do README, a validar no código ao tocar a seção).
- Contraste AA obrigatório em qualquer combinação de cor nova — pensado para leitura ao sol/telas antigas, conforme regra de usabilidade do projeto.

## Ao propor mudanças visuais

Qualquer alteração de paleta, tipografia, espaçamento ou componente deve:
1. Manter a hierarquia de tokens semânticos (nunca cor solta em componente).
2. Ser compatível com a lista "evitar explicitamente" acima.
3. Passar as skills de design do projeto (`impeccable`, `ui-ux-pro-max`, `responsive-craft`, `frontend-design`) antes da implementação, conforme `CLAUDE.md`.
