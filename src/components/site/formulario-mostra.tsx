import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { apenasDigitos, cpfValido, emailValido, mascaraCPF } from "@/lib/formatos";
import { WHATS_ORG } from "@/components/site/consulta-cpf";
import type { SessaoRelato } from "@/lib/sessao-relato";
import type { Database } from "@/integrations/supabase/types";

type Categoria = Database["public"]["Enums"]["categoria_relato"];
type Modo = Database["public"]["Enums"]["modo_participacao"];
type Origem = Database["public"]["Enums"]["origem_imagem"];

const LIMITE_BYTES = 10 * 1024 * 1024;

const MSG = {
  titulo: "Escreva o título do relato.",
  categoria: "Escolha uma categoria.",
  modo: "Escolha como quer participar.",
  docx: "Anexe o arquivo do relato em Word (.docx).",
  docxTipo:
    "O relato precisa ser enviado em Word editável (.docx). O PDF é opcional e não substitui o Word.",
  pdfTipo: "A versão opcional precisa ser um arquivo .pdf.",
  tamanho:
    "Esse arquivo tem mais de 10 MB. Tente salvar de novo reduzindo as imagens de dentro do documento.",
  imagemTipo: "As imagens precisam ser .jpg ou .png.",
  imagemQtd: "São aceitas no máximo 2 imagens.",
  origem: "Diga de onde vêm as imagens.",
  autorizacao: "Para enviar fotos da prática, é preciso marcar esta autorização.",
  coautoria: "Marque a declaração de coautoria.",
  originalidade: "Para enviar, é preciso marcar a declaração de originalidade.",
  direitosAutorais: "Para enviar, é preciso aceitar as condições de publicação e direitos autorais.",
  autorNome: "Escreva o nome completo do autor responsável.",
  autorCpf: "Esse CPF não parece válido. Confira os números.",
  contribuicaoAutor: "Descreva a sua contribuição para a prática.",
  coautorNome: "Escreva o nome completo do coautor.",
  coautorCpf: "Esse CPF não parece válido. Confira os números.",
  coautorEmail: "Parece que o e-mail está incompleto.",
  coautorContrib: "Descreva a contribuição do coautor.",
  inscricao_nao_habilitada: `Sua inscrição não prevê envio de relato para a Mostra. Fale com a organização pelo WhatsApp ${WHATS_ORG}.`,
  prazo_encerrado: "O prazo de submissão encerrou em 23 de agosto de 2026.",
  prazo_nao_aberto: "As submissões ainda não abriram. Elas começam em 5 de agosto de 2026.",
  limite_relatos_excedido: `Você já enviou 2 relatos como autor principal — esse é o limite por pessoa. Coautoria não entra nessa conta. Dúvidas: WhatsApp ${WHATS_ORG}.`,
  generico: `Não conseguimos registrar seu relato agora. Seus arquivos não foram perdidos — tente enviar de novo em instantes ou fale com a organização pelo WhatsApp ${WHATS_ORG}.`,
};

const rotuloCampo = "block text-sm font-semibold text-tinta";
const campoBase =
  "mt-2 h-14 w-full rounded-xl border bg-background px-4 text-base text-tinta outline-none transition-colors placeholder:text-ferro focus:border-tinta";

const categorias: { valor: Categoria; rotulo: string }[] = [
  { valor: "gestao", rotulo: "Gestão" },
  { valor: "educacao_infantil", rotulo: "Educação Infantil" },
  { valor: "ensino_fundamental", rotulo: "Ensino Fundamental" },
];

const modos: { valor: Modo; rotulo: string }[] = [
  { valor: "palco", rotulo: "Quero concorrer à apresentação" },
  { valor: "ebook", rotulo: "Só quero aparecer no e-book" },
];

const origens: { valor: Origem; rotulo: string }[] = [
  { valor: "foto_pratica", rotulo: "Foto da prática" },
  { valor: "gerada_ia", rotulo: "Imagem gerada por IA" },
];

type Coautor = { nome: string; cpf: string; email: string; contribuicao: string };
const coautorVazio = (): Coautor => ({ nome: "", cpf: "", email: "", contribuicao: "" });
const coautorPreenchido = (c: Coautor) =>
  !!(c.nome.trim() || c.cpf.trim() || c.email.trim() || c.contribuicao.trim());

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

