import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { User, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";

interface Exclusao {
  id: number;
  dataAgendada: string;
  cliente: string;
  celular: string;
  profissional: string;
  servico: string;
  excluidoPor: string;
  dataExclusao: string;
}

const initialData: Exclusao[] = [
  { id: 1, dataAgendada: "04/03/2026 13:00", cliente: "Frizzar Demonstração", celular: "(41) 99111-2233", profissional: "Matheus", servico: "Barba Pacote", excluidoPor: "Cesar", dataExclusao: "04/03/2026 12:21" },
  { id: 2, dataAgendada: "04/03/2026 13:05", cliente: "Leandro Carvalho", celular: "(41) 99123-4567", profissional: "Vini", servico: "Corte Masculino", excluidoPor: "Cesar", dataExclusao: "04/03/2026 12:22" },
  { id: 3, dataAgendada: "04/03/2026 13:30", cliente: "Marcel Pires", celular: "(41) 98765-4321", profissional: "Vini", servico: "Corte Masculino", excluidoPor: "Cesar", dataExclusao: "04/03/2026 12:18" },
  { id: 4, dataAgendada: "04/03/2026 13:35", cliente: "Diego Almeida", celular: "(41) 99876-5432", profissional: "Vini", servico: "Corte Masculino", excluidoPor: "Cesar", dataExclusao: "04/03/2026 12:22" },
];

export default function ExclusaoAgendamentos() {
  const [aulaOpen, setAulaOpen] = useState(false);
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
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <a href="/funcionarioPesquisa" className="hover:underline font-medium">{v}</a>
        </div>
      ),
    },
    { key: "servico", label: "Serviço" },
    { key: "excluidoPor", label: "Excluído por" },
    { key: "dataExclusao", label: "Data Exclusão" },
  ];

  return (
    <AppLayout>
      <DataTable title="Exclusão de Agendamentos"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />} data={allData} columns={columns} showDateFilter={true} selectable selectionActions={selectionActions} pageSize={15} tableId="exclusao_agendamentos" />
      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Exclusão de Agendamentos"
      />
    </AppLayout>
  );
}