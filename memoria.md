# Memória do projeto

Registro de continuidade — não é log de conversa. Só o que ajuda a retomar o trabalho depois.

## Decisões aprovadas

- **08/08/2026** — Modelo de slides (I2) não vai mais existir; o texto oficial do regulamento (fora deste repo) está sendo ajustado para remover essa promessa. `docs/regulamento.md`/`/regulamento` ficam divergentes até o novo texto chegar.
- **08/08/2026** — Canal de envio de slides (I4) não será feito pelo site; a organização coleta por fora (canal ainda não definido).
- **08/08/2026** — E-mail de confirmação (D6/D7) adiado deliberadamente, será implementado via Lovable depois do restante.
- **08/08/2026** — Avaliação dos relatos concorrentes (§9) não terá login de avaliador externo no site; comissão compartilha relatos anonimizados por fora e lança notas manualmente no `/admin`.
- **08/08/2026** — Controle de presença operado pelo `/admin` (não pelo público), por exigência de `service_role` no banco.
- **08/08/2026** — Confirmado pelo usuário: a programação da home (`src/routes/index.tsx`), incluindo os palestrantes convidados "Maricelia Rossi de Oliveira" e "Beatriz Bonadiman", **está correta**. Não é divergência do regulamento — o regulamento rege a Mostra/ProLEEI, não a grade horária completa do evento, que é decisão própria da organização.
- Data desta rodada — Estrutura documental consolidada: `CLAUDE.md` complementado (sem remover regras existentes) + `specs/site.md` + `specs/design.md` + este arquivo, apontando `docs/regulamento.md` como autoridade máxima acima de qualquer spec.
- **08/08/2026 — Exceção pontual à regra "sem scroll-jacking" de `specs/design.md`.** Aprovada pelo usuário, escopo único: o escudo do hero da home. Comportamento: escudo aparece grande/centralizado no load, fica pinned (`position: sticky` + `animation-timeline: view()`, CSS nativo — sem GSAP, decisão revisada depois de rodar as skills `frontend-design`/`impeccable`/`ui-ux-pro-max`, que desaconselham dependência nova pra um efeito que o CSS atual já expressa) por ~1 viewport de scroll enquanto encolhe pra tamanho de logo e título/data/CTA fazem fade-in ao redor; depois libera scroll normal. Só essa seção — não abre precedente pro resto do site. Fallback obrigatório (`@supports not` + `prefers-reduced-motion`): escudo estático já no tamanho final, sem pin.

## Decisões rejeitadas

(nenhuma registrada ainda)

## Alterações realizadas

- Data desta rodada — `CLAUDE.md`: adicionada seção "Documentação do projeto" (aponta para `specs/site.md`, `specs/design.md`, `memoria.md`), regra de parar e avisar em caso de conflito com specs/memória, trava de stack técnica, proibição de remover decisão aprovada silenciosamente, proibição de inventar informação sobre o evento, regra de plano resumido antes de mudança grande e de atualizar `memoria.md` após decisão aprovada.
- Data desta rodada — Criados `specs/site.md` e `specs/design.md` do zero, documentando estado atual (código + regulamento), sem repetir o que já está em `docs/`.
- **08/08/2026 — Polimento visual da home** (pedido do usuário: "menos cara de site feito com IA", mais profissional, com animação de fundo; paleta vermelho/preto/branco/cinza mantida, tons/transparências livres). Rodou `impeccable` (context + detector mecânico) antes e depois. Mudanças:
  - `src/styles.css` — novos utilities: `sombra-card`/`sombra-card-hover`/`sombra-acao` (sombras com offset+blur reais, não halo), `grao` (textura de ruído SVG sutil via `feTurbulence`, opacity 5%), `fundo-aurora` (gradientes radiais vermelhos com deriva lenta via `@keyframes`), `revela`/`revela-visivel` (fade+translateY de entrada). Também: `::selection`, scrollbar e `:focus-visible` temáticos na paleta da marca, e `prefers-reduced-motion: reduce` global.
  - `src/components/site/fundo-hero.tsx` (novo) — aurora + grão no hero.
  - `src/components/site/reveal.tsx` (novo) — wrapper com `IntersectionObserver` para entrada suave ao rolar, reaproveitado em todos os títulos de seção da home.
  - `src/components/ui/button.tsx` — variantes `acao`/`tinta`/`contorno` ganharam elevação no hover (`-translate-y-0.5`) e sombra com offset real.
  - `src/components/site/barra-fixa.tsx` — `backdrop-blur` + sombra e transição de entrada (antes só opacity).
  - `src/routes/index.tsx` — hero com fundo animado e tipografia mais confiante; cards do bento com sombra/hover; **removida a "side-tab accent border" (`border-l-4` colorida) de 6 avisos/callouts** — era o antipadrão mais reconhecível de "gerado por IA", confirmado pelo detector mecânico do `impeccable` — substituída por ícone (`TriangleAlert`/`ShieldCheck`) + hierarquia tipográfica; timeline de "Datas importantes" trocou a barra lateral/superior grossa por marcador de ponto, igual ao padrão já usado em "Programação".
  - **Não verificado visualmente no navegador**: este ambiente não tem `node_modules`/`bun` instalados, não foi possível rodar `vite dev` para checar responsividade e o resultado real da animação. Recomendo `bun install && bun run dev` e revisar hero (mobile e desktop) antes de publicar.
