import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, ActionsMenu } from "@/components/DataTable";
import { Undo2, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Exclusao {
  id: number;
  dataAgendada: string;
  cliente: string;
  profissional: string;
  servico: string;
  usuarioExclusao: string;
  dataExclusao: string;
}

const initialData: Exclusao[] = [
  { id: 1, dataAgendada: "04/03/2026 13:00", cliente: "Frizzar Demonstração", profissional: "Matheus", servico: "Barba Pacote", usuarioExclusao: "Cesar", dataExclusao: "04/03/2026 12:21" },
  { id: 2, dataAgendada: "04/03/2026 13:05", cliente: "Leandro Carvalho", profissional: "Vini", servico: "Corte Masculino", usuarioExclusao: "Cesar", dataExclusao: "04/03/2026 12:22" },
  { id: 3, dataAgendada: "04/03/2026 13:30", cliente: "Marcel Pires", profissional: "Vini", servico: "Corte Masculino", usuarioExclusao: "Cesar", dataExclusao: "04/03/2026 12:18" },
  { id: 4, dataAgendada: "04/03/2026 13:35", cliente: "Diego Almeida", profissional: "Vini", servico: "Corte Masculino", usuarioExclusao: "Cesar", dataExclusao: "04/03/2026 12:22" },
];

export default function ExclusaoAgendamentos() {
  const [data, setData] = useState(initialData);
  const { toast } = useToast();

  const restore = (id: number) => {
    toast({ title: "Agendamento restaurado" });
  };

  const remove = (id: number) => {
    setData((prev) => prev.filter((d) => d.id !== id));
    toast({ title: "Registro removido", variant: "destructive" });
  };

  const columns: Column<Exclusao>[] = [
    { key: "dataAgendada", label: "Data Agendada" },
    { key: "cliente", label: "Cliente" },
    { key: "profissional", label: "Profissional" },
    { key: "servico", label: "Serviço" },
    { key: "usuarioExclusao", label: "Usuário Exclusão" },
    { key: "dataExclusao", label: "Data Exclusão" },
    {
      key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
      render: (_v, row) => (
        <ActionsMenu items={[
          { label: "Restaurar", icon: <Undo2 className="h-4 w-4" />, onClick: () => restore(row.id) },
          { label: "Detalhes", icon: <Eye className="h-4 w-4" /> },
          { label: "Excluir definitivamente", icon: <Trash2 className="h-4 w-4" />, variant: "destructive", onClick: () => remove(row.id) },
        ]} />
      ),
    },
  ];

  return (
    <AppLayout>
      <DataTable title="Relatório exclusão de agendamentos" data={data} columns={columns} />
    </AppLayout>
  );
}
