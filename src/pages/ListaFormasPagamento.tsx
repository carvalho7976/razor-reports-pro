import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, ActionsMenu, TabDef } from "@/components/DataTable";
import { Trash2, Pencil } from "lucide-react";
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
  const [allData] = useState(initialData);
  const [tab, setTab] = useState("todos");
  const { toast } = useToast();

  const data = useMemo(() => {
    if (tab === "todos") return allData;
    if (tab === "ativos") return allData.filter(d => d.status === "Ativo");
    return allData.filter(d => d.status === "Desativado");
  }, [tab, allData]);

  const bulkRemove = (indices: number[]) => {
    toast({ title: `${indices.length} forma(s) removida(s)`, variant: "destructive" });
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
      render: v => <span className="font-medium" style={{ color: v === "Ativo" ? "#00c5b4" : "#ff2f2f" }}>{v}</span>,
    },
    {
      key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
      render: () => <ActionsMenu items={[
        { label: "Editar", icon: <Pencil className="h-4 w-4" /> },
        { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, variant: "destructive" },
      ]} />,
    },
  ];

  const tabs: TabDef[] = [
    { label: "Todos", value: "todos", count: allData.length, color: "neutral" },
    { label: "Ativos", value: "ativos", count: allData.filter(d => d.status === "Ativo").length, color: "success" },
    { label: "Desativados", value: "desativados", count: allData.filter(d => d.status === "Desativado").length, color: "destructive" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Formas de Pagamento"
        data={data}
        columns={columns}
        selectable
        selectionActions={selectionActions}
        showDateFilter={true}
        novoMenuItems={[{ label: "Nova forma de pagamento" }]}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        pageSize={15}
        tableId="lista_formas_pagamento"
      />
    </AppLayout>
  );
}