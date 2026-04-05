import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, ActionsMenu } from "@/components/DataTable";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  estoque: number;
  estoqueMinimo: number;
  valor: number;
  status: "Normal" | "Mínimo" | "Sem estoque";
}

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const initialData: Produto[] = [
  { id: 1, nome: "Pomada Modeladora", categoria: "Finalizadores", estoque: 25, estoqueMinimo: 5, valor: 40, status: "Normal" },
  { id: 2, nome: "Shampoo Anticaspa", categoria: "Shampoos", estoque: 3, estoqueMinimo: 5, valor: 35, status: "Mínimo" },
  { id: 3, nome: "Óleo de Barba", categoria: "Barba", estoque: 0, estoqueMinimo: 3, valor: 40, status: "Sem estoque" },
  { id: 4, nome: "Condicionador", categoria: "Condicionadores", estoque: 15, estoqueMinimo: 5, valor: 30, status: "Normal" },
  { id: 5, nome: "Cera Capilar", categoria: "Finalizadores", estoque: 2, estoqueMinimo: 5, valor: 35, status: "Mínimo" },
  { id: 6, nome: "Tônico Capilar", categoria: "Tratamento", estoque: 0, estoqueMinimo: 3, valor: 40, status: "Sem estoque" },
  { id: 7, nome: "Gel Fixador", categoria: "Finalizadores", estoque: 18, estoqueMinimo: 5, valor: 25, status: "Normal" },
  { id: 8, nome: "Spray Fixador", categoria: "Finalizadores", estoque: 10, estoqueMinimo: 5, valor: 30, status: "Normal" },
];

export default function ListaProdutos() {
  const [allData, setAllData] = useState(initialData);
  const [tab, setTab] = useState("todos");
  const { toast } = useToast();

  const data = useMemo(() => {
    if (tab === "todos") return allData;
    if (tab === "estoque") return allData.filter(d => d.status === "Normal");
    if (tab === "minimo") return allData.filter(d => d.status === "Mínimo");
    return allData.filter(d => d.status === "Sem estoque");
  }, [tab, allData]);

  const bulkRemove = (indices: number[]) => {
    const ids = indices.map(i => data[i]?.id).filter(Boolean);
    setAllData(prev => prev.filter(d => !ids.includes(d.id)));
    toast({ title: `${ids.length} produto(s) removido(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Remover", icon: <Trash2 className="h-4 w-4" />, onClick: bulkRemove, variant: "destructive", description: "Remove os produtos selecionados" },
  ];

  const columns: Column<Produto>[] = [
    { key: "nome", label: "Nome", pinned: true },
    { key: "categoria", label: "Categoria" },
    { key: "estoque", label: "Estoque", align: "center" },
    { key: "estoqueMinimo", label: "Estoque Mín.", align: "center" },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    {
      key: "status", label: "Status",
      render: v => <span className="font-medium" style={{ color: v === "Normal" ? "#00c5b4" : v === "Mínimo" ? "#f59e0b" : "#ff2f2f" }}>{v}</span>,
    },
    {
      key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
      render: () => <ActionsMenu items={[{ label: "Editar" }, { label: "Excluir", variant: "destructive" }]} />,
    },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Produtos"
        data={data}
        columns={columns}
        selectable
        selectionActions={selectionActions}
        showDateFilter={false}
        novoMenuItems={[{ label: "Novo produto" }]}
        tabs={[
          { label: "Todos", value: "todos", count: allData.length },
          { label: "Estoque", value: "estoque", count: allData.filter(d => d.status === "Normal").length },
          { label: "Mínimo", value: "minimo", count: allData.filter(d => d.status === "Mínimo").length },
          { label: "Sem estoque", value: "sem", count: allData.filter(d => d.status === "Sem estoque").length },
        ]}
        activeTab={tab}
        onTabChange={setTab}
        pageSize={15}
      />
    </AppLayout>
  );
}
