import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, TabDef, SummaryCard } from "@/components/DataTable";
import { User, SprayCan, DollarSign } from "lucide-react";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";

const formatBRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Produto {
  nome: string;
  valor: number;
  quantidade: number;
}

interface CompraResumida {
  id: number;
  data: string;
  funcionario: string;
  valor: number;
  desconto: number;
  total: number;
  debitoTipo?: string;
  produtos: Produto[];
}

const initialData: CompraResumida[] = [
  {
    id: 1,
    data: "04/04/2026",
    funcionario: "Lara",
    valor: 85,
    desconto: 31,
    total: 54,
    debitoTipo: "caixa",
    produtos: [
      { nome: "GEL FIXADOR", valor: 23, quantidade: 1 },
      { nome: "color dicolor 10.89 - dicolore", valor: 31, quantidade: 2 },
    ],
  },
  {
    id: 2,
    data: "01/04/2026",
    funcionario: "Carlos",
    valor: 120,
    desconto: 10,
    total: 110,
    debitoTipo: "conta",
    produtos: [
      { nome: "Pomada Modeladora", valor: 40, quantidade: 2 },
      { nome: "Shampoo Anticaspa", valor: 20, quantidade: 2 },
    ],
  },
  {
    id: 3,
    data: "28/03/2026",
    funcionario: "Ana",
    valor: 95,
    desconto: 5,
    total: 90,
    debitoTipo: "parcelar",
    produtos: [
      { nome: "Óleo de Barba", valor: 45, quantidade: 1 },
      { nome: "Condicionador", valor: 25, quantidade: 2 },
    ],
  },
];

export default function HistoricoCompras() {
  const navigate = useNavigate();
  const [aulaOpen, setAulaOpen] = useState(false);
  const [tab, setTab] = useState<"resumido" | "detalhado">("resumido");
  const [compras] = useState<CompraResumida[]>(initialData);
  const [detalhadoDataFiltro, setDetalhadoDataFiltro] = useState<string | null>(null);

  const totalProdutos = compras.reduce(
    (sumCompras, compra) =>
      sumCompras + compra.produtos.reduce((sumProdutos, produto) => sumProdutos + produto.quantidade, 0),
    0,
  );

  const totalCompras = compras.reduce((sum, compra) => sum + compra.total, 0);

  const summaryCards: SummaryCard[] = [
    {
      label: "Produtos Comprados",
      value: String(totalProdutos),
      type: "quantity",
      icon: <SprayCan className="h-4 w-4" />,
      size: "compact",
      color: "blue",
    },
    {
      label: "Total em Compras",
      value: formatBRL(totalCompras),
      icon: <DollarSign className="h-4 w-4" />,
      size: "wide",
      color: "blue",
    },
  ];

  const abrirDetalhadoPorData = (data: string) => {
    setDetalhadoDataFiltro(data);
    setTab("detalhado");
  };

  const columnsResumido: Column<any>[] = [
    {
      key: "data",
      label: "Data",
      pinned: true,
      render: (v: string) => (
        <button
          type="button"
          onClick={() => abrirDetalhadoPorData(v)}
          className="font-medium text-black underline hover:text-black"
        >
          {v}
        </button>
      ),
    },
    {
      key: "funcionario",
      label: "Usuário Responsável",
      render: (v: string) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <a href="/funcionarioPesquisa" className="font-medium hover:underline">
            {v}
          </a>
        </div>
      ),
    },
    { key: "valor", label: "Valor", align: "right", render: (v: number) => formatBRL(v) },
    { key: "desconto", label: "Desconto", align: "right", render: (v: number) => formatBRL(v) },
    {
      key: "total",
      label: "Total",
      align: "right",
      render: (v: number) => <span className="font-medium text-emerald-600">{formatBRL(v)}</span>,
    },
  ];

  const detalhadoDataBase = useMemo(() => {
    const rows: any[] = [];
    compras.forEach((compra) => {
      compra.produtos.forEach((produto, index) => {
        rows.push({
          id: compra.id * 1000 + index,
          compraId: compra.id,
          data: compra.data,
          produto: produto.nome,
          quantidade: produto.quantidade,
          valor: produto.valor,
          total: Number(produto.valor || 0) * Number(produto.quantidade || 0),
        });
      });
    });
    return rows;
  }, [compras]);

  const detalhadoData = useMemo(() => {
    if (!detalhadoDataFiltro) return detalhadoDataBase;
    return detalhadoDataBase.filter((item) => item.data === detalhadoDataFiltro);
  }, [detalhadoDataBase, detalhadoDataFiltro]);

  const columnsDetalhado: Column<any>[] = [
    { key: "data", label: "Data", pinned: true },
    { key: "produto", label: "Produto" },
    { key: "quantidade", label: "Quantidade", align: "center" },
    {
      key: "valor",
      label: "Valor Unitário",
      align: "right",
      render: (v: number) => formatBRL(v),
    },
    {
      key: "total",
      label: "Total",
      align: "right",
      render: (v: number) => <span className="font-medium text-emerald-600">{formatBRL(v)}</span>,
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
        data={tab === "resumido" ? compras : detalhadoData}
        columns={tab === "resumido" ? columnsResumido : columnsDetalhado}
        summaryCards={summaryCards}
        tabs={tabs}
        activeTab={tab}
        onTabChange={(value) => {
          setTab(value as "resumido" | "detalhado");
          if (value === "resumido") setDetalhadoDataFiltro(null);
        }}
        pageSize={15}
        showDateFilter={true}
        tableId="historico_compras"
        novoMenuItems={[{ label: "Nova compra", onClick: () => navigate("/novaCompra") }]}
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
