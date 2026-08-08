# Site — 1º Summit de Educação de Arabutã

Site oficial do 1º Summit de Educação de Arabutã · 2º Seminário Municipal de Educação.
Evento em 8 de setembro de 2026, no Centro Educacional Esportivo e Cultural, Arabutã (SC).
Realização: Gen-Z Educação · Secretaria Municipal de Educação de Arabutã.

O site é o **único canal oficial** de inscrição no evento e de envio de relatos. Não existe fluxo alternativo por e-mail, WhatsApp ou entrega física.

O site já existe, já é funcional e já capta dados reais de participantes (inscrição + os dois formulários de relato). O objetivo de qualquer tarefa aqui é **evoluir e complementar**, não recriar do zero.

---

## Documentação do projeto — leia antes de trabalhar

- [`docs/regulamento.md`](docs/regulamento.md) — regulamento oficial do evento. **Autoridade máxima, acima de qualquer spec, decisão de design ou pedido pontual.**
- [`docs/requisitos.md`](docs/requisitos.md) — checklist derivado do regulamento, item por item.
- [`specs/site.md`](specs/site.md) — o que o site faz hoje: fluxos de captação de dados, seções, stack, escopo. Documenta a implementação, não repete o regulamento.
- [`specs/design.md`](specs/design.md) — identidade visual atual (baseline) e direção visual desejada.
- [`docs/referencia-visual.md`](docs/referencia-visual.md) — valores exatos (hex, duration, cubic-bezier) extraídos de sites de referência para padrões de movimento e tipografia. Usar como base, não copiar 1:1.
- [`memoria.md`](memoria.md) — decisões aprovadas/rejeitadas, alterações feitas, pendências e próximos passos.

**Se um pedido conflitar com o regulamento, com `docs/requisitos.md`, ou com uma decisão já registrada em `specs/site.md`, `specs/design.md` ou `memoria.md`: pare e avise antes de fazer qualquer alteração.** Explique qual regra ou decisão seria afetada e pergunte como proceder — não decida sozinho por cima de uma decisão já tomada.

---

## Conformidade com o regulamento — REGRA PRINCIPAL

Este projeto tem um regulamento público que rege o evento. O site é um instrumento desse regulamento, não uma peça de marketing independente. **Qualquer divergência entre o site e o regulamento é um defeito.**

**Antes de implementar, alterar ou revisar qualquer página, formulário, texto, validação ou regra de negócio:**

1. Leia [`docs/regulamento.md`](docs/regulamento.md) — texto oficial e íntegro. **É a fonte de verdade.**
2. Confira [`docs/requisitos.md`](docs/requisitos.md) — checklist derivado, item por item, com rastreio da seção de origem.
3. Ao terminar uma feature, atualize o status dos itens correspondentes em `docs/requisitos.md`.

**Se `docs/requisitos.md` divergir de `docs/regulamento.md`, o regulamento vence.** Nesse caso, corrija o checklist e avise no resumo da mudança.

### O que nunca fazer sem confirmação explícita

- Alterar prazos, datas, cargas horárias de certificado, pesos de avaliação, números de vagas ou valores de premiação.
- Inventar campo de formulário que o regulamento não prevê, ou remover campo que ele exige.
- Parafrasear regras normativas (prazos, critérios, restrições) de um jeito que mude o sentido. Nesses trechos, mantenha-se fiel ao texto do regulamento.
- Criar canal de envio fora da aba "Submeter prática exitosa".
- Expor CPF em qualquer superfície pública.
- Alterar a stack técnica (Vite + TypeScript + Supabase + bun) sem autorização explícita.
- Remover ou reverter silenciosamente uma decisão já aprovada e registrada em `memoria.md` ou nas specs.
- Inventar informação sobre o evento (datas, regras, premiação, categorias, palestrantes, programação) que não esteja em `docs/regulamento.md`.

### Processo

- Antes de uma mudança grande (nova página, novo fluxo, refatoração ampla), apresente um plano resumido antes de implementar.
- Depois de uma decisão importante ser aprovada, registre em `memoria.md`.

### Ao escrever textos do site

- Público-alvo: profissionais da educação da rede municipal, com níveis variados de familiaridade com tecnologia. Linguagem direta, sem jargão.
- O regulamento usa tom acolhedor e concreto ("não precisa ser projeto grande", "é contar, com suas palavras"). Preserve esse tom.
- Regras normativas devem ser **exatas**; textos explicativos podem ser reescritos para clareza.

---

## Duas vertentes distintas — não confundir

O erro mais provável neste projeto é tratar Mostra e ProLEEI como um fluxo só. São percursos diferentes:

| | Mostra de Práticas Exitosas | ProLEEI |
|---|---|---|
| Quem envia | Quem está na formação em andamento | As 4 unidades de educação infantil |
| Autoria | Individual ou até 3 autores | Coletiva, da unidade |
| Formato do texto | 450–700 palavras, 7 partes obrigatórias | Livre |
| Categoria | Gestão / Ed. Infantil / Ens. Fundamental | Não se aplica |
| Avaliação | Só se optar por concorrer | Nunca avaliado |
| Apresentação | 5 vagas por nota, 8 min | Bloco próprio garantido, 10–15 min |

Uma mesma pessoa **pode** participar das duas — a inscrição aceita múltipla seleção e o site precisa liberar as duas abas.

---

## Datas críticas (hardcodadas em lógica de abertura/fechamento)

- **05/08/2026** — abertura de inscrições e submissões; modelo de slides já disponível
- **23/08/2026, 23h59** — fechamento das submissões, sem prorrogação
- **26/08/2026, 18h** — prazo de devolução de correções
- **03/09/2026** — divulgação dos 5 selecionados e do suplente
- **04/09/2026, 12h** — prazo final de envio de slides
- **08/09/2026** — dia do evento

Datas e horários seguem o fuso de Brasília (America/Sao_Paulo). Nunca use o relógio do cliente para decidir se um prazo está aberto.

---

## Contato oficial

WhatsApp (49) 99927-1442 — Maricelia. É o canal para dúvidas, ajuste de opção de participação, pedido de revisão por erro material e solicitações de dados pessoais.

---

## Comandos disponíveis

- `/auditar-regulamento` — compara o estado atual do site com `docs/requisitos.md` e emite relatório de conformidade item por item.

## Toda alteração visual usa as skills de design

Sempre que a tarefa envolver visual do site (layout, cores, tipografia, espaçamento, componentes de UI, responsividade, hierarquia, animação) — mesmo que o usuário não peça explicitamente — invoque as skills de design relevantes antes de implementar, sem perguntar:

- `impeccable` — para redesenhar, polir, revisar UX/hierarquia, resolver anti-padrões
- `ui-ux-pro-max` — paletas, tipografia, componentes shadcn/ui, tokens de design
- `responsive-craft` — layout responsivo, breakpoints, mobile
- `frontend-design` — direção estética geral

Ponytail continua ativo para lógica/código, mas não deve reduzir esforço visual — o modo atual (`lite`) já reflete isso.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
