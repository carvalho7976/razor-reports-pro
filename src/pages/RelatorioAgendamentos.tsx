import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, SummaryCard, TabDef } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { User, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Agendamento { id: number; cliente: string; celular: string; profissional: string; servico: string; data: string; horario: string; origem: string; valor: number; status: "Aberto" | "Realizado"; }
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const initialData: Agendamento[] = [
  { id: 1, cliente: "João Silva", celular: "(41) 99123-4567", profissional: "Carlos", servico: "Corte Masculino", data: "05/04/2026", horario: "09:00", origem: "App", valor: 50, status: "Aberto" },
  { id: 2, cliente: "Maria Santos", celular: "(41) 98765-4321", profissional: "Ana", servico: "Escova", data: "05/04/2026", horario: "10:30", origem: "WhatsApp", valor: 80, status: "Aberto" },
  { id: 3, cliente: "Pedro Oliveira", celular: "(41) 99876-5432", profissional: "Carlos", servico: "Barba", data: "04/04/2026", horario: "14:00", origem: "Presencial", valor: 35, status: "Realizado" },
  { id: 4, cliente: "Ana Costa", celular: "(41) 99654-3210", profissional: "Fernanda", servico: "Coloração", data: "04/04/2026", horario: "11:00", origem: "App", valor: 200, status: "Realizado" },
  { id: 5, cliente: "Lucas Almeida", celular: "(41) 98432-1098", profissional: "Carlos", servico: "Corte Masculino", data: "03/04/2026", horario: "16:00", origem: "Telefone", valor: 50, status: "Realizado" },
  { id: 6, cliente: "Carla Dias", celular: "", profissional: "Ana", servico: "Hidratação", data: "05/04/2026", horario: "08:00", origem: "App", valor: 120, status: "Aberto" },
];

// Parse "dd/MM/yyyy HH:mm" into sortable number
function parseDateTime(data: string, horario: string): number {
  const [d, m, y] = data.split("/").map(Number);
  const [h, min] = horario.split(":").map(Number);
  return new Date(y, m - 1, d, h, min).getTime();
}

export default function RelatorioAgendamentos() {
  const [allData, setAllData] = useState(initialData);
  const [tab, setTab] = useState("todos");
  const { toast } = useToast();

  const data = useMemo(() => {
    if (tab === "todos") return allData;
    if (tab === "abertos") return allData.filter(d => d.status === "Aberto");
    return allData.filter(d => d.status === "Realizado");
  }, [tab, allData]);

  const bulkRemove = (indices: number[]) => {
    const ids = indices.map(i => data[i]?.id).filter(Boolean);
    setAllData(prev => prev.filter(d => !ids.includes(d.id)));
    toast({ title: `${ids.length} agendamento(s) removido(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Remover", icon: <Trash2 className="h-4 w-4" />, onClick: bulkRemove, variant: "destructive", description: "Remove os agendamentos selecionados" },
  ];

  const origemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allData.forEach(d => { counts[d.origem] = (counts[d.origem] || 0) + 1; });
    return counts;
  }, [allData]);

  const summaryCards: SummaryCard[] = [
    { label: "Total", value: String(allData.length), type: "quantity", size: "compact" },
    ...Object.entries(origemCounts).map(([origem, count]) => ({
      label: origem,
      value: `${count} (${Math.round(count / allData.length * 100)}%)`,
      type: "quantity" as const,
      size: "compact" as const,
    })),
  ];

  const columns: Column<Agendamento>[] = [
    {
      key: "cliente", label: "Cliente", pinned: true,
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <WhatsAppButton telefone={row.celular} nome={row.cliente} />
          <a href="/clientePesquisa" className="hover:underline font-medium">{v}</a>
        </div>
      ),
    },
    {
      key: "profissional", label: "Profissional",
      render: (v) => (
        <div className="flex items-center gap-1.5">
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3 w-3 text-muted-foreground" />
          </div>
          <a href="/funcionarioPesquisa" className="hover:underline font-medium">{v}</a>
        </div>
      ),
    },
    { key: "servico", label: "Serviço" },
    {
      key: "data", label: "Data / Horário",
      render: (v, row) => `${v} ${row.horario}`,
      sortFn: (a: Agendamento, b: Agendamento) => parseDateTime(a.data, a.horario) - parseDateTime(b.data, b.horario),
    },
    { key: "origem", label: "Origem" },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    { key: "status", label: "Status", render: v => <span className="font-medium" style={{ color: v === "Realizado" ? "#00c5b4" : "#f59e0b" }}>{v}</span> },
  ];

  const tabs: TabDef[] = [
    { label: "Todos", value: "todos", count: allData.length, color: "neutral" },
    { label: "Abertos", value: "abertos", count: allData.filter(d => d.status === "Aberto").length, color: "warning" },
    { label: "Realizados", value: "realizados", count: allData.filter(d => d.status === "Realizado").length, color: "success" },
  ];

  return (
    <AppLayout>
      <DataTable title="Agendamentos" data={data} columns={columns} summaryCards={summaryCards} selectable selectionActions={selectionActions} tabs={tabs} activeTab={tab} onTabChange={setTab} pageSize={15} showDateFilter={true} tableId="relatorio_agendamentos" />
    </AppLayout>
  );
}
