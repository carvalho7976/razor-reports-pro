import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { User, Star } from "lucide-react";

interface Avaliacao { id: number; cliente: string; celular: string; profissional: string; servico: string; nota: number; comentario: string; data: string; }

const initialData: Avaliacao[] = [
  { id: 1, cliente: "João Silva", celular: "(41) 99123-4567", profissional: "Carlos", servico: "Corte Masculino", nota: 10, comentario: "Excelente!", data: "05/04/2026" },
  { id: 2, cliente: "Maria Santos", celular: "(41) 98765-4321", profissional: "Ana", servico: "Escova", nota: 9, comentario: "Muito bom", data: "04/04/2026" },
  { id: 3, cliente: "Pedro Oliveira", celular: "(41) 99876-5432", profissional: "Carlos", servico: "Barba", nota: 8, comentario: "Bom atendimento", data: "04/04/2026" },
  { id: 4, cliente: "Ana Costa", celular: "(41) 99654-3210", profissional: "Fernanda", servico: "Coloração", nota: 10, comentario: "Perfeito!", data: "03/04/2026" },
  { id: 5, cliente: "Lucas Almeida", celular: "(41) 98432-1098", profissional: "Carlos", servico: "Corte Masculino", nota: 7, comentario: "Regular", data: "03/04/2026" },
  { id: 6, cliente: "Carla Dias", celular: "", profissional: "Ana", servico: "Hidratação", nota: 6, comentario: "Poderia melhorar", data: "02/04/2026" },
  { id: 7, cliente: "Roberto Lima", celular: "(41) 99111-2233", profissional: "Fernanda", servico: "Manicure", nota: 9, comentario: "Ótimo", data: "02/04/2026" },
];

export default function Avaliacoes() {
  const npsGeral = Math.round(initialData.reduce((s, r) => s + r.nota, 0) / initialData.length * 10);
  const summaryCards: SummaryCard[] = [{ label: "NPS Geral", value: `${npsGeral}%`, icon: <Star className="h-4 w-4" /> }];

  const columns: Column<Avaliacao>[] = [
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
    { key: "nota", label: "Nota", align: "center", render: v => <span className="font-medium" style={{ color: v >= 9 ? "#00c5b4" : v >= 7 ? "#f59e0b" : "#ff2f2f" }}>{v}</span> },
    { key: "comentario", label: "Comentário" },
    { key: "data", label: "Data" },
  ];

  return (
    <AppLayout>
      <DataTable title="Avaliações" data={initialData} columns={columns} summaryCards={summaryCards} showDateFilter={true} pageSize={15} tableId="avaliacoes" />
    </AppLayout>
  );
}