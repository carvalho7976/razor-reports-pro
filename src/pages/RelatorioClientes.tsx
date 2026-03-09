import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column } from "@/components/DataTable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageCircle, ChevronRight, Gift, RotateCcw, Bell, Users, Edit3 } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Cliente {
  cliente: string;
  celular: string;
  qtdServicos: number;
  qtdProdutos: number;
  valorGasto: number;
  ticketMedio: number;
}

const data: Cliente[] = [
  { cliente: "CAIO CESAR DE SOUZA FERNANDES", celular: "(41) 99123-4567", qtdServicos: 9, qtdProdutos: 0, valorGasto: 380, ticketMedio: 126.67 },
  { cliente: "César", celular: "(41) 98765-4321", qtdServicos: 6, qtdProdutos: 0, valorGasto: 310, ticketMedio: 77.5 },
  { cliente: "Everton", celular: "(41) 99876-5432", qtdServicos: 3, qtdProdutos: 0, valorGasto: 215, ticketMedio: 215 },
  { cliente: "Gean", celular: "(41) 99654-3210", qtdServicos: 2, qtdProdutos: 0, valorGasto: 65, ticketMedio: 65 },
  { cliente: "Luis Alberto Santos", celular: "(41) 98432-1098", qtdServicos: 2, qtdProdutos: 2, valorGasto: 137, ticketMedio: 137 },
  { cliente: "Marlon", celular: "", qtdServicos: 2, qtdProdutos: 0, valorGasto: 150, ticketMedio: 150 },
  { cliente: "Frizzar Demonstração", celular: "(41) 99111-2233", qtdServicos: 1, qtdProdutos: 2, valorGasto: 66.55, ticketMedio: 66.55 },
];

const messageTemplates: { key: string; label: string; icon: React.ReactNode; getText: (nome: string) => string }[] = [
  {
    key: "aniversario", label: "Aniversário", icon: <Gift className="h-4 w-4" />,
    getText: (nome) => `🎂 Feliz aniversário, ${nome}! A equipe Frizzar deseja um dia incrível pra você. Venha comemorar com a gente — temos uma surpresa especial esperando por você! 🎉`,
  },
  {
    key: "retorno", label: "Retorno", icon: <RotateCcw className="h-4 w-4" />,
    getText: (nome) => `Olá ${nome}! Faz um tempinho que não te vemos por aqui. 😊 Que tal agendar um horário? Estamos com novidades que você vai adorar! Agende já pelo nosso app ou responda essa mensagem.`,
  },
  {
    key: "lembrete", label: "Lembrete", icon: <Bell className="h-4 w-4" />,
    getText: (nome) => `Oi ${nome}, tudo bem? Passando pra lembrar do seu agendamento conosco. Qualquer dúvida ou necessidade de reagendar, é só nos avisar. Até breve! ✂️`,
  },
  {
    key: "indicacao", label: "Pedido de indicação", icon: <Users className="h-4 w-4" />,
    getText: (nome) => `Oi ${nome}! Que bom ter você como cliente. 💈 Se tiver um amigo que curtisse conhecer nosso trabalho, indique pra gente! Vocês dois ganham condições especiais. É só compartilhar essa mensagem! 🤝`,
  },
];

function PhoneCell({ celular, cliente }: { celular: string; cliente: string }) {
  const [open, setOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const firstName = cliente.split(" ")[0];

  if (!celular) return <span className="text-muted-foreground text-xs">—</span>;

  const cleanNumber = celular.replace(/\D/g, "");

  const sendWhatsApp = (text: string) => {
    const url = `https://wa.me/55${cleanNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setOpen(false);
    setCustomOpen(false);
    setCustomText("");
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm">{celular}</span>
      <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setCustomOpen(false); setCustomText(""); } }}>
        <PopoverTrigger asChild>
          <button className="p-1 rounded hover:bg-accent transition-colors" title="Enviar mensagem">
            <MessageCircle className="h-4 w-4 text-green-600" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-2" align="start">
          <p className="text-xs font-medium text-muted-foreground px-2 pb-1.5 truncate">Enviar para {cliente}</p>
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
    </div>
  );
}

const columns: Column<Cliente>[] = [
  { key: "cliente", label: "Cliente", pinned: true },
  {
    key: "celular", label: "Celular",
    render: (v, row) => <PhoneCell celular={v} cliente={row.cliente} />,
  },
  { key: "qtdServicos", label: "Qtd Serviços", align: "center" },
  { key: "qtdProdutos", label: "Qtd Produtos", align: "center" },
  { key: "valorGasto", label: "Valor Gasto", align: "right", render: (v) => R$(v) },
  { key: "ticketMedio", label: "Ticket Médio", align: "right", render: (v) => R$(v) },
];

export default function RelatorioClientes() {
  return (
    <AppLayout>
      <DataTable
        title="Relatório de Clientes"
        data={data}
        columns={columns}
        summaryCards={[{ label: "Total", value: `${data.length} clientes atendidos` }]}
      />
    </AppLayout>
  );
}
