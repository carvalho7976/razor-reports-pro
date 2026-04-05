import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard } from "@/components/DataTable";
import { CreditCard } from "lucide-react";

interface Pacote {
  id: number;
  nome: string;
  cliente: string;
  totalVendido: number;
  valor: number;
  dataVenda: string;
  profissional: string;
}

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const initialData: Pacote[] = [
  { id: 1, nome: "Pacote Barba + Corte 4x", cliente: "João Silva", totalVendido: 4, valor: 160, dataVenda: "01/03/2026", profissional: "Carlos" },
  { id: 2, nome: "Pacote Hidratação 3x", cliente: "Maria Santos", totalVendido: 3, valor: 270, dataVenda: "15/02/2026", profissional: "Ana" },
  { id: 3, nome: "Pacote Corte 5x", cliente: "Pedro Oliveira", totalVendido: 5, valor: 200, dataVenda: "10/03/2026", profissional: "Carlos" },
  { id: 4, nome: "Pacote Coloração 2x", cliente: "Ana Costa", totalVendido: 2, valor: 350, dataVenda: "20/02/2026", profissional: "Fernanda" },
  { id: 5, nome: "Pacote Barba + Corte 4x", cliente: "Lucas Almeida", totalVendido: 4, valor: 160, dataVenda: "05/03/2026", profissional: "Carlos" },
];

export default function RelatorioPacotes() {
  const totalPacotes = initialData.length;
  const valorTotal = initialData.reduce((s, r) => s + r.valor, 0);

  const summaryCards: SummaryCard[] = [
    { label: "Total", value: String(totalPacotes), type: "quantity" },
    { label: "Valor Total", value: R$(valorTotal), icon: <CreditCard className="h-4 w-4" /> },
  ];

  const columns: Column<Pacote>[] = [
    { key: "nome", label: "Pacote", pinned: true },
    { key: "cliente", label: "Cliente" },
    { key: "profissional", label: "Profissional" },
    { key: "totalVendido", label: "Total Vendido", align: "center" },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    { key: "dataVenda", label: "Data Venda" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Relatório de Pacotes"
        data={initialData}
        columns={columns}
        summaryCards={summaryCards}
        pageSize={15}
      />
    </AppLayout>
  );
}
