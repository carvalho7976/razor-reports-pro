import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, ActionsMenu } from "@/components/DataTable";
import { Trash2, Eye, Power } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Pacote {
  id: number;
  nome: string;
  servicos: string;
  valor: number;
  validade: string;
  status: "Ativo" | "Desativado";
}

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const initialData: Pacote[] = [
  { id: 1, nome: "Pacote Barba + Corte 4x", servicos: "Corte Masculino, Barba", valor: 160, validade: "60 dias", status: "Ativo" },
  { id: 2, nome: "Pacote Hidratação 3x", servicos: "Hidratação", valor: 270, validade: "90 dias", status: "Ativo" },
  { id: 3, nome: "Pacote Corte 5x", servicos: "Corte Masculino", valor: 200, validade: "120 dias", status: "Ativo" },
  { id: 4, nome: "Pacote Coloração 2x", servicos: "Coloração", valor: 350, validade: "60 dias", status: "Desativado" },
  { id: 5, nome: "Pacote Manicure 4x", servicos: "Manicure", valor: 160, validade: "60 dias", status: "Desativado" },
];

export default function ListaPacotes() {
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
    toast({ title: `${ids.length} pacote(s) removido(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Remover", icon: <Trash2 className="h-4 w-4" />, onClick: bulkRemove, variant: "destructive", description: "Remove os pacotes selecionados" },
  ];

  const columns: Column<Pacote>[] = [
    { key: "nome", label: "Nome", pinned: true },
    { key: "servicos", label: "Serviços" },
    { key: "valor", label: "Valor", align: "right", render: v => R$(v) },
    { key: "validade", label: "Validade" },
    {
      key: "status", label: "Status",
      render: v => <span className="font-medium" style={{ color: v === "Ativo" ? "#00c5b4" : "#6b7280" }}>{v}</span>,
    },
    {
      key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
      render: (_, row) => <ActionsMenu items={[
        { label: "Visualizar" },
        { label: row.status === "Ativo" ? "Desativar" : "Ativar" },
        { label: "Excluir", variant: "destructive" },
      ]} />,
    },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Pacotes"
        data={data}
        columns={columns}
        selectable
        selectionActions={selectionActions}
        showDateFilter={false}
        novoMenuItems={[{ label: "Novo pacote" }]}
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
