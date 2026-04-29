import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  /**
   * VERIFICACIÓN DE META / WHATSAPP Cloud API
   * Facebook enviará un GET con varios query params la primera vez que configures el webhook.
   */
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook Verificado por WhatsApp");
    return new NextResponse(challenge, { status: 200 });
  } else {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
}

export async function POST(request: Request) {
  /**
   * INGESTA DE MENSAJES DE WHATSAPP
   */
  try {
    const body = await request.json();
    
    // Verificamos que sea un evento de la API de WhatsApp
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const contacts = value?.contacts;
      const messages = value?.messages;

      // Si es un mensaje entrante nuevo
      if (contacts && messages) {
        const phone = messages[0].from; // Teléfono del remitente (cliente)
        const textMessage = messages[0].text?.body;
        const contactName = contacts[0]?.profile?.name || "Desconocido";

        if (!textMessage) return NextResponse.json({ status: "ok" }, { status: 200 });

        const supabase = createClient();

        // 1. Buscamos si existe un Lead con ese teléfono
        let { data: leadData } = await supabase
          .from("leads")
          .select("id")
          .eq("telefono", phone)
          .single();

        let leadId = leadData?.id;

        // 2. Si no existe, creamos un nuevo Lead (Estado "Nuevo")
        if (!leadId) {
          const { data: newLead } = await supabase
            .from("leads")
            .insert({
              nombre_cliente: contactName,
              telefono: phone,
              estado_kanban: "nuevo",
              fuente: "WhatsApp Directo"
            })
            .select("id")
            .single();
          
          if (newLead) leadId = newLead.id;
        }

        // 3. Guardamos el mensaje en la tabla Mensajes
        if (leadId) {
          await supabase.from("mensajes").insert({
            lead_id: leadId,
            remitente: "cliente",
            canal: "whatsapp",
            mensaje_texto: textMessage,
            leido: false
          });
        }
      }
    }
    
    // WhatsApp requiere un status 200 rápido para no reenviar el webhook
    return NextResponse.json({ status: "ok" }, { status: 200 });

  } catch (error) {
    console.error("Error procesando Webhook", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
