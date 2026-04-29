import { Mensaje } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export const MensajesService = {
  async getMensajesPorLead(leadId: string): Promise<Mensaje[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("mensajes")
      .select("*")
      .eq("lead_id", leadId)
      .order("creado_el", { ascending: true });
      
    if (error) throw error;
    return data as Mensaje[];
  },

  async enviarMensaje(mensaje: Partial<Mensaje>): Promise<Mensaje> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("mensajes")
      .insert([mensaje])
      .select()
      .single();
      
    if (error) throw error;
    return data as Mensaje;
  }
};
