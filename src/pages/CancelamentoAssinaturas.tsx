import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard } from "@/components/DataTable";
import { CreditCard } from "lucide-react";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Cancelamento { id: number; nome: string; plano: string; motivo: string; dataCancelamento: string; valor: number; }

const initialData: Cancelamento[] = [
  { id: 1, nome: "Ricardo Ferreira", plano: "Plano Mensal", motivo: "Mudança de cidade", dataCancelamento: "01/04/2026", valor: 89.9 },
  { id: 2, nome: "Marcos Paulo", plano: "Plano Trimestral", motivo: "Insatisfação", dataCancelamento: "28/03/2026", valor: 239.9 },
  { id: 3, nome: "Felipe Souza", plano: "Plano Mensal", motivo: "Financeiro", dataCancelamento: "25/03/2026", valor: 89.9 },
  { id: 4, nome: "Gustavo Lima", plano: "Plano Semestral", motivo: "Não utiliza", dataCancelamento: "20/03/2026", valor: 449.9 },
  { id: 5, nome: "Bruno Alves", plano: "Plano Mensal", motivo: "Mudança de cidade", dataCancelamento: "15/03/2026", valor: 89.9 },
];

export default function CancelamentoAssinaturas() {
  const summaryCards: SummaryCard[] = [
    { label: "Total", value: String(initialData.length), type: "quantity" },
    { label: "Valor Total", value: R$(initialData.reduce((s, r) => s + r.valor, 0)), icon: <CreditCard className="h-4 w-4" /> },
  ];

  const columns: Column<Cancelamento>[] = [
    { key: "nome", label: "Nome", pinned: true, render: (v) => <a href="/clientePesquisa" className="text-primary hover:underline font-medium">{v}</a> },
    { key: "plano", label: "Plano" },
    { key: "motivo", label: "Motivo" },
    { key: "dataCancelamento", label: "Data Cancelamento" },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
  ];

  return (
    <AppLayout>
      <DataTable title="Cancelamento de Assinaturas" data={initialData} columns={columns} summaryCards={summaryCards} pageSize={15} showDateFilter={true} tableId="cancelamento_assinaturas" />
    </AppLayout>
  );
}
