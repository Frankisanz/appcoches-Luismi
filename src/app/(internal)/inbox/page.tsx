"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Send, Phone, MoreVertical, ShieldCheck, CheckCheck, Clock, User, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LeadsService } from "@/services/leads.service";
import { MensajesService } from "@/services/mensajes.service";
import type { Lead, Mensaje, EstadoLead } from "@/lib/types";

// Extending Lead to match the UI expectations locally
type ContactoInbox = {
  lead: Lead;
  ultimoMensaje?: Mensaje;
  mensajesNoLeidos: number;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function timeOnly(iso: string) {
  return new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

const estadoLabel: Record<EstadoLead, string> = {
  nuevo: "Nuevo", en_contacto: "En Contacto", visita_programada: "Visita Prog.",
  negociacion: "Negociación", ganado: "Ganado", perdido: "Perdido",
};

export default function InboxPage() {
  const [contactos, setContactos] = useState<ContactoInbox[]>([]);
  const [activeContact, setActiveContact] = useState<ContactoInbox | null>(null);
  const [chatMessages, setChatMessages] = useState<Mensaje[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load contacts (leads) initially
  useEffect(() => {
    let mounted = true;
    LeadsService.getLeads()
      .then(leads => {
        if(mounted) {
          const mapped = leads.map(l => ({
             lead: l,
             mensajesNoLeidos: 0
          }));
          setContactos(mapped);
          if (mapped.length > 0) setActiveContact(mapped[0]);
        }
      })
      .catch((err) => {
        console.error("Error cargando contactos:", err);
      })
      .finally(() => {
        if(mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  // Load messages when contact changes
  useEffect(() => {
    let mounted = true;
    if (activeContact) {
      MensajesService.getMensajesPorLead(activeContact.lead.id)
        .then(msgs => {
           if(mounted) setChatMessages(msgs);
        })
        .catch((err) => {
          console.error("Error cargando mensajes:", err);
        });
    }
    return () => { mounted = false; };
  }, [activeContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  if (loading) return <div className="h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"/></div>;
  if (!contactos.length) return <div className="p-8 text-center text-muted-foreground">No hay conversaciones.</div>;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeContact) return;

    try {
      // Optimistic update
      const optimisticMsg: Mensaje = {
        id: `optimistic-${Date.now()}`,
        lead_id: activeContact.lead.id,
        remitente: "agente",
        canal: "whatsapp",
        mensaje_texto: inputValue.trim(),
        leido: false,
        creado_el: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, optimisticMsg]);
      setInputValue("");

      // Actual Database insert
      await MensajesService.enviarMensaje({
        lead_id: activeContact.lead.id,
        remitente: "agente",
        canal: "whatsapp",
        mensaje_texto: optimisticMsg.mensaje_texto,
        leido: false,
      });
    } catch(e) {
      console.error("Error al enviar", e);
    }
  };

  return (
    <div className="flex h-full bg-background overflow-hidden relative">
      {/* ========== CAJA IZQUIERDA (Lista de Contactos) ========== */}
      <div
        className={cn(
          "w-full md:w-[360px] flex-shrink-0 bg-card border-r border-border flex flex-col transition-transform duration-300",
          "hidden md:flex z-10 h-full"
        )}
      >
        <div className="h-16 px-4 border-b border-border flex justify-between items-center bg-card/50 backdrop-blur-sm z-10">
          <h1 className="font-bold text-lg text-foreground">Mensajes</h1>
          <MoreVertical className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
        </div>

        <div className="p-3 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Buscar chat o vehículo..." 
              className="pl-9 bg-muted/40 border-transparent focus-visible:ring-1 focus-visible:bg-background"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {contactos.map((contact, i) => {
            const isActive = activeContact?.lead.id === contact.lead.id;
            return (
              <div 
                key={contact.lead.id}
                onClick={() => setActiveContact(contact)}
                className={cn(
                  "flex items-start p-3 cursor-pointer border-b border-border/40 transition-colors duration-200 animate-fade-in",
                  `stagger-${(i % 5) + 1}`,
                  isActive ? "bg-primary/5" : "hover:bg-muted/50"
                )}
              >
                <Avatar name={contact.lead.nombre_cliente} size="md" className="shrink-0 mt-0.5" />
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-semibold text-sm text-foreground truncate pr-2">
                       {contact.lead.nombre_cliente}
                    </span>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                       {contact.ultimoMensaje ? timeAgo(contact.ultimoMensaje.creado_el) : 'Reciente'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={cn(
                      "text-xs truncate mr-2",
                      contact.mensajesNoLeidos > 0 ? "font-semibold text-foreground" : "text-muted-foreground"
                    )}>
                      {contact.ultimoMensaje ? (
                        <>
                          {contact.ultimoMensaje.remitente === "agente" && "Tú: "}
                          {contact.ultimoMensaje.mensaje_texto}
                        </>
                      ) : "Sin mensajes"}
                    </span>
                  </div>
                  <div className="mt-1.5 flex gap-2 items-center">
                     <Badge variant={contact.lead.estado_kanban as EstadoLead} className="text-[9px] px-1.5 py-0">
                        {estadoLabel[contact.lead.estado_kanban]}
                     </Badge>
                     {contact.lead.fuente && (
                       <span className="text-[9px] text-muted-foreground bg-muted/50 px-1 rounded">{contact.lead.fuente}</span>
                     )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========== CAJA DERECHA (Chat Activo) ========== */}
      {activeContact && (
      <div className="flex-1 flex flex-col bg-[hsl(var(--chat-bg))] relative h-full">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none" />

        <div className="h-16 px-4 border-b border-border bg-card/95 backdrop-blur z-20 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3 cursor-pointer">
            <Avatar name={activeContact.lead.nombre_cliente} size="md" />
            <div>
              <h2 className="font-semibold text-sm text-foreground leading-none">{activeContact.lead.nombre_cliente}</h2>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                 <Badge variant="whatsapp" className="text-[9px] px-1 py-0 border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">WhatsApp</Badge>
                 {activeContact.lead.telefono}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <button className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"><Phone className="w-4 h-4" /></button>
             <button className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"><User className="w-4 h-4" /></button>
             <button className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"><MoreVertical className="w-4 h-4" /></button>
          </div>
        </div>

        {activeContact.lead.vehiculo_interes && (
          <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between z-10 shadow-sm">
             <div className="flex items-center gap-2">
               <Info className="w-4 h-4 text-primary" />
               <span className="text-xs text-foreground font-medium">Interesado en:</span>
               <span className="text-xs text-muted-foreground">{activeContact.lead.vehiculo_interes.marca} {activeContact.lead.vehiculo_interes.modelo}</span>
             </div>
             <span className="text-xs font-bold text-foreground">{formatEur(activeContact.lead.vehiculo_interes.precio_venta)}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10 scrollbar-thin">
           <div className="max-w-xs mx-auto bg-amber-100/50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-200/80 text-[10px] rounded-lg p-2 text-center shadow-sm flex flex-col items-center gap-1.5 animate-fade-in">
             <ShieldCheck className="w-3.5 h-3.5 opacity-80" />
             Los mensajes a este chat y las llamadas están protegidos con cifrado de extremo a extremo.
           </div>

           {chatMessages.length === 0 && (
              <div className="text-center text-xs text-muted-foreground py-8">Inicia tú la conversación.</div>
           )}

           {chatMessages.map((msg, idx) => {
             const isAgent = msg.remitente === "agente";
             const isLastInGroup = idx === chatMessages.length - 1 || chatMessages[idx + 1].remitente !== msg.remitente;
             
             return (
               <div key={msg.id} className={cn("flex flex-col animate-slide-in", isAgent ? "items-end" : "items-start")}>
                 <div className={cn(
                    "max-w-[75%] px-3 py-2 shadow-sm relative group",
                    isAgent ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border/50",
                    "rounded-2xl",
                    isAgent ? (isLastInGroup ? "rounded-br-sm" : "") : (isLastInGroup ? "rounded-bl-sm" : "")
                 )}>
                   <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">{msg.mensaje_texto}</p>
                   
                   <div className={cn(
                     "flex items-center justify-end gap-1 mt-1 -mb-1",
                     isAgent ? "text-primary-foreground/70" : "text-muted-foreground/70"
                   )}>
                     <span className="text-[9px]">{timeOnly(msg.creado_el)}</span>
                     {isAgent && <CheckCheck className={cn("w-3 h-3", msg.leido ? "text-blue-300" : "")} />}
                   </div>
                 </div>
               </div>
             )
           })}
           <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-card border-t border-border z-20">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input 
               type="text"
               placeholder="Escribe un mensaje..."
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               className="bg-muted/40 border-transparent rounded-full px-5 h-12 text-sm focus-visible:ring-1"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
      )}
    </div>
  );
}

function formatEur(val: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val);
}
