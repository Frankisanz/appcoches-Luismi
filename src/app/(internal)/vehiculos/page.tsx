"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, Settings2, ShieldCheck, MoreHorizontal, Fuel, Gauge, Cog } from "lucide-react";
import { Input } from "@/components/ui/input";
import { VehiculosService } from "@/services/vehiculos.service";
import type { Vehiculo, EstadoVehiculo } from "@/lib/types";

function formatEur(val: number | undefined) {
  if (!val) return "---";
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val);
}

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<EstadoVehiculo | "todos">("todos");

  React.useEffect(() => {
    let mounted = true;
    VehiculosService.getVehiculos()
      .then((data) => {
        if(mounted) {
          setVehiculos(data);
        }
      })
      .catch((err) => {
        console.error("Error cargando vehículos:", err);
      })
      .finally(() => {
        if(mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const filteredCars = vehiculos.filter((car) => {
    const matchesSearch = 
      car.marca.toLowerCase().includes(searchTerm.toLowerCase()) || 
      car.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.vin && car.vin.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "todos" || car.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 h-full flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Catálogo de Vehículos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestiona el stock de exportación e importación.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input 
               placeholder="Buscar marca, modelo o VIN..." 
               className="pl-9 bg-card" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtros</span>
           </button>
           <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors">
              Añadir
           </button>
        </div>
      </div>

      {/* Tabs / Quick Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin shrink-0 animate-fade-in stagger-1">
         {(["todos", "disponible", "importando", "reservado", "vendido"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === status 
                  ? "bg-foreground text-background" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
         ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-1 pb-4">
        {loading ? (
          <div className="h-40 flex flex-col items-center justify-center text-muted-foreground bg-card rounded-2xl border border-dashed border-border/60">
             <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
             <p>Cargando catálogo en tiempo real...</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-muted-foreground bg-card rounded-2xl border border-dashed border-border/60">
            <Settings2 className="w-8 h-8 mb-2 opacity-50" />
            <p>No se encontraron vehículos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredCars.map((car, i) => (
              <Card key={car.id} className={`overflow-hidden border-border/50 group animate-scale-in stagger-${(i % 6) + 1}`}>
                {/* Image Area */}
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative group-hover:opacity-90 transition-opacity">
                  {car.imagen_url ? (
                    <img src={car.imagen_url} alt={`${car.marca} ${car.modelo}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-black/5 dark:text-white/5 uppercase tracking-tighter">
                        {car.marca}
                      </span>
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant={car.estado as EstadoVehiculo} className="shadow-sm backdrop-blur-md bg-background/80">
                      {car.estado.toUpperCase()}
                    </Badge>
                  </div>
                  <button className="absolute top-3 right-3 p-1.5 bg-background/80 backdrop-blur-md rounded-md text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-full">
                      <h3 className="font-bold text-foreground leading-tight text-lg group-hover:text-primary transition-colors">
                        {car.marca} <span className="font-medium text-muted-foreground">{car.modelo}</span>
                      </h3>
                      {car.detalles_extras && typeof car.detalles_extras.slogan === "string" && (
                        <p className="text-[13px] text-muted-foreground mt-2 leading-snug line-clamp-2">
                          &ldquo;{car.detalles_extras.slogan}&rdquo;
                        </p>
                      )}
                      {/* Detail Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/60 rounded-md px-2 py-0.5">
                          <Calendar className="w-3 h-3" /> {car.año}
                        </span>
                        {car.detalles_extras && typeof car.detalles_extras.km === "number" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/60 rounded-md px-2 py-0.5">
                            <Gauge className="w-3 h-3" /> {new Intl.NumberFormat("es-ES").format(car.detalles_extras.km as number)} km
                          </span>
                        )}
                        {car.detalles_extras && typeof car.detalles_extras.combustible === "string" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/60 rounded-md px-2 py-0.5">
                            <Fuel className="w-3 h-3" /> {car.detalles_extras.combustible as string}
                          </span>
                        )}
                        {car.detalles_extras && typeof car.detalles_extras.transmision === "string" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/60 rounded-md px-2 py-0.5">
                            <Cog className="w-3 h-3" /> {car.detalles_extras.transmision as string}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/40 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Precio Venta</p>
                      <p className="font-bold text-lg text-foreground">{formatEur(car.precio_venta)}</p>
                    </div>
                    {/* Oferta Info */}
                    {car.precio_oferta && (
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center justify-end gap-1 mb-0.5">
                          <ShieldCheck className="w-3 h-3 text-emerald-500" /> Coste
                        </p>
                        <p className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                           {formatEur(car.precio_oferta)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
