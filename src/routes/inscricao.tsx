import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FolhaDivisor } from "@/components/site/graficos";
import {
  apenasDigitos,
  cpfValido,
  emailValido,
  mascaraCPF,
  mascaraTelefone,
} from "@/lib/formatos";

const WHATS_ORG = "(49) 99927-1442";

const MSG = {
  nome: "Escreva seu nome completo.",
  cpf: "Esse CPF não parece válido. Confira os números.",
  cpfDuplicado: `Esse CPF já está inscrito no Summit. Se precisar alterar alguma informação, fale com a organização pelo WhatsApp ${WHATS_ORG}.`,
  email: "Parece que o e-mail está incompleto.",
  whatsapp: "Falta algum número no WhatsApp. Confira o DDD.",
  escola: "Diga onde você trabalha.",
  funcao: "Escolha uma opção.",
  relato: "Escolha pelo menos uma opção. Se não pretende enviar relato, marque a última.",
  lgpd: "Para concluir a inscrição, é preciso aceitar a política de privacidade.",
  inesperado: `Não conseguimos salvar sua inscrição agora. Tente de novo em instantes ou fale com a organização pelo WhatsApp ${WHATS_ORG}.`,
};

type Funcao = "professor" | "gestao" | "outro";

const funcoes: { valor: Funcao; rotulo: string }[] = [
  { valor: "professor", rotulo: "Professor(a)" },
  { valor: "gestao", rotulo: "Equipe gestora" },
  { valor: "outro", rotulo: "Outro profissional" },
];

type CampoErro =
  | "nome"
  | "cpf"
  | "email"
  | "whatsapp"
  | "escola"
  | "funcao"
  | "relato"
  | "lgpd";

const rotuloCampo = "block text-sm font-semibold text-tinta";
const campoBase =
  "mt-2 h-14 w-full rounded-xl border bg-background px-4 text-base text-tinta outline-none transition-colors placeholder:text-ferro focus:border-tinta";

function Erro({ texto, id }: { texto?: string; id: string }) {
  if (!texto) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-sm font-semibold text-listel">
      {texto}
    </p>
  );
}

