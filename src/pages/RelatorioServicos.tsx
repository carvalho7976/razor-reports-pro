import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard, TabDef } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { User, CreditCard, Hash } from "lucide-react";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface ServicoResumido { id: number; nome: string; quantidade: number; valor: number; qtdVendaExtra: number; vendaExtra: number; desconto: number; data: string; }
interface ServicoDetalhado { id: number; servico: string; cliente: string; celular: string; profissional: string; valor: number; vendaExtra: number; desconto: number; data: string; }

const resumidoData: ServicoResumido[] = [
  { id: 1, nome: "Corte Masculino", quantidade: 45, valor: 2250, qtdVendaExtra: 5, vendaExtra: 150, desconto: 80, data: "05/04/2026" },
  { id: 2, nome: "Escova", quantidade: 30, valor: 2400, qtdVendaExtra: 8, vendaExtra: 200, desconto: 120, data: "05/04/2026" },
  { id: 3, nome: "Barba", quantidade: 38, valor: 1330, qtdVendaExtra: 0, vendaExtra: 0, desconto: 50, data: "05/04/2026" },
  { id: 4, nome: "Coloração", quantidade: 15, valor: 3000, qtdVendaExtra: 10, vendaExtra: 500, desconto: 200, data: "05/04/2026" },
  { id: 5, nome: "Hidratação", quantidade: 20, valor: 2400, qtdVendaExtra: 6, vendaExtra: 300, desconto: 100, data: "05/04/2026" },
  { id: 6, nome: "Manicure", quantidade: 25, valor: 1250, qtdVendaExtra: 3, vendaExtra: 100, desconto: 60, data: "05/04/2026" },
];

const detalhadoData: ServicoDetalhado[] = [
  { id: 1, servico: "Corte Masculino", cliente: "João Silva", celular: "(41) 99123-4567", profissional: "Carlos", valor: 50, vendaExtra: 10, desconto: 0, data: "05/04/2026" },
  { id: 2, servico: "Escova", cliente: "Maria Santos", celular: "(41) 98765-4321", profissional: "Ana", valor: 80, vendaExtra: 15, desconto: 10, data: "05/04/2026" },
  { id: 3, servico: "Barba", cliente: "Pedro Oliveira", celular: "(41) 99876-5432", profissional: "Carlos", valor: 35, vendaExtra: 0, desconto: 5, data: "04/04/2026" },
  { id: 4, servico: "Coloração", cliente: "Ana Costa", celular: "(41) 99654-3210", profissional: "Fernanda", valor: 200, vendaExtra: 50, desconto: 20, data: "04/04/2026" },
  { id: 5, servico: "Hidratação", cliente: "Carla Dias", celular: "", profissional: "Ana", valor: 120, vendaExtra: 30, desconto: 10, data: "03/04/2026" },
];

export default function RelatorioServicos() {
  const [tab, setTab] = useState("resumido");

  const avulsoQtd = resumidoData.reduce((s, r) => s + r.quantidade, 0);
  const avulsoValor = resumidoData.reduce((s, r) => s + r.valor, 0);
  const assinanteQtd = resumidoData.reduce((s, r) => s + r.qtdVendaExtra, 0);
  const assinanteValor = resumidoData.reduce((s, r) => s + r.vendaExtra, 0);
  const totalQtd = avulsoQtd + assinanteQtd;
  const totalValor = avulsoValor + assinanteValor;

  const summaryCards: SummaryCard[] = [
    { label: "Total Avulso e Assinantes", value: `${totalQtd} · ${R$(totalValor)}`, icon: <Hash className="h-4 w-4" />, size: "wide" },
    { label: "Venda Avulso", value: `${avulsoQtd} · ${R$(avulsoValor)}`, icon: <CreditCard className="h-4 w-4" />, size: "wide" },
    { label: "Venda Assinantes", value: `${assinanteQtd} · ${R$(assinanteValor)}`, icon: <CreditCard className="h-4 w-4" />, size: "wide" },
    { label: "Desconto", value: R$(resumidoData.reduce((s, r) => s + r.desconto, 0)), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
  ];

  const columnsResumido: Column<ServicoResumido>[] = [
    { key: "nome", label: "Serviço", pinned: true },
    { key: "quantidade", label: "Quantidade Avulso", align: "center" },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    { key: "qtdVendaExtra", label: "Quantidade Assinantes", align: "center" },
    { key: "vendaExtra", label: "Venda Assinantes", align: "right", render: v => R$(v) },
    { key: "desconto", label: "Desconto", align: "right", render: v => R$(v) },
    { key: "data", label: "Data" },
  ];

  const columnsDetalhado: Column<ServicoDetalhado>[] = [
    { key: "servico", label: "Serviço", pinned: true },
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
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <a href="/funcionarioPesquisa" className="hover:underline font-medium">{v}</a>
        </div>
      ),
    },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    { key: "vendaExtra", label: "Venda Assinantes", align: "right", render: v => R$(v) },
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
        title="Relatório de Serviços"
        data={tab === "resumido" ? resumidoData as any[] : detalhadoData as any[]}
        columns={tab === "resumido" ? columnsResumido as any : columnsDetalhado as any}
        summaryCards={summaryCards}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        pageSize={15}
        showDateFilter={true}
        tableId="relatorio_servicos"
      />
    </AppLayout>
  );
}
