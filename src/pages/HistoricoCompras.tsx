import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { User } from "lucide-react";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Compra { id: number; cliente: string; celular: string; produto: string; quantidade: number; valor: number; formaPagamento: string; profissional: string; data: string; }

const initialData: Compra[] = [
  { id: 1, cliente: "João Silva", celular: "(41) 99123-4567", produto: "Pomada Modeladora", quantidade: 2, valor: 80, formaPagamento: "Cartão Crédito", profissional: "Carlos", data: "05/04/2026" },
  { id: 2, cliente: "Maria Santos", celular: "(41) 98765-4321", produto: "Shampoo Anticaspa", quantidade: 1, valor: 35, formaPagamento: "Pix", profissional: "Ana", data: "04/04/2026" },
  { id: 3, cliente: "Pedro Oliveira", celular: "(41) 99876-5432", produto: "Óleo de Barba", quantidade: 1, valor: 40, formaPagamento: "Dinheiro", profissional: "Carlos", data: "04/04/2026" },
  { id: 4, cliente: "Ana Costa", celular: "(41) 99654-3210", produto: "Condicionador", quantidade: 3, valor: 90, formaPagamento: "Cartão Débito", profissional: "Fernanda", data: "03/04/2026" },
  { id: 5, cliente: "Lucas Almeida", celular: "(41) 98432-1098", produto: "Cera Capilar", quantidade: 1, valor: 35, formaPagamento: "Pix", profissional: "Carlos", data: "03/04/2026" },
  { id: 6, cliente: "Carla Dias", celular: "", produto: "Tônico Capilar", quantidade: 2, valor: 80, formaPagamento: "Cartão Crédito", profissional: "Ana", data: "02/04/2026" },
];

export default function HistoricoCompras() {
  const columns: Column<Compra>[] = [
    {
      key: "cliente", label: "Cliente", pinned: true,
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <WhatsAppButton telefone={row.celular} nome={row.cliente} />
          <a href="/clientePesquisa" className="hover:underline font-medium">{v}</a>
        </div>
      ),
    },
    { key: "produto", label: "Produto" },
    { key: "quantidade", label: "Qtd", align: "center" },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    { key: "formaPagamento", label: "Forma Pagamento" },
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
    { key: "data", label: "Data" },
  ];

  return (
    <AppLayout>
      <DataTable title="Histórico de Compras" data={initialData} columns={columns} pageSize={15} showDateFilter={true} tableId="historico_compras" />
    </AppLayout>
  );
}