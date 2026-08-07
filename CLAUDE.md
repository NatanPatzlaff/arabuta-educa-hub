# Site — 1º Summit de Educação de Arabutã

Site oficial do 1º Summit de Educação de Arabutã · 2º Seminário Municipal de Educação.
Evento em 8 de setembro de 2026, no Centro Educacional Esportivo e Cultural, Arabutã (SC).
Realização: Gen-Z Educação · Secretaria Municipal de Educação de Arabutã.

O site é o **único canal oficial** de inscrição no evento e de envio de relatos. Não existe fluxo alternativo por e-mail, WhatsApp ou entrega física.

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
