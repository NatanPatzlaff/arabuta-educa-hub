import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { apenasDigitos, cpfValido, mascaraCPF } from "@/lib/formatos";
import { WHATS_ORG } from "@/components/site/consulta-cpf";
import type { SessaoRelato } from "@/lib/sessao-relato";

const LIMITE_BYTES = 10 * 1024 * 1024;

const MSG = {
  unidade: "Diga o nome da unidade.",
  titulo: "Escreva o título do relato.",
  listaVazia: "Adicione pelo menos um participante.",
  participante: "Preencha o nome e o CPF de todos os participantes.",
  cpfRepetido: "Esse CPF já está na lista.",
  docx: "Anexe o arquivo do relato em Word (.docx).",
  docxTipo:
    "O relato precisa ser enviado em Word editável (.docx). O PDF é opcional e não substitui o Word.",
  tamanho:
    "Esse arquivo tem mais de 10 MB. Tente salvar de novo reduzindo as imagens de dentro do documento.",
  imagemTipo: "As imagens precisam ser .jpg ou .png.",
  declaracao: "Para enviar, é preciso marcar esta declaração.",
  inscricao_nao_habilitada: `Sua inscrição não prevê o relato do ProLEEI. Fale com a organização pelo WhatsApp ${WHATS_ORG}.`,
  prazo_encerrado: "O prazo de submissão encerrou em 23 de agosto de 2026.",
  sem_participantes: "Adicione pelo menos um participante.",
  generico: `Não conseguimos registrar o relato agora. Seus arquivos não foram perdidos — tente de novo em instantes ou fale com a organização pelo WhatsApp ${WHATS_ORG}.`,
};

const rotuloCampo = "block text-sm font-semibold text-tinta";
const campoBase =
  "mt-2 h-14 w-full rounded-xl border bg-background px-4 text-base text-tinta outline-none transition-colors placeholder:text-ferro focus:border-tinta";

type Participante = { nome_completo: string; cpf: string };
const participanteVazio = (): Participante => ({ nome_completo: "", cpf: "" });

function Erro({ texto, id }: { texto?: string | undefined; id: string }) {
  if (!texto) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-sm font-semibold text-listel">
      {texto}
    </p>
  );
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-cinza pt-7 first:border-t-0 first:pt-0">
      <h2 className="text-xl text-tinta">{titulo}</h2>
      <div className="mt-5 space-y-7">{children}</div>
    </section>
  );
}

function extensao(nome: string) {
  const i = nome.lastIndexOf(".");
  return i < 0 ? "" : nome.slice(i).toLowerCase();
}

function ArquivoEscolhido({ nome, aoTrocar }: { nome: string; aoTrocar: () => void }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-cinza bg-neve p-4">
      <span className="text-base text-tinta">{nome}</span>
      <button
        type="button"
        onClick={aoTrocar}
        className="text-sm text-ferro underline underline-offset-4 hover:text-tinta"
      >
        Trocar arquivo
      </button>
    </div>
  );
}

export type ResultadoProleei = {
  codigo: string;
  nome_unidade: string;
  titulo: string;
  participantes: number;
};

