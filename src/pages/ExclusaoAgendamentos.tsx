import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction } from "@/components/DataTable";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Exclusao {
  id: number;
  dataAgendada: string;
  cliente: string;
  profissional: string;
  servico: string;
  excluidoPor: string;
  dataExclusao: string;
}

const initialData: Exclusao[] = [
  { id: 1, dataAgendada: "04/03/2026 13:00", cliente: "Frizzar Demonstração", profissional: "Matheus", servico: "Barba Pacote", excluidoPor: "Cesar", dataExclusao: "04/03/2026 12:21" },
  { id: 2, dataAgendada: "04/03/2026 13:05", cliente: "Leandro Carvalho", profissional: "Vini", servico: "Corte Masculino", excluidoPor: "Cesar", dataExclusao: "04/03/2026 12:22" },
  { id: 3, dataAgendada: "04/03/2026 13:30", cliente: "Marcel Pires", profissional: "Vini", servico: "Corte Masculino", excluidoPor: "Cesar", dataExclusao: "04/03/2026 12:18" },
  { id: 4, dataAgendada: "04/03/2026 13:35", cliente: "Diego Almeida", profissional: "Vini", servico: "Corte Masculino", excluidoPor: "Cesar", dataExclusao: "04/03/2026 12:22" },
];

export default function ExclusaoAgendamentos() {
  const [allData, setAllData] = useState(initialData);
  const { toast } = useToast();

  const bulkRestore = (indices: number[]) => {
    const ids = indices.map((i) => allData[i]?.id).filter(Boolean);
    setAllData((prev) => prev.filter((d) => !ids.includes(d.id)));
    toast({ title: `${ids.length} agendamento(s) restaurado(s)` });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Restaurar", icon: <RotateCcw className="h-4 w-4" />, onClick: bulkRestore, description: "Restaura os agendamentos selecionados" },
  ];

  const columns: Column<Exclusao>[] = [
    { key: "dataAgendada", label: "Data Agendada" },
    { key: "cliente", label: "Cliente", pinned: true, render: (v) => <a href="/clientePesquisa" className="text-primary hover:underline font-medium">{v}</a> },
    { key: "profissional", label: "Profissional", render: (v) => <a href="/funcionarioPesquisa" className="text-primary hover:underline font-medium">{v}</a> },
    { key: "servico", label: "Serviço" },
    { key: "excluidoPor", label: "Excluído por" },
    { key: "dataExclusao", label: "Data Exclusão" },
  ];

  return (
    <AppLayout>
      <DataTable title="Exclusão de Agendamentos" data={allData} columns={columns} showDateFilter={true} selectable selectionActions={selectionActions} pageSize={15} tableId="exclusao_agendamentos" />
    </AppLayout>
  );
}
