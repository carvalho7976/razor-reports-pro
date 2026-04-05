import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction } from "@/components/DataTable";
import { FolderOpen, FolderClosed, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Comanda {
  id: number;
  cliente: string;
  profissional: string;
  abertura: string;
  fechamento: string;
  valor: number;
  fechadoPor: string;
  status: "Aberta" | "Fechada";
}

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const initialData: Comanda[] = [
  { id: 1, cliente: "João Silva", profissional: "Carlos", abertura: "05/04/2026 09:00", fechamento: "", valor: 120, fechadoPor: "", status: "Aberta" },
  { id: 2, cliente: "Maria Santos", profissional: "Ana", abertura: "05/04/2026 10:30", fechamento: "", valor: 85, fechadoPor: "", status: "Aberta" },
  { id: 3, cliente: "Pedro Oliveira", profissional: "Carlos", abertura: "04/04/2026 14:00", fechamento: "04/04/2026 15:30", valor: 150, fechadoPor: "Admin", status: "Fechada" },
  { id: 4, cliente: "Ana Costa", profissional: "Fernanda", abertura: "04/04/2026 11:00", fechamento: "04/04/2026 12:00", valor: 200, fechadoPor: "Fernanda", status: "Fechada" },
  { id: 5, cliente: "Lucas Almeida", profissional: "Carlos", abertura: "03/04/2026 16:00", fechamento: "03/04/2026 17:30", valor: 95, fechadoPor: "Admin", status: "Fechada" },
  { id: 6, cliente: "Carla Dias", profissional: "Ana", abertura: "05/04/2026 08:00", fechamento: "", valor: 180, fechadoPor: "", status: "Aberta" },
];

export default function Comandas() {
  const [allData, setAllData] = useState(initialData);
  const [tab, setTab] = useState("total");
  const { toast } = useToast();

  const data = useMemo(() => {
    if (tab === "total") return allData;
    if (tab === "abertas") return allData.filter(d => d.status === "Aberta");
    return allData.filter(d => d.status === "Fechada");
  }, [tab, allData]);

  const bulkOpen = (indices: number[]) => {
    const ids = indices.map(i => data[i]?.id).filter(Boolean);
    setAllData(prev => prev.map(d => ids.includes(d.id) ? { ...d, status: "Aberta" as const, fechamento: "", fechadoPor: "" } : d));
    toast({ title: `${ids.length} comanda(s) aberta(s)` });
  };
  const bulkClose = (indices: number[]) => {
    const ids = indices.map(i => data[i]?.id).filter(Boolean);
    setAllData(prev => prev.map(d => ids.includes(d.id) ? { ...d, status: "Fechada" as const, fechamento: "05/04/2026 18:00", fechadoPor: "Admin" } : d));
    toast({ title: `${ids.length} comanda(s) fechada(s)` });
  };
  const bulkRemove = (indices: number[]) => {
    const ids = indices.map(i => data[i]?.id).filter(Boolean);
    setAllData(prev => prev.filter(d => !ids.includes(d.id)));
    toast({ title: `${ids.length} comanda(s) removida(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Abrir", icon: <FolderOpen className="h-4 w-4" />, onClick: bulkOpen, description: "Reabre as comandas selecionadas" },
    { label: "Fechar", icon: <FolderClosed className="h-4 w-4" />, onClick: bulkClose, description: "Fecha as comandas selecionadas" },
    { label: "Remover", icon: <Trash2 className="h-4 w-4" />, onClick: bulkRemove, variant: "destructive", description: "Remove as comandas selecionadas" },
  ];

  const columns: Column<Comanda>[] = [
    { key: "cliente", label: "Cliente", pinned: true },
    { key: "profissional", label: "Profissional" },
    { key: "abertura", label: "Abertura" },
    { key: "fechamento", label: "Fechamento", render: v => v || "—" },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    { key: "fechadoPor", label: "Fechado por", render: v => v || "—" },
    {
      key: "status", label: "Status",
      render: v => <span className="font-medium" style={{ color: v === "Aberta" ? "#00c5b4" : "#6b7280" }}>{v}</span>,
    },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Comandas"
        data={data}
        columns={columns}
        selectable
        selectionActions={selectionActions}
        tabs={[
          { label: "Total", value: "total", count: allData.length },
          { label: "Abertas", value: "abertas", count: allData.filter(d => d.status === "Aberta").length },
          { label: "Fechadas", value: "fechadas", count: allData.filter(d => d.status === "Fechada").length },
        ]}
        activeTab={tab}
        onTabChange={setTab}
        pageSize={15}
      />
    </AppLayout>
  );
}
