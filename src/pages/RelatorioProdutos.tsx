import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard } from "@/components/DataTable";
import { CreditCard } from "lucide-react";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Produto { id: number; nome: string; categoria: string; quantidade: number; valor: number; vendaExtra: number; desconto: number; data: string; }

const initialData: Produto[] = [
  { id: 1, nome: "Pomada Modeladora", categoria: "Finalizadores", quantidade: 30, valor: 1200, vendaExtra: 200, desconto: 50, data: "05/04/2026" },
  { id: 2, nome: "Shampoo Anticaspa", categoria: "Shampoos", quantidade: 25, valor: 875, vendaExtra: 100, desconto: 30, data: "05/04/2026" },
  { id: 3, nome: "Óleo de Barba", categoria: "Barba", quantidade: 18, valor: 720, vendaExtra: 150, desconto: 40, data: "05/04/2026" },
  { id: 4, nome: "Condicionador", categoria: "Condicionadores", quantidade: 20, valor: 600, vendaExtra: 80, desconto: 20, data: "05/04/2026" },
  { id: 5, nome: "Cera Capilar", categoria: "Finalizadores", quantidade: 15, valor: 525, vendaExtra: 60, desconto: 25, data: "05/04/2026" },
  { id: 6, nome: "Tônico Capilar", categoria: "Tratamento", quantidade: 12, valor: 480, vendaExtra: 0, desconto: 15, data: "05/04/2026" },
];

export default function RelatorioProdutos() {
  const summaryCards: SummaryCard[] = [
    { label: "Valor Total", value: R$(initialData.reduce((s, r) => s + r.valor, 0)), icon: <CreditCard className="h-4 w-4" /> },
    { label: "Venda Extra", value: R$(initialData.reduce((s, r) => s + r.vendaExtra, 0)), icon: <CreditCard className="h-4 w-4" /> },
    { label: "Desconto", value: R$(initialData.reduce((s, r) => s + r.desconto, 0)), icon: <CreditCard className="h-4 w-4" /> },
    { label: "Total", value: String(initialData.reduce((s, r) => s + r.quantidade, 0)), type: "quantity" },
  ];

  const columns: Column<Produto>[] = [
    { key: "nome", label: "Produto", pinned: true },
    { key: "categoria", label: "Categoria" },
    { key: "quantidade", label: "Qtd", align: "center" },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    { key: "vendaExtra", label: "Venda Extra", align: "right", render: v => R$(v) },
    { key: "desconto", label: "Desconto", align: "right", render: v => R$(v) },
    { key: "data", label: "Data" },
  ];

  return (
    <AppLayout>
      <DataTable title="Relatório de Produtos" data={initialData} columns={columns} summaryCards={summaryCards} pageSize={15} showDateFilter={true} tableId="relatorio_produtos" />
    </AppLayout>
  );
}
