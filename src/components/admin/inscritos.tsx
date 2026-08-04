import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Caixa, Rolagem, campoAdmin, rotuloCampo, td, th } from "@/components/admin/base";
import {
  ROTULO_FUNCAO,
  baixarCsv,
  dataHora,
  mascaraCpfExibicao,
  simNao,
} from "@/lib/admin-formatos";
import type { Database } from "@/integrations/supabase/types";

type Inscricao = Database["public"]["Tables"]["inscricoes"]["Row"];

function intencao(i: Inscricao): string {
  const partes: string[] = [];
  if (i.quer_palco) partes.push("Palco");
  if (i.quer_ebook) partes.push("E-book");
  if (i.quer_proleei) partes.push("ProLEEI");
  if (i.nao_vai_enviar) partes.push("Não vai enviar");
  return partes.length ? partes.join(", ") : "—";
}

function estadoEmail(i: Inscricao): string {
  if (i.email_confirmacao_erro) return `Erro: ${i.email_confirmacao_erro}`;
  if (i.email_confirmacao_enviado_em) return `Enviado em ${dataHora(i.email_confirmacao_enviado_em)}`;
  return "Ainda não enviado";
}

export function ListaInscritos() {
  const [linhas, setLinhas] = React.useState<Inscricao[]>([]);
  const [carregando, setCarregando] = React.useState(true);
  const [erro, setErro] = React.useState("");
  const [busca, setBusca] = React.useState("");
  const [funcao, setFuncao] = React.useState("");
  const [recentesPrimeiro, setRecentesPrimeiro] = React.useState(true);
  const [mostrarCpf, setMostrarCpf] = React.useState(false);

  React.useEffect(() => {
    let ativo = true;
    (async () => {
      const { data, error } = await supabase
        .from("inscricoes")
        .select("*")
        .order("created_at", { ascending: false });
      if (!ativo) return;
      if (error) setErro("Não conseguimos carregar a lista de inscritos.");
      else setLinhas(data ?? []);
      setCarregando(false);
    })();
    return () => {
      ativo = false;
    };
  }, []);

  const filtradas = React.useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const lista = linhas.filter((i) => {
      const escolaOk = !termo || (i.escola ?? "").toLowerCase().includes(termo);
      const funcaoOk = !funcao || i.funcao === funcao;
      return escolaOk && funcaoOk;
    });
    return [...lista].sort((a, b) => {
      const d = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return recentesPrimeiro ? d : -d;
    });
  }, [linhas, busca, funcao, recentesPrimeiro]);

  const exportar = () => {
    baixarCsv(
      "inscritos",
      [
        "Nome completo",
        "CPF",
        "Escola",
        "Função",
        "E-mail",
        "WhatsApp",
        "Palco",
        "E-book",
        "ProLEEI",
        "Não vai enviar",
        "Data da inscrição",
        "E-mail de confirmação",
      ],
      filtradas.map((i) => [
        i.nome_completo,
        mascaraCpfExibicao(i.cpf),
        i.escola,
        ROTULO_FUNCAO[i.funcao] ?? i.funcao,
        i.email,
        i.whatsapp,
        simNao(i.quer_palco),
        simNao(i.quer_ebook),
        simNao(i.quer_proleei),
        simNao(i.nao_vai_enviar),
        dataHora(i.created_at),
        estadoEmail(i),
      ]),
    );
  };

  return (
    <Caixa
      titulo="Inscritos"
      acoes={
        <>
          <Button size="sm" variant="contorno" onClick={() => setMostrarCpf((v) => !v)}>
            {mostrarCpf ? "Ocultar CPF" : "Mostrar CPF"}
          </Button>
          <Button size="sm" variant="acao" onClick={exportar} disabled={filtradas.length === 0}>
            Exportar CSV
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label htmlFor="busca-escola" className={rotuloCampo}>
            Buscar por escola
          </label>
          <input
            id="busca-escola"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Digite parte do nome da escola"
            className={campoAdmin}
          />
        </div>
        <div>
          <label htmlFor="filtro-funcao" className={rotuloCampo}>
            Função
          </label>
          <select
            id="filtro-funcao"
            value={funcao}
            onChange={(e) => setFuncao(e.target.value)}
            className={campoAdmin}
          >
            <option value="">Todas</option>
            <option value="professor">Professor(a)</option>
            <option value="gestao">Equipe gestora</option>
            <option value="outro">Outro</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ferro">
          Mostrando {filtradas.length} de {linhas.length}
        </p>
        <button
          type="button"
          onClick={() => setRecentesPrimeiro((v) => !v)}
          className="text-sm text-ferro underline underline-offset-4 hover:text-tinta"
        >
          Data da inscrição: {recentesPrimeiro ? "mais recentes primeiro" : "mais antigas primeiro"}
        </button>
      </div>

      {erro && <p className="mt-4 text-sm font-semibold text-listel">{erro}</p>}

      <div className="mt-3">
        <Rolagem>
          <thead>
            <tr>
              <th className={th}>Nome completo</th>
              {mostrarCpf && <th className={th}>CPF</th>}
              <th className={th}>Escola</th>
              <th className={th}>Função</th>
              <th className={th}>E-mail</th>
              <th className={th}>WhatsApp</th>
              <th className={th}>Relato</th>
              <th className={th}>Inscrição</th>
              <th className={th}>E-mail de confirmação</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((i) => (
              <tr key={i.id}>
                <td className={td}>{i.nome_completo}</td>
                {mostrarCpf && <td className={td}>{mascaraCpfExibicao(i.cpf)}</td>}
                <td className={td}>{i.escola}</td>
                <td className={td}>{ROTULO_FUNCAO[i.funcao] ?? i.funcao}</td>
                <td className={td}>{i.email}</td>
                <td className={td}>{i.whatsapp}</td>
                <td className={td}>{intencao(i)}</td>
                <td className={td}>{dataHora(i.created_at)}</td>
                <td className={td}>{estadoEmail(i)}</td>
              </tr>
            ))}
            {!carregando && filtradas.length === 0 && (
              <tr>
                <td className={`${td} text-ferro`} colSpan={mostrarCpf ? 9 : 8}>
                  Nenhum inscrito com esses filtros.
                </td>
              </tr>
            )}
            {carregando && (
              <tr>
                <td className={`${td} text-ferro`} colSpan={mostrarCpf ? 9 : 8}>
                  Carregando...
                </td>
              </tr>
            )}
          </tbody>
        </Rolagem>
      </div>
    </Caixa>
  );
}
