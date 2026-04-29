"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Users,
  Car,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Clock,
  ChevronRight,
} from "lucide-react";
import { LeadsService } from "@/services/leads.service";
import { VehiculosService } from "@/services/vehiculos.service";
import type { Lead, Vehiculo, EstadoLead, EstadoVehiculo } from "@/lib/types";

// helpers
function formatEur(val: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val);
}
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

const estadoLabel: Record<EstadoLead, string> = {
  nuevo: "Nuevo", en_contacto: "En Contacto", visita_programada: "Visita Prog.",
  negociacion: "Negociación", ganado: "Ganado", perdido: "Perdido",
};

export default function DashboardPage() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [vehiculos, setVehiculos] = React.useState<Vehiculo[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([LeadsService.getLeads(), VehiculosService.getVehiculos()]).then(([leadsData, vehiculosData]) => {
      setLeads(leadsData);
      setVehiculos(vehiculosData);
      setLoading(false);
    });
  }, []);

  const stats = {
    totalLeads: leads.length,
    nuevoLeads: leads.filter(l => l.estado_kanban === "nuevo").length,
    mensajesNoLeidos: 0, // Simplified for now since we don't have message service hooked up yet
    ingresosPotenciales: leads.filter(l => l.estado_kanban !== "perdido").reduce((acc, lead) => acc + (lead.vehiculo_interes?.precio_venta || 0), 0),
    vehiculosDisponibles: vehiculos.filter(v => v.estado === "disponible").length,
    vehiculosTotal: vehiculos.length,
  };

  const kpis = [
    { label: "Total Leads",        value: stats.totalLeads,            icon: Users,         color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-500/10" },
    { label: "Nuevos Leads",       value: stats.nuevoLeads,            icon: Sparkles,      color: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-500/10" },
    { label: "Mensajes sin leer",  value: stats.mensajesNoLeidos,      icon: MessageSquare, color: "text-rose-600 dark:text-rose-400",    bg: "bg-rose-50 dark:bg-rose-500/10" },
    { label: "Ingreso Potencial",  value: formatEur(stats.ingresosPotenciales), icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  ];

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.actualizado_el).getTime() - new Date(a.actualizado_el).getTime())
    .slice(0, 5);

  const featuredCars = vehiculos.filter((v) => v.estado === "disponible").slice(0, 3);

  if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Greeting */}
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Buenos días, Alejandro 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Aquí tienes el resumen de hoy en <span className="font-semibold text-primary">Automóviles Luismi</span>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpis.map((kpi, i) => (
          <Card key={kpi.label} className={`animate-fade-in stagger-${i + 1} hover:shadow-md transition-shadow duration-300 border-0 shadow-sm`}>
            <CardContent className="p-4 md:p-5">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-xl ${kpi.bg}`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground/40" />
              </div>
              <div className="mt-3">
                <p className="text-2xl md:text-3xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Leads */}
        <Card className="lg:col-span-2 border-0 shadow-sm animate-fade-in">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Leads Recientes</CardTitle>
              <Link href="/kanban" className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline">
                Ver Kanban <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4">
            <div className="space-y-1">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <Avatar name={lead.nombre_cliente} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground truncate">{lead.nombre_cliente}</span>
                      <Badge variant={lead.estado_kanban as EstadoLead} className="text-[10px]">
                        {estadoLabel[lead.estado_kanban]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {lead.vehiculo_interes
                        ? `${lead.vehiculo_interes.marca} ${lead.vehiculo_interes.modelo}`
                        : "Sin vehículo asignado"
                      }
                      {lead.fuente && ` · ${lead.fuente}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {lead.vehiculo_interes && (
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatEur(lead.vehiculo_interes.precio_venta)}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 justify-end">
                      <Clock className="w-3 h-3" /> {timeAgo(lead.actualizado_el)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stock Snapshot */}
        <Card className="border-0 shadow-sm animate-fade-in">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Stock Destacado</CardTitle>
              <Link href="/vehiculos" className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline">
                Ver todo <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 space-y-3">
            {featuredCars.map((car) => (
              <div
                key={car.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center shrink-0">
                  <Car className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{car.marca} {car.modelo}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{car.año}</span>
                    <Badge variant={car.estado as EstadoVehiculo} className="text-[10px]">{car.estado}</Badge>
                  </div>
                </div>
                <p className="text-sm font-bold text-foreground">{formatEur(car.precio_venta)}</p>
              </div>
            ))}

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats.vehiculosDisponibles}</p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">Disponibles</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-100 dark:bg-slate-500/10">
                <p className="text-lg font-bold text-foreground">{stats.vehiculosTotal}</p>
                <p className="text-[10px] text-muted-foreground font-medium">Total Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline bar */}
      <Card className="border-0 shadow-sm animate-fade-in">
        <CardContent className="p-4 md:p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Pipeline de Ventas</h3>
          <div className="flex rounded-xl overflow-hidden h-8">
            {[
              { status: "nuevo" as const, color: "bg-blue-500", count: leads.filter(l => l.estado_kanban === "nuevo").length },
              { status: "en_contacto" as const, color: "bg-amber-500", count: leads.filter(l => l.estado_kanban === "en_contacto").length },
              { status: "visita_programada" as const, color: "bg-cyan-500", count: leads.filter(l => l.estado_kanban === "visita_programada").length },
              { status: "negociacion" as const, color: "bg-purple-500", count: leads.filter(l => l.estado_kanban === "negociacion").length },
              { status: "ganado" as const, color: "bg-emerald-500", count: leads.filter(l => l.estado_kanban === "ganado").length },
              { status: "perdido" as const, color: "bg-rose-400", count: leads.filter(l => l.estado_kanban === "perdido").length },
            ].filter(s => s.count > 0).map((stage) => (
              <div
                key={stage.status}
                className={`${stage.color} flex items-center justify-center text-white text-xs font-semibold transition-all duration-500`}
                style={{ width: `${(stage.count / Math.max(1, leads.length)) * 100}%` }}
                title={`${estadoLabel[stage.status]}: ${stage.count}`}
              >
                {stage.count}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            {[
              { label: "Nuevos", color: "bg-blue-500" },
              { label: "Contacto", color: "bg-amber-500" },
              { label: "Visita", color: "bg-cyan-500" },
              { label: "Negociación", color: "bg-purple-500" },
              { label: "Ganados", color: "bg-emerald-500" },
              { label: "Perdidos", color: "bg-rose-400" },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className={`w-2 h-2 rounded-full ${l.color}`} />
                {l.label}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
