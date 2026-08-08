# Referência Visual — Base de Design

Documento extraído via inspeção de CSS computado (DevTools) de 3 sites de referência (siteInspire). Use como guia de **padrões**, não para copiar 1:1 — a ideia é aplicar a lógica de cada um ao projeto do summit.

---

## 1. Collection.industries (agência criativa, Montréal)

**Vibe:** portfólio editorial, alto contraste preto/branco, tipografia grande como elemento de layout.

### Tipografia
- Título/display: `"Doves Type Text", serif`
- Corpo/UI: `"Good Direction Sans", sans-serif`
- Escala de tamanhos observada: `16px`, `18px`, `24px`, `34px`, `40px`, `60px`, `92px`, `138px` (todos peso 500 — a hierarquia vem do tamanho, não do peso)

### Cores
- Preto: `rgb(0,0,0)`
- Branco: `rgb(255,255,255)`
- Cinza claro (fundo secundário): `rgb(240,240,240)`
- Paleta minimalista de 3 cores só — contraste extremo

### Animação / transições (valores exatos)
- Menu modal: `transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)` (easing "ease-in-out-quart", usado em quase tudo do site — é a assinatura de movimento dele)
- Overlay de modal: `opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)`
- Botão de contato: `transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)`
- Card de contato (abertura): `transform 1s ease`
- Header ao rolar: `transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)`
- Emblema animado (logo): `0.8s cubic-bezier(0.645, 0.045, 0.355, 1)`
- Tagline do hero: `0.6s cubic-bezier(0.645, 0.045, 0.355, 1)`
- Hover em imagem: `transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)`
- Micro-interações genéricas (cor, opacidade): `0.15s cubic-bezier(0.4, 0, 0.2, 1)` (easing padrão Tailwind/Material)

**Padrão a copiar:** uma única curva de easing (`cubic-bezier(0.645, 0.045, 0.355, 1)`) reaproveitada em quase toda transição do site — dá consistência de "peso" ao movimento. Durações maiores (0.6-1s) pra elementos grandes (menu, modal), curtas (0.15-0.3s) pra micro-interações.

---

## 2. Ciridae.com (AI Transformation, consultoria)

**Vibe:** techy, escuro, monoespaçada em detalhes — tom mais "produto de software" que institucional.

### Tipografia
- Título condensado: `"Pragmatica Cond", Arial, sans-serif`
- Corpo: `Pragmatica, Arial, sans-serif`
- Detalhes/labels/dados: `"Roboto Mono", monospace` — usa mono pra números e metadados, sans pra texto corrido
- Tamanhos: `11px`, `14px`, `16px`, `32px`, `40px` — todos peso 400 (regular)

### Cores
- Fundo escuro principal: `rgb(11,11,11)` / `rgb(5,5,5)`
- Fundo secundário (cards): `rgb(39,42,42)` — cinza-esverdeado, não preto puro
- Texto: `rgb(255,255,255)` sobre escuro, `rgb(11,11,11)` sobre claro
- Overlay: `rgba(255,255,255,0.72)`

### Animação / transições
- Menu burger: `opacity/visibility 0.6s cubic-bezier(0.76, 0, 0.24, 1)` (easing "ease-in-out-quint" — mais abrupto no meio que o da Collection)
- Popup: `opacity/visibility 0.6s cubic-bezier(0.84, 0, 0.16, 1)` (ainda mais extremo)
- Nav ao abrir (multi-propriedade simultânea): `transform, background-color, color 0.8s/0.4s cubic-bezier(0.76, 0, 0.24, 1)`
- Ícones do burger: `transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)`

**Padrão a copiar:** curvas de easing mais "extremas" (quint/quart puro) que aceleram forte no início e no fim — dá sensação de precisão/mecânico, coerente com o tom tech. Estados de nav mudam várias propriedades ao mesmo tempo com durações levemente escalonadas (0.8s no transform, 0.4s na cor) — evita que tudo termine no mesmo instante, o que humaniza o movimento.

---

## 3. MakingSoftware.com (manual/livro técnico interativo)

**Vibe:** "manual de engenharia" — diagramas isométricos vetoriais, tipografia pixelada no título, serifada no corpo, fundo off-white com grid pontilhado.

### Tipografia
- Título/UI: `ui-sans-serif, system-ui` (mas visualmente usa fonte pixel/bitmap customizada nos títulos grandes — "MAKING SOFTWARE" em blocos azuis pixelados)
- Corpo: `arizona, "EB Garamond", serif` — serifada clássica, legibilidade de texto longo
- Monoespaçada (labels técnicos, legendas de figura): `departureMono, monospace`
- Tamanhos pequenos e discretos: `10px`, `12px`, `14px`, `16px` — o impacto visual vem dos diagramas, não do texto

### Cores
- Fundo: `rgb(251,251,251)` (off-white, não branco puro)
- Azul de destaque (diagramas, título): `oklch(0.5058 0.2886 264.84)` ≈ azul vívido tipo `#3B5BFF`
- Preto: `rgb(0,0,0)` só no texto de corpo

### Estrutura visual
- Layout em "página de livro": duas colunas, texto à esquerda / diagrama técnico à direita
- Diagramas SVG isométricos com linhas tracejadas e legendas apontando pra partes (estilo "exploded view" de manual de hardware)
- Grid de pontos fino no fundo do diagrama, sutil
- Sem animações CSS tradicionais capturadas — o movimento aqui é via scroll/interação nos próprios diagramas SVG (não replicável por transição simples)

**Padrão a copiar:** contraste entre tipografia "de manual técnico" (serifada + mono) e um único azul de destaque forte. Layout em colunas com diagrama explicativo ao lado do texto é uma metáfora forte pra qualquer conteúdo que precise "explicar como algo funciona" (ex: como funciona a avaliação de trabalhos, o fluxo de submissão).

---

## Síntese — o que aplicar no site do summit

| Aspecto | Referência | Aplicação sugerida |
|---|---|---|
| Easing padrão | Collection: `cubic-bezier(0.645, 0.045, 0.355, 1)` | Uma curva única em toda transição do site pra dar consistência |
| Durações | Collection: 0.6-1s (grande) / 0.15-0.3s (micro) | Mesma escala — menu/modal lento, hover rápido |
| Paleta | Collection (mono) + MakingSoftware (1 cor de destaque) | Preto/branco/cinza-claro + uma cor de destaque só (definir com base na identidade do evento) |
| Tipografia | MakingSoftware: serifada no corpo + mono em labels técnicos | Bom pra seção de regulamento/critérios (serifada = leitura longa, mono = dados/prazos) |
| Diagramas explicativos | MakingSoftware: exploded view lado a lado com texto | Aplicar no fluxo de submissão — "como funciona a avaliação", linha do tempo do processo |
| Estados de nav multi-propriedade | Ciridae: durações escalonadas por propriedade | Evitar que header/menu pareçam "travar" tudo junto ao abrir |

Todos os valores acima (hex, durations, easings) foram extraídos do CSS computado real das páginas — pode usar direto no Claude Code sem aproximar.
