import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard, TabDef } from "@/components/DataTable";
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
  const [tab, setTab] = useState("detalhado");

  const npsEmpresa = Math.round(initialData.reduce((s, r) => s + r.nota, 0) / initialData.length * 10);

  // NPS by profissional
  const profMap = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    initialData.forEach(r => {
      if (!map[r.profissional]) map[r.profissional] = { total: 0, count: 0 };
      map[r.profissional].total += r.nota;
      map[r.profissional].count++;
    });
    return map;
  }, []);

  const npsEquipe = Math.round(
    Object.values(profMap).reduce((s, v) => s + (v.total / v.count * 10), 0) / Object.keys(profMap).length
  );

  const npsRecepcao = 85; // placeholder

  const summaryCards: SummaryCard[] = [
    { label: "NPS Empresa", value: `${npsEmpresa}%`, icon: <Star className="h-4 w-4" /> },
    { label: "NPS Equipe Profissional", value: `${npsEquipe}%`, icon: <Star className="h-4 w-4" /> },
    { label: "NPS Recepção", value: `${npsRecepcao}%`, icon: <Star className="h-4 w-4" /> },
  ];

  const resumidoData = useMemo(() => {
    return Object.entries(profMap).map(([nome, v], i) => ({
      id: i + 1,
      profissional: nome,
      npsMedia: Math.round(v.total / v.count * 10),
      totalAvaliacoes: v.count,
    }));
  }, [profMap]);

  const columnsDetalhado: Column<Avaliacao>[] = [
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

  const columnsResumido: Column<any>[] = [
    {
      key: "foto" as any, label: "", sortable: false, filterable: false, width: "50px", align: "center",
      render: () => (
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mx-auto">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      ),
    },
    {
      key: "profissional", label: "Profissional", pinned: true,
      render: (v: string) => <a href="/funcionarioPesquisa" className="hover:underline font-medium">{v}</a>,
    },
    {
      key: "npsMedia", label: "NPS Média", align: "center",
      render: (v: number) => <span className="font-bold" style={{ color: v >= 90 ? "#00c5b4" : v >= 70 ? "#f59e0b" : "#ff2f2f" }}>{v}%</span>,
    },
    { key: "totalAvaliacoes", label: "Avaliações", align: "center" },
  ];

  const tabs: TabDef[] = [
    { label: "Resumido", value: "resumido", color: "neutral" },
    { label: "Detalhado", value: "detalhado", color: "info" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Avaliações"
        data={tab === "resumido" ? resumidoData : initialData}
        columns={tab === "resumido" ? columnsResumido : columnsDetalhado}
        summaryCards={summaryCards}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        showDateFilter={true}
        pageSize={15}
        tableId="avaliacoes"
      />
    </AppLayout>
  );
}