function FormularioInscricao({
  onSucesso,
}: {
  onSucesso: (dados: {
    nome: string;
    quer_palco: boolean;
    quer_ebook: boolean;
    quer_proleei: boolean;
    nao_vai_enviar: boolean;
  }) => void;
}) {
  const [nome, setNome] = React.useState("");
  const [cpf, setCpf] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [whatsapp, setWhatsapp] = React.useState("");
  const [escola, setEscola] = React.useState("");
  const [funcao, setFuncao] = React.useState<Funcao | "">("");
  const [palco, setPalco] = React.useState(false);
  const [ebook, setEbook] = React.useState(false);
  const [proleei, setProleei] = React.useState(false);
  const [naoEnvia, setNaoEnvia] = React.useState(false);
  const [lgpd, setLgpd] = React.useState(false);

  const [erros, setErros] = React.useState<Partial<Record<CampoErro, string>>>({});
  const [enviando, setEnviando] = React.useState(false);
  const [erroGeral, setErroGeral] = React.useState("");

  const refs = React.useRef<Partial<Record<CampoErro, HTMLElement | null>>>({});

  const validaCampo = (campo: CampoErro, estado?: Partial<{ palco: boolean; ebook: boolean; proleei: boolean; naoEnvia: boolean }>): string | undefined => {
    const p = estado?.palco ?? palco;
    const e = estado?.ebook ?? ebook;
    const pr = estado?.proleei ?? proleei;
    const n = estado?.naoEnvia ?? naoEnvia;
    switch (campo) {
      case "nome":
        return nome.trim().length >= 2 ? undefined : MSG.nome;
      case "cpf":
        return cpfValido(cpf) ? undefined : MSG.cpf;
      case "email":
        return emailValido(email) ? undefined : MSG.email;
      case "whatsapp":
        return apenasDigitos(whatsapp).length >= 10 ? undefined : MSG.whatsapp;
      case "escola":
        return escola.trim().length >= 2 ? undefined : MSG.escola;
      case "funcao":
        return funcao ? undefined : MSG.funcao;
      case "relato":
        return p || e || pr || n ? undefined : MSG.relato;
      case "lgpd":
        return lgpd ? undefined : MSG.lgpd;
    }
  };

  const aoSair = (campo: CampoErro) =>
    setErros((atual) => ({ ...atual, [campo]: validaCampo(campo) }));

  // Regras de marcação do item 7
  const marcarPalco = (v: boolean) => {
    setPalco(v);
    if (v) {
      setEbook(false);
      setNaoEnvia(false);
    }
    setErros((a) => ({ ...a, relato: undefined }));
  };
  const marcarEbook = (v: boolean) => {
    setEbook(v);
    if (v) {
      setPalco(false);
      setNaoEnvia(false);
    }
    setErros((a) => ({ ...a, relato: undefined }));
  };
  const marcarProleei = (v: boolean) => {
    setProleei(v);
    if (v) setNaoEnvia(false);
    setErros((a) => ({ ...a, relato: undefined }));
  };
  const marcarNaoEnvia = (v: boolean) => {
    setNaoEnvia(v);
    if (v) {
      setPalco(false);
      setEbook(false);
      setProleei(false);
    }
    setErros((a) => ({ ...a, relato: undefined }));
  };

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErroGeral("");

    const ordem: CampoErro[] = [
      "nome",
      "cpf",
      "email",
      "whatsapp",
      "escola",
      "funcao",
      "relato",
      "lgpd",
    ];
    const novos: Partial<Record<CampoErro, string>> = {};
    for (const campo of ordem) {
      const msg = validaCampo(campo);
      if (msg) novos[campo] = msg;
    }
    setErros(novos);

    const primeiro = ordem.find((c) => novos[c]);
    if (primeiro) {
      refs.current[primeiro]?.scrollIntoView({ behavior: "smooth", block: "center" });
      (refs.current[primeiro] as HTMLInputElement | null)?.focus?.({ preventScroll: true });
      return;
    }

    setEnviando(true);
    const { error } = await supabase.from("inscricoes").insert({
      nome_completo: nome.trim(),
      cpf: apenasDigitos(cpf),
      email: email.trim(),
      whatsapp: apenasDigitos(whatsapp),
      escola: escola.trim(),
      funcao: funcao as Funcao,
      quer_palco: palco,
      quer_ebook: ebook,
      quer_proleei: proleei,
      nao_vai_enviar: naoEnvia,
      aceite_lgpd: lgpd,
    });
    setEnviando(false);

    if (error) {
      if (error.code === "23505") {
        setErros((a) => ({ ...a, cpf: MSG.cpfDuplicado }));
        refs.current.cpf?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      setErroGeral(MSG.inesperado);
      return;
    }

    // TODO(próximo passo): disparar aqui o e-mail de confirmação da inscrição.
    onSucesso({
      nome: nome.trim(),
      quer_palco: palco,
      quer_ebook: ebook,
      quer_proleei: proleei,
      nao_vai_enviar: naoEnvia,
    });
  };

  const borda = (campo: CampoErro) => (erros[campo] ? "border-listel" : "border-cinza");

  return (
    <form noValidate onSubmit={enviar} className="space-y-7">
      {/* 1. Nome */}
      <div>
        <label htmlFor="nome" className={rotuloCampo}>
          Nome completo
        </label>
        <input
          id="nome"
          ref={(el) => { refs.current.nome = el; }}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onBlur={() => aoSair("nome")}
          autoComplete="name"
          aria-invalid={!!erros.nome}
          className={`${campoBase} ${borda("nome")}`}
        />
        <Erro id="erro-nome" texto={erros.nome} />
      </div>

      {/* 2. CPF */}
      <div>
        <label htmlFor="cpf" className={rotuloCampo}>
          CPF
        </label>
        <input
          id="cpf"
          ref={(el) => { refs.current.cpf = el; }}
          value={cpf}
          inputMode="numeric"
          placeholder="000.000.000-00"
          onChange={(e) => setCpf(mascaraCPF(e.target.value))}
          onBlur={() => aoSair("cpf")}
          aria-invalid={!!erros.cpf}
          className={`${campoBase} ${borda("cpf")}`}
        />
        <p className="mt-2 text-sm text-ferro">
          O CPF é usado apenas para emitir o seu certificado. Ele não aparece no e-book nem em
          nenhum material público.
        </p>
        <Erro id="erro-cpf" texto={erros.cpf} />
      </div>

      {/* 3. E-mail */}
      <div>
        <label htmlFor="email" className={rotuloCampo}>
          E-mail
        </label>
        <input
          id="email"
          type="email"
          ref={(el) => { refs.current.email = el; }}
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => aoSair("email")}
          aria-invalid={!!erros.email}
          className={`${campoBase} ${borda("email")}`}
        />
        <Erro id="erro-email" texto={erros.email} />
      </div>

      {/* 4. WhatsApp */}
      <div>
        <label htmlFor="whatsapp" className={rotuloCampo}>
          WhatsApp
        </label>
        <input
          id="whatsapp"
          ref={(el) => { refs.current.whatsapp = el; }}
          value={whatsapp}
          inputMode="tel"
          placeholder="(00) 00000-0000"
          onChange={(e) => setWhatsapp(mascaraTelefone(e.target.value))}
          onBlur={() => aoSair("whatsapp")}
          aria-invalid={!!erros.whatsapp}
          className={`${campoBase} ${borda("whatsapp")}`}
        />
        <Erro id="erro-whatsapp" texto={erros.whatsapp} />
      </div>

      {/* 5. Escola — texto livre */}
      <div>
        <label htmlFor="escola" className={rotuloCampo}>
          Escola / local de trabalho
        </label>
        <input
          id="escola"
          ref={(el) => { refs.current.escola = el; }}
          value={escola}
          autoComplete="off"
          onChange={(e) => setEscola(e.target.value)}
          onBlur={() => aoSair("escola")}
          aria-invalid={!!erros.escola}
          className={`${campoBase} ${borda("escola")}`}
        />
        <Erro id="erro-escola" texto={erros.escola} />
      </div>

      {/* 6. Função */}
      <fieldset ref={(el) => { refs.current.funcao = el; }}>
        <legend className={rotuloCampo}>Função</legend>
        <div className="mt-3 space-y-3">
          {funcoes.map((f) => (
            <label
              key={f.valor}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-base text-tinta transition-colors hover:bg-neve ${
                funcao === f.valor ? "border-tinta" : borda("funcao")
              }`}
            >
              <input
                type="radio"
                name="funcao"
                value={f.valor}
                checked={funcao === f.valor}
                onChange={() => {
                  setFuncao(f.valor);
                  setErros((a) => ({ ...a, funcao: undefined }));
                }}
                className="h-5 w-5 accent-[var(--listel)]"
              />
              {f.rotulo}
            </label>
          ))}
        </div>
        <Erro id="erro-funcao" texto={erros.funcao} />
      </fieldset>

      {/* 7. Relato */}
      <fieldset ref={(el) => { refs.current.relato = el; }}>
        <legend className={rotuloCampo}>Vai enviar relato?</legend>
        <div className="mt-3 space-y-3">
          {[
            {
              marcado: palco,
              alterna: marcarPalco,
              rotulo: "Relato para a Mostra — quero apresentar no palco",
            },
            {
              marcado: ebook,
              alterna: marcarEbook,
              rotulo: "Relato para a Mostra — só para o e-book",
            },
            {
              marcado: proleei,
              alterna: marcarProleei,
              rotulo: "Vou participar do relato do ProLEEI",
            },
            { marcado: naoEnvia, alterna: marcarNaoEnvia, rotulo: "Não vou enviar" },
          ].map((opcao) => (
            <label
              key={opcao.rotulo}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-base text-tinta transition-colors hover:bg-neve ${
                opcao.marcado ? "border-tinta" : borda("relato")
              }`}
            >
              <input
                type="checkbox"
                checked={opcao.marcado}
                onChange={(e) => opcao.alterna(e.target.checked)}
                className="mt-0.5 h-5 w-5 accent-[var(--listel)]"
              />
              <span>{opcao.rotulo}</span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-sm text-ferro">
          Essa resposta define o que o site libera para você depois. Se mudar de ideia, procure a
          organização pelo WhatsApp {WHATS_ORG} até 23 de agosto.
        </p>
        <Erro id="erro-relato" texto={erros.relato} />
      </fieldset>

      {/* 8. LGPD */}
      <div ref={(el) => { refs.current.lgpd = el; }}>
        <label
          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-base text-tinta transition-colors hover:bg-neve ${
            lgpd ? "border-tinta" : borda("lgpd")
          }`}
        >
          <input
            type="checkbox"
            checked={lgpd}
            onChange={(e) => {
              setLgpd(e.target.checked);
              setErros((a) => ({ ...a, lgpd: undefined }));
            }}
            className="mt-0.5 h-5 w-5 accent-[var(--listel)]"
          />
          <span>
            Li e aceito a{" "}
            <a
              href="/privacidade"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-listel underline underline-offset-4"
            >
              política de privacidade
            </a>
          </span>
        </label>
        <Erro id="erro-lgpd" texto={erros.lgpd} />
      </div>

      {erroGeral && (
        <p role="alert" className="rounded-xl border border-listel bg-background p-4 text-sm font-semibold text-listel">
          {erroGeral}
        </p>
      )}

      <Button type="submit" variant="acao" size="xl" disabled={enviando} className="w-full">
        {enviando ? "Enviando..." : "Confirmar inscrição"}
      </Button>
    </form>
  );
}

function Confirmacao({
  nome,
  quer_palco,
  quer_ebook,
  quer_proleei,
  nao_vai_enviar,
}: {
  nome: string;
  quer_palco: boolean;
  quer_ebook: boolean;
  quer_proleei: boolean;
  nao_vai_enviar: boolean;
}) {
  const mostra = quer_palco || quer_ebook;

  return (
    <div>
      <h2 className="text-2xl text-tinta sm:text-3xl">Inscrição confirmada</h2>
      <p className="mt-2 text-lg font-semibold text-tinta">{nome}</p>
      <p className="medida mt-4 text-base text-ferro">
        Enviamos um e-mail de confirmação com os detalhes da sua inscrição.
      </p>

      <div className="mt-8 rounded-xl border border-cinza bg-neve p-6">
        <h3 className="text-lg text-tinta">O que você pode fazer agora</h3>

        {nao_vai_enviar && (
          <p className="mt-3 text-base text-tinta">
            Sua inscrição está garantida. Nos vemos em 8 de setembro.
          </p>
        )}

        {mostra && (
          <div className="mt-4">
            <p className="text-base text-tinta">Você já pode enviar seu relato para a Mostra</p>
            <Button asChild variant="acao" size="xl" className="mt-3">
              <Link to="/relato">Enviar relato da Mostra</Link>
            </Button>
          </div>
        )}

        {quer_proleei && (
          <div className="mt-6">
            <p className="text-base text-tinta">
              Sua unidade já pode enviar o relato institucional do ProLEEI
            </p>
            <Button asChild variant="acao" size="xl" className="mt-3">
              <Link to="/relato">Enviar relato do ProLEEI</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Button variant="contorno" size="xl" disabled className="w-full sm:w-auto">
          Baixar o Regulamento
        </Button>
        <p className="mt-2 text-sm text-ferro">Disponível em breve.</p>
      </div>
    </div>
  );
}

function PaginaInscricao() {
  const [sucesso, setSucesso] = React.useState<{
    nome: string;
    quer_palco: boolean;
    quer_ebook: boolean;
    quer_proleei: boolean;
    nao_vai_enviar: boolean;
  } | null>(null);

  return (
    <main className="bg-background section-pad">
      <div className="container-site grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <FolhaDivisor className="mb-6" />
          <h1 className="text-3xl text-tinta sm:text-4xl">Inscrição no Summit</h1>
          <p className="mt-4 text-base font-semibold text-tinta">
            8 de setembro de 2026 — Centro Educacional Esportivo e Cultural, Arabutã (SC)
          </p>
          <p className="medida mt-3 text-base text-ferro">
            A inscrição é gratuita e leva menos de dois minutos. Não é preciso criar conta nem
            senha.
          </p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="rounded-xl border border-cinza bg-card p-6 lg:p-8">
            {sucesso ? (
              <Confirmacao {...sucesso} />
            ) : (
              <FormularioInscricao onSucesso={setSucesso} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export const Route = createFileRoute("/inscricao")({
  head: () => ({
    meta: [
      { title: "Inscrição — Summit de Educação de Arabutã" },
      {
        name: "description",
        content:
          "Inscrição gratuita para o Summit de Educação de Arabutã, 8 de setembro de 2026, no Centro Educacional Esportivo e Cultural.",
      },
      { property: "og:title", content: "Inscrição — Summit de Educação de Arabutã" },
      {
        property: "og:description",
        content:
          "Inscrição gratuita para o Summit de Educação de Arabutã, 8 de setembro de 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaginaInscricao,
});
