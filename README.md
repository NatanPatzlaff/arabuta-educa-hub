# Arabutã Education Summit

Crie uma landing page para o Summit de Educação de Arabutã (SC), evento de 8 de setembro de 2026 no Centro Educacional Esportivo e Cultural. Nesta primeira etapa quero APENAS o design system, a estrutura de rotas e a página pública com conteúdo estático. NÃO crie banco de dados, formulários funcionais nem autenticação agora — isso vem nos próximos passos.

## DESIGN SYSTEM (defina tudo em index.css e tailwind.config.ts como tokens semânticos, nunca cores soltas nos componentes)

Paleta oficial, extraída do brasão do município:

- verde-campo #7CB342 = hsl(89 46% 48%) — cor principal: cabeçalhos, botões primários

- verde-mata #1B7A3D = hsl(141 64% 29%) — títulos, ícones, textos de destaque

- azul-ceu #3D9BE0 = hsl(205 72% 56%) — links, elementos de apoio, faixas

- amarelo-sol #FFD400 = hsl(50 100% 50%) — destaques pontuais, ícones, realce

- vermelho-listel #D32F2F = hsl(0 65% 51%) — botões de ação, contagem regressiva, avisos de prazo

- marrom-terra #8B5A2B = hsl(29 53% 36%) — detalhes, divisores, bordas

- areia #FAF7F0 = hsl(42 50% 96%) — fundos de seção

- grafite #23272F = hsl(220 15% 16%) — texto corrido

Hierarquia de uso, obrigatória para o site não ficar carnavalesco:

- Verde-campo e verde-mata dominam, são a base visual.

- Azul e amarelo só em pequenas doses, em ícones e detalhes.

- Vermelho SÓ em ação e urgência: botão "Quero me inscrever", contador de prazo, aviso de encerramento.

- Marrom e areia estruturam fundos e divisores.

- Muito espaço em branco entre as seções.

Tipografia (Google Fonts):

- Títulos: Sora, peso 700, com personalidade.

- Texto corrido: Inter, mínimo 16px, alta legibilidade.

- A epígrafe do hino usa Lora em itálico, para se distinguir do resto.

Elementos gráficos (SVG inline, discretos, nunca ilustração cheia):

- Folha estilizada de pau-brasil como divisor entre seções.

- Uma linha ondulada sutil evocando o Rio Jacutinga, usada como separador ou base de seção.

- Raios de sol como detalhe no topo do hero.

PROIBIDO: ilustração folclórica, clip-art de imigrante, desenho de fazenda, estética de template genérico de evento. A referência local entra como detalhe gráfico, não como cenário.

## ROTAS (crie todas, com páginas placeholder onde ainda não há conteúdo)

- / — página pública completa (esta etapa)

- /inscricao — placeholder "em construção"

- /relato — placeholder "em construção"

- /presenca — placeholder "em construção"

- /admin — placeholder "em construção"

- /privacidade — placeholder "em construção"

## PÁGINA PÚBLICA — seções nesta ordem exata

1. TOPO (hero)

Nome do evento: "Summit de Educação de Arabutã".

Assinatura: "Encontro de pessoas, práticas e ideias que movimentam a educação".

Data e local: "8 de setembro de 2026 · Centro Educacional Esportivo e Cultural · Arabutã (SC)".

Dois botões grandes lado a lado (empilhados no celular):

- "Quero me inscrever" (vermelho-listel, primário) → leva para /inscricao

- "Enviar meu relato" (verde-mata, secundário) → rola suavemente até a seção de envio de relato

2. EPÍGRAFE

Em Lora itálico, com crédito visível:

"Nos exemplos do passado construímos o amanhã."

— Hino de Arabutã, José Acácio Santana

3. O QUE É O SUMMIT (3 a 4 linhas)

Texto: "Um dia inteiro de formação para os profissionais da educação de Arabutã. A programação reúne palestras, a apresentação de práticas desenvolvidas por professores da própria rede e a premiação das experiências selecionadas. Quem participar dos dois períodos recebe certificado de 8 horas."

4. PROGRAMAÇÃO

Título com o aviso destacado: "Programação preliminar, sujeita a ajustes."

Itens, nesta ordem:

- Recepção e apresentação cultural de abertura

- ProLEEI — falas dos participantes

