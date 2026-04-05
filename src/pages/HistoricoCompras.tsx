import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column } from "@/components/DataTable";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Compra { id: number; cliente: string; produto: string; quantidade: number; valor: number; formaPagamento: string; profissional: string; data: string; }

const initialData: Compra[] = [
  { id: 1, cliente: "João Silva", produto: "Pomada Modeladora", quantidade: 2, valor: 80, formaPagamento: "Cartão Crédito", profissional: "Carlos", data: "05/04/2026" },
  { id: 2, cliente: "Maria Santos", produto: "Shampoo Anticaspa", quantidade: 1, valor: 35, formaPagamento: "Pix", profissional: "Ana", data: "04/04/2026" },
  { id: 3, cliente: "Pedro Oliveira", produto: "Óleo de Barba", quantidade: 1, valor: 40, formaPagamento: "Dinheiro", profissional: "Carlos", data: "04/04/2026" },
  { id: 4, cliente: "Ana Costa", produto: "Condicionador", quantidade: 3, valor: 90, formaPagamento: "Cartão Débito", profissional: "Fernanda", data: "03/04/2026" },
  { id: 5, cliente: "Lucas Almeida", produto: "Cera Capilar", quantidade: 1, valor: 35, formaPagamento: "Pix", profissional: "Carlos", data: "03/04/2026" },
  { id: 6, cliente: "Carla Dias", produto: "Tônico Capilar", quantidade: 2, valor: 80, formaPagamento: "Cartão Crédito", profissional: "Ana", data: "02/04/2026" },
];

export default function HistoricoCompras() {
  const columns: Column<Compra>[] = [
    { key: "cliente", label: "Cliente", pinned: true, render: (v) => <a href="/clientePesquisa" className="text-primary hover:underline font-medium">{v}</a> },
    { key: "produto", label: "Produto" },
    { key: "quantidade", label: "Qtd", align: "center" },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    { key: "formaPagamento", label: "Forma Pagamento" },
    { key: "profissional", label: "Profissional", render: (v) => <a href="/funcionarioPesquisa" className="text-primary hover:underline font-medium">{v}</a> },
    { key: "data", label: "Data" },
  ];

  return (
    <AppLayout>
      <DataTable title="Histórico de Compras" data={initialData} columns={columns} pageSize={15} showDateFilter={true} tableId="historico_compras" />
    </AppLayout>
  );
}
