# Requisitos do site — extraídos do regulamento

Cada item abaixo é uma obrigação concreta que o site precisa cumprir, com a seção do regulamento que a origina.
Fonte de verdade: [`docs/regulamento.md`](./regulamento.md). Em caso de divergência, **o regulamento vence** — este arquivo é derivado.

Status possíveis: `[ ]` não implementado · `[~]` parcial · `[x]` implementado · `[!]` divergente (o site mostra valor/regra diferente do regulamento)

> **Última auditoria: 07/08/2026** — 30/100 implementados · 51 faltando · 17 parciais · 2 divergentes · 4 excedentes.
> Excedentes (ainda não resolvidos): campos `escola` e `funcao` na inscrição (§7 pede só nome, e-mail, WhatsApp e CPF); e-mail de coautor no formulário da Mostra; campo obrigatório "Título do relato" no formulário do ProLEEI; limite de 10 MB por arquivo.
>
> **08/08/2026 — resolução dos bloqueadores 1–5:** página `/privacidade` publicada com §13/§14/§15 (L1–L3, L5, L7, L9); as duas divergências corrigidas (E2 — 7 partes do relato; J2/J4 — 15h não depende de ir ao palco); avisos de não identificar autoria no arquivo e de não expor dados de estudante ao agente de IA adicionados na home e no formulário da Mostra (DM10, F3); nova seção "Proteção dos estudantes" reproduzindo o §6 (G1–G5). Total após esta etapa: 47/100.
> Bloqueadores 6 (modelo de slides) e 7 (e-mail de confirmação) seguem em aberto — dependem de um arquivo e de uma decisão de provedor/credenciais que só a organização pode fornecer.
>
> **08/08/2026 — página `/regulamento`:** o regulamento completo (as 15 seções) agora está publicado e legível no site, linkado da home (botão "Ler o regulamento completo", link "Ver a seção 3 do regulamento" no bloco ProLEEI) e do rodapé. Isso resolve A7 diretamente e, por tabela — como muitos itens do checklist exigem só que a informação esteja acessível na interface, não necessariamente resumida na home — também fecha de uma vez a maior parte dos blocos B, E, F, H, I, J, K e M, que eram puramente informativos. **Novo total: 86/100 implementados · 4 faltando · 10 parciais · 0 divergentes · 4 excedentes.**
>
> Ressalva importante: isso cobre a exigência de "informar", mas alguns fatos com peso prático — pesos de avaliação, as 5 vagas do palco, a premiação — ficaram só no texto integral do regulamento, sem resumo na home. Vale considerar depois se algum desses merece destaque na página inicial por clareza, mesmo já estando formalmente coberto.
>
> Itens que **continuam sem solução puramente textual** (exigem arquivo, funcionalidade ou decisão de infraestrutura): **I2** (modelo de slides — bloqueador 6), **I4** (canal de envio de slides), **D6/D7** (e-mail de confirmação — bloqueador 7), **D1/D5** (nome da aba e lógica de abertura em 05/08), **DM1/DM6/DM11** (comportamento do formulário da Mostra), **C3** (texto exato das opções no formulário de inscrição), **G6/L6/L8** (avisos e aceites que precisam estar dentro do próprio fluxo de envio, não só documentados), **A1** (nome oficial completo no hero da home).
>
> **08/08/2026 — página `/presenca`:** não é item deste checklist (o regulamento não especifica um mecanismo de site para controle de presença), mas era uma página "Em construção" órfã. Resolvida como funcionalidade: check-in fica no painel `/admin` (nova seção "Controle de presença", com toggle de manhã/tarde por inscrito), operado pela organização — decisão confirmada com a organização, já que o banco só permitia escrita via `service_role`. Nova migração `20260808120000_presencas_admin_checkin.sql` libera insert/delete em `presencas` para `is_admin()`; **precisa ser aplicada no Supabase antes de funcionar em produção.** A página pública `/presenca` agora explica esse fluxo em vez de mostrar "em construção".
>
> **08/08/2026 — decisões da organização sobre os dois bloqueadores restantes:**
> - **D6/D7 (e-mail de confirmação):** fica para depois, implementado por fora deste fluxo (via Lovable), depois que o resto estiver pronto. Não é regressão — é adiamento deliberado.
> - **I2 (modelo de slides):** a organização decidiu que **não vai mais existir** modelo de slides. Isso não é só uma lacuna de arquivo — o §10 do regulamento promete textualmente "o modelo fica no site desde a abertura das submissões" (05/08), e essa frase já está publicada em `docs/regulamento.md` e em `/regulamento`. A organização confirmou que **a versão oficial do regulamento (fora deste repositório) já está sendo ajustada** para remover essa promessa. **Assim que o novo texto da seção 10 chegar, `docs/regulamento.md` e a página `/regulamento` precisam ser atualizados para bater com a versão oficial** — até lá, o site continua divergente do regulamento publicado neste repositório (I2 permanece `[ ]`, não `[x]`).
>
> **08/08/2026 — segunda leva de correções (A1, C3, D1, D5, DM1, DM6, DM11, G6, L6, L8):** nome oficial completo no hero (A1); texto das 4 opções de inscrição idêntico ao §7 (C3); seção de envio renomeada para "Submeter prática exitosa" (D1); abertura de submissões em 05/08 agora validada no servidor, simétrica ao fechamento (D5); "quero concorrer" como padrão real do formulário da Mostra (DM1); novo campo de contribuição do autor principal (DM6); limite de 2 relatos por autor principal validado no formulário e na RPC (DM11); aviso de proteção ao estudante repetido no ponto de upload de imagem, nos dois formulários (G6); checkbox de aceite da licença de publicação, com coluna nova no banco (L6); declaração de originalidade ampliada para cobrir materiais de terceiros e imagens de IA (L8). Duas migrações novas — `20260808130000_prazo_abertura_submissoes.sql` e `20260808140000_relatos_mostra_regras_regulamento.sql` — **precisam ser aplicadas no Supabase** (mudam RPCs e adicionam colunas; sem isso os formulários vão falhar ao enviar). **Novo total: 96/100 implementados · 0 faltando reais · 1 parcial (I4) · 3 intencionalmente adiados (D6, D7, I2) · 0 divergentes · 4 excedentes.**
>
> **I4** (canal de envio de slides): a organização decidiu (08/08) que isso **não será feito pelo site** — nem a seleção/avaliação nem o upload de slides existem no banco hoje, e construir isso seria uma funcionalidade nova (avaliação, ranking, marcação de selecionados no `/admin`), não um ajuste pequeno. Como o §3/§10/§12 não exigem que o canal de slides seja o site (diferente do relato, que é site-only), a organização vai coletar por fora. Item continua `[~]` só porque falta divulgar, quando decidido, qual será esse canal alternativo.
>
> **08/08/2026 — avaliação às cegas (§9), fora do checklist original:** os itens H4/H5 do checklist só cobriam "informar" as regras de avaliação — a *funcionalidade* de avaliação em si nunca existiu (nenhuma tabela de notas, nenhum jeito de avaliador ver relato sem nome do autor). A organização decidiu (08/08) que o avaliador externo **não terá login no site** — a comissão compartilha os relatos de forma anônima por fora e repassa as notas manualmente. Implementado: nova tabela `avaliacoes_mostra` (5 critérios do §9, pesos 25/20/20/20/15) e uma seção "Avaliação dos relatos concorrentes" no `/admin`, com lista anônima exportável (só relatos habilitados com `modo_participacao = 'palco'`, sem nome de autor) e lançamento manual de notas por código do relato. O ranking já aplica a nota final (média) e o desempate do §9 (Resultados → Replicação → Clareza → ordem de envio), destacando os 5 primeiros e o 6º (suplente). Nova migração `20260808150000_avaliacao_relatos_mostra.sql` — **também precisa ser aplicada no Supabase.**

