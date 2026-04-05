import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, ActionsMenu } from "@/components/DataTable";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Servico {
  id: number;
  nome: string;
  categoria: string;
  duracao: string;
  valor: number;
  comissao: number;
}

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const initialData: Servico[] = [
  { id: 1, nome: "Corte Masculino", categoria: "Cabelo", duracao: "30 min", valor: 50, comissao: 40 },
  { id: 2, nome: "Escova", categoria: "Cabelo", duracao: "45 min", valor: 80, comissao: 40 },
  { id: 3, nome: "Barba", categoria: "Barba", duracao: "20 min", valor: 35, comissao: 40 },
  { id: 4, nome: "Coloração", categoria: "Química", duracao: "90 min", valor: 200, comissao: 35 },
  { id: 5, nome: "Hidratação", categoria: "Tratamento", duracao: "60 min", valor: 120, comissao: 40 },
  { id: 6, nome: "Manicure", categoria: "Unhas", duracao: "45 min", valor: 50, comissao: 50 },
  { id: 7, nome: "Pedicure", categoria: "Unhas", duracao: "50 min", valor: 55, comissao: 50 },
];

export default function ListaServicos() {
  const [allData, setAllData] = useState(initialData);
  const { toast } = useToast();

  const bulkRemove = (indices: number[]) => {
    const ids = indices.map(i => allData[i]?.id).filter(Boolean);
    setAllData(prev => prev.filter(d => !ids.includes(d.id)));
    toast({ title: `${ids.length} serviço(s) removido(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Remover", icon: <Trash2 className="h-4 w-4" />, onClick: bulkRemove, variant: "destructive", description: "Remove os serviços selecionados" },
  ];

  const columns: Column<Servico>[] = [
    { key: "nome", label: "Nome", pinned: true },
    { key: "categoria", label: "Categoria" },
    { key: "duracao", label: "Duração" },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    { key: "comissao", label: "Comissão %", align: "center", render: v => `${v}%` },
    {
      key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
      render: () => <ActionsMenu items={[{ label: "Editar" }, { label: "Excluir", variant: "destructive" }]} />,
    },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Serviços"
        data={allData}
        columns={columns}
        selectable
        selectionActions={selectionActions}
        showDateFilter={false}
        novoMenuItems={[{ label: "Novo serviço" }]}
        pageSize={15}
      />
    </AppLayout>
  );
}