export type ResultadoMostra = {
  codigo: string;
  titulo: string;
  categoria: Categoria;
  modo: Modo;
};

export function FormularioMostra({
  sessao,
  onSucesso,
}: {
  sessao: SessaoRelato;
  onSucesso: (resultado: ResultadoMostra) => void;
}) {
  const [titulo, setTitulo] = React.useState("");
  const [autorNome, setAutorNome] = React.useState(sessao.nome_completo ?? sessao.primeiro_nome ?? "");
  const [autorCpf, setAutorCpf] = React.useState(sessao.cpf ?? "");
  const [categoria, setCategoria] = React.useState<Categoria | "">("");
  // Padrão do §7: "Quero concorrer à apresentação" é a opção padrão, exceto se a
  // pessoa já tinha escolhido "só e-book" na inscrição.
  const [modo, setModo] = React.useState<Modo | "">(
    sessao.modo_participacao_preferido ?? "palco",
  );
  const [contribuicaoAutor, setContribuicaoAutor] = React.useState("");
  const [coautores, setCoautores] = React.useState<Coautor[]>([]);
  const [decCoautoria, setDecCoautoria] = React.useState(false);
  const [docx, setDocx] = React.useState<File | null>(null);
  const [pdf, setPdf] = React.useState<File | null>(null);
  const [imagens, setImagens] = React.useState<File[]>([]);
  const [origem, setOrigem] = React.useState<Origem | "">("");
  const [autorizacao, setAutorizacao] = React.useState(false);
  const [decOriginalidade, setDecOriginalidade] = React.useState(false);
  const [decDireitosAutorais, setDecDireitosAutorais] = React.useState(false);

  const [erros, setErros] = React.useState<Record<string, string | undefined>>({});
  const [erroGeral, setErroGeral] = React.useState("");
  const [enviando, setEnviando] = React.useState(false);
  const [etapa, setEtapa] = React.useState("");
  const [progresso, setProgresso] = React.useState(0);

  // §2: até 2 relatos por autor principal (coautoria não conta nessa conta).
  const [limiteRelatos, setLimiteRelatos] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let ativo = true;
    (async () => {
      const { count } = await supabase
        .from("relatos_mostra")
        .select("id", { count: "exact", head: true })
        .eq("inscricao_id", sessao.inscricao_id);
      if (ativo) setLimiteRelatos((count ?? 0) >= 2);
    })();
    return () => {
      ativo = false;
    };
  }, [sessao.inscricao_id]);

  const docxRef = React.useRef<HTMLInputElement>(null);
  const pdfRef = React.useRef<HTMLInputElement>(null);
  const imgRef = React.useRef<HTMLInputElement>(null);

  const limpa = (chave: string) => setErros((a) => ({ ...a, [chave]: undefined }));
  const borda = (chave: string) => (erros[chave] ? "border-listel" : "border-cinza");

  const restantes = 120 - titulo.length;

  const adicionarCoautor = () => setCoautores((a) => [...a, coautorVazio()]);
  const removerCoautor = (i: number) =>
    setCoautores((a) => a.filter((_, indice) => indice !== i));
  const alterarCoautor = (i: number, campo: keyof Coautor, valor: string) =>
    setCoautores((a) => a.map((c, indice) => (indice === i ? { ...c, [campo]: valor } : c)));

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

  const escolherPdf = (arquivo: File | undefined) => {
    if (!arquivo) return;
    const tipoOk =
      extensao(arquivo.name) === ".pdf" &&
      (arquivo.type === "" || arquivo.type === "application/pdf");
    if (!tipoOk) {
      setErros((a) => ({ ...a, pdf: MSG.pdfTipo }));
      return;
    }
    if (arquivo.size > LIMITE_BYTES) {
      setErros((a) => ({ ...a, pdf: MSG.tamanho }));
      return;
    }
    setPdf(arquivo);
    limpa("pdf");
  };

  const escolherImagens = (lista: FileList | null) => {
    if (!lista || lista.length === 0) return;
    const novos = Array.from(lista);
    if (imagens.length + novos.length > 2) {
      setErros((a) => ({ ...a, imagens: MSG.imagemQtd }));
      return;
    }
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
    if (!titulo.trim()) novos["titulo"] = MSG.titulo;
    if (!autorNome.trim()) novos["autorNome"] = MSG.autorNome;
    if (!cpfValido(autorCpf)) novos["autorCpf"] = MSG.autorCpf;
    if (!categoria) novos["categoria"] = MSG.categoria;
    if (!modo) novos["modo"] = MSG.modo;
    if (contribuicaoAutor.trim().length < 3) novos["contribuicaoAutor"] = MSG.contribuicaoAutor;

    coautores.forEach((c, i) => {
      if (!coautorPreenchido(c)) return;
      if (c.nome.trim().length < 2) novos[`coautor-${i}-nome`] = MSG.coautorNome;
      if (!cpfValido(c.cpf)) novos[`coautor-${i}-cpf`] = MSG.coautorCpf;
      if (!emailValido(c.email)) novos[`coautor-${i}-email`] = MSG.coautorEmail;
      if (c.contribuicao.trim().length < 3) novos[`coautor-${i}-contribuicao`] = MSG.coautorContrib;
    });

    if (coautores.length > 0 && !decCoautoria) novos["coautoria"] = MSG.coautoria;
    if (!docx) novos["docx"] = MSG.docx;
    if (imagens.length > 0 && !origem) novos["origem"] = MSG.origem;
    if (imagens.length > 0 && origem === "foto_pratica" && !autorizacao)
      novos["autorizacao"] = MSG.autorizacao;
    if (!decOriginalidade) novos["originalidade"] = MSG.originalidade;
    if (!decDireitosAutorais) novos["direitosAutorais"] = MSG.direitosAutorais;

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

    const total = 1 + (pdf ? 1 : 0) + imagens.length;
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

      let pdfPath = "";
      if (pdf) {
        pdfPath = `${pasta}/versao.pdf`;
        await subir("relatos", pdfPath, pdf);
      }

      const caminhosImagens: string[] = [];
      for (let i = 0; i < imagens.length; i++) {
        const arquivo = imagens[i]!;
        const ext = extensao(arquivo.name) === ".png" ? ".png" : ".jpg";
        const caminho = `${pasta}/imagem-${i + 1}${ext}`;
        await subir("imagens-relatos", caminho, arquivo);
        caminhosImagens.push(caminho);
      }

      setEtapa("Registrando seu relato...");

      const { data, error } = await supabase.rpc("submeter_relato_mostra", {
        p_inscricao_id: sessao.inscricao_id,
        p_titulo: titulo.trim(),
        p_autor_nome: autorNome.trim(),
        p_autor_cpf: apenasDigitos(autorCpf),
        p_categoria: categoria as Categoria,
        p_modo: modo as Modo,
        p_docx_path: docxPath,
        p_pdf_path: pdfPath,
        p_imagens: caminhosImagens,
        p_origem: (imagens.length > 0 ? origem : null) as Origem,
        p_autorizacao: origem === "foto_pratica" ? autorizacao : false,
        p_declaracao_coautoria: coautores.length > 0 ? decCoautoria : false,
        p_declaracao_originalidade: decOriginalidade,
        p_contribuicao_autor_principal: contribuicaoAutor.trim(),
        p_declaracao_direitos_autorais: decDireitosAutorais,
        p_coautores: coautores
          .filter(coautorPreenchido)
          .map((c) => ({
            nome: c.nome.trim(),
            cpf: apenasDigitos(c.cpf),
            email: c.email.trim(),
            contribuicao: c.contribuicao.trim(),
          })),
      });

      if (error) {
        await limparArquivos();
        const bruto = `${error.message} ${error.details ?? ""}`;
        if (bruto.includes("inscricao_nao_habilitada")) setErroGeral(MSG.inscricao_nao_habilitada);
        else if (bruto.includes("prazo_encerrado")) setErroGeral(MSG.prazo_encerrado);
        else if (bruto.includes("prazo_nao_aberto")) setErroGeral(MSG.prazo_nao_aberto);
        else if (bruto.includes("limite_relatos_excedido")) {
          setErroGeral(MSG.limite_relatos_excedido);
          setLimiteRelatos(true);
        } else setErroGeral(MSG.generico);
        return;
      }

      onSucesso({
        codigo: String(data),
        titulo: titulo.trim(),
        categoria: categoria as Categoria,
        modo: modo as Modo,
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

  if (limiteRelatos === true) {
    return (
      <div className="rounded-xl border border-listel bg-background p-6 sm:p-8">
        <p className="text-lg font-semibold text-listel">
          Você já enviou 2 relatos como autor principal.
        </p>
        <p className="medida mt-3 text-base text-ferro">
          Esse é o limite por pessoa (a coautoria não entra nessa conta). Se precisar rever algum
          envio, fale com a organização pelo WhatsApp {WHATS_ORG}.
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={enviar} className="space-y-9">
      <Bloco titulo="Dados de autoria">
        <p className="medida text-base text-ferro">
          Informe o nome e o CPF do autor responsável. Eles ficam registrados separadamente do
          arquivo para manter a avaliação às cegas e evitar que os avaliadores identifiquem quem
          escreveu o relato.
        </p>

        <div>
          <label htmlFor="autor-nome" className={rotuloCampo}>
            Nome completo do autor responsável
          </label>
          <input
            id="autor-nome"
            value={autorNome}
            onChange={(e) => {
              setAutorNome(e.target.value);
              limpa("autorNome");
            }}
            aria-invalid={!!erros["autorNome"]}
            aria-describedby={erros["autorNome"] ? "erro-autor-nome" : undefined}
            className={`${campoBase} ${borda("autorNome")}`}
          />
          <Erro id="erro-autor-nome" texto={erros["autorNome"]} />
        </div>

        <div>
          <label htmlFor="autor-cpf" className={rotuloCampo}>
            CPF do autor responsável
          </label>
          <input
            id="autor-cpf"
            value={autorCpf}
            inputMode="numeric"
            placeholder="000.000.000-00"
            onChange={(e) => {
              setAutorCpf(mascaraCPF(e.target.value));
              limpa("autorCpf");
            }}
            aria-invalid={!!erros["autorCpf"]}
            aria-describedby={erros["autorCpf"] ? "erro-autor-cpf" : undefined}
            className={`${campoBase} ${borda("autorCpf")}`}
          />
          <Erro id="erro-autor-cpf" texto={erros["autorCpf"]} />
        </div>
      </Bloco>

      <Bloco titulo="Sobre o relato">
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

        <fieldset aria-describedby={erros["categoria"] ? "erro-categoria" : undefined}>
          <legend className={rotuloCampo}>Categoria</legend>
          <div className="mt-3 space-y-3">
            {categorias.map((c) => (
              <label
                key={c.valor}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-base text-tinta transition-colors hover:bg-neve ${
                  categoria === c.valor ? "border-tinta" : borda("categoria")
                }`}
              >
                <input
                  type="radio"
                  name="categoria"
                  checked={categoria === c.valor}
                  onChange={() => {
                    setCategoria(c.valor);
                    limpa("categoria");
                  }}
                  className="h-5 w-5 accent-[var(--listel)]"
                />
                {c.rotulo}
              </label>
            ))}
          </div>
          <Erro id="erro-categoria" texto={erros["categoria"]} />
        </fieldset>

        <fieldset aria-describedby={erros["modo"] ? "erro-modo" : undefined}>
          <legend className={rotuloCampo}>Como quer participar</legend>
          <div className="mt-3 space-y-3">
            {modos.map((m) => (
              <label
                key={m.valor}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-base text-tinta transition-colors hover:bg-neve ${
                  modo === m.valor ? "border-tinta" : borda("modo")
                }`}
              >
                <input
                  type="radio"
                  name="modo"
                  checked={modo === m.valor}
                  onChange={() => {
                    setModo(m.valor);
                    limpa("modo");
                  }}
                  className="h-5 w-5 accent-[var(--listel)]"
                />
                {m.rotulo}
              </label>
            ))}
          </div>
          <Erro id="erro-modo" texto={erros["modo"]} />
        </fieldset>

        <div>
          <label htmlFor="contribuicao-autor" className={rotuloCampo}>
            Sua contribuição para a prática
          </label>
          <textarea
            id="contribuicao-autor"
            value={contribuicaoAutor}
            rows={3}
            onChange={(e) => {
              setContribuicaoAutor(e.target.value);
              limpa("contribuicaoAutor");
            }}
            aria-invalid={!!erros["contribuicaoAutor"]}
            aria-describedby={erros["contribuicaoAutor"] ? "erro-contribuicao-autor" : undefined}
            className={`mt-2 w-full rounded-xl border bg-background p-4 text-base text-tinta outline-none transition-colors placeholder:text-ferro focus:border-tinta ${borda(
              "contribuicaoAutor",
            )}`}
          />
          <Erro id="erro-contribuicao-autor" texto={erros["contribuicaoAutor"]} />
        </div>
      </Bloco>

      <Bloco titulo="Coautores">
        <p className="medida text-base text-ferro">
          Opcional. Você pode incluir até dois coautores. Quem for incluído aqui entra no
          certificado.
        </p>

        {coautores.map((c, i) => (
          <div key={i} className="rounded-xl border border-cinza bg-neve p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-tinta">Coautor {i + 1}</h3>
              <button
                type="button"
                onClick={() => removerCoautor(i)}
                className="text-sm text-ferro underline underline-offset-4 hover:text-tinta"
              >
                Remover
              </button>
            </div>

            <div className="mt-4 space-y-5">
              <div>
                <label htmlFor={`coautor-${i}-nome`} className={rotuloCampo}>
                  Nome completo
                </label>
                <input
                  id={`coautor-${i}-nome`}
                  value={c.nome}
                  onChange={(e) => {
                    alterarCoautor(i, "nome", e.target.value);
                    limpa(`coautor-${i}-nome`);
                  }}
                  aria-invalid={!!erros[`coautor-${i}-nome`]}
                  aria-describedby={
                    erros[`coautor-${i}-nome`] ? `erro-coautor-${i}-nome` : undefined
                  }
                  className={`${campoBase} ${borda(`coautor-${i}-nome`)}`}
                />
                <Erro id={`erro-coautor-${i}-nome`} texto={erros[`coautor-${i}-nome`]} />
              </div>

              <div>
                <label htmlFor={`coautor-${i}-cpf`} className={rotuloCampo}>
                  CPF
                </label>
                <input
                  id={`coautor-${i}-cpf`}
                  value={c.cpf}
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  onChange={(e) => {
                    alterarCoautor(i, "cpf", mascaraCPF(e.target.value));
                    limpa(`coautor-${i}-cpf`);
                  }}
                  aria-invalid={!!erros[`coautor-${i}-cpf`]}
                  aria-describedby={erros[`coautor-${i}-cpf`] ? `erro-coautor-${i}-cpf` : undefined}
                  className={`${campoBase} ${borda(`coautor-${i}-cpf`)}`}
                />
                <Erro id={`erro-coautor-${i}-cpf`} texto={erros[`coautor-${i}-cpf`]} />
              </div>

              <div>
                <label htmlFor={`coautor-${i}-email`} className={rotuloCampo}>
                  E-mail
                </label>
                <input
                  id={`coautor-${i}-email`}
                  type="email"
                  value={c.email}
                  onChange={(e) => {
                    alterarCoautor(i, "email", e.target.value);
                    limpa(`coautor-${i}-email`);
                  }}
                  aria-invalid={!!erros[`coautor-${i}-email`]}
                  aria-describedby={
                    erros[`coautor-${i}-email`] ? `erro-coautor-${i}-email` : undefined
                  }
                  className={`${campoBase} ${borda(`coautor-${i}-email`)}`}
                />
                <Erro id={`erro-coautor-${i}-email`} texto={erros[`coautor-${i}-email`]} />
              </div>

              <div>
                <label htmlFor={`coautor-${i}-contribuicao`} className={rotuloCampo}>
                  Contribuição
                </label>
                <textarea
                  id={`coautor-${i}-contribuicao`}
                  value={c.contribuicao}
                  rows={3}
                  onChange={(e) => {
                    alterarCoautor(i, "contribuicao", e.target.value);
                    limpa(`coautor-${i}-contribuicao`);
                  }}
                  aria-invalid={!!erros[`coautor-${i}-contribuicao`]}
                  aria-describedby={
                    erros[`coautor-${i}-contribuicao`]
                      ? `erro-coautor-${i}-contribuicao`
                      : undefined
                  }
                  className={`mt-2 w-full rounded-xl border bg-background p-4 text-base text-tinta outline-none transition-colors placeholder:text-ferro focus:border-tinta ${borda(
                    `coautor-${i}-contribuicao`,
                  )}`}
                />
                <Erro
                  id={`erro-coautor-${i}-contribuicao`}
                  texto={erros[`coautor-${i}-contribuicao`]}
                />
              </div>
            </div>
          </div>
        ))}

        {coautores.length < 2 && (
          <Button type="button" variant="contorno" size="xl" onClick={adicionarCoautor}>
            Adicionar coautor
          </Button>
        )}

        {coautores.length > 0 && (
          <div>
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-base text-tinta transition-colors hover:bg-neve ${
                decCoautoria ? "border-tinta" : borda("coautoria")
              }`}
            >
              <input
                type="checkbox"
                checked={decCoautoria}
                aria-invalid={!!erros["coautoria"]}
                aria-describedby={erros["coautoria"] ? "erro-coautoria" : undefined}
                onChange={(e) => {
                  setDecCoautoria(e.target.checked);
                  limpa("coautoria");
                }}
                className="mt-0.5 h-5 w-5 accent-[var(--listel)]"
              />
              <span>
                Declaro que todos os coautores contribuíram efetivamente, conhecem o conteúdo e
                autorizam a publicação
              </span>
            </label>
            <Erro id="erro-coautoria" texto={erros["coautoria"]} />
          </div>
        )}
      </Bloco>

      <Bloco titulo="Arquivos">
        <div className="rounded-xl border border-cinza bg-neve p-5">
          <p className="medida text-base font-semibold text-tinta">
            O relato deve ter entre 450 e 700 palavras e ser enviado em Word editável (.docx).
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Button type="button" variant="contorno" size="xl" disabled>
              Baixar modelo em Word
            </Button>
            <a
              href="https://chatgpt.com/g/g-6a6dedf3f8248191b04949dfd3a3221f-praticas-exitosas"
              target="_blank"
              rel="noreferrer"
              className="text-base font-semibold text-listel underline underline-offset-4"
            >
              Converse com o agente de apoio
            </a>
          </div>
          <p className="mt-3 text-sm text-ferro">Modelo disponível em breve.</p>
          <p className="medida mt-3 text-sm font-semibold text-listel">
            Ao conversar com o agente, não informe nomes, iniciais, diagnósticos, condições de
            saúde ou situações familiares de estudantes. Use descrições gerais, como "um
            estudante" ou "parte do grupo".
          </p>
        </div>

        <div className="rounded-xl border-l-4 border-listel bg-neve p-5">
          <p className="text-base font-semibold text-tinta">
            Não escreva seu nome dentro deste arquivo.
          </p>
          <p className="medida mt-2 text-sm text-ferro">
            A autoria já está registrada no formulário — é de lá que sai tudo, inclusive seu nome
            no e-book e no certificado. O arquivo sem nome serve só para que os avaliadores leiam
            sem saber quem escreveu; nenhuma informação se perde.
          </p>
        </div>

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
          <label htmlFor="pdf" className={rotuloCampo}>
            Versão em PDF (opcional)
          </label>
          <input
            id="pdf"
            ref={pdfRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => escolherPdf(e.target.files?.[0])}
            aria-invalid={!!erros["pdf"]}
            aria-describedby={erros["pdf"] ? "erro-pdf" : undefined}
            className={`mt-2 w-full rounded-xl border bg-background p-4 text-base text-tinta file:mr-4 file:rounded-lg file:border-0 file:bg-tinta file:px-4 file:py-2 file:text-sm file:text-white ${borda("pdf")}`}
          />
          {pdf && (
            <ArquivoEscolhido
              nome={pdf.name}
              aoTrocar={() => {
                setPdf(null);
                if (pdfRef.current) pdfRef.current.value = "";
              }}
            />
          )}
          <Erro id="erro-pdf" texto={erros["pdf"]} />
        </div>

        <div>
          <label htmlFor="imagens" className={rotuloCampo}>
            Imagens (opcional, até 2)
          </label>
          <p className="mt-2 text-sm font-semibold text-listel">
            Não identifique estudantes, nem nos textos das fotos. Fotos com estudante
            reconhecível só com autorização válida — veja a{" "}
            <a
              href="/regulamento#secao-6"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              seção 6 do regulamento
            </a>
            .
          </p>
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

        {imagens.length > 0 && (
          <fieldset aria-describedby={erros["origem"] ? "erro-origem" : undefined}>
            <legend className={rotuloCampo}>Origem das imagens</legend>
            <div className="mt-3 space-y-3">
              {origens.map((o) => (
                <label
                  key={o.valor}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-base text-tinta transition-colors hover:bg-neve ${
                    origem === o.valor ? "border-tinta" : borda("origem")
                  }`}
                >
                  <input
                    type="radio"
                    name="origem"
                    checked={origem === o.valor}
                    onChange={() => {
                      setOrigem(o.valor);
                      limpa("origem");
                    }}
                    className="h-5 w-5 accent-[var(--listel)]"
                  />
                  {o.rotulo}
                </label>
              ))}
            </div>
            <Erro id="erro-origem" texto={erros["origem"]} />
          </fieldset>
        )}

        {imagens.length > 0 && origem === "foto_pratica" && (
          <div>
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-base text-tinta transition-colors hover:bg-neve ${
                autorizacao ? "border-tinta" : borda("autorizacao")
              }`}
            >
              <input
                type="checkbox"
                checked={autorizacao}
                aria-invalid={!!erros["autorizacao"]}
                aria-describedby={erros["autorizacao"] ? "erro-autorizacao" : undefined}
                onChange={(e) => {
                  setAutorizacao(e.target.checked);
                  limpa("autorizacao");
                }}
                className="mt-0.5 h-5 w-5 accent-[var(--listel)]"
              />
              <span>
                As fotos não identificam estudantes, ou possuem autorização válida para publicação
                em material digital de acesso público, arquivada na escola
              </span>
            </label>
            <Erro id="erro-autorizacao" texto={erros["autorizacao"]} />
          </div>
        )}
      </Bloco>

      <Bloco titulo="Declarações">
        <div>
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-base text-tinta transition-colors hover:bg-neve ${
              decOriginalidade ? "border-tinta" : borda("originalidade")
            }`}
          >
            <input
              type="checkbox"
              checked={decOriginalidade}
              aria-invalid={!!erros["originalidade"]}
              aria-describedby={erros["originalidade"] ? "erro-originalidade" : undefined}
              onChange={(e) => {
                setDecOriginalidade(e.target.checked);
                limpa("originalidade");
              }}
              className="mt-0.5 h-5 w-5 accent-[var(--listel)]"
            />
            <span>
              Declaro que a prática relatada aconteceu de verdade, que o texto é de minha
              autoria e que tenho autorização de uso de fotografias, ilustrações e outros
              materiais de terceiros eventualmente incluídos, inclusive imagens geradas por IA
            </span>
          </label>
          <Erro id="erro-originalidade" texto={erros["originalidade"]} />
        </div>

        <div>
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-base text-tinta transition-colors hover:bg-neve ${
              decDireitosAutorais ? "border-tinta" : borda("direitosAutorais")
            }`}
          >
            <input
              type="checkbox"
              checked={decDireitosAutorais}
              aria-invalid={!!erros["direitosAutorais"]}
              aria-describedby={erros["direitosAutorais"] ? "erro-direitos-autorais" : undefined}
              onChange={(e) => {
                setDecDireitosAutorais(e.target.checked);
                limpa("direitosAutorais");
              }}
              className="mt-0.5 h-5 w-5 accent-[var(--listel)]"
            />
            <span>
              Autorizo a publicação deste relato no e-book e nos materiais do Summit, de forma
              gratuita e não exclusiva, com crédito de autoria, conforme a{" "}
              <a
                href="/regulamento#secao-14"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-listel underline underline-offset-4"
              >
                seção 14 do regulamento
              </a>
            </span>
          </label>
          <Erro id="erro-direitos-autorais" texto={erros["direitosAutorais"]} />
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
        {enviando ? "Enviando..." : "Enviar meu relato"}
      </Button>
    </form>
  );
}