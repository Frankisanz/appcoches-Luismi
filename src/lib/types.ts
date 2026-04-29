// =====================================================
// MOTOR-CRM: Tipos TypeScript (alineados con schema SQL)
// =====================================================

// --- Enums ---
export type RolUsuario = "admin" | "vendedor";
export type EstadoVehiculo = "disponible" | "reservado" | "vendido" | "importando";
export type EstadoLead = "nuevo" | "en_contacto" | "visita_programada" | "negociacion" | "ganado" | "perdido";
export type RemitenteMensaje = "cliente" | "agente" | "bot";
export type CanalMensaje = "whatsapp" | "email" | "sms";

// --- Modelos ---
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  avatar_url?: string;
  creado_el: string;
}

export interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  año: number;
  vin?: string;
  precio_oferta?: number;
  precio_venta: number;
  estado: EstadoVehiculo;
  imagen_url?: string;
  detalles_extras?: Record<string, unknown>;
  creado_el: string;
  actualizado_el: string;
}

export interface Lead {
  id: string;
  nombre_cliente: string;
  telefono?: string;
  email?: string;
  estado_kanban: EstadoLead;
  vehiculo_interes_id?: string;
  vehiculo_interes?: Vehiculo; // join
  asignado_a?: string;
  asignado_a_usuario?: Usuario; // join
  fuente?: string;
  creado_el: string;
  actualizado_el: string;
}

export interface Mensaje {
  id: string;
  lead_id: string;
  remitente: RemitenteMensaje;
  canal: CanalMensaje;
  mensaje_texto?: string;
  media_url?: string;
  leido: boolean;
  creado_el: string;
}

// --- UI Helpers ---
export interface ContactoInbox {
  lead: Lead;
  ultimoMensaje: Mensaje;
  mensajesNoLeidos: number;
}

export const KANBAN_COLUMNS: { id: EstadoLead; titulo: string; color: string; bgColor: string }[] = [
  { id: "nuevo",             titulo: "Nuevos",           color: "text-blue-700 dark:text-blue-300",    bgColor: "bg-blue-50 dark:bg-blue-950/40" },
  { id: "en_contacto",       titulo: "En Contacto",      color: "text-amber-700 dark:text-amber-300",  bgColor: "bg-amber-50 dark:bg-amber-950/40" },
  { id: "visita_programada", titulo: "Visita Prog.",      color: "text-cyan-700 dark:text-cyan-300",    bgColor: "bg-cyan-50 dark:bg-cyan-950/40" },
  { id: "negociacion",       titulo: "Negociación",       color: "text-purple-700 dark:text-purple-300",bgColor: "bg-purple-50 dark:bg-purple-950/40" },
  { id: "ganado",            titulo: "Ganados",           color: "text-emerald-700 dark:text-emerald-300",bgColor: "bg-emerald-50 dark:bg-emerald-950/40" },
  { id: "perdido",           titulo: "Perdidos",          color: "text-rose-700 dark:text-rose-300",    bgColor: "bg-rose-50 dark:bg-rose-950/40" },
];