export function FormularioProleei({
  sessao,
  onSucesso,
}: {
  sessao: SessaoRelato;
  onSucesso: (resultado: ResultadoProleei) => void;
}) {
  const [nomeUnidade, setNomeUnidade] = React.useState("");
  const [titulo, setTitulo] = React.useState("");
  const [participantes, setParticipantes] = React.useState<Participante[]>([participanteVazio()]);
  const [docx, setDocx] = React.useState<File | null>(null);
  const [imagens, setImagens] = React.useState<File[]>([]);
  const [declaracao, setDeclaracao] = React.useState(false);

  const [erros, setErros] = React.useState<Record<string, string | undefined>>({});
  const [erroGeral, setErroGeral] = React.useState("");
  const [enviando, setEnviando] = React.useState(false);
  const [etapa, setEtapa] = React.useState("");
  const [progresso, setProgresso] = React.useState(0);

  const docxRef = React.useRef<HTMLInputElement>(null);
  const imgRef = React.useRef<HTMLInputElement>(null);
  const focarUltimo = React.useRef(false);

  React.useEffect(() => {
    if (!focarUltimo.current) return;
    focarUltimo.current = false;
    const alvo = document.getElementById(`participante-${participantes.length - 1}-nome`);
    if (alvo) (alvo as HTMLInputElement).focus();
  }, [participantes.length]);

  const limpa = (chave: string) => setErros((a) => ({ ...a, [chave]: undefined }));
  const borda = (chave: string) => (erros[chave] ? "border-listel" : "border-cinza");

  const restantes = 120 - titulo.length;

  const adicionarParticipante = () => {
    focarUltimo.current = true;
    setParticipantes((a) => [...a, participanteVazio()]);
    limpa("participantes");
  };
  const removerParticipante = (i: number) =>
    setParticipantes((a) => a.filter((_, indice) => indice !== i));
  const alterarParticipante = (i: number, campo: keyof Participante, valor: string) =>
    setParticipantes((a) => a.map((p, indice) => (indice === i ? { ...p, [campo]: valor } : p)));

  const escolherDocx = (arquivo: File | undefined) => {
    if (!arquivo) return;
    const tipoOk =
      extensao(arquivo.name) === ".docx" &&
      (arquivo.type === "" ||
        arquivo.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    if (!tipoOk) {
      setErros((a) => ({ ...a, docx: MSG.docxTipo }));
      return;
    }
    if (arquivo.size > LIMITE_BYTES) {
      setErros((a) => ({ ...a, docx: MSG.tamanho }));
      return;
    }
    setDocx(arquivo);
    limpa("docx");
  };

  const escolherImagens = (lista: FileList | null) => {
    if (!lista || lista.length === 0) return;
    const novos = Array.from(lista);
    for (const arquivo of novos) {
      const ext = extensao(arquivo.name);
      const tipoOk =
        (ext === ".jpg" || ext === ".jpeg" || ext === ".png") &&
        (arquivo.type === "" || arquivo.type === "image/jpeg" || arquivo.type === "image/png");
      if (!tipoOk) {
        setErros((a) => ({ ...a, imagens: MSG.imagemTipo }));
        return;
      }
      if (arquivo.size > LIMITE_BYTES) {
        setErros((a) => ({ ...a, imagens: MSG.tamanho }));
        return;
      }
    }
    setImagens((a) => [...a, ...novos]);
    limpa("imagens");
  };

  const validar = () => {
    const novos: Record<string, string | undefined> = {};
    if (!nomeUnidade.trim()) novos["unidade"] = MSG.unidade;
    if (!titulo.trim()) novos["titulo"] = MSG.titulo;

    const preenchidos = participantes.filter(
      (p) => p.nome_completo.trim() || p.cpf.trim(),
    );
    if (preenchidos.length === 0) novos["participantes"] = MSG.listaVazia;

    const vistos = new Set<string>();
    participantes.forEach((p, i) => {
      const nomeOk = p.nome_completo.trim().length >= 2;
      const cpfOk = cpfValido(p.cpf);
      if (!nomeOk || !cpfOk) {
        novos["participantes"] = MSG.participante;
        if (!nomeOk) novos[`participante-${i}-nome`] = MSG.participante;
        if (!cpfOk) novos[`participante-${i}-cpf`] = MSG.participante;
        return;
      }
      const digitos = apenasDigitos(p.cpf);
      if (vistos.has(digitos)) novos[`participante-${i}-cpf`] = MSG.cpfRepetido;
      vistos.add(digitos);
    });

    if (!docx) novos["docx"] = MSG.docx;
    if (!declaracao) novos["declaracao"] = MSG.declaracao;

    setErros(novos);
    return Object.keys(novos).length === 0;
  };

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErroGeral("");
    if (!validar()) return;
    if (!docx) return;

    setEnviando(true);
    setProgresso(0);

    const pasta = crypto.randomUUID();
    const enviados: { bucket: string; caminho: string }[] = [];

    const total = 1 + imagens.length;
    let feitos = 0;

    const subir = async (bucket: string, caminho: string, arquivo: File) => {
      feitos += 1;
      setEtapa(`Enviando arquivo ${feitos} de ${total}...`);
      setProgresso(Math.round(((feitos - 1) / total) * 100));
      const { error } = await supabase.storage.from(bucket).upload(caminho, arquivo, {
        upsert: false,
        ...(arquivo.type ? { contentType: arquivo.type } : {}),
      });
      if (error) throw new Error("upload");
      enviados.push({ bucket, caminho });
      setProgresso(Math.round((feitos / total) * 100));
    };

    const limparArquivos = async () => {
      for (const item of enviados) {
        await supabase.storage.from(item.bucket).remove([item.caminho]);
      }
    };

    try {
      const docxPath = `${pasta}/relato.docx`;
      await subir("relatos", docxPath, docx);

      const caminhosImagens: string[] = [];
      for (let i = 0; i < imagens.length; i++) {
        const arquivo = imagens[i]!;
        const ext = extensao(arquivo.name) === ".png" ? ".png" : ".jpg";
        const caminho = `${pasta}/imagem-${i + 1}${ext}`;
        await subir("imagens-relatos", caminho, arquivo);
        caminhosImagens.push(caminho);
      }

      setEtapa("Registrando o relato da unidade...");

      const lista = participantes.map((p) => ({
        nome_completo: p.nome_completo.trim(),
        cpf: apenasDigitos(p.cpf),
      }));

      const { data, error } = await supabase.rpc("submeter_relato_proleei", {
        p_inscricao_id: sessao.inscricao_id,
        p_nome_unidade: nomeUnidade.trim(),
        p_titulo: titulo.trim(),
        p_docx_path: docxPath,
        p_imagens: caminhosImagens,
        p_declaracao: declaracao,
        p_participantes: lista,
      });

      if (error) {
        await limparArquivos();
        const bruto = `${error.message} ${error.details ?? ""}`;
        if (bruto.includes("inscricao_nao_habilitada")) setErroGeral(MSG.inscricao_nao_habilitada);
        else if (bruto.includes("prazo_encerrado")) setErroGeral(MSG.prazo_encerrado);
        else if (bruto.includes("sem_participantes")) setErroGeral(MSG.sem_participantes);
        else setErroGeral(MSG.generico);
        return;
      }

      onSucesso({
        codigo: String(data),
        nome_unidade: nomeUnidade.trim(),
        titulo: titulo.trim(),
        participantes: lista.length,
      });
    } catch {
      await limparArquivos();
      setErroGeral(MSG.generico);
    } finally {
      setEnviando(false);
      setEtapa("");
      setProgresso(0);
    }
  };

  return (
    <form noValidate onSubmit={enviar} className="space-y-9">
      <p className="text-base text-ferro">
        Enviando como <span className="font-semibold text-tinta">{sessao.primeiro_nome}</span>
      </p>

      <Bloco titulo="Sobre a unidade">
        <div>
          <label htmlFor="unidade" className={rotuloCampo}>
            Nome da unidade
          </label>
          <input
            id="unidade"
            value={nomeUnidade}
            onChange={(e) => {
              setNomeUnidade(e.target.value);
              limpa("unidade");
            }}
            aria-invalid={!!erros["unidade"]}
            aria-describedby={erros["unidade"] ? "erro-unidade" : undefined}
            className={`${campoBase} ${borda("unidade")}`}
          />
          <Erro id="erro-unidade" texto={erros["unidade"]} />
        </div>

        <div>
          <label htmlFor="titulo" className={rotuloCampo}>
            Título do relato
          </label>
          <input
            id="titulo"
            value={titulo}
            maxLength={120}
            onChange={(e) => {
              setTitulo(e.target.value.slice(0, 120));
              limpa("titulo");
            }}
            aria-invalid={!!erros["titulo"]}
            aria-describedby={erros["titulo"] ? "erro-titulo" : "contador-titulo"}
            className={`${campoBase} ${borda("titulo")}`}
          />
          <p id="contador-titulo" className="mt-2 text-sm text-ferro">
            {restantes} {restantes === 1 ? "caractere restante" : "caracteres restantes"}
          </p>
          <Erro id="erro-titulo" texto={erros["titulo"]} />
        </div>
      </Bloco>

      <Bloco titulo="Relação de participantes">
        <p className="medida rounded-xl border border-listel bg-background p-4 text-base font-semibold text-tinta">
          É esta lista que gera os certificados de 15 horas. Quem não estiver aqui não recebe o
          certificado da unidade. Confira os nomes e os CPFs antes de enviar.
        </p>

        <p aria-live="polite" className="text-sm font-semibold text-ferro">
          {participantes.length}{" "}
          {participantes.length === 1 ? "participante na lista" : "participantes na lista"}
        </p>

        {participantes.map((p, i) => (
          <div key={i} className="rounded-xl border border-cinza bg-neve p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-tinta">Participante {i + 1}</h3>
              {participantes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removerParticipante(i)}
                  className="text-sm text-ferro underline underline-offset-4 hover:text-tinta"
                >
                  Remover
                </button>
              )}
            </div>

            <div className="mt-4 space-y-5">
              <div>
                <label htmlFor={`participante-${i}-nome`} className={rotuloCampo}>
                  Nome completo
                </label>
                <input
                  id={`participante-${i}-nome`}
                  value={p.nome_completo}
                  onChange={(e) => {
                    alterarParticipante(i, "nome_completo", e.target.value);
                    limpa(`participante-${i}-nome`);
                    limpa("participantes");
                  }}
                  aria-invalid={!!erros[`participante-${i}-nome`]}
                  aria-describedby={
                    erros[`participante-${i}-nome`] ? `erro-participante-${i}-nome` : undefined
                  }
                  className={`${campoBase} ${borda(`participante-${i}-nome`)}`}
                />
                <Erro
                  id={`erro-participante-${i}-nome`}
                  texto={erros[`participante-${i}-nome`]}
                />
              </div>

              <div>
                <label htmlFor={`participante-${i}-cpf`} className={rotuloCampo}>
                  CPF
                </label>
                <input
                  id={`participante-${i}-cpf`}
                  value={p.cpf}
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  onChange={(e) => {
                    alterarParticipante(i, "cpf", mascaraCPF(e.target.value));
                    limpa(`participante-${i}-cpf`);
                    limpa("participantes");
                  }}
                  aria-invalid={!!erros[`participante-${i}-cpf`]}
                  aria-describedby={
                    erros[`participante-${i}-cpf`] ? `erro-participante-${i}-cpf` : undefined
                  }
                  className={`${campoBase} ${borda(`participante-${i}-cpf`)}`}
                />
                <Erro id={`erro-participante-${i}-cpf`} texto={erros[`participante-${i}-cpf`]} />
              </div>
            </div>
          </div>
        ))}

        <Erro id="erro-participantes" texto={erros["participantes"]} />

        <Button
          type="button"
          variant="contorno"
          size="xl"
          className="w-full"
          onClick={adicionarParticipante}
        >
          Adicionar participante
        </Button>
      </Bloco>

      <Bloco titulo="Arquivos">
        <div>
          <label htmlFor="docx" className={rotuloCampo}>
            Arquivo do relato (.docx)
          </label>
          <input
            id="docx"
            ref={docxRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => escolherDocx(e.target.files?.[0])}
            aria-invalid={!!erros["docx"]}
            aria-describedby={erros["docx"] ? "erro-docx" : undefined}
            className={`mt-2 w-full rounded-xl border bg-background p-4 text-base text-tinta file:mr-4 file:rounded-lg file:border-0 file:bg-tinta file:px-4 file:py-2 file:text-sm file:text-white ${borda("docx")}`}
          />
          {docx && (
            <ArquivoEscolhido
              nome={docx.name}
              aoTrocar={() => {
                setDocx(null);
                if (docxRef.current) docxRef.current.value = "";
              }}
            />
          )}
          <Erro id="erro-docx" texto={erros["docx"]} />
        </div>

        <div>
          <label htmlFor="imagens" className={rotuloCampo}>
            Imagens (opcional)
          </label>
          <input
            id="imagens"
            ref={imgRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            onChange={(e) => {
              escolherImagens(e.target.files);
              if (imgRef.current) imgRef.current.value = "";
            }}
            aria-invalid={!!erros["imagens"]}
            aria-describedby={erros["imagens"] ? "erro-imagens" : undefined}
            className={`mt-2 w-full rounded-xl border bg-background p-4 text-base text-tinta file:mr-4 file:rounded-lg file:border-0 file:bg-tinta file:px-4 file:py-2 file:text-sm file:text-white ${borda("imagens")}`}
          />
          {imagens.map((arquivo, i) => (
            <ArquivoEscolhido
              key={`${arquivo.name}-${i}`}
              nome={arquivo.name}
              aoTrocar={() => setImagens((a) => a.filter((_, indice) => indice !== i))}
            />
          ))}
          <Erro id="erro-imagens" texto={erros["imagens"]} />
        </div>
      </Bloco>

      <Bloco titulo="Declarações">
        <div>
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-base text-tinta transition-colors hover:bg-neve ${
              declaracao ? "border-tinta" : borda("declaracao")
            }`}
          >
            <input
              type="checkbox"
              checked={declaracao}
              aria-invalid={!!erros["declaracao"]}
              aria-describedby={erros["declaracao"] ? "erro-declaracao" : undefined}
              onChange={(e) => {
                setDeclaracao(e.target.checked);
                limpa("declaracao");
              }}
              className="mt-0.5 h-5 w-5 accent-[var(--listel)]"
            />
            <span>
              As fotos não identificam estudantes, ou possuem autorização válida para publicação em
              material digital de acesso público, arquivada na escola
            </span>
          </label>
          <Erro id="erro-declaracao" texto={erros["declaracao"]} />
        </div>
      </Bloco>

      {enviando && (
        <div aria-live="polite" className="rounded-xl border border-cinza bg-neve p-5">
          <p className="text-base font-semibold text-tinta">{etapa}</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cinza">
            <div
              className="h-full bg-listel transition-all"
              style={{ width: `${Math.max(progresso, 8)}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-ferro">
            Arquivos grandes podem demorar. Não feche esta página.
          </p>
        </div>
      )}

      {erroGeral && (
        <p
          role="alert"
          className="rounded-xl border border-listel bg-background p-4 text-sm font-semibold text-listel"
        >
          {erroGeral}
        </p>
      )}

      <Button type="submit" variant="acao" size="xl" disabled={enviando} className="w-full">
        {enviando ? "Enviando..." : "Enviar o relato da unidade"}
      </Button>
    </form>
  );
}
