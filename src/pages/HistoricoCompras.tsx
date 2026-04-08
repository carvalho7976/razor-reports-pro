import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, TabDef, SummaryCard } from "@/components/DataTable";
import { User, CreditCard, Hash } from "lucide-react";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Produto {
  nome: string;
  valor: number;
  quantidade: number;
  total: number;
}
interface CompraResumida {
  id: number;
  data: string;
  funcionario: string;
  valor: number;
  desconto: number;
  total: number;
  produtos: Produto[];
}

const resumidoData: CompraResumida[] = [
  {
    id: 1,
    data: "04/04/2026",
    funcionario: "Lara",
    valor: 54,
    desconto: 0,
    total: 54,
    produtos: [
      { nome: "GEL FIXADOR", valor: 23, quantidade: 1, total: 23 },
      { nome: "color dicolor 10.89 - dicolore", valor: 31, quantidade: 2, total: 31 },
    ],
  },
  {
    id: 2,
    data: "01/04/2026",
    funcionario: "Carlos",
    valor: 120,
    desconto: 10,
    total: 110,
    produtos: [
      { nome: "Pomada Modeladora", valor: 40, quantidade: 2, total: 80 },
      { nome: "Shampoo Anticaspa", valor: 20, quantidade: 2, total: 40 },
    ],
  },
  {
    id: 3,
    data: "28/03/2026",
    funcionario: "Ana",
    valor: 95,
    desconto: 5,
    total: 90,
    produtos: [
      { nome: "Óleo de Barba", valor: 45, quantidade: 1, total: 45 },
      { nome: "Condicionador", valor: 25, quantidade: 2, total: 50 },
    ],
  },
];

export default function HistoricoCompras() {
  const [aulaOpen, setAulaOpen] = useState(false);
  const [tab, setTab] = useState("resumido");

  const totalProdutos = resumidoData.reduce((s, r) => s + r.produtos.reduce((ps, p) => ps + p.quantidade, 0), 0);
  const totalCompras = resumidoData.reduce((s, r) => s + r.total, 0);

  const summaryCards: SummaryCard[] = [
    {
      label: "Produtos Comprados",
      value: String(totalProdutos),
      type: "quantity",
      icon: <Hash className="h-4 w-4" />,
      size: "compact",
      color: "blue",
    },
    {
      label: "Total em Compras",
      value: R$(totalCompras),
      icon: <CreditCard className="h-4 w-4" />,
      size: "wide",
      color: "blue",
    },
  ];

  // Resumido columns (grouped by date + funcionario)
  const columnsResumido: Column<any>[] = [
    { key: "data", label: "Data", pinned: true },
    {
      key: "funcionario",
      label: "Usuário Responsável",
      render: (v: string) => (
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
    { key: "valor", label: "Valor", align: "right", render: (v: number) => R$(v) },
    { key: "desconto", label: "Desconto", align: "right", render: (v: number) => R$(v) },
    {
      key: "total",
      label: "Total",
      align: "right",
      render: (v: number) => (
        <span style={{ color: "#00c5b4" }} className="font-medium">
          {R$(v)}
        </span>
      ),
    },
  ];

  // Detalhado: flat list of products per purchase (no funcionario)
  const detalhadoData = useMemo(() => {
    const rows: any[] = [];
    resumidoData.forEach((compra) => {
      compra.produtos.forEach((p, pi) => {
        rows.push({
          id: compra.id * 1000 + pi,
          data: compra.data,
          produto: p.nome,
          quantidade: p.quantidade,
          valor: p.valor,
          total: p.total,
        });
      });
    });
    return rows;
  }, []);

  const columnsDetalhado: Column<any>[] = [
    { key: "data", label: "Data", pinned: true },
    { key: "produto", label: "Produto" },
    { key: "quantidade", label: "Quantidade", align: "center" },
    { key: "valor", label: "Valor Unitário", align: "right", render: (v: number) => R$(v) },
    {
      key: "total",
      label: "Total",
      align: "right",
      render: (v: number) => (
        <span style={{ color: "#00c5b4" }} className="font-medium">
          {R$(v)}
        </span>
      ),
    },
  ];

  const tabs: TabDef[] = [
    { label: "Resumido", value: "resumido", color: "neutral" },
    { label: "Detalhado", value: "detalhado", color: "info" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Histórico de Compras"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />}
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
      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Histórico de Compras"
      />
    </AppLayout>
  );
}
