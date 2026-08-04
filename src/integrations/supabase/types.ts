export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          criado_em: string
          nome: string
          user_id: string
        }
        Insert: {
          criado_em?: string
          nome: string
          user_id: string
        }
        Update: {
          criado_em?: string
          nome?: string
          user_id?: string
        }
        Relationships: []
      }
      coautores: {
        Row: {
          contribuicao: string
          cpf: string
          email: string
          id: string
          nome: string
          ordem: number
          relato_mostra_id: string
        }
        Insert: {
          contribuicao: string
          cpf: string
          email: string
          id?: string
          nome: string
          ordem: number
          relato_mostra_id: string
        }
        Update: {
          contribuicao?: string
          cpf?: string
          email?: string
          id?: string
          nome?: string
          ordem?: number
          relato_mostra_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coautores_relato_mostra_id_fkey"
            columns: ["relato_mostra_id"]
            isOneToOne: false
            referencedRelation: "relatos_mostra"
            referencedColumns: ["id"]
          },
        ]
      }
      consultas_cpf: {
        Row: {
          criado_em: string
          id: string
          ip: string
        }
        Insert: {
          criado_em?: string
          id?: string
          ip: string
        }
        Update: {
          criado_em?: string
          id?: string
          ip?: string
        }
        Relationships: []
      }
      inscricoes: {
        Row: {
          aceite_lgpd: boolean
          cpf: string
          created_at: string
          email: string
          email_confirmacao_enviado_em: string | null
          email_confirmacao_erro: string | null
          escola: string
          funcao: Database["public"]["Enums"]["funcao_inscrito"]
          id: string
          nao_vai_enviar: boolean
          nome_completo: string
          quer_ebook: boolean
          quer_palco: boolean
          quer_proleei: boolean
          whatsapp: string
        }
        Insert: {
          aceite_lgpd: boolean
          cpf: string
          created_at?: string
          email: string
          email_confirmacao_enviado_em?: string | null
          email_confirmacao_erro?: string | null
          escola: string
          funcao: Database["public"]["Enums"]["funcao_inscrito"]
          id?: string
          nao_vai_enviar?: boolean
          nome_completo: string
          quer_ebook?: boolean
          quer_palco?: boolean
          quer_proleei?: boolean
          whatsapp: string
        }
        Update: {
          aceite_lgpd?: boolean
          cpf?: string
          created_at?: string
          email?: string
          email_confirmacao_enviado_em?: string | null
          email_confirmacao_erro?: string | null
          escola?: string
          funcao?: Database["public"]["Enums"]["funcao_inscrito"]
          id?: string
          nao_vai_enviar?: boolean
          nome_completo?: string
          quer_ebook?: boolean
          quer_palco?: boolean
          quer_proleei?: boolean
          whatsapp?: string
        }
        Relationships: []
      }
      participantes_proleei: {
        Row: {
          cpf: string
          id: string
          nome_completo: string
          relato_proleei_id: string
        }
        Insert: {
          cpf: string
          id?: string
          nome_completo: string
          relato_proleei_id: string
        }
        Update: {
          cpf?: string
          id?: string
          nome_completo?: string
          relato_proleei_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participantes_proleei_relato_proleei_id_fkey"
            columns: ["relato_proleei_id"]
            isOneToOne: false
            referencedRelation: "relatos_proleei"
            referencedColumns: ["id"]
          },
        ]
      }
      presencas: {
        Row: {
          id: string
          inscricao_id: string
          periodo: Database["public"]["Enums"]["periodo_presenca"]
          registrado_em: string
        }
        Insert: {
          id?: string
          inscricao_id: string
          periodo: Database["public"]["Enums"]["periodo_presenca"]
          registrado_em?: string
        }
        Update: {
          id?: string
          inscricao_id?: string
          periodo?: Database["public"]["Enums"]["periodo_presenca"]
          registrado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "presencas_inscricao_id_fkey"
            columns: ["inscricao_id"]
            isOneToOne: false
            referencedRelation: "inscricoes"
            referencedColumns: ["id"]
          },
        ]
      }
      relatos_mostra: {
        Row: {
          arquivo_docx_path: string
          arquivo_pdf_path: string | null
          autorizacao_imagem: boolean
          categoria: Database["public"]["Enums"]["categoria_relato"]
          codigo: string
          created_at: string
          declaracao_coautoria: boolean
          declaracao_originalidade: boolean
          id: string
          imagens: string[]
          inscricao_id: string
          modo_participacao: Database["public"]["Enums"]["modo_participacao"]
          origem_imagens: Database["public"]["Enums"]["origem_imagem"] | null
          status_habilitacao: Database["public"]["Enums"]["status_habilitacao"]
          titulo: string
        }
        Insert: {
          arquivo_docx_path: string
          arquivo_pdf_path?: string | null
          autorizacao_imagem?: boolean
          categoria: Database["public"]["Enums"]["categoria_relato"]
          codigo: string
          created_at?: string
          declaracao_coautoria?: boolean
          declaracao_originalidade: boolean
          id?: string
          imagens?: string[]
          inscricao_id: string
          modo_participacao: Database["public"]["Enums"]["modo_participacao"]
          origem_imagens?: Database["public"]["Enums"]["origem_imagem"] | null
          status_habilitacao?: Database["public"]["Enums"]["status_habilitacao"]
          titulo: string
        }
        Update: {
          arquivo_docx_path?: string
          arquivo_pdf_path?: string | null
          autorizacao_imagem?: boolean
          categoria?: Database["public"]["Enums"]["categoria_relato"]
          codigo?: string
          created_at?: string
          declaracao_coautoria?: boolean
          declaracao_originalidade?: boolean
          id?: string
          imagens?: string[]
          inscricao_id?: string
          modo_participacao?: Database["public"]["Enums"]["modo_participacao"]
          origem_imagens?: Database["public"]["Enums"]["origem_imagem"] | null
          status_habilitacao?: Database["public"]["Enums"]["status_habilitacao"]
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "relatos_mostra_inscricao_id_fkey"
            columns: ["inscricao_id"]
            isOneToOne: false
            referencedRelation: "inscricoes"
            referencedColumns: ["id"]
          },
        ]
      }
      relatos_proleei: {
        Row: {
          arquivo_docx_path: string
          codigo: string
          created_at: string
          declaracao_protecao_dados: boolean
          id: string
          imagens: string[]
          inscricao_id: string
          nome_unidade: string
          titulo: string
        }
        Insert: {
          arquivo_docx_path: string
          codigo: string
          created_at?: string
          declaracao_protecao_dados: boolean
          id?: string
          imagens?: string[]
          inscricao_id: string
          nome_unidade: string
          titulo: string
        }
        Update: {
          arquivo_docx_path?: string
          codigo?: string
          created_at?: string
          declaracao_protecao_dados?: boolean
          id?: string
          imagens?: string[]
          inscricao_id?: string
          nome_unidade?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "relatos_proleei_inscricao_id_fkey"
            columns: ["inscricao_id"]
            isOneToOne: false
            referencedRelation: "inscricoes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      submeter_relato_mostra: {
        Args: {
          p_autorizacao: boolean
          p_categoria: Database["public"]["Enums"]["categoria_relato"]
          p_coautores: Json
          p_declaracao_coautoria: boolean
          p_declaracao_originalidade: boolean
          p_docx_path: string
          p_imagens: string[]
          p_inscricao_id: string
          p_modo: Database["public"]["Enums"]["modo_participacao"]
          p_origem: Database["public"]["Enums"]["origem_imagem"]
          p_pdf_path: string
          p_titulo: string
        }
        Returns: string
      }
    }
    Enums: {
      categoria_relato: "gestao" | "educacao_infantil" | "ensino_fundamental"
      funcao_inscrito: "professor" | "gestao" | "outro"
      modo_participacao: "palco" | "ebook"
      origem_imagem: "foto_pratica" | "gerada_ia"
      periodo_presenca: "manha" | "tarde"
      status_habilitacao:
        | "nao_avaliado"
        | "habilitado"
        | "pendente_correcao"
        | "inabilitado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      categoria_relato: ["gestao", "educacao_infantil", "ensino_fundamental"],
      funcao_inscrito: ["professor", "gestao", "outro"],
      modo_participacao: ["palco", "ebook"],
      origem_imagem: ["foto_pratica", "gerada_ia"],
      periodo_presenca: ["manha", "tarde"],
      status_habilitacao: [
        "nao_avaliado",
        "habilitado",
        "pendente_correcao",
        "inabilitado",
      ],
    },
  },
} as const
