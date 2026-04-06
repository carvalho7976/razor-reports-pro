import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, SummaryCard } from "@/components/DataTable";
import { User, CheckCircle, Trash2, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Adiantamento {
  id: number;
  data: string;
  profissional: string;
  valor: number;
  status: string;
  observacao: string;
}

const initialData: Adiantamento[] = [
  { id: 1, data: "03/02/2026", profissional: "Cesar", valor: 100, status: "Em aberto", observacao: "Balm - Qtd: 1 - R$ 100.00 desconto" },
  { id: 2, data: "10/02/2026", profissional: "Claudia", valor: 20, status: "Devolvido", observacao: "Vale transporte" },
  { id: 3, data: "15/02/2026", profissional: "Lara", valor: 100, status: "Em aberto", observacao: "Adiantamento salarial" },
  { id: 4, data: "20/02/2026", profissional: "Ramon", valor: 150, status: "Devolvido", observacao: "Vale alimentação" },
  { id: 5, data: "01/03/2026", profissional: "Fila de espera", valor: 60, status: "Em aberto", observacao: "Produto desconto" },
];

export default function Adiantamentos() {
  const [allData, setAllData] = useState(initialData);
  const { toast } = useToast();

  const totalEmAberto = allData.filter(d => d.status === "Em aberto").reduce((s, r) => s + r.valor, 0);
  const totalDevolvido = allData.filter(d => d.status === "Devolvido").reduce((s, r) => s + r.valor, 0);

  const bulkQuitar = (indices: number[]) => {
    const ids = indices.map((i) => allData[i]?.id).filter(Boolean);
    setAllData((prev) => prev.map((d) => ids.includes(d.id) ? { ...d, status: "Devolvido" } : d));
    toast({ title: `${ids.length} adiantamento(s) quitado(s)` });
  };
  const bulkDelete = (indices: number[]) => {
    const ids = indices.map((i) => allData[i]?.id).filter(Boolean);
    setAllData((prev) => prev.filter((d) => !ids.includes(d.id)));
    toast({ title: `${ids.length} adiantamento(s) removido(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Quitar", icon: <CheckCircle className="h-4 w-4" />, onClick: bulkQuitar, description: "Marca os adiantamentos selecionados como devolvidos" },
    { label: "Deletar", icon: <Trash2 className="h-4 w-4" />, onClick: bulkDelete, variant: "destructive", description: "Remove permanentemente os adiantamentos selecionados" },
  ];

  const summaryCards: SummaryCard[] = [
    { label: "Em aberto", value: R$(totalEmAberto), icon: <CreditCard className="h-4 w-4" /> },
    { label: "Devolvido", value: R$(totalDevolvido), icon: <CreditCard className="h-4 w-4" /> },
  ];

  const columns: Column<Adiantamento>[] = [
    { key: "data", label: "Data" },
    {
      key: "profissional", label: "Profissional", pinned: true,
      render: (v) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <a href="/funcionarioPesquisa" className="hover:underline font-medium">{v}</a>
        </div>
      ),
    },
    { key: "valor", label: "Valor", align: "right", render: (v) => R$(v) },
    {
      key: "status", label: "Status",
      render: (v) => <span className="font-medium" style={{ color: v === "Devolvido" ? "#00c5b4" : "#ff2f2f" }}>{v}</span>,
    },
    { key: "observacao", label: "Observação" },
  ];

  const total = allData.reduce((s, r) => s + r.valor, 0);

  return (
    <AppLayout>
      <DataTable
        title="Adiantamentos"
        data={allData}
        columns={columns}
        totalRow={{ profissional: "Total:", valor: R$(total) }}
        summaryCards={summaryCards}
        selectable
        selectionActions={selectionActions}
        novoMenuItems={[{ label: "Novo Vale" }, { label: "Vender Produto" }]}
        pageSize={15}
        showDateFilter={true}
        tableId="adiantamentos"
      />
    </AppLayout>
  );
}