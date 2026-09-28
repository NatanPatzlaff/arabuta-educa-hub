import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Caixa } from "@/components/admin/base";

/** Upload dos PDFs gerados por scripts/separar-certificados.py (nome = <cpf>.pdf). */
export function Certificados() {
  const [total, setTotal] = React.useState<number | null>(null);
  const [progresso, setProgresso] = React.useState("");
  const [falhas, setFalhas] = React.useState<string[]>([]);
  const [enviando, setEnviando] = React.useState(false);

  const contar = React.useCallback(async () => {
    const { data } = await supabase.storage.from("certificados").list("", { limit: 1000 });
    setTotal(data?.filter((f) => f.name.endsWith(".pdf")).length ?? null);
  }, []);

  React.useEffect(() => {
    void contar();
  }, [contar]);

  const enviar = async (evento: React.ChangeEvent<HTMLInputElement>) => {
    const arquivos = Array.from(evento.target.files ?? []);
    evento.target.value = "";
    if (!arquivos.length) return;

    setEnviando(true);
    const erros: string[] = [];
    let feitos = 0;
    for (const arquivo of arquivos) {
      if (!/^\d{11}\.pdf$/.test(arquivo.name)) {
        erros.push(`${arquivo.name}: nome deve ser o CPF (11 dígitos).pdf`);
      } else {
        const { error } = await supabase.storage
          .from("certificados")
          .upload(arquivo.name, arquivo, { upsert: true, contentType: "application/pdf" });
        if (error) erros.push(`${arquivo.name}: ${error.message}`);
      }
      feitos += 1;
      setProgresso(`${feitos} de ${arquivos.length} processados`);
    }
    setFalhas(erros);
    setEnviando(false);
    void contar();
  };

  return (
    <Caixa
      titulo="Certificados"
      acoes={
        <label className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-tinta px-4 text-sm font-semibold text-tinta transition-colors hover:bg-tinta hover:text-tinta-foreground has-[:disabled]:cursor-wait has-[:disabled]:opacity-60">
          {enviando ? "Enviando..." : "Enviar PDFs"}
          <input
            type="file"
            accept="application/pdf"
            multiple
            disabled={enviando}
            onChange={enviar}
            className="sr-only"
          />
        </label>
      }
    >
      <p className="text-sm text-tinta">
        {total === null ? "Carregando..." : `${total} certificados disponíveis para download.`}
      </p>
      <p className="mt-1 text-sm text-ferro">
        Selecione os arquivos nomeados pelo CPF (ex.: 12345678901.pdf). Reenviar o mesmo CPF
        substitui o certificado. O participante baixa em /certificado.
      </p>
      {progresso && <p className="mt-3 text-sm text-tinta">{progresso}</p>}
      {falhas.length > 0 && (
        <ul role="alert" className="mt-2 space-y-1 text-sm font-semibold text-listel">
          {falhas.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
    </Caixa>
  );
}
