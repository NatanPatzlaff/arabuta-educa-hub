# Spec — Site do Summit

Este arquivo documenta **o que o site faz hoje** (implementação). Regras normativas (prazos, critérios, campos obrigatórios) vivem em [`docs/regulamento.md`](../docs/regulamento.md) e no checklist [`docs/requisitos.md`](../docs/requisitos.md) — não são repetidas aqui. Em caso de dúvida sobre uma regra, a fonte é sempre o regulamento.

## Objetivo

Hub informativo do evento (o que é, programação, local, cronograma) **e** captação oficial de dados: inscrição no Summit e submissão de relatos. Não é venda de ingresso — o evento é gratuito, a "inscrição" é cadastro de participante.

## Público-alvo

Profissionais da educação da rede municipal de Arabutã (SC) — professores, equipes gestoras e demais profissionais que atuam junto aos estudantes —, com níveis variados de familiaridade com tecnologia. Muitos acessam por celular, com conexão do interior.

## Idiomas

Só português (pt-BR). Sem i18n implementado nem previsto pelo regulamento.

## Fluxos de captação de dados (via oficial única)

Não existe canal alternativo por e-mail/WhatsApp/impresso para estes dados — WhatsApp serve só para dúvidas, ajuste de opção e pedido de revisão.

1. **`/inscricao`** (`src/routes/inscricao.tsx`) — nome, e-mail, WhatsApp, CPF; pergunta obrigatória sobre envio de relato, com as 4 opções do §7 (múltipla seleção). A resposta libera a(s) aba(s) de envio correspondente(s).
2. **Mostra de Práticas Exitosas** (`src/components/site/formulario-mostra.tsx`) — até 3 autores (dados de cada um), categoria, opção "concorrer" vs. "só e-book" (padrão: concorrer), upload de arquivo (.docx obrigatório) e até 2 imagens, aceite de direitos autorais.
3. **ProLEEI** (`src/components/site/formulario-proleei.tsx`) — nome da unidade, responsável pelo envio (nome/CPF, precisa estar inscrito), arquivo, imagens, relação de todos os profissionais contribuintes (nome + CPF, sem limite).

Ambos os formulários ficam atrás da aba "Submeter prática exitosa" (`/relato`), com o primeiro passo perguntando Mostra ou ProLEEI. Consulta de status por CPF existe em `src/components/site/consulta-cpf.tsx`.

## Seções do site

- **Home (`/`)** — hero, epígrafe, "o que é o Summit", programação, Mostra + bloco ProLEEI, "como escrever seu relato", datas importantes, área de envio, rodapé. Barra fixa de navegação (`barra-fixa.tsx`).
- **`/inscricao`** — formulário de inscrição.
- **`/relato`** — aba "Submeter prática exitosa" (Mostra ou ProLEEI), gated por CPF já inscrito.
- **`/regulamento`** — texto integral das 15 seções do regulamento, publicado e linkável por âncora (`#secao-N`).
- **`/privacidade`** — §13/§14/§15 (dados pessoais, direitos autorais, observações finais).
- **`/presenca`** — página pública explicativa; o check-in em si é operado pela organização no `/admin` (controle de presença manhã/tarde por inscrito), decisão da organização já que a escrita no banco exige `service_role`.
- **`/admin`** — painel interno: controle de presença, avaliação anônima dos relatos concorrentes (5 critérios do §9, ranking com desempate), lançamento manual de notas.

## Programação

A home (`src/routes/index.tsx`, arrays `manha`/`tarde`) exibe a programação horária do dia do evento, incluindo os dois palestrantes convidados confirmados pela organização ("Maricelia Rossi de Oliveira", "Beatriz Bonadiman") — **conteúdo confirmado pela organização, fora do escopo do regulamento da Mostra** (`docs/regulamento.md` rege a Mostra/ProLEEI, não a grade horária completa do evento). Não é uma divergência: é informação adicional, legítima, que o regulamento simplesmente não precisa cobrir.

O que o regulamento (§10) garante e permanece fixo dentro dessa grade: bloco próprio do ProLEEI (10–15 min/unidade) e 5 apresentações da Mostra com maior nota (8 min, 3–4 slides) + 1 suplente, seguidos de premiação — já refletidos na programação da home ("ProLEEI — falas dos participantes", "Apresentação das práticas exitosas selecionadas", "Encerramento: menções honrosas, troféus e homenagem ao ProLEEI").

Os nomes dos apresentadores selecionados da Mostra só se definem depois de 23/08 (fim das submissões) + avaliação (27–30/08) + divulgação (03/09) — essa parte, sim, é dinâmica/pendente.

## Chamadas para ação

- "Quero me inscrever" → `/inscricao`.
- "Enviar meu relato" → rola/leva para a área de envio (`/relato`), condicionada à opção marcada na inscrição.

## Pendências (fora do controle só de código — ver `docs/requisitos.md` para a lista oficial)

- Modelo de slides: a organização decidiu que não vai mais existir (o texto oficial do regulamento está sendo ajustado para remover essa promessa; `docs/regulamento.md` precisa ser atualizado quando o novo texto chegar).
- Canal de envio de slides (I4): coletado por fora do site, canal ainda não definido/publicado.
- E-mail de confirmação de inscrição/envio (D6/D7): adiado deliberadamente, será feito via Lovable depois.
- Programação final da home: pendente até 23/08 + avaliação (ver divergência acima).

## Stack técnica

- Vite + TypeScript + React 19, roteamento via TanStack Router (file-based, `src/routes/`).
- Supabase (`@supabase/supabase-js`) — dados de inscrição, relatos, presenças, avaliações.
- bun como runtime/gerenciador de pacotes (`bun.lock`, `bunfig.toml`).
- Tailwind CSS v4 (config em `src/styles.css`, sem `tailwind.config.ts` — tokens via `@theme inline`), shadcn/ui (`components.json`) para primitivos de UI.
- Projeto iniciado no Lovable (integração ainda ativa, ver `.lovable`/README) — mudanças por este canal (Claude Code) e pelo Lovable convivem no mesmo repositório.
- **Não alterar esta stack sem autorização explícita.**

## Responsividade

- Mobile-first: a maioria acessa por celular, com conexão do interior. Botões grandes, campos altos, um campo por linha nos formulários.
- Container central (`.container-site`) com breakpoints em 1024px e 1440px.

## Acessibilidade

- Contraste alto (AA), pensado para leitura ao sol e telas antigas.
- Foco visível (`focus-visible:ring`) nos componentes interativos.
- Nenhum dado pessoal de inscrito (nome, CPF, e-mail, telefone) pode aparecer em área pública do site.

## Desempenho

- Sem carrossel, sem animação pesada, sem pop-up, sem banner de cookies invasivo.
- SVGs inline discretos para elementos gráficos (folha, onda, raios de sol) em vez de imagens pesadas.

## Escopo desta rodada

Esta rodada é **só documental**: consolidar `CLAUDE.md`, este arquivo, `specs/design.md` e `memoria.md`. Nenhuma alteração de código, layout ou conteúdo publicado foi feita.
