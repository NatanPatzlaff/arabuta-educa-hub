import { getRequest } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/** Registra a consulta por CPF e diz se o IP passou de 10 consultas em 15 min. */
export async function limiteConsultasExcedido(): Promise<boolean> {
  const cabecalhos = getRequest().headers;
  const ip = (
    cabecalhos.get("cf-connecting-ip") ||
    cabecalhos.get("x-forwarded-for")?.split(",")[0] ||
    cabecalhos.get("x-real-ip") ||
    "desconhecido"
  ).trim();

  await supabaseAdmin.from("consultas_cpf").insert({ ip });
  const desde = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const { count } = await supabaseAdmin
    .from("consultas_cpf")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("criado_em", desde);
  return (count ?? 0) > 10;
}
