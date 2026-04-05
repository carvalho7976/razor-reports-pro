import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard, TabDef } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { User, CreditCard } from "lucide-react";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface RelProf {
  profissional: string;
  funcao: string;
  totalServicos: number;
  qtdServicos: number;
  ticketMedio: number;
  clientesAtendidos: number;
  tempoTrabalhado: string;
  totalProdutos: number;
  qtdProdutos: number;
  qtdVendaExtra: number;
  vendaExtra: number;
  totalAberto: number;
}

interface ProfDetalhado {
  id: number;
  profissional: string;
  servico: string;
  cliente: string;
  celular: string;
  valor: number;
  vendaExtra: number;
  data: string;
}

const resumidoData: RelProf[] = [
  { profissional: "Cesar", funcao: "Gerente", totalServicos: 895, qtdServicos: 16, ticketMedio: 55.94, clientesAtendidos: 7, tempoTrabalhado: "575 min", totalProdutos: 0, qtdProdutos: 0, qtdVendaExtra: 2, vendaExtra: 80, totalAberto: 641.25 },
  { profissional: "Claudia", funcao: "Profissional", totalServicos: 922, qtdServicos: 20, ticketMedio: 46.1, clientesAtendidos: 9, tempoTrabalhado: "990 min", totalProdutos: 920.6, qtdProdutos: 41, qtdVendaExtra: 5, vendaExtra: 200, totalAberto: 448.55 },
  { profissional: "Fila de espera", funcao: "Recepção", totalServicos: 0, qtdServicos: 0, ticketMedio: 0, clientesAtendidos: 0, tempoTrabalhado: "0 min", totalProdutos: 0, qtdProdutos: 0, qtdVendaExtra: 0, vendaExtra: 0, totalAberto: 0 },
  { profissional: "Henrique", funcao: "Recepção", totalServicos: 0, qtdServicos: 0, ticketMedio: 0, clientesAtendidos: 0, tempoTrabalhado: "0 min", totalProdutos: 0, qtdProdutos: 0, qtdVendaExtra: 0, vendaExtra: 0, totalAberto: 0 },
  { profissional: "Lara", funcao: "Frizzar", totalServicos: 0, qtdServicos: 0, ticketMedio: 0, clientesAtendidos: 0, tempoTrabalhado: "0 min", totalProdutos: 0, qtdProdutos: 0, qtdVendaExtra: 0, vendaExtra: 0, totalAberto: 0 },
  { profissional: "Marcia Silva", funcao: "Assistente", totalServicos: 510, qtdServicos: 9, ticketMedio: 56.67, clientesAtendidos: 3, tempoTrabalhado: "300 min", totalProdutos: 0, qtdProdutos: 0, qtdVendaExtra: 1, vendaExtra: 30, totalAberto: 200 },
  { profissional: "Matheus", funcao: "Profissional", totalServicos: 290, qtdServicos: 6, ticketMedio: 48.33, clientesAtendidos: 2, tempoTrabalhado: "210 min", totalProdutos: 0, qtdProdutos: 0, qtdVendaExtra: 0, vendaExtra: 0, totalAberto: 330 },
  { profissional: "Ramon", funcao: "Caixa", totalServicos: 0, qtdServicos: 0, ticketMedio: 0, clientesAtendidos: 0, tempoTrabalhado: "0 min", totalProdutos: 0, qtdProdutos: 0, qtdVendaExtra: 0, vendaExtra: 0, totalAberto: 0 },
  { profissional: "Vini", funcao: "Auxiliar", totalServicos: 0, qtdServicos: 0, ticketMedio: 0, clientesAtendidos: 0, tempoTrabalhado: "0 min", totalProdutos: 0, qtdProdutos: 0, qtdVendaExtra: 0, vendaExtra: 0, totalAberto: 360.72 },
];

const detalhadoData: ProfDetalhado[] = [
  { id: 1, profissional: "Cesar", servico: "Corte Masculino", cliente: "João Silva", celular: "(41) 99123-4567", valor: 50, vendaExtra: 10, data: "05/04/2026" },
  { id: 2, profissional: "Claudia", servico: "Escova", cliente: "Maria Santos", celular: "(41) 98765-4321", valor: 80, vendaExtra: 20, data: "05/04/2026" },
  { id: 3, profissional: "Cesar", servico: "Barba", cliente: "Pedro Oliveira", celular: "(41) 99876-5432", valor: 35, vendaExtra: 0, data: "04/04/2026" },
  { id: 4, profissional: "Claudia", servico: "Coloração", cliente: "Ana Costa", celular: "(41) 99654-3210", valor: 200, vendaExtra: 50, data: "04/04/2026" },
  { id: 5, profissional: "Marcia Silva", servico: "Hidratação", cliente: "Carla Dias", celular: "", valor: 120, vendaExtra: 30, data: "03/04/2026" },
];

