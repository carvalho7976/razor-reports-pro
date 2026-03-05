import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column } from "@/components/DataTable";

interface Exclusao {
  dataAgendada: string;
  cliente: string;
  profissional: string;
  servico: string;
  usuarioExclusao: string;
  dataExclusao: string;
}

const data: Exclusao[] = [
  { dataAgendada: "04/03/2026 13:00", cliente: "Frizzar Demonstração", profissional: "Matheus", servico: "Barba Pacote", usuarioExclusao: "Cesar", dataExclusao: "04/03/2026 12:21" },
  { dataAgendada: "04/03/2026 13:05", cliente: "Leandro Carvalho", profissional: "Vini", servico: "Corte Masculino", usuarioExclusao: "Cesar", dataExclusao: "04/03/2026 12:22" },
  { dataAgendada: "04/03/2026 13:30", cliente: "Marcel Pires", profissional: "Vini", servico: "Corte Masculino", usuarioExclusao: "Cesar", dataExclusao: "04/03/2026 12:18" },
  { dataAgendada: "04/03/2026 13:35", cliente: "Diego Almeida", profissional: "Vini", servico: "Corte Masculino", usuarioExclusao: "Cesar", dataExclusao: "04/03/2026 12:22" },
];

const columns: Column<Exclusao>[] = [
  { key: "dataAgendada", label: "Data Agendada" },
  { key: "cliente", label: "Cliente" },
  { key: "profissional", label: "Profissional" },
  { key: "servico", label: "Serviço" },
  { key: "usuarioExclusao", label: "Usuário Exclusão" },
  { key: "dataExclusao", label: "Data Exclusão" },
];

export default function ExclusaoAgendamentos() {
  return (
    <AppLayout>
      <DataTable title="Relatório exclusão de agendamentos" data={data} columns={columns} />
    </AppLayout>
  );
}
