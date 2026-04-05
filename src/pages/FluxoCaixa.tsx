import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard, TabDef } from "@/components/DataTable";
import { CreditCard } from "lucide-react";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface FluxoItem { id: number; data: string; descricao: string; categoria: string; entrada: number; saida: number; formaPagamento: string; }
interface FluxoResumido { id: number; data: string; abertura: number; adicao: number; entrada: number; saida: number; sangria: number; fechamento: number; saldo: number; }

const initialData: FluxoItem[] = [
  { id: 1, data: "05/04/2026", descricao: "Corte Masculino - João Silva", categoria: "Serviços", entrada: 50, saida: 0, formaPagamento: "Pix" },
  { id: 2, data: "05/04/2026", descricao: "Pomada Modeladora", categoria: "Produtos", entrada: 40, saida: 0, formaPagamento: "Cartão Crédito" },
  { id: 3, data: "05/04/2026", descricao: "Aluguel", categoria: "Despesas Fixas", entrada: 0, saida: 3500, formaPagamento: "Transferência" },
  { id: 4, data: "04/04/2026", descricao: "Escova - Maria Santos", categoria: "Serviços", entrada: 80, saida: 0, formaPagamento: "Cartão Débito" },
  { id: 5, data: "04/04/2026", descricao: "Material de limpeza", categoria: "Despesas Variáveis", entrada: 0, saida: 150, formaPagamento: "Dinheiro" },
  { id: 6, data: "04/04/2026", descricao: "Coloração - Ana Costa", categoria: "Serviços", entrada: 200, saida: 0, formaPagamento: "Pix" },
  { id: 7, data: "03/04/2026", descricao: "Barba - Pedro Oliveira", categoria: "Serviços", entrada: 35, saida: 0, formaPagamento: "Dinheiro" },
  { id: 8, data: "03/04/2026", descricao: "Produtos para revenda", categoria: "Estoque", entrada: 0, saida: 800, formaPagamento: "Cartão Crédito" },
  { id: 9, data: "03/04/2026", descricao: "Hidratação - Carla Dias", categoria: "Serviços", entrada: 120, saida: 0, formaPagamento: "Pix" },
  { id: 10, data: "02/04/2026", descricao: "Energia elétrica", categoria: "Despesas Fixas", entrada: 0, saida: 450, formaPagamento: "Débito automático" },
];

export default function FluxoCaixa() {
  const [tab, setTab] = useState("detalhado");

  const totalEntrada = initialData.reduce((s, r) => s + r.entrada, 0);
  const totalSaida = initialData.reduce((s, r) => s + r.saida, 0);
  const saldo = totalEntrada - totalSaida;

  const summaryCards: SummaryCard[] = [
    { label: "Entradas", value: R$(totalEntrada), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
    { label: "Saídas", value: R$(totalSaida), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
    { label: "Saldo", value: R$(saldo), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
  ];

  const resumidoData: FluxoResumido[] = useMemo(() => {
    const grouped = initialData.reduce((acc, item) => {
      const existing = acc.find(a => a.data === item.data);
      if (existing) { existing.entrada += item.entrada; existing.saida += item.saida; }
      else { acc.push({ id: acc.length + 1, data: item.data, entrada: item.entrada, saida: item.saida, abertura: 0, adicao: 0, sangria: 0, fechamento: 0, saldo: 0 }); }
      return acc;
    }, [] as FluxoResumido[]);
    // Simulate opening/closing values
    grouped.forEach((g, i) => {
      g.abertura = i === 0 ? 500 : grouped[i - 1].fechamento;
      g.adicao = 100;
      g.sangria = 50;
      g.saldo = g.entrada - g.saida;
      g.fechamento = g.abertura + g.adicao + g.entrada - g.saida - g.sangria;
    });
    return grouped;
  }, []);

  const columnsDetalhado: Column<FluxoItem>[] = [
    { key: "data", label: "Data" },
    { key: "descricao", label: "Descrição", pinned: true },
    { key: "categoria", label: "Categoria" },
    { key: "entrada", label: "Entrada", align: "right", render: v => v > 0 ? <span style={{ color: "#00c5b4" }}>{R$(v)}</span> : "—" },
    { key: "saida", label: "Saída", align: "right", render: v => v > 0 ? <span style={{ color: "#ff2f2f" }}>{R$(v)}</span> : "—" },
    { key: "formaPagamento", label: "Forma Pagamento" },
  ];

  const columnsResumido: Column<FluxoResumido>[] = [
    { key: "data", label: "Data", pinned: true },
    { key: "abertura", label: "Abertura", align: "right", render: (v: number) => R$(v) },
    { key: "adicao", label: "Adição", align: "right", render: (v: number) => R$(v) },
    { key: "entrada", label: "Entrada", align: "right", render: (v: number) => <span style={{ color: "#00c5b4" }}>{R$(v)}</span> },
    { key: "saida", label: "Saída", align: "right", render: (v: number) => <span style={{ color: "#ff2f2f" }}>{R$(v)}</span> },
    { key: "sangria", label: "Sangria", align: "right", render: (v: number) => R$(v) },
    { key: "fechamento", label: "Fechamento", align: "right", render: (v: number) => R$(v) },
    { key: "saldo", label: "Saldo", align: "right", render: (v: number) => <span className="font-bold" style={{ color: v >= 0 ? "#00c5b4" : "#ff2f2f" }}>{R$(v)}</span> },
  ];

  const tabs: TabDef[] = [
    { label: "Detalhado", value: "detalhado", color: "neutral" },
    { label: "Resumido", value: "resumido", color: "info" },
  ];

  return (
    <AppLayout>
      <DataTable title="Fluxo de Caixa" data={tab === "detalhado" ? initialData as any[] : resumidoData as any[]} columns={tab === "detalhado" ? columnsDetalhado as any : columnsResumido as any} summaryCards={summaryCards} tabs={tabs} activeTab={tab} onTabChange={setTab} showDateFilter={true} pageSize={15} tableId="fluxo_caixa" />
    </AppLayout>
  );
}