---

## A. Identidade e informações do evento

- [x] **A1** — Nome oficial exibido: "1º Summit de Educação de Arabutã · 2º Seminário Municipal de Educação" *(cabeçalho)* — hero da home (`index.tsx`)
- [x] **A2** — Data do evento: 8 de setembro de 2026 *(cabeçalho)*
- [x] **A3** — Local: Centro Educacional Esportivo e Cultural, Arabutã (SC) *(cabeçalho)*
- [x] **A4** — Realização creditada: Gen-Z Educação · Secretaria Municipal de Educação de Arabutã *(§15)*
- [x] **A5** — Canal de contato visível em todo o site: WhatsApp (49) 99927-1442 — Maricelia *(§7, §9, §13, §15)*
- [x] **A6** — Contexto histórico: 2ª edição da divulgação de práticas; 1ª foi em 2025 no Seminário com relatos do ProLEEI *(cabeçalho)* — `/regulamento`
- [x] **A7** — Regulamento completo acessível no site (leitura online e/ou download) — `/regulamento`, leitura online; download em PDF ainda não existe

## B. Elegibilidade — precisa estar explicado com clareza

- [x] **B1** — Participar do Summit é aberto a **todos** os profissionais da rede municipal; basta se inscrever *(§2)* — `/regulamento#secao-2`
- [x] **B2** — Enviar relato é **opcional** e restrito a quem faz/fez uma das duas formações *(§2)* — `/regulamento#secao-2`
- [x] **B3** — Tabela comparativa Mostra × ProLEEI (quem envia, como, quais regras) *(§2)* — `/regulamento#secao-2`
- [x] **B4** — Deixar explícito: quem não faz formação participa e recebe certificado de 8h, só não envia relato *(§2)* — `/regulamento#secao-2`
- [x] **B5** — Mostra: prática precisa ter acontecido em 2025 ou 2026; pode estar em andamento com resultados observáveis *(§2)* — `/regulamento#secao-2`
- [x] **B6** — Mostra: até 3 autores por relato; até 2 relatos por pessoa como autor principal (coautoria não conta) *(§2)* — `/regulamento#secao-2`; validado também no formulário e na RPC (DM11)
- [x] **B7** — Aviso de que incluir nomes só para obter certificação pode inabilitar o relato *(§2)* — `/regulamento#secao-2`
- [x] **B8** — Categorias do e-book: Gestão · Educação Infantil · Ensino Fundamental; seleção é geral por mérito, sem vagas por categoria *(§2)* — `/regulamento#secao-2`

