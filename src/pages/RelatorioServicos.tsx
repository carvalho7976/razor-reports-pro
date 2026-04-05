import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard } from "@/components/DataTable";
import { CreditCard } from "lucide-react";

interface Servico {
  id: number;
  nome: string;
  profissional: string;
  quantidade: number;
  valor: number;
  vendaExtra: number;
  desconto: number;
  data: string;
}

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const initialData: Servico[] = [
  { id: 1, nome: "Corte Masculino", profissional: "Carlos", quantidade: 45, valor: 2250, vendaExtra: 150, desconto: 80, data: "05/04/2026" },
  { id: 2, nome: "Escova", profissional: "Ana", quantidade: 30, valor: 2400, vendaExtra: 200, desconto: 120, data: "05/04/2026" },
  { id: 3, nome: "Barba", profissional: "Carlos", quantidade: 38, valor: 1330, vendaExtra: 0, desconto: 50, data: "05/04/2026" },
  { id: 4, nome: "Coloração", profissional: "Fernanda", quantidade: 15, valor: 3000, vendaExtra: 500, desconto: 200, data: "05/04/2026" },
  { id: 5, nome: "Hidratação", profissional: "Ana", quantidade: 20, valor: 2400, vendaExtra: 300, desconto: 100, data: "05/04/2026" },
  { id: 6, nome: "Manicure", profissional: "Fernanda", quantidade: 25, valor: 1250, vendaExtra: 100, desconto: 60, data: "05/04/2026" },
];

export default function RelatorioServicos() {
  const totalQtd = initialData.reduce((s, r) => s + r.quantidade, 0);
  const totalValor = initialData.reduce((s, r) => s + r.valor, 0);
  const totalVendaExtra = initialData.reduce((s, r) => s + r.vendaExtra, 0);
  const totalDesconto = initialData.reduce((s, r) => s + r.desconto, 0);

  const summaryCards: SummaryCard[] = [
    { label: "Valor Total", value: R$(totalValor), icon: <CreditCard className="h-4 w-4" /> },
    { label: "Venda Extra", value: R$(totalVendaExtra), icon: <CreditCard className="h-4 w-4" /> },
    { label: "Desconto", value: R$(totalDesconto), icon: <CreditCard className="h-4 w-4" /> },
    { label: "Total", value: String(totalQtd), type: "quantity" },
  ];

  const columns: Column<Servico>[] = [
    { key: "nome", label: "Serviço", pinned: true },
    { key: "profissional", label: "Profissional" },
    { key: "quantidade", label: "Qtd", align: "center" },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    { key: "vendaExtra", label: "Venda Extra", align: "right", render: v => R$(v) },
    { key: "desconto", label: "Desconto", align: "right", render: v => R$(v) },
    { key: "data", label: "Data" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Relatório de Serviços"
        data={initialData}
        columns={columns}
        summaryCards={summaryCards}
        pageSize={15}
      />
    </AppLayout>
  );
}
