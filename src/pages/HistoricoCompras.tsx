import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, TabDef, SummaryCard } from "@/components/DataTable";
import { User, CreditCard, Hash, ChevronDown, ChevronRight } from "lucide-react";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface CompraResumida { id: number; data: string; funcionario: string; valor: number; desconto: number; total: number; produtos: { nome: string; valor: number; quantidade: number; total: number }[]; }

const resumidoData: CompraResumida[] = [
  {
    id: 1, data: "04/04/2026", funcionario: "Lara", valor: 54, desconto: 0, total: 54,
    produtos: [
      { nome: "GEL FIXADOR", valor: 23, quantidade: 1, total: 23 },
      { nome: "color dicolor 10.89 - dicolore", valor: 31, quantidade: 2, total: 31 },
    ],
  },
  {
    id: 2, data: "01/04/2026", funcionario: "Carlos", valor: 120, desconto: 10, total: 110,
    produtos: [
      { nome: "Pomada Modeladora", valor: 40, quantidade: 2, total: 80 },
      { nome: "Shampoo Anticaspa", valor: 20, quantidade: 2, total: 40 },
    ],
  },
  {
    id: 3, data: "28/03/2026", funcionario: "Ana", valor: 95, desconto: 5, total: 90,
    produtos: [
      { nome: "Óleo de Barba", valor: 45, quantidade: 1, total: 45 },
      { nome: "Condicionador", valor: 25, quantidade: 2, total: 50 },
    ],
  },
];

export default function HistoricoCompras() {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (id: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalProdutos = resumidoData.reduce((s, r) => s + r.produtos.reduce((ps, p) => ps + p.quantidade, 0), 0);
  const totalCompras = resumidoData.reduce((s, r) => s + r.total, 0);

  const summaryCards: SummaryCard[] = [
    { label: "Produtos Comprados", value: String(totalProdutos), type: "quantity", icon: <Hash className="h-4 w-4" />, size: "compact" },
    { label: "Total em Compras", value: R$(totalCompras), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
  ];

  // Build flat rows: main row + expanded product rows
  const flatData = useMemo(() => {
    const rows: any[] = [];
    resumidoData.forEach(compra => {
      rows.push({
        id: compra.id,
        _type: "main",
        _expandable: true,
        _expanded: expandedRows.has(compra.id),
        _onToggle: () => toggleRow(compra.id),
        data: compra.data,
        funcionario: compra.funcionario,
        valor: compra.valor,
        desconto: compra.desconto,
        total: compra.total,
      });
      if (expandedRows.has(compra.id)) {
        compra.produtos.forEach((p, pi) => {
          rows.push({
            id: compra.id * 1000 + pi,
            _type: "detail",
            data: "",
            funcionario: p.nome,
            valor: p.valor,
            desconto: p.quantidade,
            total: p.total,
          });
        });
      }
    });
    return rows;
  }, [expandedRows]);

  const columns: Column<any>[] = [
    {
      key: "data", label: "Data", width: "120px",
      render: (v: string, row: any) => {
        if (row._type === "detail") return "";
        return (
          <div className="flex items-center gap-1.5">
            <button onClick={(e) => { e.stopPropagation(); row._onToggle(); }} className="p-0.5 rounded hover:bg-muted">
              {row._expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            <span>{v}</span>
          </div>
        );
      },
    },
    {
      key: "funcionario", label: "Funcionário",
      render: (v: string, row: any) => {
        if (row._type === "detail") return <span className="pl-6 text-muted-foreground">{v}</span>;
        return (
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
              <User className="h-3 w-3 text-muted-foreground" />
            </div>
            <a href="/funcionarioPesquisa" className="hover:underline font-medium">{v}</a>
          </div>
        );
      },
    },
    {
      key: "valor", label: "Valor", align: "right",
      render: (v: number, row: any) => row._type === "detail" ? R$(v) : R$(v),
    },
    {
      key: "desconto", label: "Desconto", align: "right",
      render: (v: any, row: any) => {
        if (row._type === "detail") return String(v);
        return R$(v);
      },
    },
    {
      key: "total", label: "Total", align: "right",
      render: (v: number, row: any) => (
        <span style={{ color: row._type === "main" ? "#00c5b4" : undefined }} className={row._type === "main" ? "font-medium" : ""}>
          {R$(v)}
        </span>
      ),
    },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Histórico de Compras"
        data={flatData}
        columns={columns}
        summaryCards={summaryCards}
        pageSize={30}
        showDateFilter={true}
        tableId="historico_compras"
      />
    </AppLayout>
  );
}
