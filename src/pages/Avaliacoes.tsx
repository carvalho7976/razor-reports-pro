import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard } from "@/components/DataTable";
import { Star } from "lucide-react";

interface Avaliacao { id: number; cliente: string; profissional: string; servico: string; nota: number; comentario: string; data: string; }

const initialData: Avaliacao[] = [
  { id: 1, cliente: "João Silva", profissional: "Carlos", servico: "Corte Masculino", nota: 10, comentario: "Excelente!", data: "05/04/2026" },
  { id: 2, cliente: "Maria Santos", profissional: "Ana", servico: "Escova", nota: 9, comentario: "Muito bom", data: "04/04/2026" },
  { id: 3, cliente: "Pedro Oliveira", profissional: "Carlos", servico: "Barba", nota: 8, comentario: "Bom atendimento", data: "04/04/2026" },
  { id: 4, cliente: "Ana Costa", profissional: "Fernanda", servico: "Coloração", nota: 10, comentario: "Perfeito!", data: "03/04/2026" },
  { id: 5, cliente: "Lucas Almeida", profissional: "Carlos", servico: "Corte Masculino", nota: 7, comentario: "Regular", data: "03/04/2026" },
  { id: 6, cliente: "Carla Dias", profissional: "Ana", servico: "Hidratação", nota: 6, comentario: "Poderia melhorar", data: "02/04/2026" },
  { id: 7, cliente: "Roberto Lima", profissional: "Fernanda", servico: "Manicure", nota: 9, comentario: "Ótimo", data: "02/04/2026" },
];

export default function Avaliacoes() {
  const npsGeral = Math.round(initialData.reduce((s, r) => s + r.nota, 0) / initialData.length * 10);
  const summaryCards: SummaryCard[] = [{ label: "NPS Geral", value: `${npsGeral}%`, icon: <Star className="h-4 w-4" /> }];

  const columns: Column<Avaliacao>[] = [
    { key: "cliente", label: "Cliente", pinned: true, render: (v) => <a href="/clientePesquisa" className="text-primary hover:underline font-medium">{v}</a> },
    { key: "profissional", label: "Profissional", render: (v) => <a href="/funcionarioPesquisa" className="text-primary hover:underline font-medium">{v}</a> },
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
