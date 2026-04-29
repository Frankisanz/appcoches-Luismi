"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { GripVertical, Phone, Mail, Clock } from "lucide-react";
import { LeadsService } from "@/services/leads.service";
import { KANBAN_COLUMNS } from "@/lib/types";
import type { Lead, EstadoLead } from "@/lib/types";

function formatEur(val: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val);
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

// ─── Lead Card ────────────────────────────────────────────────────
function LeadCard({ lead, isDragging = false }: { lead: Lead; isDragging?: boolean }) {
  return (
    <Card className={`border border-border/60 shadow-sm transition-all duration-200 ${isDragging ? "shadow-xl ring-2 ring-primary/30 rotate-2 scale-105" : "hover:shadow-md"}`}>
      <CardContent className="p-3.5 space-y-2.5">
        <div className="flex items-start gap-2.5">
          <Avatar name={lead.nombre_cliente} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{lead.nombre_cliente}</p>
            {lead.vehiculo_interes && (
              <p className="text-xs text-muted-foreground truncate">
                {lead.vehiculo_interes.marca} {lead.vehiculo_interes.modelo}
              </p>
            )}
          </div>
          <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5" />
        </div>

        {lead.vehiculo_interes && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {formatEur(lead.vehiculo_interes.precio_venta)}
            </span>
            <Badge variant={lead.vehiculo_interes.estado as "disponible" | "reservado" | "vendido" | "importando"} className="text-[10px]">
              {lead.vehiculo_interes.estado}
            </Badge>
          </div>
        )}

        <div className="flex items-center gap-2 pt-1 border-t border-border/40">
          {lead.fuente && (
            <span className="text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{lead.fuente}</span>
          )}
          <span className="flex-1" />
          <div className="flex items-center gap-1.5 text-muted-foreground/60">
            {lead.telefono && <Phone className="w-3 h-3" />}
            {lead.email && <Mail className="w-3 h-3" />}
            <span className="text-[10px] flex items-center gap-0.5">
              <Clock className="w-3 h-3" /> {timeAgo(lead.actualizado_el)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Sortable Wrapper ─────────────────────────────────────────────
function SortableItem({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none mb-3">
      <LeadCard lead={lead} />
    </div>
  );
}

// ─── Kanban Page ──────────────────────────────────────────────────
export default function KanbanPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  React.useEffect(() => {
    let mounted = true;
    LeadsService.getLeads()
      .then((data) => {
        if(mounted) {
          setLeads(data);
        }
      })
      .catch((err) => {
        console.error("Error cargando leads:", err);
      })
      .finally(() => {
        if(mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const lead = leads.find((l) => l.id === event.active.id);
    setActiveLead(lead ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);
    if (!over) return;

    if (active.id !== over.id) {
      // Find if we moved it to a new column
      const activeId = active.id as string;
      const overId = over.id as string;
      
      const activeLead = leads.find((l) => l.id === activeId);
      const overColumnId = overId as EstadoLead;

      if (activeLead && activeLead.estado_kanban !== overColumnId) {
        // Optimistic update
        setLeads((items) =>
          items.map((item) =>
            item.id === activeId ? { ...item, estado_kanban: overColumnId } : item
          )
        );
        
        // Supabase update
        await LeadsService.updateLeadStatus(activeId, overColumnId);
      }
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"/></div>;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 pb-0 animate-fade-in">
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Tablero Kanban</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Arrastra para cambiar prioridades y estado de los leads.</p>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 md:p-6">
        <div className="flex gap-4 h-full min-w-max">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {KANBAN_COLUMNS.map((col) => {
              const columnLeads = leads.filter((l) => l.estado_kanban === col.id);
              return (
                <div
                  key={col.id}
                  className="w-[300px] shrink-0 flex flex-col h-full animate-fade-in"
                >
                  {/* Column Header */}
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <h2 className={`text-sm font-bold ${col.color}`}>{col.titulo}</h2>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${col.bgColor} ${col.color}`}>
                      {columnLeads.length}
                    </span>
                  </div>

                  {/* Column Body */}
                  <div className={`flex-1 rounded-2xl p-3 overflow-y-auto scrollbar-thin ${col.bgColor}`}>
                    <SortableContext items={columnLeads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                      {columnLeads.length === 0 ? (
                        <div className="flex items-center justify-center h-24 text-xs text-muted-foreground italic">
                          Sin leads
                        </div>
                      ) : (
                        columnLeads.map((lead) => (
                          <SortableItem key={lead.id} lead={lead} />
                        ))
                      )}
                    </SortableContext>
                  </div>
                </div>
              );
            })}

            {/* Drag Overlay */}
            <DragOverlay>
              {activeLead ? <LeadCard lead={activeLead} isDragging /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