## C. Inscrição no Summit

- [x] **C1** — Formulário de inscrição com os campos obrigatórios: **nome, e-mail, WhatsApp, CPF** *(§7)*
- [x] **C2** — Pergunta obrigatória na inscrição sobre envio de relato *(§7)*
- [x] **C3** — As 4 opções exatas da pergunta: *(§7)* — `src/routes/inscricao.tsx`
  - "Vou enviar relato para a Mostra — quero apresentar no palco"
  - "Vou enviar relato para a Mostra — só para o e-book"
  - "Vou participar do relato institucional do ProLEEI"
  - "Não vou enviar relato"
- [x] **C4** — Permitir **múltipla seleção** (ProLEEI + Mostra simultaneamente) *(§7)*
- [x] **C5** — Lógica condicional: a resposta libera a aba de envio correspondente (Mostra, ProLEEI, ambas ou nenhuma) *(§7)*
- [x] **C6** — Informar que mudança de opção se faz pelo WhatsApp da organização, até 23/08 *(§7)*
- [x] **C7** — Justificar a coleta de CPF: emissão de certificado com nome completo e CPF *(§11, §13)*

## D. Aba "Submeter prática exitosa"

- [x] **D1** — Aba existe com esse nome e só fica disponível para quem já se inscreveu *(§3, §7)* — cabeçalho de "Submeter prática exitosa" na home e em `/relato`; gate por CPF inalterado
- [x] **D2** — Deixar explícito que é o **único** canal aceito — não vale WhatsApp, e-mail, impresso ou entrega em mãos *(§7)*
- [x] **D3** — Primeiro passo do formulário: escolher entre relato da **Mostra** ou relato institucional do **ProLEEI** *(§7)*
- [x] **D4** — Fechamento automático das submissões em **23/08/2026, 23h59** — sem prorrogação *(§7, §12)*
- [x] **D5** — Abertura das inscrições e submissões em **05/08** *(§12)* — `valida_prazo_submissao()` agora bloqueia antes de 05/08 também (migração `20260808130000`)
- [ ] **D6** — E-mail de confirmação enviado em até 1 hora após o envio *(§7)* — adiado deliberadamente, será feito via Lovable depois do restante
- [ ] **D7** — Orientação em caso de não recebimento: conferir spam e procurar a organização pelo WhatsApp *(§7)* — depende de D6 existir primeiro

### D-M. Formulário da Mostra

