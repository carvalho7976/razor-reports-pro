import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, ActionsMenu, TabDef } from "@/components/DataTable";
import { Switch } from "@/components/ui/switch";
import { Trash2, Pencil, Ban, CreditCard, Banknote, Smartphone, ArrowRightLeft, Gift, FileText } from "lucide-react";
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

const logoMap: Record<string, React.ReactNode> = {
  Dinheiro: <Banknote className="h-5 w-5 text-success" />,
  Pix: <Smartphone className="h-5 w-5 text-info" />,
  "Cartão Crédito": <CreditCard className="h-5 w-5 text-primary" />,
  "Cartão Débito": <CreditCard className="h-5 w-5 text-warning" />,
  Transferência: <ArrowRightLeft className="h-5 w-5 text-info" />,
  Cheque: <FileText className="h-5 w-5 text-muted-foreground" />,
  "Vale Presente": <Gift className="h-5 w-5 text-primary" />,
};

export default function ListaFormasPagamento() {
  const [allData, setAllData] = useState(initialData);
  const [tab, setTab] = useState("todos");
  const { toast } = useToast();

  const data = useMemo(() => {
    if (tab === "todos") return allData;
    if (tab === "ativos") return allData.filter((d) => d.status === "Ativo");
    return allData.filter((d) => d.status === "Desativado");
  }, [tab, allData]);

  const handleStatusChange = (id: number, checked: boolean) => {
    setAllData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: checked ? "Ativo" : "Desativado" } : item)),
    );

    toast({
      title: checked ? "Forma ativada" : "Forma desativada",
    });
  };

  const bulkRemove = (indices: number[]) => {
    toast({ title: `${indices.length} forma(s) removida(s)`, variant: "destructive" });
  };

  const bulkDesativar = (indices: number[]) => {
    const ids = indices.map((i) => data[i]?.id).filter(Boolean);
    setAllData((prev) => prev.map((d) => (ids.includes(d.id) ? { ...d, status: "Desativado" as const } : d)));
    toast({ title: `${ids.length} forma(s) desativada(s)` });
  };

  const selectionActions: SelectionAction[] = [
    {
      label: "Desativar",
      icon: <Ban className="h-4 w-4" />,
      onClick: bulkDesativar,
      variant: "destructive",
      description: "Desativa as formas de pagamento selecionadas",
    },
    {
      label: "Remover",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: bulkRemove,
      variant: "destructive",
      description: "Remove as formas de pagamento selecionadas",
    },
  ];

  const columns: Column<FormaPagamento>[] = [
    {
      key: "logo" as any,
      label: "",
      sortable: false,
      filterable: false,
      width: "50px",
      align: "center",
      render: (_v: any, row: FormaPagamento) => (
        <div className="flex items-center justify-center">
          {logoMap[row.nome] || <CreditCard className="h-5 w-5 text-muted-foreground" />}
        </div>
      ),
    },
    { key: "nome", label: "Nome", pinned: true },
    { key: "tipo", label: "Tipo" },
    { key: "taxa", label: "Taxa %", align: "center", render: (v) => `${v}%` },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (v, row) => (
        <div className="flex justify-center">
          <Switch
            checked={v === "Ativo"}
            onCheckedChange={(checked) => handleStatusChange(row.id, checked)}
            className="scale-90 data-[state=checked]:bg-blue-600"
          />
        </div>
      ),
    },
    {
      key: "acoes" as any,
      label: "Ações",
      sortable: false,
      filterable: false,
      align: "center",
      render: () => (
        <ActionsMenu
          items={[
            { label: "Editar", icon: <Pencil className="h-4 w-4" /> },
            { label: "Desativar", icon: <Ban className="h-4 w-4" /> },
            { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, variant: "destructive" },
          ]}
        />
      ),
    },
  ];

  const tabs: TabDef[] = [
    { label: "Todos", value: "todos", count: allData.length, color: "neutral" },
    { label: "Ativos", value: "ativos", count: allData.filter((d) => d.status === "Ativo").length, color: "success" },
    {
      label: "Desativados",
      value: "desativados",
      count: allData.filter((d) => d.status === "Desativado").length,
      color: "destructive",
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