- **08/08/2026 — Escudo pinned no hero** (pedido do usuário, ver exceção registrada acima em "Decisões aprovadas"). Rodou `frontend-design`, `impeccable` (context + `reference/animate.md`) e `ui-ux-pro-max` (domínios `gsap`/`ux`) antes de implementar — a crítica dessas skills foi o motivo de trocar GSAP por CSS nativo. Verificado visualmente no navegador (`chrome-devtools` MCP), desktop e mobile (390×844), incluindo dois bugs achados e corrigidos só nesse processo de verificação:
  - `public/brasao-arabuta.png` (novo) — brasão oficial do município (Prefeitura de Arabutã, domínio público, via Wikimedia Commons), fundo recortado por flood-fill, 900×1044px, ~200KB. **Não é a imagem PNG anexada pelo usuário** — aquela tinha um glow/vinheta pintado no próprio arquivo (não removível sem degradar as linhas do brasão); a versão oficial do Wikimedia tinha fundo branco liso, resultado bem mais limpo.
  - `src/components/site/escudo-hero.tsx` (novo) — estrutura do pin (imagem + título/data/CTA).
  - `src/styles.css` — utilities `escudo-track`/`escudo-pin`/`escudo-img`/`escudo-conteudo` + keyframes `escudo-encolhe`/`escudo-texto-entra`. Estado base = layout final estático (sem pin); a camada de scroll (`position: sticky` + `animation-timeline: view()`) só ativa dentro de `@supports (animation-timeline: view()) { @media (prefers-reduced-motion: no-preference) {...} }`.
  - **Bug 1** — `header#hero` tinha `overflow-hidden`, o que faz o navegador tratar o header (não o documento) como scroll container da view-timeline, quebrando o cálculo de progresso do pin (escudo aparecia sempre encolhido, nunca grande). Corrigido isolando `overflow-hidden` num wrapper só dos elementos decorativos (`FundoHero`/`RaiosDeSol`), tirando do header.
  - **Bug 2** — a animação usava `transform: scale()`, que não afeta o espaço reservado no layout: a caixa original (grande) continuava ocupando o lugar mesmo com o escudo visualmente encolhido, deixando um vão vazio entre o escudo pequeno e o título. Corrigido trocando para animar `width` diretamente (o fluxo reflui e o texto acompanha o encolhimento).
  - `src/routes/index.tsx` — hero agora usa `<EscudoHero />` no lugar do bloco de título/CTA estático.
  - Fallback de `prefers-reduced-motion: reduce` **não foi verificado visualmente** (a ferramenta de emulação do navegador disponível não expõe esse media feature) — validado só por revisão do CSS (a regra fica estritamente dentro de `@media (prefers-reduced-motion: no-preference)`, então com `reduce` ativo cai automaticamente no estado base/estático). Recomendo conferir manualmente ativando "reduzir movimento" no SO antes de publicar.

## Problemas encontrados

- `docs/requisitos.md` já documenta 4 "excedentes" não resolvidos: campos `escola`/`funcao` na inscrição (regulamento pede só nome/e-mail/WhatsApp/CPF), e-mail de coautor no formulário da Mostra, campo "Título do relato" no ProLEEI, limite de 10 MB por arquivo — nenhum é proibido pelo regulamento, mas também não é exigido; ver se vale remover ou manter.

## Soluções aplicadas

(nenhuma — rodada só documental, nenhum código alterado)

## Pendências

- Nomes dos 5 apresentadores selecionados da Mostra + suplente: só se definem após 23/08 (fim das submissões) + avaliação (27–30/08) + divulgação (03/09/2026). Até lá, essa parte específica da programação é dinâmica/pendente — a grade horária e os palestrantes convidados já estão confirmados (ver Decisões aprovadas).
- `docs/regulamento.md` precisa ser atualizado quando a organização enviar o novo texto oficial da seção 10 (removendo a promessa do modelo de slides).
- Canal alternativo de envio de slides (I4) ainda não definido/publicado.
- E-mail de confirmação (D6/D7) ainda não implementado (adiado para depois, via Lovable).
- Download em PDF do regulamento ainda não existe (A7 é atendido só por leitura online).
- Migrações Supabase pendentes de aplicação em produção, conforme notas de `docs/requisitos.md`: `20260808120000_presencas_admin_checkin.sql`, `20260808130000_prazo_abertura_submissoes.sql`, `20260808140000_relatos_mostra_regras_regulamento.sql`, `20260808150000_avaliacao_relatos_mostra.sql`.

## Próximos passos

1. Confirmar se as migrações pendentes listadas acima já foram aplicadas em produção.
2. Retomar o trabalho de código seguindo `specs/site.md` e `specs/design.md` como referência de implementação.