- Coffee break

- Palestra sobre alfabetização na educação infantil: neurociência, consciência fonológica e atraso de linguagem, com atividades práticas

- Apresentação das práticas exitosas selecionadas

- Almoço

- 13h30 às 14h30 — Aplicações práticas de IA, gamificação, comportamento e mediação em sala de aula, com Maricelia Rossi de Oliveira

- 14h30 às 15h30 — Tendências futuras da educação e metodologias em desenvolvimento, com Beatriz Bonadiman

- Encerramento: menções honrosas, troféus e homenagem ao ProLEEI

REGRA CRÍTICA: não invente nem acrescente NENHUM outro nome de palestrante, patrocinador ou instituição. Os dois nomes acima são os únicos autorizados. A palestra de alfabetização fica sem nome, a convidada ainda não está confirmada.

5. MOSTRA DE PRÁTICAS EXITOSAS

Convite para submeter, destacando: certificado de 15 horas em vez de 8, publicação no e-book e chance de apresentar no palco.

Dois botões de download: "Baixar o Regulamento (PDF)" e "Baixar o Convite (PDF)".

Como ainda não tenho os arquivos, deixe os botões visíveis porém desabilitados, com o texto auxiliar "Disponível em breve" e um comentário no código marcando onde trocar pelo link real.

Aviso destacado nesta seção: "O relato só é aceito pela aba de submissão deste site. Não são aceitos relatos por WhatsApp, e-mail ou impressos."

6. BLOCO DO ProLEEI — dentro da mesma seção da Mostra, como um destaque visual separado (card com borda ou fundo areia)

Texto: "Unidades de educação infantil que fizeram a formação do ProLEEI enviam um relato institucional por unidade, com formato livre e caminho próprio."

Botão "Baixar o Convite do ProLEEI (PDF)", também desabilitado com "Disponível em breve", e um link "Ver a seção 3 do regulamento".

7. COMO ESCREVER SEU RELATO

Liste as 7 partes do relato como uma lista numerada, com os títulos: 1. Identificação, 2. Contexto, 3. Objetivos, 4. Descrição da prática, 5. Resultados, 6. Reflexão, 7. Referências.

Deixe bem visível: limite de 450 a 700 palavras e formato .docx obrigatório.

Botão "Baixar o modelo de relato em Word" (desabilitado, "Disponível em breve").

Link externo, abrindo em nova aba: "Converse com o agente de apoio" apontando para https://chatgpt.com/g/g-6a6dedf3f8248191b04949dfd3a3221f-praticas-exitosas

8. DATAS IMPORTANTES (timeline horizontal no desktop, vertical no celular)

05/08 abertura · 10/08 aula de apoio · 23/08 encerramento das submissões · 03/09 divulgação dos selecionados · 08/09 Summit

9. ÁREA DE ENVIO DE RELATO (é o destino do botão "Enviar meu relato" do topo)

Nesta etapa, só a seção com título, o texto explicativo e um campo de CPF visualmente pronto porém ainda sem lógica. A validação vem no próximo passo.

10. RODAPÉ

Contato oficial: "WhatsApp (49) 99927-1442 — Maricelia", com link clicável para wa.me.

Espaço reservado para três logos lado a lado: brasão do município, Secretaria Municipal de Educação de Arabutã e Gen-Z Educação. Como não tenho os arquivos, use placeholders neutros de tamanho correto, com comentário no código indicando onde substituir.

Link para /privacidade.

Assinatura: "Comissão Organizadora — Summit de Educação de Arabutã · Gen-Z Educação · Secretaria Municipal de Educação de Arabutã".

## REGRAS DE USABILIDADE, valem para o site inteiro

- Mobile primeiro. A maioria acessa pelo celular, com conexão lenta do interior. Botões grandes, campos altos, um campo por linha.

- Tom acolhedor, nunca corporativo.

- SEM carrossel, SEM animação pesada, SEM pop-up, SEM banner de cookies invasivo.

- Contraste alto, pensado para leitura ao sol e em telas antigas. Verifique que todo texto passa em AA.

- Nenhum nome, CPF, e-mail ou telefone de inscrito pode aparecer em área pública do site.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://arabuta-educa-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/de04425a-2f73-483f-99df-71e01e819f29).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
