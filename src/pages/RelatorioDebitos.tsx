import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, SummaryCard, TabDef } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CreditCard, CheckCircle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Debito {
  id: number;
  cliente: string;
  celular: string;
  descricao: string;
  valor: number;
  data: string;
  vencimento: string;
  pagoEm: string;
  usuarioResponsavel: string;
  status: "Em aberto" | "Pago";
}

const initialData: Debito[] = [
  {
    id: 1,
    cliente: "João Silva",
    celular: "(41) 99123-4567",
    descricao: "Corte + Barba",
    valor: 85,
    data: "01/04/2026",
    vencimento: "10/04/2026",
    pagoEm: "",
    usuarioResponsavel: "Admin",
    status: "Em aberto",
  },
  {
    id: 2,
    cliente: "Pedro Oliveira",
    celular: "(41) 99876-5432",
    descricao: "Coloração",
    valor: 200,
    data: "28/03/2026",
    vencimento: "05/04/2026",
    pagoEm: "",
    usuarioResponsavel: "Fernanda",
    status: "Em aberto",
  },
  {
    id: 3,
    cliente: "Lucas Almeida",
    celular: "(41) 98432-1098",
    descricao: "Pacote Corte 5x",
    valor: 200,
    data: "20/03/2026",
    vencimento: "30/03/2026",
    pagoEm: "28/03/2026",
    usuarioResponsavel: "Admin",
    status: "Pago",
  },
  {
    id: 4,
    cliente: "Ana Costa",
    celular: "(41) 99654-3210",
    descricao: "Produtos",
    valor: 150,
    data: "15/03/2026",
    vencimento: "25/03/2026",
    pagoEm: "24/03/2026",
    usuarioResponsavel: "Ana",
    status: "Pago",
  },
  {
    id: 5,
    cliente: "Carla Dias",
    celular: "",
    descricao: "Hidratação",
    valor: 120,
    data: "02/04/2026",
    vencimento: "12/04/2026",
    pagoEm: "",
    usuarioResponsavel: "Admin",
    status: "Em aberto",
  },
  {
    id: 6,
    cliente: "Roberto Lima",
    celular: "(41) 99111-2233",
    descricao: "Manicure",
    valor: 50,
    data: "03/04/2026",
    vencimento: "13/04/2026",
    pagoEm: "",
    usuarioResponsavel: "Fernanda",
    status: "Em aberto",
  },
];

const tabFilter = (row: Debito, tab: string) => {
  if (tab === "todos") return true;
  if (tab === "aberto") return row.status === "Em aberto";
  return row.status === "Pago";
};

const buildCards = (filtered: Debito[]): SummaryCard[] => [
  {
    label: "Total em Aberto",
    value: R$(filtered.filter((d) => d.status === "Em aberto").reduce((s, r) => s + r.valor, 0)),
    icon: <DollarSign className="h-4 w-4" />,
    size: "wide",
    color: "red",
  },
  {
    label: "Total Pago",
    value: R$(filtered.filter((d) => d.status === "Pago").reduce((s, r) => s + r.valor, 0)),
    icon: <DollarSign className="h-4 w-4" />,
    size: "wide",
    color: "green",
  },
];

export default function RelatorioDebitos() {
  const [aulaOpen, setAulaOpen] = useState(false);
  const [allData, setAllData] = useState(initialData);
  const [tab, setTab] = useState("todos");
  const { toast } = useToast();

  const bulkReceber = (indices: number[]) => {
    const ids = indices.map((i) => allData[i]?.id).filter(Boolean);
    setAllData((prev) =>
      prev.map((d) => (ids.includes(d.id) ? { ...d, status: "Pago" as const, pagoEm: "05/04/2026" } : d)),
    );
    toast({ title: `${ids.length} débito(s) recebido(s)` });
  };
  const bulkReabrir = (indices: number[]) => {
    const ids = indices.map((i) => allData[i]?.id).filter(Boolean);
    setAllData((prev) =>
      prev.map((d) => (ids.includes(d.id) ? { ...d, status: "Em aberto" as const, pagoEm: "" } : d)),
    );
    toast({ title: `${ids.length} débito(s) reaberto(s)` });
  };

  const selectionActions: SelectionAction[] = [
    {
      label: "Receber",
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: bulkReceber,
      description: "Marca os débitos como pagos",
    },
    {
      label: "Reabrir",
      icon: <RotateCcw className="h-4 w-4" />,
      onClick: bulkReabrir,
      description: "Reabre os débitos selecionados",
    },
  ];

  const columns: Column<Debito>[] = [
    {
      key: "cliente",
      label: "Cliente",
      pinned: true,
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <WhatsAppButton telefone={row.celular} nome={row.cliente} />
          <a href="/clientePesquisa" className="hover:underline font-medium">
            {v}
          </a>
        </div>
      ),
    },
    { key: "descricao", label: "Descrição" },
    { key: "valor", label: "Valor", align: "right", render: (v) => R$(v) },
    { key: "data", label: "Data" },
    { key: "pagoEm", label: "Pago Em:", render: (v, row) => (row.status === "Pago" ? v : "—") },
    { key: "usuarioResponsavel", label: "Usuário Responsável" },
    {
      key: "status",
      label: "Status",
      render: (v) => (
        <span className="font-medium" style={{ color: v === "Pago" ? "#00c5b4" : "#ff2f2f" }}>
          {v}
        </span>
      ),
    },
  ];

  const tabs: TabDef[] = [
    { label: "Todos", value: "todos", color: "neutral" },
    { label: "Em aberto", value: "aberto", color: "destructive" },
    { label: "Pagos", value: "pagos", color: "success" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Relatório de Débitos"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />}
        data={allData}
        columns={columns}
        summaryCards={buildCards}
        selectable
        selectionActions={selectionActions}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        tabFilterFn={tabFilter}
        pageSize={15}
        showDateFilter={true}
        tableId="relatorio_debitos"
      />
      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Relatório de Débitos"
      />
    </AppLayout>
  );
}