export default function RelatorioProfissionais() {
  const [tab, setTab] = useState("resumido");

  const totalServicos = resumidoData.reduce((s, r) => s + r.totalServicos, 0);
  const totalQtd = resumidoData.reduce((s, r) => s + r.qtdServicos, 0);
  const totalVendaExtra = resumidoData.reduce((s, r) => s + r.vendaExtra, 0);
  const activeProfs = resumidoData.filter(d => d.qtdServicos > 0);
  const avgTicket = activeProfs.length > 0 ? activeProfs.reduce((s, r) => s + r.ticketMedio, 0) / activeProfs.length : 0;

  const summaryCards: SummaryCard[] = [
    { label: "Total", value: String(totalQtd), type: "quantity", size: "compact" },
    { label: "Valor", value: R$(totalServicos), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
    { label: "Venda Extra", value: R$(totalVendaExtra), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
    { label: "Ticket Médio", value: R$(avgTicket), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
  ];

  const columnsResumido: Column<RelProf>[] = [
    {
      key: "foto" as any, label: "", sortable: false, filterable: false, align: "center", width: "50px",
      render: () => (
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mx-auto">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      ),
    },
    {
      key: "profissional", label: "Profissional", pinned: true,
      render: (v) => <a href="/funcionarioPesquisa" className="hover:underline font-medium">{v}</a>,
    },
    { key: "funcao", label: "Função", render: (v) => <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-foreground">{v}</span> },
    { key: "totalServicos", label: "Total em Serviços", align: "right", render: (v) => R$(v) },
    { key: "qtdServicos", label: "Quantidade", align: "center" },
    { key: "ticketMedio", label: "Ticket Médio", align: "right", render: (v) => R$(v) },
    { key: "clientesAtendidos", label: "Clientes atendidos", align: "center" },
    { key: "tempoTrabalhado", label: "Tempo Trabalhado", align: "center" },
    { key: "qtdVendaExtra", label: "Qtd Venda Extra", align: "center" },
    { key: "vendaExtra", label: "Venda Extra", align: "right", render: (v) => R$(v) },
    { key: "totalProdutos", label: "Total em Produtos", align: "right", render: (v) => R$(v) },
    { key: "qtdProdutos", label: "Qtd Produtos", align: "center" },
    { key: "totalAberto", label: "Total em aberto", align: "right", render: (v) => R$(v) },
  ];

  const columnsDetalhado: Column<ProfDetalhado>[] = [
    {
      key: "foto" as any, label: "", sortable: false, filterable: false, align: "center", width: "50px",
      render: () => (
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mx-auto">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      ),
    },
    {
      key: "profissional", label: "Profissional", pinned: true,
      render: (v) => <a href="/funcionarioPesquisa" className="hover:underline font-medium">{v}</a>,
    },
    { key: "servico", label: "Serviço" },
    {
      key: "cliente", label: "Cliente",
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <WhatsAppButton telefone={row.celular} nome={row.cliente} />
          <a href="/clientePesquisa" className="hover:underline font-medium">{v}</a>
        </div>
      ),
    },
    { key: "valor", label: "Valor", align: "right", render: (v) => R$(v) },
    { key: "vendaExtra", label: "Venda Extra", align: "right", render: (v) => R$(v) },
    { key: "data", label: "Data" },
  ];

  const totals: Record<string, any> = {
    profissional: "",
    totalServicos: R$(totalServicos),
    qtdServicos: totalQtd,
    ticketMedio: R$(avgTicket),
    clientesAtendidos: resumidoData.reduce((s, r) => s + r.clientesAtendidos, 0),
    tempoTrabalhado: `${resumidoData.reduce((s, r) => s + parseInt(r.tempoTrabalhado), 0)} min`,
    qtdVendaExtra: resumidoData.reduce((s, r) => s + r.qtdVendaExtra, 0),
    vendaExtra: R$(totalVendaExtra),
    totalProdutos: R$(resumidoData.reduce((s, r) => s + r.totalProdutos, 0)),
    qtdProdutos: resumidoData.reduce((s, r) => s + r.qtdProdutos, 0),
    totalAberto: R$(resumidoData.reduce((s, r) => s + r.totalAberto, 0)),
  };

  const tabs: TabDef[] = [
    { label: "Resumido", value: "resumido", color: "neutral" },
    { label: "Detalhado", value: "detalhado", color: "info" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Relatório Profissional"
        data={tab === "resumido" ? resumidoData : detalhadoData}
        columns={tab === "resumido" ? columnsResumido : columnsDetalhado}
        summaryCards={summaryCards}
        totalRow={tab === "resumido" ? totals : undefined}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        pageSize={15}
        showDateFilter={true}
        tableId="relatorio_profissionais"
      />
    </AppLayout>
  );
}
