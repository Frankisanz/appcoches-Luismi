import { Lead, EstadoLead } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

/**
 * Servicio para gestionar Leads.
 * Por ahora incluye mock fallback, pero está preparado para usar Supabase.
 */
export const LeadsService = {
  async getLeads(): Promise<Lead[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("leads")
      .select(`
        *,
        vehiculo_interes:vehiculos(*),
        asignado_a_usuario:usuarios(*)
      `);
    
    if (error) throw error;
    return data as Lead[];
  },

  async updateLeadStatus(id: string, newStatus: EstadoLead): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("leads")
      .update({ estado_kanban: newStatus })
      .eq("id", id);
      
    if (error) throw error;
  }
};
