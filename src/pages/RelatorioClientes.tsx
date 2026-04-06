import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard, TabDef } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Users, BarChart3, CreditCard, TrendingUp } from "lucide-react";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type TipoCliente = "avulso" | "assinatura";

interface Cliente {
  cliente: string;
  celular: string;
  qtdServicos: number;
  qtdProdutos: number;
  totalServicos: number;
  totalProdutos: number;
  valorGasto: number;
  ticketMedio: number;
  frequencia: number;
  tipo: TipoCliente;
}

const allData: Cliente[] = [
  { cliente: "CAIO CESAR DE SOUZA FERNANDES", celular: "(41) 99123-4567", qtdServicos: 9, qtdProdutos: 0, totalServicos: 380, totalProdutos: 0, valorGasto: 380, ticketMedio: 126.67, frequencia: 3, tipo: "avulso" },
  { cliente: "César", celular: "(41) 98765-4321", qtdServicos: 6, qtdProdutos: 0, totalServicos: 310, totalProdutos: 0, valorGasto: 310, ticketMedio: 77.5, frequencia: 4, tipo: "avulso" },
  { cliente: "Everton", celular: "(41) 99876-5432", qtdServicos: 3, qtdProdutos: 0, totalServicos: 215, totalProdutos: 0, valorGasto: 215, ticketMedio: 215, frequencia: 1, tipo: "assinatura" },
  { cliente: "Gean", celular: "(41) 99654-3210", qtdServicos: 2, qtdProdutos: 0, totalServicos: 65, totalProdutos: 0, valorGasto: 65, ticketMedio: 65, frequencia: 1, tipo: "avulso" },
  { cliente: "Luis Alberto Santos", celular: "(41) 98432-1098", qtdServicos: 2, qtdProdutos: 2, totalServicos: 97, totalProdutos: 40, valorGasto: 137, ticketMedio: 137, frequencia: 1, tipo: "assinatura" },
  { cliente: "Marlon", celular: "", qtdServicos: 2, qtdProdutos: 0, totalServicos: 150, totalProdutos: 0, valorGasto: 150, ticketMedio: 150, frequencia: 1, tipo: "avulso" },
  { cliente: "Frizzar Demonstração", celular: "(41) 99111-2233", qtdServicos: 1, qtdProdutos: 2, totalServicos: 30, totalProdutos: 36.55, valorGasto: 66.55, ticketMedio: 66.55, frequencia: 1, tipo: "avulso" },
];

export default function RelatorioClientes() {
  const [tab, setTab] = useState("total");

  const data = useMemo(() => {
    if (tab === "total") return allData;
    if (tab === "avulso") return allData.filter(c => c.tipo === "avulso");
    return allData.filter(c => c.tipo === "assinatura");
  }, [tab]);

  const totalClientes = data.length;
  const totalFrequencia = data.reduce((s, r) => s + r.frequencia, 0);
  const totalValor = data.reduce((s, r) => s + r.valorGasto, 0);
  const avgTicket = totalClientes > 0 ? data.reduce((s, r) => s + r.ticketMedio, 0) / totalClientes : 0;

  const totalServicos = data.reduce((s, r) => s + r.totalServicos, 0);
  const totalProdutos = data.reduce((s, r) => s + r.totalProdutos, 0);

  const summaryCards: SummaryCard[] = [
    { label: "Clientes Atendidos", value: String(totalClientes), type: "quantity", icon: <Users className="h-4 w-4" />, size: "compact" },
    { label: "Serviços", value: R$(totalServicos), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
    { label: "Produtos", value: R$(totalProdutos), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
  ];

  const columns: Column<Cliente>[] = [
    {
      key: "cliente", label: "Cliente", pinned: true,
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <WhatsAppButton telefone={row.celular} nome={row.cliente} />
          <a href="/clientePesquisa" className="hover:underline font-medium">{v}</a>
        </div>
      ),
    },
    { key: "totalServicos", label: "Serviços", align: "right", render: (v) => R$(v) },
    { key: "totalProdutos", label: "Produtos", align: "right", render: (v) => R$(v) },
    { key: "valorGasto", label: "Total", align: "right", render: (v) => R$(v) },
    { key: "ticketMedio", label: "Ticket", align: "right", render: (v) => R$(v) },
    { key: "frequencia", label: "Frequência", align: "center" },
  ];

  const tabs: TabDef[] = [
    { label: "Total", value: "total", count: allData.length, color: "neutral" },
    { label: "Avulso", value: "avulso", count: allData.filter(c => c.tipo === "avulso").length, color: "info" },
    { label: "Assinatura", value: "assinatura", count: allData.filter(c => c.tipo === "assinatura").length, color: "success" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Relatório de Clientes"
        data={data}
        columns={columns}
        summaryCards={summaryCards}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        pageSize={15}
        showDateFilter={true}
        tableId="relatorio_clientes"
      />
    </AppLayout>
  );
}