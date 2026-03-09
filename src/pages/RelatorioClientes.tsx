import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column } from "@/components/DataTable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageCircle, Phone, Mail, Send } from "lucide-react";
import { useState } from "react";

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

function PhoneCell({ celular, cliente }: { celular: string; cliente: string }) {
  const [open, setOpen] = useState(false);
  if (!celular) return <span className="text-muted-foreground text-xs">—</span>;

  const cleanNumber = celular.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/55${cleanNumber}`;
  const smsUrl = `sms:+55${cleanNumber}`;
  const telUrl = `tel:+55${cleanNumber}`;

  const options = [
    { icon: <MessageCircle className="h-4 w-4 text-green-500" />, label: "WhatsApp", href: whatsappUrl },
    { icon: <Send className="h-4 w-4 text-blue-500" />, label: "SMS", href: smsUrl },
    { icon: <Phone className="h-4 w-4 text-orange-500" />, label: "Ligar", href: telUrl },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="text-primary underline-offset-2 hover:underline cursor-pointer font-medium text-sm">
          {celular}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2" align="start">
        <p className="text-xs text-muted-foreground px-2 pb-1.5 truncate">{cliente}</p>
        <div className="flex flex-col gap-0.5">
          {options.map((opt) => (
            <a
              key={opt.label}
              href={opt.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors"
            >
              {opt.icon}
              {opt.label}
            </a>
          ))}
        </div>
      </PopoverContent>
    </Popover>
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
