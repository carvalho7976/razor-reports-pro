import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard, TabDef } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { User, CreditCard, Hash } from "lucide-react";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Pacote { id: number; nome: string; cliente: string; celular: string; totalPacote: number; restam: number; valor: number; desconto: number; dataVenda: string; profissional: string; }

const initialData: Pacote[] = [
  { id: 1, nome: "Pacote Barba + Corte 4x", cliente: "João Silva", celular: "(41) 99123-4567", totalPacote: 4, restam: 2, valor: 160, desconto: 20, dataVenda: "01/03/2026", profissional: "Carlos" },
  { id: 2, nome: "Pacote Hidratação 3x", cliente: "Maria Santos", celular: "(41) 98765-4321", totalPacote: 3, restam: 0, valor: 270, desconto: 30, dataVenda: "15/02/2026", profissional: "Ana" },
  { id: 3, nome: "Pacote Corte 5x", cliente: "Pedro Oliveira", celular: "(41) 99876-5432", totalPacote: 5, restam: 3, valor: 200, desconto: 25, dataVenda: "10/03/2026", profissional: "Carlos" },
  { id: 4, nome: "Pacote Coloração 2x", cliente: "Ana Costa", celular: "(41) 99654-3210", totalPacote: 2, restam: 1, valor: 350, desconto: 50, dataVenda: "20/02/2026", profissional: "Fernanda" },
  { id: 5, nome: "Pacote Barba + Corte 4x", cliente: "Lucas Almeida", celular: "(41) 98432-1098", totalPacote: 4, restam: 0, valor: 160, desconto: 10, dataVenda: "05/03/2026", profissional: "Carlos" },
];

const tabFilter = (row: Pacote, tab: string) => {
  if (tab === "em_uso") return row.restam > 0;
  return row.restam === 0;
};

const buildCards = (filtered: Pacote[]): SummaryCard[] => [
  { label: "Total Vendido", value: String(filtered.length), type: "quantity", icon: <Hash className="h-4 w-4" />, size: "compact", color: "blue" },
  { label: "Valor Vendido", value: R$(filtered.reduce((s, r) => s + r.valor, 0)), icon: <CreditCard className="h-4 w-4" />, size: "wide", color: "green" },
  { label: "Total de Desconto", value: R$(filtered.reduce((s, r) => s + r.desconto, 0)), icon: <CreditCard className="h-4 w-4" />, size: "wide", color: "red" },
];

export default function RelatorioPacotes() {
  const [aulaOpen, setAulaOpen] = useState(false);
  const [tab, setTab] = useState("em_uso");

  const tabs: TabDef[] = [
    { label: "Em uso", value: "em_uso", color: "info" },
    { label: "Finalizados", value: "finalizados", color: "neutral" },
  ];

  const columns: Column<Pacote>[] = [
    { key: "nome", label: "Pacote", pinned: true },
    { key: "cliente", label: "Cliente", render: (v, row) => (
      <div className="flex items-center gap-1.5">
        <WhatsAppButton telefone={row.celular} nome={row.cliente} />
        <a href="/clientePesquisa" className="hover:underline font-medium">{v}</a>
      </div>
    )},
    { key: "profissional", label: "Profissional", render: v => (
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center"><User className="h-3.5 w-3.5 text-muted-foreground" /></div>
        <a href="/funcionarioPesquisa" className="hover:underline font-medium">{v}</a>
      </div>
    )},
    { key: "restam" as any, label: "Restam", align: "center", render: (_v: any, row: Pacote) => {
      const ratio = row.restam / row.totalPacote;
      const color = ratio <= 0 ? "#ff2f2f" : ratio <= 0.25 ? "#f59e0b" : "#00c5b4";
      return <span className="font-medium" style={{ color }}>{row.restam} / {row.totalPacote}</span>;
    }},
    { key: "valor", label: "Preço", align: "right", render: v => R$(v) },
    { key: "desconto", label: "Desconto", align: "right", render: v => R$(v) },
    { key: "dataVenda", label: "Data Venda" },
  ];

  return (
    <AppLayout>
      <DataTable title="Relatório de Pacotes"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />}
        data={initialData}
        columns={columns}
        summaryCards={buildCards}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        tabFilterFn={tabFilter}
        pageSize={15}
        showDateFilter={true}
        tableId="relatorio_pacotes"
        dateField="dataVenda"
      />
      <YouTubeModal open={aulaOpen} onClose={() => setAulaOpen(false)} videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Aula - Pacotes" />
    </AppLayout>
  );
}
