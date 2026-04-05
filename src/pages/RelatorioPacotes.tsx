import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { User, CreditCard } from "lucide-react";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Pacote { id: number; nome: string; cliente: string; celular: string; totalVendido: number; valor: number; dataVenda: string; profissional: string; }

const initialData: Pacote[] = [
  { id: 1, nome: "Pacote Barba + Corte 4x", cliente: "João Silva", celular: "(41) 99123-4567", totalVendido: 4, valor: 160, dataVenda: "01/03/2026", profissional: "Carlos" },
  { id: 2, nome: "Pacote Hidratação 3x", cliente: "Maria Santos", celular: "(41) 98765-4321", totalVendido: 3, valor: 270, dataVenda: "15/02/2026", profissional: "Ana" },
  { id: 3, nome: "Pacote Corte 5x", cliente: "Pedro Oliveira", celular: "(41) 99876-5432", totalVendido: 5, valor: 200, dataVenda: "10/03/2026", profissional: "Carlos" },
  { id: 4, nome: "Pacote Coloração 2x", cliente: "Ana Costa", celular: "(41) 99654-3210", totalVendido: 2, valor: 350, dataVenda: "20/02/2026", profissional: "Fernanda" },
  { id: 5, nome: "Pacote Barba + Corte 4x", cliente: "Lucas Almeida", celular: "(41) 98432-1098", totalVendido: 4, valor: 160, dataVenda: "05/03/2026", profissional: "Carlos" },
];

export default function RelatorioPacotes() {
  const summaryCards: SummaryCard[] = [
    { label: "Total", value: String(initialData.length), type: "quantity" },
    { label: "Valor Total", value: R$(initialData.reduce((s, r) => s + r.valor, 0)), icon: <CreditCard className="h-4 w-4" /> },
  ];

  const columns: Column<Pacote>[] = [
    { key: "nome", label: "Pacote", pinned: true },
    {
      key: "cliente", label: "Cliente",
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <WhatsAppButton telefone={row.celular} nome={row.cliente} />
          <a href="/clientePesquisa" className="hover:underline font-medium">{v}</a>
        </div>
      ),
    },
    {
      key: "profissional", label: "Profissional",
      render: (v) => (
        <div className="flex items-center gap-1.5">
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3 w-3 text-muted-foreground" />
          </div>
          <a href="/funcionarioPesquisa" className="hover:underline font-medium">{v}</a>
        </div>
      ),
    },
    { key: "totalVendido", label: "Total Vendido", align: "center" },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    { key: "dataVenda", label: "Data Venda" },
  ];

  return (
    <AppLayout>
      <DataTable title="Relatório de Pacotes" data={initialData} columns={columns} summaryCards={summaryCards} pageSize={15} showDateFilter={true} tableId="relatorio_pacotes" dateField="dataVenda" />
    </AppLayout>
  );
}