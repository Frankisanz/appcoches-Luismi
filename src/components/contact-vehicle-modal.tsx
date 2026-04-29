"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, MessageCircle, Phone, Calendar, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import type { Vehiculo } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface ContactVehicleModalProps {
  vehiculo: Vehiculo | null;
  onClose: () => void;
}

export function ContactVehicleModal({ vehiculo, onClose }: ContactVehicleModalProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!vehiculo) return null;

  const whatsappNumber = "34699349377"; // Número actualizado solicitado por el usuario
  const message = `¡Hola! 👋 Estoy interesado en el ${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.año}) por ${vehiculo.precio_venta.toLocaleString()}€ que he visto en vuestra web. ¿Podríais darme más información?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const nombre = formData.get("nombre") as string;
    const telefono = formData.get("telefono") as string;

    try {
      const supabase = createClient();
      
      // Insertamos el lead en la tabla de leads para que aparezca en el Kanban
      const { error } = await supabase.from("leads").insert({
        nombre,
        telefono,
        email: "",
        origen: "Web - Catálogo",
        estado: "nuevo",
        interes_vehiculo: `${vehiculo.marca} ${vehiculo.modelo}`,
        notas: `Interesado en el coche de ${vehiculo.precio_venta}€. Cliente solicita contacto telefónico.`
      });

      if (error) throw error;
      
      setSent(true);
      setTimeout(() => {
        onClose();
        setSent(false);
      }, 3000);
    } catch (error) {
      console.error("Error al guardar lead:", error);
      alert("Hubo un error al enviar tus datos. Por favor, usa el botón de WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-background/50 hover:bg-background text-foreground z-20 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Parte izquierda: Info del coche */}
          <div className="relative h-64 md:h-auto bg-muted">
            {vehiculo.imagen_url ? (
              <Image src={vehiculo.imagen_url} alt={vehiculo.modelo} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-border">
                <span className="text-muted-foreground font-medium text-lg">Sin imagen</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white">{vehiculo.marca} {vehiculo.modelo}</h3>
              <p className="text-blue-400 font-bold text-xl">{vehiculo.precio_venta.toLocaleString()}€</p>
            </div>
          </div>

          {/* Parte derecha: CTAs */}
          <div className="p-8 space-y-8">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <div>
                  <h4 className="text-xl font-bold">¡Solicitud enviada!</h4>
                  <p className="text-muted-foreground mt-2">Un agente te contactará muy pronto.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">¿Hablamos?</h3>
                  <p className="text-sm text-muted-foreground">Elige cómo prefieres que te ayudemos con tu nuevo coche.</p>
                </div>

                <div className="space-y-4">
                  {/* WhatsApp CTA */}
                  <a 
                    href={whatsappUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-green-600/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 fill-current" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold">WhatsApp Directo</p>
                        <p className="text-xs text-white/80">Respuesta inmediata</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 opacity-50" />
                  </a>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">O te llamamos nosotros</span></div>
                  </div>

                  {/* Formulario Lead */}
                  <form onSubmit={handleLeadSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <input 
                        name="nombre" 
                        required 
                        placeholder="Tu nombre completo" 
                        className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <input 
                        name="telefono" 
                        required 
                        type="tel"
                        placeholder="Teléfono de contacto" 
                        className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Phone className="w-5 h-5" />}
                      Solicitar información
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
