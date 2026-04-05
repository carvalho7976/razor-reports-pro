import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard } from "@/components/DataTable";
import { User, CreditCard } from "lucide-react";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Servico { id: number; nome: string; profissional: string; quantidade: number; valor: number; vendaExtra: number; desconto: number; data: string; }

const initialData: Servico[] = [
  { id: 1, nome: "Corte Masculino", profissional: "Carlos", quantidade: 45, valor: 2250, vendaExtra: 150, desconto: 80, data: "05/04/2026" },
  { id: 2, nome: "Escova", profissional: "Ana", quantidade: 30, valor: 2400, vendaExtra: 200, desconto: 120, data: "05/04/2026" },
  { id: 3, nome: "Barba", profissional: "Carlos", quantidade: 38, valor: 1330, vendaExtra: 0, desconto: 50, data: "05/04/2026" },
  { id: 4, nome: "Coloração", profissional: "Fernanda", quantidade: 15, valor: 3000, vendaExtra: 500, desconto: 200, data: "05/04/2026" },
  { id: 5, nome: "Hidratação", profissional: "Ana", quantidade: 20, valor: 2400, vendaExtra: 300, desconto: 100, data: "05/04/2026" },
  { id: 6, nome: "Manicure", profissional: "Fernanda", quantidade: 25, valor: 1250, vendaExtra: 100, desconto: 60, data: "05/04/2026" },
];

export default function RelatorioServicos() {
  const summaryCards: SummaryCard[] = [
    { label: "Valor Total", value: R$(initialData.reduce((s, r) => s + r.valor, 0)), icon: <CreditCard className="h-4 w-4" /> },
    { label: "Venda Extra", value: R$(initialData.reduce((s, r) => s + r.vendaExtra, 0)), icon: <CreditCard className="h-4 w-4" /> },
    { label: "Desconto", value: R$(initialData.reduce((s, r) => s + r.desconto, 0)), icon: <CreditCard className="h-4 w-4" /> },
    { label: "Total", value: String(initialData.reduce((s, r) => s + r.quantidade, 0)), type: "quantity" },
  ];

  const columns: Column<Servico>[] = [
    { key: "nome", label: "Serviço", pinned: true },
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
    { key: "quantidade", label: "Qtd", align: "center" },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    { key: "vendaExtra", label: "Venda Extra", align: "right", render: v => R$(v) },
    { key: "desconto", label: "Desconto", align: "right", render: v => R$(v) },
    { key: "data", label: "Data" },
  ];

  return (
    <AppLayout>
      <DataTable title="Relatório de Serviços" data={initialData} columns={columns} summaryCards={summaryCards} pageSize={15} showDateFilter={true} tableId="relatorio_servicos" />
    </AppLayout>
  );
}