import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, ActionsMenu, TabDef } from "@/components/DataTable";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Trash2,
  Pencil,
  Ban,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRightLeft,
  Gift,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface FormaPagamento {
  id: number;
  nome: string;
  tipo: string;
  taxa: number;
  destino: string;
  tempoParaCair: string;
  status: "Ativo" | "Desativado";
}

const initialData: FormaPagamento[] = [
  { id: 1, nome: "Dinheiro", tipo: "Espécie", taxa: 0, destino: "CONTA", tempoParaCair: "Na hora", status: "Ativo" },
  { id: 2, nome: "Pix", tipo: "Digital", taxa: 0, destino: "CONTA", tempoParaCair: "Na hora", status: "Ativo" },
  {
    id: 3,
    nome: "Cartão Crédito",
    tipo: "Cartão",
    taxa: 3.5,
    destino: "CONTA",
    tempoParaCair: "Na hora",
    status: "Ativo",
  },
  {
    id: 4,
    nome: "Cartão Débito",
    tipo: "Cartão",
    taxa: 1.5,
    destino: "CAIXA",
    tempoParaCair: "1 dia",
    status: "Ativo",
  },
  {
    id: 5,
    nome: "Transferência",
    tipo: "Digital",
    taxa: 0,
    destino: "NENHUM",
    tempoParaCair: "Na hora",
    status: "Ativo",
  },
  { id: 6, nome: "Cheque", tipo: "Outros", taxa: 0, destino: "CAIXA", tempoParaCair: "Na hora", status: "Desativado" },
  {
    id: 7,
    nome: "Vale Presente",
    tipo: "Outros",
    taxa: 0,
    destino: "CONTA",
    tempoParaCair: "Na hora",
    status: "Desativado",
  },
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

type ModalState =
  | { type: "edit"; item: FormaPagamento }
  | { type: "toggle"; item: FormaPagamento; nextStatus: "Ativo" | "Desativado" }
  | { type: "delete"; item: FormaPagamento }
  | null;

export default function ListaFormasPagamento() {
  const [allData, setAllData] = useState(initialData);
  const [tab, setTab] = useState("todos");
  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<FormaPagamento | null>(null);
  const { toast } = useToast();

  const data = useMemo(() => {
    if (tab === "todos") return allData;
    if (tab === "ativos") return allData.filter((d) => d.status === "Ativo");
    return allData.filter((d) => d.status === "Desativado");
  }, [tab, allData]);

  const openEditModal = (item: FormaPagamento) => {
    setForm({ ...item });
    setModal({ type: "edit", item });
  };

  const openToggleModal = (item: FormaPagamento, nextStatus: "Ativo" | "Desativado") => {
    setModal({ type: "toggle", item, nextStatus });
  };

  const openDeleteModal = (item: FormaPagamento) => {
    setModal({ type: "delete", item });
  };

  const closeModal = () => {
    setModal(null);
    setForm(null);
  };

  const handleStatusChange = (id: number, checked: boolean) => {
    setAllData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: checked ? "Ativo" : "Desativado" } : item)),
    );

    toast({
      title: checked ? "Forma ativada" : "Forma desativada",
    });
  };

  const handleSaveEdit = () => {
    if (!form) return;

    setAllData((prev) => prev.map((item) => (item.id === form.id ? form : item)));

    toast({ title: "Forma de pagamento atualizada" });
    closeModal();
  };

  const handleConfirmToggle = () => {
    if (!modal || modal.type !== "toggle") return;

    setAllData((prev) =>
      prev.map((item) => (item.id === modal.item.id ? { ...item, status: modal.nextStatus } : item)),
    );

    toast({
      title: modal.nextStatus === "Ativo" ? "Forma ativada" : "Forma desativada",
    });

    closeModal();
  };

  const handleConfirmDelete = () => {
    if (!modal || modal.type !== "delete") return;

    setAllData((prev) => prev.filter((item) => item.id !== modal.item.id));
    toast({ title: "Forma de pagamento removida", variant: "destructive" });
    closeModal();
  };

  const bulkRemove = (indices: number[]) => {
    const ids = indices.map((i) => data[i]?.id).filter(Boolean);
    setAllData((prev) => prev.filter((d) => !ids.includes(d.id)));
    toast({ title: `${ids.length} forma(s) removida(s)`, variant: "destructive" });
  };

  const bulkDesativar = (indices: number[]) => {
    const ids = indices.map((i) => data[i]?.id).filter(Boolean);
    setAllData((prev) => prev.map((d) => (ids.includes(d.id) ? { ...d, status: "Desativado" as const } : d)));
    toast({ title: `${ids.length} forma(s) desativada(s)` });
  };

  const bulkAtivar = (indices: number[]) => {
    const ids = indices.map((i) => data[i]?.id).filter(Boolean);
    setAllData((prev) => prev.map((d) => (ids.includes(d.id) ? { ...d, status: "Ativo" as const } : d)));
    toast({ title: `${ids.length} forma(s) ativada(s)` });
  };

  const selectionActions: SelectionAction[] = [
    {
      label: "Ativar",
      icon: <CheckCircle2 className="h-4 w-4" />,
      onClick: bulkAtivar,
      description: "Ativa as formas de pagamento selecionadas",
    },
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
      key: "nome",
      label: "Nome",
      pinned: true,
      
    { key: "tipo", label: "Tipo" },
    { key: "taxa", label: "Taxa %", align: "center", render: (v) => `${v}%` },
    { key: "destino", label: "Destino", align: "center" },
    { key: "tempoParaCair", label: "Tempo p/ Cair", align: "center" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (v, row) => (
        <div className="flex justify-center">
          <Switch
            checked={v === "Ativo"}
            onCheckedChange={(checked) => handleStatusChange(row.id, checked)}
            className="scale-90 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
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
      render: (_v, row) => (
        <ActionsMenu
          items={[
            { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: () => openEditModal(row) },
            row.status === "Ativo"
              ? {
                  label: "Desativar",
                  icon: <Ban className="h-4 w-4" />,
                  onClick: () => openToggleModal(row, "Desativado"),
                }
              : {
                  label: "Ativar",
                  icon: <CheckCircle2 className="h-4 w-4" />,
                  onClick: () => openToggleModal(row, "Ativo"),
                },
            {
              label: "Excluir",
              icon: <Trash2 className="h-4 w-4" />,
              variant: "destructive",
              onClick: () => openDeleteModal(row),
            },
          ]}
        />
      ),
    },
  ];

  const tabs: TabDef[] = [
    { label: "Todos", value: "todos", count: allData.length, color: "neutral" },
    {
      label: "Ativos",
      value: "ativos",
      count: allData.filter((d) => d.status === "Ativo").length,
      color: "success",
    },
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

      <Dialog open={modal?.type === "edit"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[560px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Editar forma de pagamento</DialogTitle>
            <DialogDescription>Atualize os dados da forma de pagamento.</DialogDescription>
          </DialogHeader>

          {form && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium">Nome</label>
                <input
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Tipo</label>
                <input
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Taxa %</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  value={form.taxa}
                  onChange={(e) => setForm({ ...form, taxa: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Destino</label>
                <input
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  value={form.destino}
                  onChange={(e) => setForm({ ...form, destino: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Tempo p/ Cair</label>
                <input
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  value={form.tempoParaCair}
                  onChange={(e) => setForm({ ...form, tempoParaCair: e.target.value })}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={closeModal}
              className="h-10 px-4 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="h-10 px-4 rounded-xl bg-[hsl(var(--novo-btn))] text-[hsl(var(--novo-btn-foreground))] text-sm font-medium hover:bg-[hsl(var(--novo-btn)/0.9)] transition-colors"
            >
              Salvar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modal?.type === "toggle"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {modal?.type === "toggle" && modal.nextStatus === "Ativo"
                ? "Ativar forma de pagamento"
                : "Desativar forma de pagamento"}
            </DialogTitle>
            <DialogDescription>
              {modal?.type === "toggle" && modal.nextStatus === "Ativo"
                ? `Deseja ativar "${modal.item.nome}"?`
                : `Deseja desativar "${modal?.type === "toggle" ? modal.item.nome : ""}"?`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={closeModal}
              className="h-10 px-4 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmToggle}
              className={cn(
                "h-10 px-4 rounded-xl text-sm font-medium transition-colors",
                modal?.type === "toggle" && modal.nextStatus === "Ativo"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              )}
            >
              {modal?.type === "toggle" && modal.nextStatus === "Ativo" ? "Ativar" : "Desativar"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modal?.type === "delete"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Excluir forma de pagamento</DialogTitle>
            <DialogDescription>
              {modal?.type === "delete"
                ? `Deseja excluir "${modal.item.nome}"? Essa ação não poderá ser desfeita.`
                : ""}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={closeModal}
              className="h-10 px-4 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="h-10 px-4 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
            >
              Excluir
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
