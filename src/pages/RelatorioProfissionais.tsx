import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard, TabDef } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { User, CreditCard, Hash, Package, Users } from "lucide-react";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface RelProf {
  profissional: string;
  funcao: string;
  totalServicos: number;
  ticketMedio: number;
  tempoTrabalhado: string;
  vendaExtra: number;
  totalProdutos: number;
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
  qtdServicos: number;
  clientesAtendidos: number;
  qtdProdutos: number;
}

const resumidoData: RelProf[] = [
  {
    profissional: "Cesar",
    funcao: "Gerente",
    totalServicos: 895,
    ticketMedio: 55.94,
    tempoTrabalhado: "575 min",
    totalProdutos: 0,
    vendaExtra: 80,
    totalAberto: 641.25,
  },
  {
    profissional: "Claudia",
    funcao: "Profissional",
    totalServicos: 922,
    ticketMedio: 46.1,
    tempoTrabalhado: "990 min",
    totalProdutos: 920.6,
    vendaExtra: 200,
    totalAberto: 448.55,
  },
  {
    profissional: "Fila de espera",
    funcao: "Recepção",
    totalServicos: 0,
    ticketMedio: 0,
    tempoTrabalhado: "0 min",
    totalProdutos: 0,
    vendaExtra: 0,
    totalAberto: 0,
  },
  {
    profissional: "Henrique",
    funcao: "Recepção",
    totalServicos: 0,
    ticketMedio: 0,
    tempoTrabalhado: "0 min",
    totalProdutos: 0,
    vendaExtra: 0,
    totalAberto: 0,
  },
  {
    profissional: "Lara",
    funcao: "Frizzar",
    totalServicos: 0,
    ticketMedio: 0,
    tempoTrabalhado: "0 min",
    totalProdutos: 0,
    vendaExtra: 0,
    totalAberto: 0,
  },
  {
    profissional: "Marcia Silva",
    funcao: "Assistente",
    totalServicos: 510,
    ticketMedio: 56.67,
    tempoTrabalhado: "300 min",
    totalProdutos: 0,
    vendaExtra: 30,
    totalAberto: 200,
  },
  {
    profissional: "Matheus",
    funcao: "Profissional",
    totalServicos: 290,
    ticketMedio: 48.33,
    tempoTrabalhado: "210 min",
    totalProdutos: 0,
    vendaExtra: 0,
    totalAberto: 330,
  },
  {
    profissional: "Ramon",
    funcao: "Caixa",
    totalServicos: 0,
    ticketMedio: 0,
    tempoTrabalhado: "0 min",
    totalProdutos: 0,
    vendaExtra: 0,
    totalAberto: 0,
  },
  {
    profissional: "Vini",
    funcao: "Auxiliar",
    totalServicos: 0,
    ticketMedio: 0,
    tempoTrabalhado: "0 min",
    totalProdutos: 0,
    vendaExtra: 0,
    totalAberto: 360.72,
  },
];

const detalhadoData: ProfDetalhado[] = [
  {
    id: 1,
    profissional: "Cesar",
    servico: "Corte Masculino",
    cliente: "João Silva",
    celular: "(41) 99123-4567",
    valor: 50,
    vendaExtra: 10,
    data: "05/04/2026",
    qtdServicos: 16,
    clientesAtendidos: 7,
    qtdProdutos: 0,
  },
  {
    id: 2,
    profissional: "Claudia",
    servico: "Escova",
    cliente: "Maria Santos",
    celular: "(41) 98765-4321",
    valor: 80,
    vendaExtra: 20,
    data: "05/04/2026",
    qtdServicos: 20,
    clientesAtendidos: 9,
    qtdProdutos: 41,
  },
  {
    id: 3,
    profissional: "Cesar",
    servico: "Barba",
    cliente: "Pedro Oliveira",
    celular: "(41) 99876-5432",
    valor: 35,
    vendaExtra: 0,
    data: "04/04/2026",
    qtdServicos: 16,
    clientesAtendidos: 7,
    qtdProdutos: 0,
  },
  {
    id: 4,
    profissional: "Claudia",
    servico: "Coloração",
    cliente: "Ana Costa",
    celular: "(41) 99654-3210",
    valor: 200,
    vendaExtra: 50,
    data: "04/04/2026",
    qtdServicos: 20,
    clientesAtendidos: 9,
    qtdProdutos: 41,
  },
  {
    id: 5,
    profissional: "Marcia Silva",
    servico: "Hidratação",
    cliente: "Carla Dias",
    celular: "",
    valor: 120,
    vendaExtra: 30,
    data: "03/04/2026",
    qtdServicos: 9,
    clientesAtendidos: 3,
    qtdProdutos: 0,
  },
];