- [x] **DM1** — Escolha de participação, com "Quero concorrer à apresentação" como **padrão** *(§7)* — `formulario-mostra.tsx`, padrão "palco" exceto quando a inscrição já indicou "só e-book"
- [x] **DM2** — Segunda opção: "Só quero aparecer no e-book" (publicado, 15h de certificado, sem concorrer ao palco) *(§7)*
- [x] **DM3** — Seleção de categoria: Gestão · Educação Infantil · Ensino Fundamental *(§2)*
- [x] **DM4** — Upload de arquivo **.docx obrigatório**; PDF opcional e que não substitui o Word *(§4)*
- [x] **DM5** — Registro de autoria no formulário: até 3 autores, com dados de cada um *(§2, §4)*
- [x] **DM6** — Campo de declaração da contribuição de cada participante *(§2)* — novo campo "Sua contribuição para a prática" para o autor principal, além dos coautores
- [x] **DM7** — Confirmação de que todos os autores conhecem o conteúdo e autorizam a publicação *(§2)*
- [x] **DM8** — Upload de até **2 imagens** em JPG ou PNG, enviadas separadamente do texto *(§4)*
- [x] **DM9** — Marcação obrigatória de imagem gerada por IA *(§4)*
- [x] **DM10** — Aviso destacado: **não escrever o nome dentro do arquivo** (avaliação às cegas) e explicação de que nada se perde porque o registro é no site *(§4)*
- [x] **DM11** — Validação/aviso do limite de 2 relatos por autor principal *(§2)* — checagem no formulário (bloqueia o form ao chegar no limite) e na RPC `submeter_relato_mostra` (migração `20260808140000`)

### D-P. Formulário do ProLEEI

- [x] **DP1** — Campo: nome da unidade *(§3)*
- [x] **DP2** — Campos: nome e CPF do responsável pelo envio, que precisa estar inscrito no Summit *(§3)*
- [x] **DP3** — Upload do arquivo (.docx) e das imagens (JPG/PNG) *(§3)*
- [x] **DP4** — Relação de **todos** os profissionais que contribuíram, com nome completo e CPF, **sem limite de quantidade** *(§3)*
- [x] **DP5** — Aviso de que é essa relação que gera os certificados — não deixar ninguém de fora *(§3)*
- [x] **DP6** — **Não** pedir categoria nem opção de concorrer neste formulário *(§3)*

## E. Conteúdo de orientação aos autores

- [x] **E1** — Página/seção "Como escrever seu relato" com a extensão de **450 a 700 palavras** *(§4)*
- [x] **E2** — As 7 partes obrigatórias listadas: Título, Contexto, O que foi feito, Resultados, Aprendizados, Frase de destaque, Palavras-chave (3) *(§4)*
- [x] **E3** — Formatação: Arial ou Times New Roman 12, espaçamento 1,5, A4; referências apenas se houver *(§4)* — `/regulamento#secao-4`
- [x] **E4** — Explicar que relato sem imagem é aceito e concorre em igualdade *(§4)* — `/regulamento#secao-4`
- [x] **E5** — Deixar claro que o formato livre do ProLEEI **não** segue as regras da seção 4 *(§3, §4)* — `/regulamento#secao-4`
- [x] **E6** — Enfatizar que não é artigo científico nem TCC *(§1)* — `/regulamento#secao-1`

## F. Inteligência artificial

- [x] **F1** — Link para o agente "Estruturador de Relatos — Práticas Exitosas": `chatgpt.com/g/g-6a6dedf3f8248191b04949dfd3a3221f-praticas-exitosas` *(§5)*
- [x] **F2** — Aviso de que o uso de IA é permitido e incentivado *(§5)* — `/regulamento#secao-5`
- [x] **F3** — Alerta destacado: não informar ao agente nomes, iniciais, diagnósticos, condições de saúde, situações familiares ou dados que identifiquem estudantes *(§5)*
- [x] **F4** — Divulgação da aula de apoio de **10/08**, ao vivo e gravada; link da gravação depois *(§5, §12)* — `/regulamento#secao-5`; link da gravação em si ainda não existe (aula é futura)
- [x] **F5** — Aviso de que prática inventada ou texto copiado leva à exclusão do e-book e da premiação, mesmo após o evento *(§5)* — `/regulamento#secao-5`

## G. Proteção dos estudantes

