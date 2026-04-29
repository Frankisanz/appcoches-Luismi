import { Vehiculo } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

/**
 * Servicio para gestionar Vehículos.
 */
export const VehiculosService = {
  async getVehiculos(): Promise<Vehiculo[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("vehiculos")
      .select("*")
      .order("creado_el", { ascending: false });
    
    if (error) throw error;
    return data as Vehiculo[];
  }
};
