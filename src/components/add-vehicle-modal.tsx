"use client";

import React, { useState, useRef } from "react";
import { X, Upload, Car, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { EstadoVehiculo } from "@/lib/types";

interface AddVehicleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddVehicleModal({ open, onClose, onSuccess }: AddVehicleModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const marca = formData.get("marca") as string;
    const modelo = formData.get("modelo") as string;
    const año = parseInt(formData.get("año") as string);
    const precio_venta = parseFloat(formData.get("precio_venta") as string);
    const precio_oferta = formData.get("precio_oferta") as string;
    const estado = formData.get("estado") as EstadoVehiculo;
    const vin = formData.get("vin") as string;
    const km = formData.get("km") as string;
    const combustible = formData.get("combustible") as string;
    const transmision = formData.get("transmision") as string;
    const color = formData.get("color") as string;
    const imagen_url = formData.get("imagen_url") as string;

    const detalles_extras: Record<string, unknown> = {};
    if (km) detalles_extras.km = parseInt(km);
    if (combustible) detalles_extras.combustible = combustible;
    if (transmision) detalles_extras.transmision = transmision;
    if (color) detalles_extras.color = color;

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("vehiculos").insert({
        marca,
        modelo,
        año,
        precio_venta,
        precio_oferta: precio_oferta ? parseFloat(precio_oferta) : null,
        estado,
        vin: vin || null,
        imagen_url: imagen_url || null,
        detalles_extras,
      });

      if (insertError) throw insertError;

      formRef.current?.reset();
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Error insertando vehículo:", err);
      setError(err instanceof Error ? err.message : "Error al guardar el vehículo");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl animate-scale-in scrollbar-thin">
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Añadir Vehículo</h2>
              <p className="text-xs text-muted-foreground">Registra un nuevo coche en el catálogo</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-sm text-rose-500 bg-rose-500/10 rounded-lg border border-rose-500/20 text-center font-medium">
              {error}
            </div>
          )}

          {/* Marca y Modelo */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Marca *</label>
              <input name="marca" required placeholder="Ej: BMW" className="flex h-10 w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 placeholder:text-muted-foreground/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Modelo *</label>
              <input name="modelo" required placeholder="Ej: X2 xDrive25e" className="flex h-10 w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 placeholder:text-muted-foreground/50" />
            </div>
          </div>

          {/* Año y Estado */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Año *</label>
              <input name="año" type="number" required min="1990" max="2030" placeholder="2024" className="flex h-10 w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 placeholder:text-muted-foreground/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</label>
              <select name="estado" defaultValue="disponible" className="flex h-10 w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1">
                <option value="disponible">Disponible</option>
                <option value="reservado">Reservado</option>
                <option value="vendido">Vendido</option>
                <option value="importando">Importando</option>
              </select>
            </div>
          </div>

          {/* Precios */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Precio venta (€) *</label>
              <input name="precio_venta" type="number" required min="0" step="100" placeholder="30900" className="flex h-10 w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 placeholder:text-muted-foreground/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Precio coste (€)</label>
              <input name="precio_oferta" type="number" min="0" step="100" placeholder="Opcional" className="flex h-10 w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 placeholder:text-muted-foreground/50" />
            </div>
          </div>

          {/* Detalles técnicos */}
          <div className="pt-2 border-t border-border/40">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Detalles técnicos</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">Kilómetros</label>
                <input name="km" type="number" min="0" placeholder="19124" className="flex h-10 w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 placeholder:text-muted-foreground/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">Combustible</label>
                <select name="combustible" defaultValue="" className="flex h-10 w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1">
                  <option value="">Seleccionar</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diésel">Diésel</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Híbrido enchufable">Híbrido enchufable</option>
                  <option value="Eléctrico">Eléctrico</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">Transmisión</label>
                <select name="transmision" defaultValue="" className="flex h-10 w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1">
                  <option value="">Seleccionar</option>
                  <option value="Manual">Manual</option>
                  <option value="Automático">Automático</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">Color</label>
                <input name="color" placeholder="Ej: Negro" className="flex h-10 w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 placeholder:text-muted-foreground/50" />
              </div>
            </div>
          </div>

          {/* VIN e Imagen */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">VIN / Bastidor</label>
              <input name="vin" placeholder="Opcional" className="flex h-10 w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 placeholder:text-muted-foreground/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">URL Imagen</label>
              <input name="imagen_url" placeholder="https://..." className="flex h-10 w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 placeholder:text-muted-foreground/50" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {loading ? "Guardando..." : "Guardar Vehículo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
