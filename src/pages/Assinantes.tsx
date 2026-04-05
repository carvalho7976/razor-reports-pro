import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, SummaryCard } from "@/components/DataTable";
import { XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Assinante {
  id: number;
  nome: string;
  plano: string;
  inicio: string;
  vencimento: string;
  valor: number;
  status: string;
}

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const initialData: Assinante[] = [
  { id: 1, nome: "CAIO CESAR DE SOUZA FERNANDES", plano: "Plano Mensal", inicio: "01/01/2026", vencimento: "01/04/2026", valor: 89.9, status: "Ativo" },
  { id: 2, nome: "Everton", plano: "Plano Trimestral", inicio: "15/12/2025", vencimento: "15/03/2026", valor: 239.9, status: "Atrasado" },
  { id: 3, nome: "Luis Alberto Santos", plano: "Plano Mensal", inicio: "10/02/2026", vencimento: "10/03/2026", valor: 89.9, status: "Atrasado" },
  { id: 4, nome: "Gean", plano: "Plano Semestral", inicio: "01/11/2025", vencimento: "01/05/2026", valor: 449.9, status: "Ativo" },
  { id: 5, nome: "Marcel Pires", plano: "Plano Mensal", inicio: "20/02/2026", vencimento: "20/03/2026", valor: 89.9, status: "Atrasado" },
  { id: 6, nome: "Diego Almeida", plano: "Plano Mensal", inicio: "05/03/2026", vencimento: "05/04/2026", valor: 89.9, status: "Ativo" },
];

export default function Assinantes() {
  const [allData, setAllData] = useState(initialData);
  const { toast } = useToast();

  const bulkCancel = (indices: number[]) => {
    const ids = indices.map((i) => allData[i]?.id).filter(Boolean);
    setAllData((prev) => prev.filter((d) => !ids.includes(d.id)));
    toast({ title: `${ids.length} assinatura(s) cancelada(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Cancelar", icon: <XCircle className="h-4 w-4" />, onClick: bulkCancel, variant: "destructive", description: "Cancela as assinaturas selecionadas" },
  ];

  const totalAssinantes = allData.length;
  const totalAtrasados = allData.filter(d => d.status === "Atrasado").length;

  const summaryCards: SummaryCard[] = [
    { label: "Total", value: String(totalAssinantes), type: "quantity" },
    { label: "Atrasados", value: String(totalAtrasados), type: "quantity" },
  ];

  const columns: Column<Assinante>[] = [
    { key: "nome", label: "Nome", pinned: true },
    { key: "plano", label: "Plano" },
    { key: "inicio", label: "Início" },
    { key: "vencimento", label: "Vencimento" },
    { key: "valor", label: "Valor", align: "right", render: (v) => R$(v) },
    {
      key: "status", label: "Status",
      render: (v) => (
        <span className="font-medium" style={{ color: v === "Ativo" ? "#00c5b4" : "#ff2f2f" }}>
          {v}
        </span>
      ),
    },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Assinantes"
        data={allData}
        columns={columns}
        showDateFilter={false}
        summaryCards={summaryCards}
        selectable
        selectionActions={selectionActions}
        novoMenuItems={[{ label: "Novo assinante" }]}
        pageSize={15}
      />
    </AppLayout>
  );
}
