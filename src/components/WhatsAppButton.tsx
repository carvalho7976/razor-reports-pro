import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageCircle, ChevronRight, Gift, RotateCcw, Bell, Users, Edit3 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const messageTemplates = [
  {
    key: "aniversario", label: "Aniversário", icon: <Gift className="h-4 w-4" />,
    getText: (nome: string) => `🎂 Feliz aniversário, ${nome}! A equipe Frizzar deseja um dia incrível pra você. Venha comemorar com a gente — temos uma surpresa especial esperando por você! 🎉`,
  },
  {
    key: "retorno", label: "Retorno", icon: <RotateCcw className="h-4 w-4" />,
    getText: (nome: string) => `Olá ${nome}! Faz um tempinho que não te vemos por aqui. 😊 Que tal agendar um horário? Estamos com novidades que você vai adorar! Agende já pelo nosso app ou responda essa mensagem.`,
  },
  {
    key: "lembrete", label: "Lembrete", icon: <Bell className="h-4 w-4" />,
    getText: (nome: string) => `Oi ${nome}, tudo bem? Passando pra lembrar do seu agendamento conosco. Qualquer dúvida ou necessidade de reagendar, é só nos avisar. Até breve! ✂️`,
  },
  {
    key: "indicacao", label: "Pedido de indicação", icon: <Users className="h-4 w-4" />,
    getText: (nome: string) => `Oi ${nome}! Que bom ter você como cliente. 💈 Se tiver um amigo que curtisse conhecer nosso trabalho, indique pra gente! Vocês dois ganham condições especiais. É só compartilhar essa mensagem! 🤝`,
  },
];

export function WhatsAppButton({ telefone, nome }: { telefone: string; nome: string }) {
  const [open, setOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const firstName = nome.split(" ")[0];

  if (!telefone) return null;

  const cleanNumber = telefone.replace(/\D/g, "");

  const sendWhatsApp = (text: string) => {
    const url = `https://wa.me/55${cleanNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setOpen(false);
    setCustomOpen(false);
    setCustomText("");
  };

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setCustomOpen(false); setCustomText(""); } }}>
      <PopoverTrigger asChild>
        <button className="p-1 rounded hover:bg-success/20 transition-colors" title="Enviar mensagem WhatsApp">
          <MessageCircle className="h-4 w-4 text-success" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="start">
        <p className="text-xs font-medium text-muted-foreground px-2 pb-1.5 truncate">Enviar para {nome}</p>
        {!customOpen ? (
          <div className="flex flex-col gap-0.5">
            {messageTemplates.map((tpl) => (
              <button
                key={tpl.key}
                onClick={() => sendWhatsApp(tpl.getText(firstName))}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors text-left w-full"
              >
                {tpl.icon}
                {tpl.label}
                <ChevronRight className="h-3 w-3 ml-auto text-muted-foreground" />
              </button>
            ))}
            <button
              onClick={() => setCustomOpen(true)}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors text-left w-full"
            >
              <Edit3 className="h-4 w-4" />
              Outro (personalizada)
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-1">
            <Textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="min-h-[80px] text-sm"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setCustomOpen(false)}>Voltar</Button>
              <Button size="sm" disabled={!customText.trim()} onClick={() => sendWhatsApp(customText)}>
                <MessageCircle className="h-3.5 w-3.5 mr-1" /> Enviar
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function ClienteLink({ nome, children }: { nome: string; children?: React.ReactNode }) {
  return (
    <a href="/clientePesquisa" className="text-primary hover:underline font-medium">
      {children || nome}
    </a>
  );
}

export function ProfissionalLink({ nome, children }: { nome: string; children?: React.ReactNode }) {
  return (
    <a href="/funcionarioPesquisa" className="text-primary hover:underline font-medium">
      {children || nome}
    </a>
  );
}
