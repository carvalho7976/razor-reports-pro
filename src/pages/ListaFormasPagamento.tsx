import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, ActionsMenu } from "@/components/DataTable";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormaPagamento {
  id: number;
  nome: string;
  tipo: string;
  taxa: number;
  status: "Ativo" | "Desativado";
}

const initialData: FormaPagamento[] = [
  { id: 1, nome: "Dinheiro", tipo: "Espécie", taxa: 0, status: "Ativo" },
  { id: 2, nome: "Pix", tipo: "Digital", taxa: 0, status: "Ativo" },
  { id: 3, nome: "Cartão Crédito", tipo: "Cartão", taxa: 3.5, status: "Ativo" },
  { id: 4, nome: "Cartão Débito", tipo: "Cartão", taxa: 1.5, status: "Ativo" },
  { id: 5, nome: "Transferência", tipo: "Digital", taxa: 0, status: "Ativo" },
  { id: 6, nome: "Cheque", tipo: "Outros", taxa: 0, status: "Desativado" },
  { id: 7, nome: "Vale Presente", tipo: "Outros", taxa: 0, status: "Desativado" },
];

export default function ListaFormasPagamento() {
  const [allData, setAllData] = useState(initialData);
  const [tab, setTab] = useState("todos");
  const { toast } = useToast();

  const data = useMemo(() => {
    if (tab === "todos") return allData;
    if (tab === "ativos") return allData.filter(d => d.status === "Ativo");
    return allData.filter(d => d.status === "Desativado");
  }, [tab, allData]);

  const bulkRemove = (indices: number[]) => {
    const ids = indices.map(i => data[i]?.id).filter(Boolean);
    setAllData(prev => prev.filter(d => !ids.includes(d.id)));
    toast({ title: `${ids.length} forma(s) removida(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Remover", icon: <Trash2 className="h-4 w-4" />, onClick: bulkRemove, variant: "destructive", description: "Remove as formas de pagamento selecionadas" },
  ];

  const columns: Column<FormaPagamento>[] = [
    { key: "nome", label: "Nome", pinned: true },
    { key: "tipo", label: "Tipo" },
    { key: "taxa", label: "Taxa %", align: "center", render: v => `${v}%` },
    {
      key: "status", label: "Status",
      render: v => <span className="font-medium" style={{ color: v === "Ativo" ? "#00c5b4" : "#6b7280" }}>{v}</span>,
    },
    {
      key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
      render: () => <ActionsMenu items={[{ label: "Editar" }, { label: "Excluir", variant: "destructive" }]} />,
    },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Formas de Pagamento"
        data={data}
        columns={columns}
        selectable
        selectionActions={selectionActions}
        showDateFilter={false}
        novoMenuItems={[{ label: "Nova forma de pagamento" }]}
        tabs={[
          { label: "Todos", value: "todos", count: allData.length },
          { label: "Ativos", value: "ativos", count: allData.filter(d => d.status === "Ativo").length },
          { label: "Desativados", value: "desativados", count: allData.filter(d => d.status === "Desativado").length },
        ]}
        activeTab={tab}
        onTabChange={setTab}
        pageSize={15}
      />
    </AppLayout>
  );
}
