import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, SummaryCard } from "@/components/DataTable";
import { Trash2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Agendamento {
  id: number;
  cliente: string;
  profissional: string;
  servico: string;
  data: string;
  horario: string;
  origem: string;
  valor: number;
  status: "Aberto" | "Realizado";
}

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const initialData: Agendamento[] = [
  { id: 1, cliente: "João Silva", profissional: "Carlos", servico: "Corte Masculino", data: "05/04/2026", horario: "09:00", origem: "App", valor: 50, status: "Aberto" },
  { id: 2, cliente: "Maria Santos", profissional: "Ana", servico: "Escova", data: "05/04/2026", horario: "10:30", origem: "WhatsApp", valor: 80, status: "Aberto" },
  { id: 3, cliente: "Pedro Oliveira", profissional: "Carlos", servico: "Barba", data: "04/04/2026", horario: "14:00", origem: "Presencial", valor: 35, status: "Realizado" },
  { id: 4, cliente: "Ana Costa", profissional: "Fernanda", servico: "Coloração", data: "04/04/2026", horario: "11:00", origem: "App", valor: 200, status: "Realizado" },
  { id: 5, cliente: "Lucas Almeida", profissional: "Carlos", servico: "Corte Masculino", data: "03/04/2026", horario: "16:00", origem: "Telefone", valor: 50, status: "Realizado" },
  { id: 6, cliente: "Carla Dias", profissional: "Ana", servico: "Hidratação", data: "05/04/2026", horario: "08:00", origem: "App", valor: 120, status: "Aberto" },
];

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

  const summaryCards: SummaryCard[] = [
    { label: "Total", value: String(allData.length), type: "quantity" },
    { label: "Origem App", value: String(allData.filter(d => d.origem === "App").length), type: "quantity" },
  ];

  const columns: Column<Agendamento>[] = [
    { key: "cliente", label: "Cliente", pinned: true },
    { key: "profissional", label: "Profissional" },
    { key: "servico", label: "Serviço" },
    { key: "data", label: "Data" },
    { key: "horario", label: "Horário" },
    { key: "origem", label: "Origem" },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    {
      key: "status", label: "Status",
      render: v => <span className="font-medium" style={{ color: v === "Realizado" ? "#00c5b4" : "#f59e0b" }}>{v}</span>,
    },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Relatório de Agendamentos"
        data={data}
        columns={columns}
        summaryCards={summaryCards}
        selectable
        selectionActions={selectionActions}
        tabs={[
          { label: "Todos", value: "todos", count: allData.length },
          { label: "Abertos", value: "abertos", count: allData.filter(d => d.status === "Aberto").length },
          { label: "Realizados", value: "realizados", count: allData.filter(d => d.status === "Realizado").length },
        ]}
        activeTab={tab}
        onTabChange={setTab}
        pageSize={15}
      />
    </AppLayout>
  );
}
