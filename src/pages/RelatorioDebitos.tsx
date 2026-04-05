import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, SummaryCard, TabDef } from "@/components/DataTable";
import { CreditCard, CheckCircle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Debito { id: number; cliente: string; descricao: string; valor: number; data: string; vencimento: string; usuarioResponsavel: string; status: "Em aberto" | "Pago"; }

const initialData: Debito[] = [
  { id: 1, cliente: "João Silva", descricao: "Corte + Barba", valor: 85, data: "01/04/2026", vencimento: "10/04/2026", usuarioResponsavel: "Admin", status: "Em aberto" },
  { id: 2, cliente: "Pedro Oliveira", descricao: "Coloração", valor: 200, data: "28/03/2026", vencimento: "05/04/2026", usuarioResponsavel: "Fernanda", status: "Em aberto" },
  { id: 3, cliente: "Lucas Almeida", descricao: "Pacote Corte 5x", valor: 200, data: "20/03/2026", vencimento: "30/03/2026", usuarioResponsavel: "Admin", status: "Pago" },
  { id: 4, cliente: "Ana Costa", descricao: "Produtos", valor: 150, data: "15/03/2026", vencimento: "25/03/2026", usuarioResponsavel: "Ana", status: "Pago" },
  { id: 5, cliente: "Carla Dias", descricao: "Hidratação", valor: 120, data: "02/04/2026", vencimento: "12/04/2026", usuarioResponsavel: "Admin", status: "Em aberto" },
  { id: 6, cliente: "Roberto Lima", descricao: "Manicure", valor: 50, data: "03/04/2026", vencimento: "13/04/2026", usuarioResponsavel: "Fernanda", status: "Em aberto" },
];

export default function RelatorioDebitos() {
  const [allData, setAllData] = useState(initialData);
  const [tab, setTab] = useState("todos");
  const { toast } = useToast();

  const data = useMemo(() => {
    if (tab === "todos") return allData;
    if (tab === "aberto") return allData.filter(d => d.status === "Em aberto");
    return allData.filter(d => d.status === "Pago");
  }, [tab, allData]);

  const bulkReceber = (indices: number[]) => {
    const ids = indices.map(i => data[i]?.id).filter(Boolean);
    setAllData(prev => prev.map(d => ids.includes(d.id) ? { ...d, status: "Pago" as const } : d));
    toast({ title: `${ids.length} débito(s) recebido(s)` });
  };
  const bulkReabrir = (indices: number[]) => {
    const ids = indices.map(i => data[i]?.id).filter(Boolean);
    setAllData(prev => prev.map(d => ids.includes(d.id) ? { ...d, status: "Em aberto" as const } : d));
    toast({ title: `${ids.length} débito(s) reaberto(s)` });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Receber", icon: <CheckCircle className="h-4 w-4" />, onClick: bulkReceber, description: "Marca os débitos como pagos" },
    { label: "Reabrir", icon: <RotateCcw className="h-4 w-4" />, onClick: bulkReabrir, description: "Reabre os débitos selecionados" },
  ];

  const summaryCards: SummaryCard[] = [
    { label: "Total em Aberto", value: R$(allData.filter(d => d.status === "Em aberto").reduce((s, r) => s + r.valor, 0)), icon: <CreditCard className="h-4 w-4" /> },
  ];

  const columns: Column<Debito>[] = [
    { key: "cliente", label: "Cliente", pinned: true, render: (v) => <a href="/clientePesquisa" className="text-primary hover:underline font-medium">{v}</a> },
    { key: "descricao", label: "Descrição" },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    { key: "data", label: "Data" },
    { key: "vencimento", label: "Vencimento" },
    { key: "usuarioResponsavel", label: "Usuário Responsável" },
    { key: "status", label: "Status", render: v => <span className="font-medium" style={{ color: v === "Pago" ? "#00c5b4" : "#ff2f2f" }}>{v}</span> },
  ];

  const tabs: TabDef[] = [
    { label: "Todos", value: "todos", count: allData.length, color: "neutral" },
    { label: "Em aberto", value: "aberto", count: allData.filter(d => d.status === "Em aberto").length, color: "destructive" },
    { label: "Pagos", value: "pagos", count: allData.filter(d => d.status === "Pago").length, color: "success" },
  ];

  return (
    <AppLayout>
      <DataTable title="Relatório de Débitos" data={data} columns={columns} summaryCards={summaryCards} selectable selectionActions={selectionActions} tabs={tabs} activeTab={tab} onTabChange={setTab} pageSize={15} showDateFilter={true} tableId="relatorio_debitos" />
    </AppLayout>
  );
}
