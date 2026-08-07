import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FolhaDivisor } from "@/components/site/graficos";

const DESC =
  "Texto integral do regulamento da Mostra de Práticas Exitosas e do ProLEEI, do 1º Summit de Educação de Arabutã.";

export const Route = createFileRoute("/regulamento")({
  head: () => ({
    meta: [
      { title: "Regulamento — Summit de Educação de Arabutã" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Regulamento — Summit de Educação de Arabutã" },
      { property: "og:description", content: DESC },
    ],
  }),
  component: PaginaRegulamento,
});

const secoes = [
  { id: "secao-1", titulo: "1. O que é" },
  { id: "secao-2", titulo: "2. Quem pode participar" },
  { id: "secao-3", titulo: "3. Relatos do ProLEEI" },
  { id: "secao-4", titulo: "4. Como escrever o seu relato" },
  { id: "secao-5", titulo: "5. Uso de inteligência artificial" },
  { id: "secao-6", titulo: "6. Proteção dos estudantes" },
  { id: "secao-7", titulo: "7. Inscrição e envio" },
  { id: "secao-8", titulo: "8. Habilitação" },
  { id: "secao-9", titulo: "9. Avaliação dos relatos concorrentes" },
  { id: "secao-10", titulo: "10. O que acontece com o seu relato" },
  { id: "secao-11", titulo: "11. Certificados" },
  { id: "secao-12", titulo: "12. Cronograma" },
  { id: "secao-13", titulo: "13. Proteção de dados pessoais" },
  { id: "secao-14", titulo: "14. Direitos autorais" },
  { id: "secao-15", titulo: "15. Observações finais" },
];

function Secao({
  id,
  titulo,
  children,
}: {
  id: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-cinza pt-8 first:border-t-0 first:pt-0">
      <h2 className="text-xl text-tinta sm:text-2xl">{titulo}</h2>
      <div className="medida mt-4 space-y-4 text-base leading-relaxed text-tinta">{children}</div>
    </section>
  );
}

function TabelaReg({ cabecalho, linhas }: { cabecalho: string[]; linhas: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-cinza">
      <table className="w-full min-w-max border-collapse text-sm">
        <thead>
          <tr>
            {cabecalho.map((c) => (
              <th
                key={c}
                className="border-b border-cinza bg-neve px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-ferro"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha, i) => (
            <tr key={i}>
              {linha.map((celula, j) => (
                <td key={j} className="border-b border-cinza px-4 py-3 align-top text-tinta">
                  {celula}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaginaRegulamento() {
  return (
    <main className="bg-background section-pad">
      <div className="container-site grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <FolhaDivisor className="mb-6" />
          <h1 className="text-3xl text-tinta sm:text-4xl">
            Regulamento — Mostra de Práticas Exitosas
          </h1>
          <p className="medida mt-4 text-base font-semibold text-tinta">
            1º Summit de Educação de Arabutã · 2º Seminário Municipal de Educação
          </p>
          <p className="medida mt-2 text-base text-ferro">
            8 de setembro de 2026 · Centro Educacional Esportivo e Cultural · Arabutã (SC)
          </p>

          <nav aria-label="Seções do regulamento" className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-ferro">Seções</p>
            <ul className="mt-3 space-y-2">
              {secoes.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-sm text-tinta underline underline-offset-4 hover:text-listel"
                  >
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="mt-8">
            <Link
              to="/"
              className="text-sm text-ferro underline underline-offset-4 hover:text-tinta"
            >
              Voltar para a página inicial
            </Link>
          </p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="rounded-xl border border-cinza bg-card p-6 lg:p-8">
            <p className="medida text-base leading-relaxed text-tinta">
              Esta é a segunda edição da divulgação de práticas da rede municipal. A primeira
              aconteceu em 2025, no Seminário Municipal, com os relatos do ProLEEI. Em 2026 a
              mostra se amplia: passa a receber relatos de toda a rede e integra o 1º Summit de
              Educação de Arabutã.
            </p>

            <div className="mt-9 space-y-9">
              <Secao id="secao-1" titulo="1. O que é">
                <p>
                  Uma chamada para profissionais da educação da rede municipal de Arabutã
                  contarem, por escrito, uma prática do dia a dia que deu certo na sua sala de
                  aula ou na sua escola.
                </p>
                <p>
                  Não precisa ser projeto grande, não precisa ter tecnologia nem verba. Não é
                  artigo científico nem TCC: é contar, com suas palavras, algo que você fez e que
                  funcionou, para que outro colega possa fazer também.
                </p>
              </Secao>

              <Secao id="secao-2" titulo="2. Quem pode participar">
                <h3 className="text-lg text-tinta">Participar do Summit: aberto a toda a rede</h3>
                <p>
                  O dia 8 de setembro é para todos os profissionais da educação da rede municipal
                  de Arabutã — professores, equipes gestoras e demais profissionais que atuam
                  junto aos estudantes. Basta se inscrever. Todos recebem certificado de 8 horas.
                </p>

                <h3 className="text-lg text-tinta">
                  Enviar relato: só para quem faz ou fez formação
                </h3>
                <p>
                  Participar do evento é para todos. Enviar relato, não. O envio é opcional e está
                  aberto apenas a quem faz ou fez uma das duas formações da rede — que são
                  formações diferentes, com percursos próprios:
                </p>

                <TabelaReg
                  cabecalho={["", "Mostra de Práticas Exitosas", "ProLEEI"]}
                  linhas={[
                    [
                      <strong key="a">Quem pode enviar</strong>,
                      "Quem está fazendo a formação em andamento",
                      "As unidades cujas equipes fizeram a formação do ProLEEI",
                    ],
                    [
                      <strong key="b">Como</strong>,
                      "Individualmente ou em até 3 autores",
                      "Um relato institucional por unidade",
                    ],
                    [
                      <strong key="c">Regras</strong>,
                      "Seções 4 e seguintes deste regulamento",
                      "Seção 3",
                    ],
                  ]}
                />

                <p>
                  Não faz nenhuma das duas formações? Você participa normalmente do Summit e
                  recebe certificado de 8 horas — apenas não envia relato nesta edição.
                </p>
                <p>
                  As duas vertentes seguem percursos próprios, em paralelo, e ambas dão direito ao
                  certificado de 15 horas.
                </p>

                <h3 className="text-lg text-tinta">Para a Mostra de Práticas Exitosas</h3>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    A prática precisa já ter acontecido, em 2025 ou 2026. Pode estar em andamento,
                    desde que já tenha resultados observáveis.
                  </li>
                  <li>
                    Cada relato pode ter até 3 autores. Cada pessoa pode enviar até 2 relatos como
                    autor principal; coautoria não entra nessa conta.
                  </li>
                  <li>
                    <strong>Autoria.</strong> Todos os autores devem ter contribuído efetivamente
                    para a prática e para o relato. O autor responsável declara no formulário a
                    contribuição de cada participante e confirma que todos conhecem o conteúdo e
                    autorizam a publicação. A inclusão de nomes apenas para obter certificação
                    poderá inabilitar o relato.
                  </li>
                  <li>
                    <strong>Categorias</strong> (para organizar o e-book): Gestão · Educação
                    Infantil · Ensino Fundamental. A seleção dos apresentadores é geral, por
                    mérito, sem vagas por categoria. Os relatos do ProLEEI têm seção própria no
                    e-book e não entram nessas categorias.
                  </li>
                </ul>
              </Secao>

              <Secao id="secao-3" titulo="3. Relatos do ProLEEI">
                <p>
                  Participam as unidades cujas equipes fizeram a formação do ProLEEI. São quatro
                  relatos institucionais, já definidos: um por unidade de educação infantil,
                  construídos coletivamente. A autoria é da unidade, não de uma pessoa.
                </p>
                <p>
                  Não há seleção nem comparação. As quatro vagas estão garantidas, uma para cada
                  unidade. Os relatos não recebem nota e não competem entre si nem com os demais:
                  todos apresentam e todos entram no e-book, em seção própria.
                </p>

                <TabelaReg
                  cabecalho={["", "Relatos do ProLEEI", "Demais relatos"]}
                  linhas={[
                    [
                      <strong key="a">Quem escreve</strong>,
                      "A equipe da unidade, coletivamente",
                      "Individualmente ou em até 3 autores",
                    ],
                    [
                      <strong key="b">Quantidade</strong>,
                      "4 relatos, um por unidade",
                      "Livre, até 2 por autor principal",
                    ],
                    [
                      <strong key="c">Formato do texto</strong>,
                      "Livre — sem estrutura, limite de palavras ou formatação",
                      "Segue a seção 4",
                    ],
                    [
                      <strong key="d">Apresentação</strong>,
                      "Bloco próprio, garantido",
                      "5 vagas",
                    ],
                    [
                      <strong key="e">Avaliação</strong>,
                      "Sem nota e sem classificação",
                      "Avaliados, se optarem por concorrer",
                    ],
                  ]}
                />

                <p>
                  O que vale igual para os dois: prazo de 23 de agosto, arquivo em Word editável
                  (.docx) com imagens em JPG ou PNG enviadas à parte, e as regras de proteção dos
                  estudantes da seção 6.
                </p>

                <h3 className="text-lg text-tinta">Como as unidades enviam</h3>
                <p>
                  Pela aba "Submeter prática exitosa" do site. O formulário do ProLEEI pede o nome
                  da unidade, o nome e CPF do responsável pelo envio — que precisa estar inscrito
                  no Summit —, o arquivo, as imagens e a relação de todos os profissionais que
                  contribuíram, com nome completo e CPF.
                </p>
                <p>
                  É essa relação que gera os certificados. Não deixe ninguém de fora: não há
                  limite de quantidade.
                </p>
                <p>Não é preciso escolher categoria nem indicar se quer concorrer.</p>

                <h3 className="text-lg text-tinta">Apresentação e slides</h3>
                <p>
                  Cada unidade tem de 10 a 15 minutos no bloco do ProLEEI. Os slides são opcionais
                  e vão até 4 de setembro, ao meio-dia, junto com os dos demais apresentadores.
                </p>

                <h3 className="text-lg text-tinta">Certificação</h3>
                <p>
                  Todos os profissionais da relação recebem certificado de 15 horas, nas condições
                  da seção 11 — participando do Summit e cumprindo o controle de presença.
                </p>
                <p>
                  Quem contribuiu com o relato da unidade e está na formação em andamento pode
                  enviar também um relato individual à Mostra. O acréscimo de 7 horas, porém, é
                  concedido uma única vez: o certificado é de 15 horas em qualquer caso.
                </p>
              </Secao>

              <Secao id="secao-4" titulo="4. Como escrever o seu relato">
                <blockquote className="border-l-4 border-cinza pl-4 text-ferro">
                  Esta seção vale para os relatos enviados individualmente à Mostra de Práticas
                  Exitosas do Summit. Os relatos institucionais do ProLEEI têm formato livre e não
                  seguem estas regras — veja a seção 3.
                </blockquote>

                <p>
                  <strong>450 a 700 palavras</strong>, com estas partes:
                </p>

                <TabelaReg
                  cabecalho={["Parte", "O que contar"]}
                  linhas={[
                    ["Título", "O que foi feito, em uma linha"],
                    ["Contexto", "Turma, quantos alunos, qual era o problema"],
                    ["O que foi feito", "O passo a passo: materiais, tempo, como conduziu"],
                    ["Resultados", "O que mudou, com evidências"],
                    ["Aprendizados", "O que outro colega precisa saber para repetir"],
                    ["Frase de destaque", "O que você diria a quem quer fazer igual"],
                    ["Palavras-chave", "3 palavras"],
                  ]}
                />

                <p>
                  <strong>Arquivo.</strong> Obrigatoriamente em Word editável (.docx). PDF é
                  opcional e não substitui o Word. Fonte Arial ou Times New Roman 12, espaçamento
                  1,5, A4. Referências apenas se houver.
                </p>
                <p>
                  <strong>Imagens (opcional).</strong> Até 2, inseridas no relato e enviadas
                  separadamente em JPG ou PNG com boa resolução. Podem ser fotos da prática — de
                  preferência de materiais e produções, não de rostos — ou imagens criadas com
                  inteligência artificial, marcadas como tal no formulário. O relato sem imagem é
                  aceito normalmente e concorre em igualdade.
                </p>
                <p>
                  <strong>Identificação — não escreva seu nome dentro do arquivo.</strong> A
                  autoria é registrada no formulário do site, e é de lá que sai tudo: a
                  organização sabe exatamente de quem é cada relato, e o seu nome aparece
                  normalmente no e-book e no certificado.
                </p>
                <p>
                  Manter o nome fora do arquivo serve só para que os avaliadores leiam sem saber
                  quem escreveu. Como o registro é feito no site, nenhuma informação se perde —
                  por isso o envio acontece apenas por lá.
                </p>
              </Secao>

              <Secao id="secao-5" titulo="5. Uso de inteligência artificial">
                <p>
                  O uso de IA como apoio à escrita é permitido e incentivado. A organização
                  disponibiliza um agente gratuito:
                </p>
                <p>
                  <strong>Estruturador de Relatos — Práticas Exitosas</strong>
                  <br />
                  <a
                    href="https://chatgpt.com/g/g-6a6dedf3f8248191b04949dfd3a3221f-praticas-exitosas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-listel underline underline-offset-4"
                  >
                    chatgpt.com/g/g-6a6dedf3f8248191b04949dfd3a3221f-praticas-exitosas
                  </a>
                </p>
                <p>
                  Não informe ao agente nomes, iniciais, diagnósticos, condições de saúde,
                  situações familiares ou qualquer dado que identifique estudantes. Use descrições
                  gerais, como "um estudante" ou "parte do grupo".
                </p>
                <p>
                  <strong>Aula de apoio:</strong> dia 10/08, ao vivo e gravada — conhecendo o
                  Estruturador e escrevendo o relato com apoio de IA, com espaço para dúvidas.
                </p>
                <p>
                  A prática relatada precisa ter acontecido de verdade, com você. Constatada
                  prática inventada ou texto copiado, o relato é excluído do e-book e da
                  premiação, mesmo após o evento.
                </p>
              </Secao>

              <Secao id="secao-6" titulo="6. Proteção dos estudantes">
                <p>
                  O e-book é publicação digital e aberta, distribuída por QR code e link, sem
                  versão impressa. Por isso:
                </p>
                <p>
                  <strong>Não identifique estudantes.</strong> Nem nome completo, nem inicial:
                  escreva "uma aluna", "um estudante do 3º ano" ou use nome fictício. Não descreva
                  diagnósticos, condições de saúde ou situações familiares que permitam reconhecer
                  alguém.
                </p>
                <p>
                  <strong>Fotografias com estudantes identificáveis</strong> só podem ser enviadas
                  com autorização válida para publicação em materiais institucionais digitais de
                  acesso público. A organização pode solicitar comprovação. Havendo dúvida sobre a
                  abrangência do documento, não envie a imagem.
                </p>
                <p>O mesmo vale para colegas de trabalho.</p>
              </Secao>

              <Secao id="secao-7" titulo="7. Inscrição e envio">
                <p>
                  Tudo acontece no site oficial do Summit, cujo link será enviado à rede pelos
                  grupos de WhatsApp e nas aulas da formação, junto com a abertura em 5 de agosto.
                </p>
                <p>
                  <strong>Inscrição no Summit — obrigatória para participar:</strong> nome,
                  e-mail, WhatsApp e CPF.
                </p>
                <p>
                  Na inscrição você já informa se vai enviar relato. A resposta é obrigatória e
                  define o que o site libera para você depois:
                </p>

                <TabelaReg
                  cabecalho={["Sua resposta", "O que acontece"]}
                  linhas={[
                    [
                      "Vou enviar relato para a Mostra — quero apresentar no palco",
                      "Libera a aba de envio da Mostra",
                    ],
                    [
                      "Vou enviar relato para a Mostra — só para o e-book",
                      "Libera a aba de envio da Mostra",
                    ],
                    [
                      "Vou participar do relato institucional do ProLEEI",
                      "Libera a aba de envio do ProLEEI",
                    ],
                    ["Não vou enviar relato", "Inscrição normal no evento, sem aba de envio"],
                  ]}
                />

                <p>
                  Você pode marcar mais de uma opção. Quem participa do relato do ProLEEI e também
                  está na formação em andamento pode enviar o seu relato individual à Mostra —
                  basta marcar as duas, e o site libera as duas abas.
                </p>
                <p>
                  Se você mudar de ideia depois, é só procurar a organização pelo WhatsApp (49)
                  99927-1442 que a sua opção é ajustada — até o prazo de 23 de agosto.
                </p>
                <p>
                  <strong>Aba "Submeter prática exitosa"</strong> — disponível para quem já se
                  inscreveu. O relato só é aceito por essa aba do site. Não são aceitos relatos
                  enviados por WhatsApp, e-mail, impressos ou entregues em mãos.
                </p>
                <p>
                  No início do formulário você indica se o envio é um relato da Mostra ou um
                  relato institucional do ProLEEI (ver seção 3). Sendo da Mostra, você confirma
                  como quer participar:
                </p>

                <TabelaReg
                  cabecalho={["Opção", "O que acontece"]}
                  linhas={[
                    [
                      "Quero concorrer à apresentação (padrão)",
                      "Avaliado, publicado no e-book e concorre a uma das 5 vagas no palco e à premiação",
                    ],
                    [
                      "Só quero aparecer no e-book",
                      "Publicado no e-book, com certificação de 15 horas, sem concorrer ao palco",
                    ],
                  ]}
                />

                <p>
                  <strong>Prazo:</strong> domingo, 23 de agosto de 2026, às 23h59. Sem
                  prorrogação. Você recebe e-mail de confirmação em até 1 hora; se não chegar,
                  confira o spam e procure a organização pelo WhatsApp (49) 99927-1442.
                </p>
                <p>
                  Em caso de indisponibilidade comprovada da plataforma nas horas finais do prazo,
                  a comissão poderá abrir canal alternativo ou estender o prazo pelo período da
                  falha. Problemas de conexão ou equipamento particular não caracterizam
                  indisponibilidade.
                </p>
              </Secao>

              <Secao id="secao-8" titulo="8. Habilitação">
                <p>Todos os relatos passam por conferência de habilitação.</p>
                <p>
                  <strong>Relatos da Mostra:</strong> verifica prazo, extensão, seções
                  obrigatórias, autoria, adequação ao tema e regras de proteção de dados.
                </p>
                <p>
                  <strong>Relatos do ProLEEI:</strong> verifica apenas prazo, formato do arquivo,
                  relação de participantes e regras de proteção de dados — não há conferência de
                  extensão nem de estrutura.
                </p>
                <p>
                  Todos os relatos habilitados serão publicados no e-book, independentemente da
                  nota ou da opção escolhida. Somente os relatos que optaram por concorrer à
                  apresentação seguem para os avaliadores externos.
                </p>
                <p>
                  Identificados problemas formais corrigíveis, a organização solicita adequações
                  até 26 de agosto, às 18h. A ausência de resposta pode resultar na não
                  publicação.
                </p>
              </Secao>

              <Secao id="secao-9" titulo="9. Avaliação dos relatos concorrentes">
                <p>
                  Os avaliadores são convidados externos e não integram a equipe de formação da
                  Gen-Z Educação nem a Secretaria Municipal de Educação de Arabutã. Avaliam sem
                  saber quem escreveu e devem declarar qualquer vínculo ou conflito de interesse,
                  ficando impedidos nesse caso.
                </p>

                <TabelaReg
                  cabecalho={["Critério", "Peso"]}
                  linhas={[
                    [
                      "Resultados demonstrados — a prática mudou algo concreto?",
                      "25",
                    ],
                    ["Clareza do relato — dá para entender e acompanhar?", "20"],
                    ["Possibilidade de replicação — outro colega consegue fazer?", "20"],
                    [
                      "Intencionalidade, criatividade e participação dos envolvidos — a prática responde ao contexto e promove participação ativa de estudantes, profissionais ou comunidade escolar?",
                      "20",
                    ],
                    ["Cumprimento das normas deste regulamento", "15"],
                  ]}
                />

                <p>
                  <strong>Nota final:</strong> média das avaliações recebidas. A composição da
                  equipe de avaliação é definida pela comissão organizadora. Havendo divergência
                  expressiva entre notas de um mesmo relato, a comissão pode encaminhá-lo a um
                  avaliador adicional; nesse caso vale a média das notas mais próximas entre si.
                </p>
                <p>
                  <strong>Empate:</strong> decide, sucessivamente, a maior nota em Resultados
                  demonstrados, Possibilidade de replicação e Clareza do relato; permanecendo o
                  empate, a ordem de envio.
                </p>
                <p>
                  <strong>Revisão:</strong> a nota é soberana, sem recurso quanto ao mérito. Cabe
                  pedido de revisão por erro material — relato não avaliado, nota não lançada,
                  soma incorreta — em até 24 horas após a divulgação, pelo WhatsApp (49)
                  99927-1442.
                </p>
              </Secao>

              <Secao id="secao-10" titulo="10. O que acontece com o seu relato">
                <p>
                  <strong>E-book.</strong> Entrega digital: no dia do evento você recebe QR code e
                  link para acessar e baixar quando quiser, gratuitamente. Não haverá exemplar
                  impresso, assim o e-book chega a toda a rede.
                </p>
                <p>
                  <strong>Revisão editorial.</strong> A organização pode fazer correções
                  ortográficas, ajustes de pontuação e padronização de títulos, referências e
                  formatação, sem alterar sentido, resultados ou a voz dos autores. Alterações de
                  conteúdo são consultadas aos autores.
                </p>
                <p>
                  <strong>Apresentação.</strong> Além do bloco do ProLEEI, garantido na
                  programação, os 5 relatos com maior nota entre os concorrentes apresentam no
                  palco, em 8 minutos, com 3 a 4 slides (contexto / o que fizeram / resultado). O
                  modelo fica no site desde a abertura das submissões. O 6º colocado é suplente,
                  avisado em 3 de setembro. Cada participante faz apenas uma apresentação: se a
                  mesma pessoa tiver dois relatos entre os cinco primeiros, permanece o de maior
                  nota e é convocado o próximo classificado.
                </p>
                <p>
                  <strong>Premiação:</strong> 1º lugar, troféu · 2º e 3º lugares, menção honrosa ·
                  4º e 5º lugares, certificado de apresentador.
                </p>
                <p>
                  <strong>Revista Saber IA.</strong> O relato de 1º lugar é convidado a virar
                  artigo, em versão ampliada e reelaborada com menção à publicação original no
                  e-book. O trabalho é posterior ao evento e a participação é voluntária.
                </p>
                <p>
                  Recebidos menos de 5 relatos concorrendo, a comissão ajusta o número de
                  apresentações e prêmios.
                </p>
              </Secao>

              <Secao id="secao-11" titulo="11. Certificados">
                <p>
                  <strong>8 horas</strong> para todo participante que cumprir o controle de
                  presença nos períodos da manhã e da tarde.
                </p>
                <p>
                  <strong>15 horas</strong> para autores e coautores de relatos habilitados que
                  também participem do Summit e cumpram o controle de presença — 8 horas de
                  evento mais 7 horas de elaboração do relato, em um único certificado, que
                  registra a participação e a autoria de relato publicado no e-book.
                </p>
                <p>
                  O acréscimo de 7 horas é concedido uma única vez por participante, mesmo com
                  mais de um relato, e independe de o relato ser selecionado para o palco. O
                  envio do relato sem participação no Summit não gera certificado de 15 horas;
                  situações excepcionais seguem as normas da Secretaria Municipal de Educação.
                </p>
                <p>
                  <strong>Relatos do ProLEEI:</strong> todos os profissionais indicados na relação
                  enviada pela unidade recebem o certificado de 15 horas, nas mesmas condições —
                  ver seção 3.
                </p>
                <p>
                  Os certificados são emitidos com nome completo e CPF, por isso esses dados são
                  pedidos na inscrição.
                </p>
              </Secao>

              <Secao id="secao-12" titulo="12. Cronograma">
                <TabelaReg
                  cabecalho={["Data", "Atividade"]}
                  linhas={[
                    [
                      "05/08",
                      "Abertura das inscrições e submissões · agente Estruturador disponível",
                    ],
                    ["10/08", "Aula de apoio: o Estruturador e a escrita do relato com IA"],
                    ["23/08, 23h59", "Encerramento das submissões"],
                    ["24 e 25/08", "Conferência de habilitação e solicitação de correções"],
                    ["26/08, até 18h", "Devolução das correções pelos autores"],
                    ["27 a 30/08", "Avaliação dos relatos concorrentes"],
                    ["31/08 a 06/09", "Revisão editorial e diagramação do e-book"],
                    ["03/09", "Divulgação dos 5 selecionados e do suplente"],
                    ["04/09, 12h", "Prazo final para envio dos slides"],
                    ["07/09 (tarde)", "Montagem do espaço"],
                    ["08/09", "Summit no Centro Educacional Esportivo e Cultural"],
                  ]}
                />
                <p>
                  Entre 5 e 7 de setembro, por conta do feriado, a organização não responderá
                  mensagens. Tudo que depende de você precisa estar entregue até 4 de setembro,
                  ao meio-dia.
                </p>
              </Secao>

              <Secao id="secao-13" titulo="13. Proteção de dados pessoais">
                <p>
                  A Secretaria Municipal de Educação de Arabutã, responsável pelo evento, utiliza
                  os dados pessoais para inscrição, comunicação, controle de presença, avaliação,
                  publicação e certificação, com acesso restrito às equipes e prestadores
                  necessários a essas atividades, observadas medidas de segurança e
                  confidencialidade.
                </p>
                <p>
                  O CPF é usado exclusivamente para identificação e certificação e não será
                  publicado no e-book ou em materiais de divulgação.
                </p>
                <p>
                  O participante pode solicitar informações, acesso, correção e, quando
                  legalmente aplicável, exclusão de seus dados. Alguns dados são conservados pelo
                  período necessário à emissão e comprovação dos certificados e ao cumprimento de
                  obrigações legais.
                </p>
                <p>
                  Solicitações relacionadas a dados pessoais: WhatsApp (49) 99927-1442 —
                  Maricelia.
                </p>
              </Secao>

              <Secao id="secao-14" titulo="14. Direitos autorais">
                <p>
                  O relato continua sendo seu. Ao submeter, você autoriza a organização a
                  publicá-lo no e-book e nos materiais do Summit de forma gratuita e não
                  exclusiva, sempre com crédito de autoria, e permanece livre para usar,
                  republicar ou apresentar o texto onde quiser. A distribuição é gratuita: a
                  organização não pode vender o e-book nem o relato.
                </p>
                <p>
                  Os autores são responsáveis pela originalidade do relato e pela autorização de
                  uso de fotografias, ilustrações, tabelas e outros materiais de terceiros,
                  informando autoria e fonte quando aplicável. Ao enviar imagem gerada por IA, o
                  autor é responsável por ter usado ferramenta de uso permitido para essa
                  finalidade.
                </p>
              </Secao>

              <Secao id="secao-15" titulo="15. Observações finais">
                <p>Casos não previstos são decididos pela comissão organizadora.</p>
                <p>Dúvidas e solicitações: WhatsApp (49) 99927-1442 — Maricelia.</p>
                <p className="font-semibold text-tinta">
                  Comissão Organizadora — Summit de Educação de Arabutã
                  <br />
                  Gen-Z Educação · Secretaria Municipal de Educação de Arabutã
                </p>
              </Secao>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
