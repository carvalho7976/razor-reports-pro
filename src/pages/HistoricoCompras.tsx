import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, TabDef, SummaryCard } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { User, CreditCard } from "lucide-react";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface CompraResumida { id: number; fornecedor: string; qtdProdutos: number; valorTotal: number; formaPagamento: string; data: string; }
interface CompraDetalhada { id: number; produto: string; fornecedor: string; quantidade: number; valorUnitario: number; valorTotal: number; data: string; }

const resumidoData: CompraResumida[] = [
  { id: 1, fornecedor: "Distribuidora Alpha", qtdProdutos: 50, valorTotal: 2500, formaPagamento: "Boleto", data: "05/04/2026" },
  { id: 2, fornecedor: "Beauty Supply", qtdProdutos: 30, valorTotal: 1800, formaPagamento: "Pix", data: "01/04/2026" },
  { id: 3, fornecedor: "Cosméticos Pro", qtdProdutos: 20, valorTotal: 950, formaPagamento: "Cartão Crédito", data: "28/03/2026" },
  { id: 4, fornecedor: "Distribuidora Alpha", qtdProdutos: 15, valorTotal: 600, formaPagamento: "Boleto", data: "20/03/2026" },
];

const detalhadoData: CompraDetalhada[] = [
  { id: 1, produto: "Pomada Modeladora", fornecedor: "Distribuidora Alpha", quantidade: 20, valorUnitario: 25, valorTotal: 500, data: "05/04/2026" },
  { id: 2, produto: "Shampoo Anticaspa", fornecedor: "Distribuidora Alpha", quantidade: 15, valorUnitario: 18, valorTotal: 270, data: "05/04/2026" },
  { id: 3, produto: "Óleo de Barba", fornecedor: "Beauty Supply", quantidade: 10, valorUnitario: 22, valorTotal: 220, data: "01/04/2026" },
  { id: 4, produto: "Condicionador", fornecedor: "Beauty Supply", quantidade: 12, valorUnitario: 15, valorTotal: 180, data: "01/04/2026" },
  { id: 5, produto: "Cera Capilar", fornecedor: "Cosméticos Pro", quantidade: 10, valorUnitario: 20, valorTotal: 200, data: "28/03/2026" },
  { id: 6, produto: "Tônico Capilar", fornecedor: "Cosméticos Pro", quantidade: 10, valorUnitario: 28, valorTotal: 280, data: "28/03/2026" },
];

export default function HistoricoCompras() {
  const [tab, setTab] = useState("resumido");

  const totalCompras = resumidoData.reduce((s, r) => s + r.valorTotal, 0);
  const totalProdutos = resumidoData.reduce((s, r) => s + r.qtdProdutos, 0);

  const summaryCards: SummaryCard[] = [
    { label: "Total em Compras", value: R$(totalCompras), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
    { label: "Produtos Comprados", value: String(totalProdutos), type: "quantity", size: "compact" },
  ];

  const columnsResumido: Column<CompraResumida>[] = [
    { key: "fornecedor", label: "Fornecedor", pinned: true },
    { key: "qtdProdutos", label: "Qtd Produtos", align: "center" },
    { key: "valorTotal", label: "Valor Total", align: "right", render: v => R$(v) },
    { key: "formaPagamento", label: "Forma Pagamento" },
    { key: "data", label: "Data" },
  ];

  const columnsDetalhado: Column<CompraDetalhada>[] = [
    { key: "produto", label: "Produto", pinned: true },
    { key: "fornecedor", label: "Fornecedor" },
    { key: "quantidade", label: "Quantidade", align: "center" },
    { key: "valorUnitario", label: "Valor Unitário", align: "right", render: v => R$(v) },
    { key: "valorTotal", label: "Valor Total", align: "right", render: v => R$(v) },
    { key: "data", label: "Data" },
  ];

  const tabs: TabDef[] = [
    { label: "Resumido", value: "resumido", color: "neutral" },
    { label: "Detalhado", value: "detalhado", color: "info" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Histórico de Compras"
        data={tab === "resumido" ? resumidoData : detalhadoData}
        columns={tab === "resumido" ? columnsResumido : columnsDetalhado}
        summaryCards={summaryCards}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        pageSize={15}
        showDateFilter={true}
        tableId="historico_compras"
      />
    </AppLayout>
  );
}
