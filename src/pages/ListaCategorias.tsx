import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, ActionsMenu } from "@/components/DataTable";
import { Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Categoria {
  id: number;
  nome: string;
  qtdServicos: number;
  descricao: string;
}

const initialData: Categoria[] = [
  { id: 1, nome: "Cabelo", qtdServicos: 5, descricao: "Cortes, escovas e penteados" },
  { id: 2, nome: "Barba", qtdServicos: 3, descricao: "Barba e bigode" },
  { id: 3, nome: "Química", qtdServicos: 4, descricao: "Coloração, relaxamento, progressiva" },
  { id: 4, nome: "Tratamento", qtdServicos: 3, descricao: "Hidratação, cauterização, reconstrução" },
  { id: 5, nome: "Unhas", qtdServicos: 2, descricao: "Manicure e pedicure" },
  { id: 6, nome: "Estética", qtdServicos: 2, descricao: "Limpeza de pele, sobrancelha" },
];

export default function ListaCategorias() {
  const [allData, setAllData] = useState(initialData);
  const { toast } = useToast();

  const bulkRemove = (indices: number[]) => {
    const ids = indices.map(i => allData[i]?.id).filter(Boolean);
    setAllData(prev => prev.filter(d => !ids.includes(d.id)));
    toast({ title: `${ids.length} categoria(s) removida(s)`, variant: "destructive" });
  };

  const handleCellEdit = (rowIdx: number, key: string, value: any) => {
    setAllData(prev => prev.map((r, i) => i === rowIdx ? { ...r, [key]: value } : r));
    toast({ title: "Campo atualizado" });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Remover", icon: <Trash2 className="h-4 w-4" />, onClick: bulkRemove, variant: "destructive", description: "Remove as categorias selecionadas" },
  ];

  const columns: Column<Categoria>[] = [
    { key: "nome", label: "Nome", pinned: true, editable: true },
    { key: "qtdServicos", label: "Qtd Serviços", align: "center" },
    { key: "descricao", label: "Descrição", editable: true },
    {
      key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
      render: () => <ActionsMenu items={[
        { label: "Editar", icon: <Pencil className="h-4 w-4" /> },
        { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, variant: "destructive" },
      ]} />,
    },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Categorias"
        data={allData}
        columns={columns}
        selectable
        selectionActions={selectionActions}
        showDateFilter={true}
        novoMenuItems={[{ label: "Nova categoria" }]}
        pageSize={15}
        onCellEdit={handleCellEdit}
        tableId="lista_categorias"
      />
    </AppLayout>
  );
}
