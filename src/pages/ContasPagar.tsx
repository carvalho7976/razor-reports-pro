import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, ActionsMenu, SelectionAction, SummaryCard } from "@/components/DataTable";
import { CheckCircle, XCircle, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Conta {
  id: number;
  conta: string;
  descricao: string;
  vencimento: string;
  valor: number;
  status: string;
  dataPagamento: string;
}

const initialData: Conta[] = [
  { id: 1, conta: "Aluguel", descricao: "Aluguel do salão", vencimento: "10/03/2026", valor: 3500, status: "Pendente", dataPagamento: "" },
  { id: 2, conta: "Energia", descricao: "Conta de luz", vencimento: "15/03/2026", valor: 890, status: "Pendente", dataPagamento: "" },
  { id: 3, conta: "Água", descricao: "Conta de água", vencimento: "12/03/2026", valor: 280, status: "Pago", dataPagamento: "12/03/2026" },
  { id: 4, conta: "Internet", descricao: "Internet fibra", vencimento: "20/03/2026", valor: 199.9, status: "Pendente", dataPagamento: "" },
  { id: 5, conta: "Fornecedor", descricao: "Produtos de barba", vencimento: "05/03/2026", valor: 1250, status: "Pago", dataPagamento: "04/03/2026" },
  { id: 6, conta: "Manutenção", descricao: "Reparo cadeira", vencimento: "25/03/2026", valor: 450, status: "Pendente", dataPagamento: "" },
];

export default function ContasPagar() {
  const [tab, setTab] = useState("pendentes");
  const [allData, setAllData] = useState(initialData);
  const { toast } = useToast();

  const toggleStatus = (id: number) => {
    setAllData((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: d.status === "Pendente" ? "Pago" : "Pendente", dataPagamento: d.status === "Pendente" ? new Date().toLocaleDateString("pt-BR") : "" }
          : d
      )
    );
    toast({ title: "Status atualizado" });
  };

  const remove = (id: number) => {
    setAllData((prev) => prev.filter((d) => d.id !== id));
    toast({ title: "Conta removida", variant: "destructive" });
  };

  const data = useMemo(() =>
    allData.filter((d) =>
      tab === "todas" ? true : tab === "pendentes" ? d.status === "Pendente" : d.status === "Pago"
    ), [tab, allData]);

  const totalEmAberto = allData.filter((d) => d.status === "Pendente").reduce((s, r) => s + r.valor, 0);
  const totalPago = allData.filter((d) => d.status === "Pago").reduce((s, r) => s + r.valor, 0);

  const bulkMarkPaid = (indices: number[]) => {
    const ids = indices.map((i) => data[i]?.id).filter(Boolean);
    setAllData((prev) =>
      prev.map((d) => ids.includes(d.id) ? { ...d, status: "Pago", dataPagamento: new Date().toLocaleDateString("pt-BR") } : d)
    );
    toast({ title: `${ids.length} conta(s) marcada(s) como paga(s)` });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Pagar", icon: <CheckCircle className="h-4 w-4" />, onClick: bulkMarkPaid, description: "Marca as contas selecionadas como pagas" },
  ];

  const summaryCards: SummaryCard[] = [
    { label: "Em aberto", value: R$(totalEmAberto), type: "monetary", sentiment: "negative" },
    { label: "Pago", value: R$(totalPago), type: "monetary", sentiment: "positive" },
  ];

  const columns: Column<Conta>[] = [
    { key: "conta", label: "Conta", pinned: true },
    { key: "descricao", label: "Descrição" },
    { key: "vencimento", label: "Vencimento" },
    { key: "valor", label: "Valor", align: "right", render: (v) => R$(v) },
    {
      key: "status", label: "Status",
      render: (v) => (
        <span className="font-medium" style={{ color: v === "Pago" ? "#00c5b4" : "#ff2f2f" }}>
          {v}
        </span>
      ),
    },
    { key: "dataPagamento", label: "Data Pagamento" },
    {
      key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
      render: (_v, row) => (
        <ActionsMenu items={[
          {
            label: row.status === "Pendente" ? "Marcar como pago" : "Marcar como pendente",
            icon: row.status === "Pendente" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />,
            onClick: () => toggleStatus(row.id),
          },
          { label: "Editar", icon: <Pencil className="h-4 w-4" /> },
          { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, variant: "destructive", onClick: () => remove(row.id) },
        ]} />
      ),
    },
  ];

  const total = data.reduce((s, r) => s + r.valor, 0);

  return (
    <AppLayout>
      <DataTable
        title="Contas à Pagar"
        data={data}
        columns={columns}
        totalRow={{ conta: "Total:", valor: R$(total) }}
        selectable
        selectionActions={selectionActions}
        novoMenuItems={[{ label: "Nova conta" }]}
        summaryCards={summaryCards}
        tabs={[
          { label: "Todas", value: "todas", count: allData.length },
          { label: "Pendentes", value: "pendentes", count: allData.filter(d => d.status === "Pendente").length },
          { label: "Pagas", value: "pagas", count: allData.filter(d => d.status === "Pago").length },
        ]}
        activeTab={tab}
        onTabChange={setTab}
        pageSize={15}
      />
    </AppLayout>
  );
}
