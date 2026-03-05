import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column } from "@/components/DataTable";
import { Download } from "lucide-react";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface RelProf {
  profissional: string;
  totalServicos: number;
  qtdServicos: number;
  ticketMedio: number;
  clientesAtendidos: number;
  tempoTrabalhado: string;
  totalProdutos: number;
  qtdProdutos: number;
  totalAberto: number;
}

const data: RelProf[] = [
  { profissional: "Cesar", totalServicos: 895, qtdServicos: 16, ticketMedio: 55.94, clientesAtendidos: 7, tempoTrabalhado: "575 min", totalProdutos: 0, qtdProdutos: 0, totalAberto: 641.25 },
  { profissional: "Claudia", totalServicos: 922, qtdServicos: 20, ticketMedio: 46.1, clientesAtendidos: 9, tempoTrabalhado: "990 min", totalProdutos: 920.6, qtdProdutos: 41, totalAberto: 448.55 },
  { profissional: "Fila de espera", totalServicos: 0, qtdServicos: 0, ticketMedio: 0, clientesAtendidos: 0, tempoTrabalhado: "0 min", totalProdutos: 0, qtdProdutos: 0, totalAberto: 0 },
  { profissional: "Henrique", totalServicos: 0, qtdServicos: 0, ticketMedio: 0, clientesAtendidos: 0, tempoTrabalhado: "0 min", totalProdutos: 0, qtdProdutos: 0, totalAberto: 0 },
  { profissional: "Lara", totalServicos: 0, qtdServicos: 0, ticketMedio: 0, clientesAtendidos: 0, tempoTrabalhado: "0 min", totalProdutos: 0, qtdProdutos: 0, totalAberto: 0 },
  { profissional: "Marcia Silva", totalServicos: 510, qtdServicos: 9, ticketMedio: 56.67, clientesAtendidos: 3, tempoTrabalhado: "300 min", totalProdutos: 0, qtdProdutos: 0, totalAberto: 200 },
  { profissional: "Matheus", totalServicos: 290, qtdServicos: 6, ticketMedio: 48.33, clientesAtendidos: 2, tempoTrabalhado: "210 min", totalProdutos: 0, qtdProdutos: 0, totalAberto: 330 },
  { profissional: "Ramon", totalServicos: 0, qtdServicos: 0, ticketMedio: 0, clientesAtendidos: 0, tempoTrabalhado: "0 min", totalProdutos: 0, qtdProdutos: 0, totalAberto: 0 },
  { profissional: "Vini", totalServicos: 0, qtdServicos: 0, ticketMedio: 0, clientesAtendidos: 0, tempoTrabalhado: "0 min", totalProdutos: 0, qtdProdutos: 0, totalAberto: 360.72 },
];

const columns: Column<RelProf>[] = [
  { key: "profissional", label: "Profissional", pinned: true },
  { key: "totalServicos", label: "Total em Serviços", align: "right", render: (v) => R$(v) },
  { key: "qtdServicos", label: "Qtd Serviços", align: "center" },
  { key: "ticketMedio", label: "Ticket Médio", align: "right", render: (v) => R$(v) },
  { key: "clientesAtendidos", label: "Clientes atendidos", align: "center" },
  { key: "tempoTrabalhado", label: "Tempo Trabalhado", align: "center" },
  { key: "totalProdutos", label: "Total em Produtos", align: "right", render: (v) => R$(v) },
  { key: "qtdProdutos", label: "Qtd Produtos", align: "center" },
  { key: "totalAberto", label: "Total em aberto", align: "right", render: (v) => R$(v) },
  {
    key: "detalhar" as any, label: "Detalhar", sortable: false, filterable: false, align: "center",
    render: () => <Download className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground mx-auto" />,
  },
];

const totals: Record<string, any> = {
  profissional: "",
  totalServicos: R$(data.reduce((s, r) => s + r.totalServicos, 0)),
  qtdServicos: data.reduce((s, r) => s + r.qtdServicos, 0),
  ticketMedio: R$(data.reduce((s, r) => s + r.ticketMedio, 0) / data.filter(d => d.qtdServicos > 0).length || 0),
  clientesAtendidos: data.reduce((s, r) => s + r.clientesAtendidos, 0),
  tempoTrabalhado: `${data.reduce((s, r) => s + parseInt(r.tempoTrabalhado), 0)} min`,
  totalProdutos: R$(data.reduce((s, r) => s + r.totalProdutos, 0)),
  qtdProdutos: data.reduce((s, r) => s + r.qtdProdutos, 0),
  totalAberto: R$(data.reduce((s, r) => s + r.totalAberto, 0)),
};

export default function RelatorioProfissionais() {
  return (
    <AppLayout>
      <DataTable
        title="Relatório profissionais"
        data={data}
        columns={columns}
        totalRow={totals}
      />
    </AppLayout>
  );
}
