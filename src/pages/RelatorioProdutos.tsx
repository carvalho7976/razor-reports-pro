import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard, TabDef } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { User, CreditCard, Hash } from "lucide-react";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface ProdutoResumido { id: number; nome: string; categoria: string; quantidade: number; valor: number; qtdVendaExtra: number; vendaExtra: number; desconto: number; data: string; }
interface ProdutoDetalhado { id: number; produto: string; cliente: string; celular: string; profissional: string; valor: number; vendaExtra: number; desconto: number; data: string; }

const resumidoData: ProdutoResumido[] = [
  { id: 1, nome: "Pomada Modeladora", categoria: "Finalizadores", quantidade: 30, valor: 1200, qtdVendaExtra: 5, vendaExtra: 200, desconto: 50, data: "05/04/2026" },
  { id: 2, nome: "Shampoo Anticaspa", categoria: "Shampoos", quantidade: 25, valor: 875, qtdVendaExtra: 3, vendaExtra: 100, desconto: 30, data: "05/04/2026" },
  { id: 3, nome: "Óleo de Barba", categoria: "Barba", quantidade: 18, valor: 720, qtdVendaExtra: 4, vendaExtra: 150, desconto: 40, data: "05/04/2026" },
  { id: 4, nome: "Condicionador", categoria: "Condicionadores", quantidade: 20, valor: 600, qtdVendaExtra: 2, vendaExtra: 80, desconto: 20, data: "05/04/2026" },
  { id: 5, nome: "Cera Capilar", categoria: "Finalizadores", quantidade: 15, valor: 525, qtdVendaExtra: 1, vendaExtra: 60, desconto: 25, data: "05/04/2026" },
  { id: 6, nome: "Tônico Capilar", categoria: "Tratamento", quantidade: 12, valor: 480, qtdVendaExtra: 0, vendaExtra: 0, desconto: 15, data: "05/04/2026" },
];

const detalhadoData: ProdutoDetalhado[] = [
  { id: 1, produto: "Pomada Modeladora", cliente: "João Silva", celular: "(41) 99123-4567", profissional: "Carlos", valor: 40, vendaExtra: 10, desconto: 0, data: "05/04/2026" },
  { id: 2, produto: "Shampoo Anticaspa", cliente: "Maria Santos", celular: "(41) 98765-4321", profissional: "Ana", valor: 35, vendaExtra: 5, desconto: 0, data: "05/04/2026" },
  { id: 3, produto: "Óleo de Barba", cliente: "Pedro Oliveira", celular: "(41) 99876-5432", profissional: "Carlos", valor: 40, vendaExtra: 10, desconto: 5, data: "04/04/2026" },
  { id: 4, produto: "Condicionador", cliente: "Ana Costa", celular: "(41) 99654-3210", profissional: "Fernanda", valor: 30, vendaExtra: 0, desconto: 0, data: "04/04/2026" },
  { id: 5, produto: "Cera Capilar", cliente: "Carla Dias", celular: "", profissional: "Ana", valor: 35, vendaExtra: 0, desconto: 5, data: "03/04/2026" },
];

export default function RelatorioProdutos() {
  const [tab, setTab] = useState("resumido");

  const totalQtd = resumidoData.reduce((s, r) => s + r.quantidade, 0) + resumidoData.reduce((s, r) => s + r.qtdVendaExtra, 0);

  const summaryCards: SummaryCard[] = [
    { label: "Total", value: String(totalQtd), type: "quantity", icon: <Hash className="h-4 w-4" />, size: "compact" },
    { label: "Valor Total", value: R$(resumidoData.reduce((s, r) => s + r.valor, 0)), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
    { label: "Venda Extra", value: R$(resumidoData.reduce((s, r) => s + r.vendaExtra, 0)), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
    { label: "Desconto", value: R$(resumidoData.reduce((s, r) => s + r.desconto, 0)), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
  ];

  const columnsResumido: Column<ProdutoResumido>[] = [
    { key: "nome", label: "Produto", pinned: true },
    { key: "categoria", label: "Categoria" },
    { key: "quantidade", label: "Quantidade", align: "center" },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    { key: "qtdVendaExtra", label: "Qtd Venda Extra", align: "center" },
    { key: "vendaExtra", label: "Venda Extra", align: "right", render: v => R$(v) },
    { key: "desconto", label: "Desconto", align: "right", render: v => R$(v) },
    { key: "data", label: "Data" },
  ];

  const columnsDetalhado: Column<ProdutoDetalhado>[] = [
    { key: "produto", label: "Produto", pinned: true },
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
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    { key: "vendaExtra", label: "Venda Extra", align: "right", render: v => R$(v) },
    { key: "desconto", label: "Desconto", align: "right", render: v => R$(v) },
    { key: "data", label: "Data" },
  ];

  const tabs: TabDef[] = [
    { label: "Resumido", value: "resumido", color: "neutral" },
    { label: "Detalhado", value: "detalhado", color: "info" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Relatório de Produtos"
        data={tab === "resumido" ? resumidoData as any[] : detalhadoData as any[]}
        columns={tab === "resumido" ? columnsResumido as any : columnsDetalhado as any}
        summaryCards={summaryCards}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        pageSize={15}
        showDateFilter={true}
        tableId="relatorio_produtos"
      />
    </AppLayout>
  );
}
