import { createServerFn } from "@tanstack/react-start";
import { apenasDigitos, cpfValido } from "@/lib/formatos";

export type CertificadoResposta =
  | { erro: "cpf_invalido" | "muitas_tentativas" | "indisponivel" }
  | { encontrado: false }
  | { encontrado: true; url: string };

export const consultarCertificado = createServerFn({ method: "POST" })
  .inputValidator((input: { cpf: string }) => ({ cpf: String(input?.cpf ?? "") }))
  .handler(async ({ data }): Promise<CertificadoResposta> => {
    const cpf = apenasDigitos(data.cpf);
    if (!cpfValido(cpf)) return { erro: "cpf_invalido" };

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { limiteConsultasExcedido } = await import("@/lib/limite-consultas.server");
      if (await limiteConsultasExcedido()) return { erro: "muitas_tentativas" };

      const { data: link, error } = await supabaseAdmin.storage
        .from("certificados")
        .createSignedUrl(`${cpf}.pdf`, 600, {
          download: "Certificado - Summit de Educacao de Arabuta.pdf",
        });

      if (error) {
        if (/not.?found/i.test(error.message)) return { encontrado: false };
        console.error("[consultarCertificado]", error);
        return { erro: "indisponivel" };
      }
      return { encontrado: true, url: link.signedUrl };
    } catch (e) {
      console.error("[consultarCertificado]", e);
      return { erro: "indisponivel" };
    }
  });
