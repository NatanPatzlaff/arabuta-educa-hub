import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { apenasDigitos, cpfValido } from "@/lib/formatos";

export type ConsultaResposta =
  | { erro: "cpf_invalido" | "muitas_tentativas" | "indisponivel" }
  | {
      encontrado: boolean;
      inscricao_id?: string;
      primeiro_nome?: string;
      nome_completo?: string;
      cpf?: string;
      pode_mostra: boolean;
      pode_proleei: boolean;
      nao_vai_enviar: boolean;
      modo_participacao_preferido?: "palco" | "ebook";
    };

const VAZIO = {
  encontrado: false,
  pode_mostra: false,
  pode_proleei: false,
  nao_vai_enviar: false,
} as const;

export const consultarInscricao = createServerFn({ method: "POST" })
  .inputValidator((input: { cpf: string }) => ({ cpf: String(input?.cpf ?? "") }))
  .handler(async ({ data }): Promise<ConsultaResposta> => {
    const cpf = apenasDigitos(data.cpf);
    if (!cpfValido(cpf)) return { erro: "cpf_invalido" };

    const cabecalhos = getRequest().headers;
    const ip = (
      cabecalhos.get("cf-connecting-ip") ||
      cabecalhos.get("x-forwarded-for")?.split(",")[0] ||
      cabecalhos.get("x-real-ip") ||
      "desconhecido"
    ).trim();

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      await supabaseAdmin.from("consultas_cpf").insert({ ip });

      const desde = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { count } = await supabaseAdmin
        .from("consultas_cpf")
        .select("id", { count: "exact", head: true })
        .eq("ip", ip)
        .gte("criado_em", desde);

      if ((count ?? 0) > 10) return { erro: "muitas_tentativas" };

      const { data: inscricao, error } = await supabaseAdmin
        .from("inscricoes")
        .select("id, nome_completo, cpf, quer_palco, quer_ebook, quer_proleei, nao_vai_enviar")
        .eq("cpf", cpf)
        .maybeSingle();

      if (error) return { erro: "indisponivel" };
      if (!inscricao) return { ...VAZIO };

      const primeiro = inscricao.nome_completo.trim().split(/\s+/)[0] ?? "";

      return {
        encontrado: true,
        inscricao_id: inscricao.id,
        primeiro_nome: primeiro,
        nome_completo: inscricao.nome_completo?.trim() || primeiro,
        cpf: inscricao.cpf,
        pode_mostra: inscricao.quer_palco || inscricao.quer_ebook,
        pode_proleei: inscricao.quer_proleei,
        nao_vai_enviar: inscricao.nao_vai_enviar,
        ...(inscricao.quer_palco
          ? { modo_participacao_preferido: "palco" as const }
          : inscricao.quer_ebook
            ? { modo_participacao_preferido: "ebook" as const }
            : {}),
      };
    } catch (e) {
      console.error("[consultarInscricao]", e);
      return { erro: "indisponivel" };
    }
  });
