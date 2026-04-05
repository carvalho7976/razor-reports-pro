import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, SummaryCard, TabDef } from "@/components/DataTable";
import { CreditCard, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Assinante { id: number; nome: string; plano: string; inicio: string; vencimento: string; valor: number; status: string; }
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const initialData: Assinante[] = [
  { id: 1, nome: "CAIO CESAR DE SOUZA FERNANDES", plano: "Plano Mensal", inicio: "01/01/2026", vencimento: "01/04/2026", valor: 89.9, status: "Ativo" },
  { id: 2, nome: "Everton", plano: "Plano Trimestral", inicio: "15/12/2025", vencimento: "15/03/2026", valor: 239.9, status: "Atrasado" },
  { id: 3, nome: "Luis Alberto Santos", plano: "Plano Mensal", inicio: "10/02/2026", vencimento: "10/03/2026", valor: 89.9, status: "Atrasado" },
  { id: 4, nome: "Gean", plano: "Plano Semestral", inicio: "01/11/2025", vencimento: "01/05/2026", valor: 449.9, status: "Ativo" },
  { id: 5, nome: "Marcel Pires", plano: "Plano Mensal", inicio: "20/02/2026", vencimento: "20/03/2026", valor: 89.9, status: "Atrasado" },
  { id: 6, nome: "Diego Almeida", plano: "Plano Mensal", inicio: "05/03/2026", vencimento: "05/04/2026", valor: 89.9, status: "Ativo" },
];

export default function Assinantes() {
  const [allData, setAllData] = useState(initialData);
  const { toast } = useToast();
  const [tab, setTab] = useState("total");

  const data = useMemo(() => tab === "total" ? allData : allData.filter(d => tab === "ativo" ? d.status === "Ativo" : d.status === "Atrasado"), [tab, allData]);

  const bulkCancel = (indices: number[]) => {
    const ids = indices.map((i) => data[i]?.id).filter(Boolean);
    setAllData((prev) => prev.filter((d) => !ids.includes(d.id)));
    toast({ title: `${ids.length} assinatura(s) cancelada(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Cancelar", icon: <XCircle className="h-4 w-4" />, onClick: bulkCancel, variant: "destructive", description: "Cancela as assinaturas selecionadas" },
  ];

  const summaryCards: SummaryCard[] = [
    { label: "Total Assinatura", value: R$(allData.filter(d => d.status === "Ativo").reduce((s, r) => s + r.valor, 0)), icon: <CreditCard className="h-4 w-4" /> },
    { label: "Total Atrasado", value: R$(allData.filter(d => d.status === "Atrasado").reduce((s, r) => s + r.valor, 0)), icon: <CreditCard className="h-4 w-4" /> },
    { label: "Total", value: String(allData.length), type: "quantity" },
    { label: "Atrasados", value: String(allData.filter(d => d.status === "Atrasado").length), type: "quantity" },
  ];

  const columns: Column<Assinante>[] = [
    { key: "nome", label: "Nome", pinned: true, render: (v) => <a href="/clientePesquisa" className="text-primary hover:underline font-medium">{v}</a> },
    { key: "plano", label: "Plano" },
    { key: "inicio", label: "Início" },
    { key: "vencimento", label: "Vencimento" },
    { key: "valor", label: "Valor", align: "right", render: (v) => R$(v) },
    { key: "status", label: "Status", render: (v) => <span className="font-medium" style={{ color: v === "Ativo" ? "#00c5b4" : "#ff2f2f" }}>{v}</span> },
  ];

  const tabs: TabDef[] = [
    { label: "Total", value: "total", count: allData.length, color: "neutral" },
    { label: "Ativos", value: "ativo", count: allData.filter(d => d.status === "Ativo").length, color: "success" },
    { label: "Atrasados", value: "atrasado", count: allData.filter(d => d.status === "Atrasado").length, color: "destructive" },
  ];

  return (
    <AppLayout>
      <DataTable title="Assinantes" data={data} columns={columns} showDateFilter={true} summaryCards={summaryCards} tabs={tabs} activeTab={tab} onTabChange={setTab} selectable selectionActions={selectionActions} novoMenuItems={[{ label: "Novo assinante" }]} pageSize={15} tableId="assinantes" />
    </AppLayout>
  );
}
