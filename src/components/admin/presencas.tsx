import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Caixa, Rolagem, campoAdmin, rotuloCampo, td, th } from "@/components/admin/base";
import type { Database } from "@/integrations/supabase/types";

type Inscricao = Pick<
  Database["public"]["Tables"]["inscricoes"]["Row"],
  "id" | "nome_completo" | "escola"
>;
type Periodo = Database["public"]["Enums"]["periodo_presenca"];

function chave(inscricaoId: string, periodo: Periodo) {
  return `${inscricaoId}:${periodo}`;
}

export function ListaPresencas() {
  const [inscritos, setInscritos] = React.useState<Inscricao[]>([]);
  const [presentes, setPresentes] = React.useState<Set<string>>(new Set());
  const [carregando, setCarregando] = React.useState(true);
  const [erro, setErro] = React.useState("");
  const [busca, setBusca] = React.useState("");
  const [alterando, setAlterando] = React.useState<string | null>(null);

  const carregar = React.useCallback(async () => {
    setCarregando(true);
    setErro("");
    const [{ data: dInscritos, error: eInscritos }, { data: dPresencas, error: ePresencas }] =
      await Promise.all([
        supabase.from("inscricoes").select("id, nome_completo, escola").order("nome_completo"),
        supabase.from("presencas").select("inscricao_id, periodo"),
      ]);
    if (eInscritos || ePresencas) {
      setErro("Não conseguimos carregar a lista de presença.");
      setCarregando(false);
      return;
    }
    setInscritos(dInscritos ?? []);
    setPresentes(new Set((dPresencas ?? []).map((p) => chave(p.inscricao_id, p.periodo))));
    setCarregando(false);
  }, []);

  React.useEffect(() => {
    void carregar();
  }, [carregar]);

  const alternar = async (inscricaoId: string, periodo: Periodo) => {
    const k = chave(inscricaoId, periodo);
    const presente = presentes.has(k);
    setAlterando(k);
    if (presente) {
      const { error } = await supabase
        .from("presencas")
        .delete()
        .eq("inscricao_id", inscricaoId)
        .eq("periodo", periodo);
      if (!error) {
        setPresentes((atual) => {
          const novo = new Set(atual);
          novo.delete(k);
          return novo;
        });
      }
    } else {
      const { error } = await supabase
        .from("presencas")
        .insert({ inscricao_id: inscricaoId, periodo });
      if (!error) {
        setPresentes((atual) => new Set(atual).add(k));
      }
    }
    setAlterando(null);
  };

  const filtrados = React.useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return inscritos;
    return inscritos.filter(
      (i) =>
        i.nome_completo.toLowerCase().includes(termo) ||
        (i.escola ?? "").toLowerCase().includes(termo),
    );
  }, [inscritos, busca]);

  const totalManha = React.useMemo(
    () => [...presentes].filter((k) => k.endsWith(":manha")).length,
    [presentes],
  );
  const totalTarde = React.useMemo(
    () => [...presentes].filter((k) => k.endsWith(":tarde")).length,
    [presentes],
  );

  return (
    <Caixa
      titulo="Controle de presença"
      acoes={
        <Button size="sm" variant="contorno" onClick={() => void carregar()} disabled={carregando}>
          {carregando ? "Atualizando..." : "Atualizar"}
        </Button>
      }
    >
      <div>
        <label htmlFor="busca-presenca" className={rotuloCampo}>
          Buscar por nome ou escola
        </label>
        <input
          id="busca-presenca"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Digite parte do nome ou da escola"
          className={campoAdmin}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <p className="text-sm font-semibold text-ferro">
          Mostrando {filtrados.length} de {inscritos.length}
        </p>
        <p className="text-sm font-semibold text-ferro">Presentes na manhã: {totalManha}</p>
        <p className="text-sm font-semibold text-ferro">Presentes na tarde: {totalTarde}</p>
      </div>

      {erro && <p className="mt-4 text-sm font-semibold text-listel">{erro}</p>}

      <div className="mt-3">
        <Rolagem>
          <thead>
            <tr>
              <th className={th}>Nome completo</th>
              <th className={th}>Escola</th>
              <th className={th}>Manhã</th>
              <th className={th}>Tarde</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((i) => {
              const kManha = chave(i.id, "manha");
              const kTarde = chave(i.id, "tarde");
              const presenteManha = presentes.has(kManha);
              const presenteTarde = presentes.has(kTarde);
              return (
                <tr key={i.id}>
                  <td className={td}>{i.nome_completo}</td>
                  <td className={td}>{i.escola}</td>
                  <td className={td}>
                    <Button
                      size="sm"
                      variant={presenteManha ? "acao" : "contorno"}
                      disabled={alterando === kManha}
                      onClick={() => void alternar(i.id, "manha")}
                    >
                      {presenteManha ? "Presente ✓" : "Marcar presença"}
                    </Button>
                  </td>
                  <td className={td}>
                    <Button
                      size="sm"
                      variant={presenteTarde ? "acao" : "contorno"}
                      disabled={alterando === kTarde}
                      onClick={() => void alternar(i.id, "tarde")}
                    >
                      {presenteTarde ? "Presente ✓" : "Marcar presença"}
                    </Button>
                  </td>
                </tr>
              );
            })}
            {!carregando && filtrados.length === 0 && (
              <tr>
                <td className={`${td} text-ferro`} colSpan={4}>
                  Nenhum inscrito com esses filtros.
                </td>
              </tr>
            )}
            {carregando && (
              <tr>
                <td className={`${td} text-ferro`} colSpan={4}>
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