export default function RelatorioProfissionais() {
  const [tab, setTab] = useState("resumido");
  const [aulaOpen, setAulaOpen] = useState(false);

  const totalServicos = resumidoData.reduce((s, r) => s + r.totalServicos, 0);
  const totalVendaAssinantes = resumidoData.reduce((s, r) => s + r.vendaExtra, 0);
  const totalProdutos = resumidoData.reduce((s, r) => s + r.totalProdutos, 0);
  const totalAberto = resumidoData.reduce((s, r) => s + r.totalAberto, 0);

  const totalQtdServicos = detalhadoData.reduce((s, r) => s + r.qtdServicos, 0);
  const totalQtdProdutos = detalhadoData.reduce((s, r) => s + r.qtdProdutos, 0);
  const totalClientesAtendidos = detalhadoData.reduce((s, r) => s + r.clientesAtendidos, 0);

  const summaryCards: SummaryCard[] = [
    {
      label: "Qtd Serviços",
      value: String(totalQtdServicos),
      type: "quantity",
      icon: <Hash className="h-4 w-4" />,
      size: "compact",
      color: "blue",
    },
    {
      label: "Qtd Produtos",
      value: String(totalQtdProdutos),
      type: "quantity",
      icon: <Package className="h-4 w-4" />,
      size: "compact",
      color: "blue",
    },
    {
      label: "Clientes Atendidos",
      value: String(totalClientesAtendidos),
      type: "quantity",
      icon: <Users className="h-4 w-4" />,
      size: "compact",
      color: "blue",
    },
    {
      label: "Vendas para Assinantes",
      value: R$(totalVendaAssinantes),
      icon: <CreditCard className="h-4 w-4" />,
      size: "wide",
      color: "green",
    },
    {
      label: "Vendas para Avulsos",
      value: R$(totalServicos),
      icon: <CreditCard className="h-4 w-4" />,
      size: "wide",
      color: "green",
    },
    {
      label: "Vendas de Produto",
      value: R$(totalProdutos),
      icon: <CreditCard className="h-4 w-4" />,
      size: "wide",
      color: "green",
    },
    {
      label: "Total em aberto",
      value: R$(totalAberto),
      icon: <CreditCard className="h-4 w-4" />,
      size: "wide",
      color: "green",
    },
  ];

  const columnsResumido: Column<RelProf>[] = [
    {
      key: "profissional",
      label: "Nome",
      pinned: true,
      render: (v) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <a href="/funcionarioPesquisa" className="hover:underline font-medium">
            {v}
          </a>
        </div>
      ),
    },
    { key: "totalServicos", label: "Vendas para Avulsos", align: "right", render: (v) => R$(v) },
    { key: "tempoTrabalhado", label: "Tempo Trabalhado", align: "center" },
    { key: "vendaExtra", label: "Vendas para Assinantes", align: "right", render: (v) => R$(v) },
    { key: "totalProdutos", label: "Vendas de Produto", align: "right", render: (v) => R$(v) },
    { key: "totalAberto", label: "Total em aberto", align: "right", render: (v) => R$(v) },
  ];

  const columnsDetalhado: Column<ProfDetalhado>[] = [
    {
      key: "profissional",
      label: "Profissional",
      pinned: true,
      render: (v) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <a href="/funcionarioPesquisa" className="hover:underline font-medium">
            {v}
          </a>
        </div>
      ),
    },
    { key: "servico", label: "Serviço" },
    {
      key: "cliente",
      label: "Cliente",
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <WhatsAppButton telefone={row.celular} nome={row.cliente} />
          <a href="/clientePesquisa" className="hover:underline font-medium">
            {v}
          </a>
        </div>
      ),
    },
    { key: "valor", label: "Valor", align: "right", render: (v) => R$(v) },
    { key: "vendaExtra", label: "Vendas para Assinantes", align: "right", render: (v) => R$(v) },
    { key: "data", label: "Data" },
  ];

  const totals: Record<string, any> = {
    profissional: "Total:",
    totalServicos: R$(totalServicos),
    tempoTrabalhado: `${resumidoData.reduce((s, r) => s + parseInt(r.tempoTrabalhado), 0)} min`,
    vendaExtra: R$(totalVendaAssinantes),
    totalProdutos: R$(totalProdutos),
    totalAberto: R$(totalAberto),
  };

  const tabs: TabDef[] = [
    { label: "Resumido", value: "resumido", color: "neutral" },
    { label: "Detalhado", value: "detalhado", color: "info" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Relatório Profissional"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />}
        data={tab === "resumido" ? (resumidoData as any[]) : (detalhadoData as any[])}
        columns={tab === "resumido" ? (columnsResumido as any) : (columnsDetalhado as any)}
        summaryCards={summaryCards}
        totalRow={tab === "resumido" ? totals : undefined}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        pageSize={15}
        showDateFilter={true}
        tableId={tab === "resumido" ? "relatorio_profissionais_resumido" : "relatorio_profissionais_detalhado"}
      />
      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Relatório Profissional"
      />
    </AppLayout>
  );
}