- [x] **G1** — Seção própria explicando que o e-book é digital, aberto, distribuído por QR code e link, sem versão impressa *(§6)*
- [x] **G2** — Regra de não identificação de estudantes (nem nome completo, nem inicial; usar "uma aluna", "um estudante do 3º ano" ou nome fictício) *(§6)*
- [x] **G3** — Proibição de descrever diagnósticos, condições de saúde ou situações familiares identificáveis *(§6)*
- [x] **G4** — Regra sobre fotografias com estudantes identificáveis: só com autorização válida para material institucional digital de acesso público; na dúvida, não enviar *(§6)*
- [x] **G5** — Deixar claro que a mesma regra vale para colegas de trabalho *(§6)*
- [x] **G6** — Aviso presente **também dentro do fluxo de upload de imagens**, não só na página informativa *(§6)* — aviso destacado acima do campo de imagens em `formulario-mostra.tsx` e `formulario-proleei.tsx`, com link para `/regulamento#secao-6`

## H. Habilitação e avaliação (transparência)

- [x] **H1** — Explicar a conferência de habilitação e o que é verificado em cada vertente *(§8)* — `/regulamento#secao-8`
- [x] **H2** — Informar que todo relato habilitado é publicado no e-book, independentemente de nota ou opção *(§8)* — `/regulamento#secao-8`
- [x] **H3** — Informar o prazo de correções: solicitadas em 24–25/08, devolução até **26/08 às 18h**; ausência de resposta pode impedir a publicação *(§8, §12)* — `/regulamento#secao-8`
- [x] **H4** — Tabela de critérios de avaliação com os pesos: Resultados 25 · Clareza 20 · Replicação 20 · Intencionalidade/criatividade/participação 20 · Cumprimento das normas 15 *(§9)* — `/regulamento#secao-9`
- [x] **H5** — Informar que os avaliadores são externos, avaliam às cegas e declaram conflito de interesse *(§9)* — `/regulamento#secao-9`
- [x] **H6** — Regra de desempate publicada *(§9)* — `/regulamento#secao-9`
- [x] **H7** — Regra de revisão: sem recurso de mérito; erro material em até 24h após a divulgação, pelo WhatsApp *(§9)* — `/regulamento#secao-9`

## I. Apresentação, e-book e premiação

- [x] **I1** — Informar as **5 vagas** no palco para os concorrentes de maior nota, 8 minutos, 3 a 4 slides (contexto / o que fizeram / resultado) *(§10)* — `/regulamento#secao-10`
- [ ] **I2** — **Modelo de slides disponível para download no site desde a abertura das submissões (05/08)** *(§10)* — depende de um arquivo real (bloqueador 6, em aberto)
- [x] **I3** — Informar bloco próprio do ProLEEI, 10 a 15 minutos por unidade, slides opcionais *(§3)* — `/regulamento#secao-3`
- [~] **I4** — Canal/aba para envio de slides com prazo **04/09 ao meio-dia** *(§3, §10, §12)* — decisão da organização (08/08): o envio de slides **não** vai ser feito pelo site. Ao contrário do envio do relato, o §3/§10/§12 não exigem que esse canal seja exclusivamente o site — só fixam o prazo, que já está publicado em `/regulamento`. A organização vai coletar os slides por outro meio (a definir). Item permanece parcial porque falta, no mínimo, publicar no site qual será esse canal alternativo, para quem for selecionado saber para onde enviar
- [x] **I5** — Divulgação dos 5 selecionados e do suplente em **03/09** *(§10, §12)* — `/regulamento#secao-10`
- [x] **I6** — Regra de uma apresentação por participante e convocação do próximo classificado *(§10)* — `/regulamento#secao-10`
- [x] **I7** — Premiação descrita: 1º troféu · 2º e 3º menção honrosa · 4º e 5º certificado de apresentador *(§10)* — `/regulamento#secao-10`
- [x] **I8** — Convite da Revista Saber IA ao 1º lugar, posterior ao evento e voluntário *(§10)* — `/regulamento#secao-10`
- [x] **I9** — Entrega do e-book por QR code e link no dia do evento, gratuita, sem impresso *(§10)* — `/regulamento#secao-10`
- [x] **I10** — Informar a revisão editorial (correções ortográficas e padronização sem alterar sentido; mudanças de conteúdo consultadas) *(§10)* — `/regulamento#secao-10`
- [x] **I11** — Ressalva de ajuste de número de apresentações e prêmios se houver menos de 5 concorrentes *(§10)* — `/regulamento#secao-10`

## J. Certificados

- [x] **J1** — **8 horas** para participante que cumprir o controle de presença manhã **e** tarde *(§11)*
- [x] **J2** — **15 horas** para autores/coautores de relatos habilitados que participem do Summit e cumpram a presença (8h evento + 7h elaboração, em um único certificado) *(§11)*
- [x] **J3** — Deixar explícito que o acréscimo de 7h é concedido **uma única vez** por participante, mesmo com mais de um relato *(§3, §11)* — `/regulamento#secao-11`
- [x] **J4** — Deixar explícito que a certificação de 15h **independe** de o relato ir ao palco *(§11)*
- [x] **J5** — Informar que enviar relato sem participar do Summit **não** gera certificado de 15 horas *(§11)* — `/regulamento#secao-11`
- [x] **J6** — ProLEEI: todos os profissionais da relação recebem 15 horas nas mesmas condições *(§3, §11)* — `/regulamento#secao-11`

## K. Cronograma

- [x] **K1** — Cronograma completo publicado com todas as 11 datas do §12 — `/regulamento#secao-12`
- [x] **K2** — Aviso de que a organização não responde mensagens entre 5 e 7 de setembro (feriado) e que tudo deve estar entregue até **04/09 ao meio-dia** *(§12)* — `/regulamento#secao-12`

## L. Jurídico e dados pessoais

- [x] **L1** — Página/seção de proteção de dados pessoais reproduzindo o §13 *(§13)*
- [x] **L2** — Identificar a Secretaria Municipal de Educação de Arabutã como responsável pelo tratamento *(§13)*
- [x] **L3** — Listar as finalidades: inscrição, comunicação, controle de presença, avaliação, publicação e certificação *(§13)*
- [x] **L4** — Informar que o CPF é usado só para identificação e certificação e **não será publicado** *(§13)*
- [x] **L5** — Informar o direito de solicitar informação, acesso, correção e exclusão, com o canal de contato *(§13)*
- [x] **L6** — Aceite de direitos autorais no envio: licença gratuita e não exclusiva, com crédito de autoria, autor segue livre para republicar *(§14)* — novo checkbox de aceite em `formulario-mostra.tsx` e `formulario-proleei.tsx`, obrigatório para enviar; coluna `declaracao_direitos_autorais` (migração `20260808140000`)
- [x] **L7** — Informar que a organização não pode vender o e-book nem o relato *(§14)*
- [x] **L8** — Declaração de responsabilidade do autor por originalidade e por autorização de materiais de terceiros e de imagens de IA *(§14)* — texto da declaração de originalidade ampliado para cobrir materiais de terceiros e imagens de IA explicitamente
- [x] **L9** — Informar que casos não previstos são decididos pela comissão organizadora *(§15)*

## M. Contingência

- [x] **M1** — Registrar data/hora de submissão de forma auditável (base para a regra de indisponibilidade e para o desempate por ordem de envio) *(§7, §9)*
- [x] **M2** — Informar a regra de indisponibilidade comprovada da plataforma e que problema de conexão particular do usuário não conta *(§7)* — `/regulamento#secao-7`

---

## Armadilhas de conformidade (erros fáceis de cometer)

1. **Tratar ProLEEI e Mostra como o mesmo fluxo.** São formulários, regras de formato, avaliação e certificação diferentes. O ProLEEI não tem categoria, não concorre e tem formato de texto livre.
2. **Esquecer a múltipla seleção na inscrição.** Uma pessoa pode ser ProLEEI **e** Mostra ao mesmo tempo — o site precisa liberar as duas abas.
3. **Deixar "concorrer à apresentação" sem ser o padrão.** O regulamento define essa opção como padrão.
4. **Aceitar só PDF.** O .docx é obrigatório; o PDF nunca substitui.
5. **Publicar o CPF em qualquer lugar.** Proibido no e-book e em materiais de divulgação.
6. **Não deixar o modelo de slides disponível desde 05/08.** O regulamento vincula essa disponibilidade à abertura das submissões.
7. **Coletar o nome do autor dentro do arquivo.** A autoria vem do formulário; o arquivo precisa ser anônimo.
8. **Prorrogar o prazo por conta própria.** 23/08 às 23h59, sem prorrogação — exceto na hipótese de indisponibilidade da plataforma.
