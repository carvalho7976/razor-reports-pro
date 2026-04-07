import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, ActionsMenu, TabDef } from "@/components/DataTable";
import { Switch } from "@/components/ui/switch";
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
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type StatusFormaPagamento = "Ativo" | "Desativado";
type DestinoFormaPagamento = "CAIXA" | "CONTA" | "NENHUM";
type DiasReceber = "Imediato" | "1 Dia" | "2 Dias" | "15 Dias" | "30 Dias";

type BandeiraMaquina =
  | "sumup"
  | "elo"
  | "rede"
  | "stone"
  | "cielo"
  | "getnet"
  | "pagseguro"
  | "mercado_pago"
  | "nenhum";

interface FormaPagamento {
  id: number;
  nome: string;
  tipo: BandeiraMaquina;
  taxa: number;
  destino: DestinoFormaPagamento;
  tempoParaCair: DiasReceber;
  status: StatusFormaPagamento;
  logo: BandeiraMaquina;
}

const initialData: FormaPagamento[] = [
  {
    id: 1,
    nome: "Pix",
    tipo: "nenhum",
    taxa: 0,
    destino: "CONTA",
    tempoParaCair: "Imediato",
    status: "Ativo",
    logo: "nenhum",
  },
  {
    id: 2,
    nome: "Cartão Crédito SumUp",
    tipo: "sumup",
    taxa: 3.5,
    destino: "CONTA",
    tempoParaCair: "30 Dias",
    status: "Ativo",
    logo: "sumup",
  },
  {
    id: 3,
    nome: "Cartão Débito Rede",
    tipo: "rede",
    taxa: 1.99,
    destino: "CAIXA",
    tempoParaCair: "1 Dia",
    status: "Ativo",
    logo: "rede",
  },
  {
    id: 4,
    nome: "Permuta",
    tipo: "nenhum",
    taxa: 0,
    destino: "NENHUM",
    tempoParaCair: "Imediato",
    status: "Desativado",
    logo: "nenhum",
  },
];

const bandeiraOptions: { value: BandeiraMaquina; label: string }[] = [
  { value: "sumup", label: "SumUp" },
  { value: "elo", label: "Elo" },
  { value: "rede", label: "Rede" },
  { value: "stone", label: "Stone" },
  { value: "cielo", label: "Cielo" },
  { value: "getnet", label: "Getnet" },
  { value: "pagseguro", label: "PagSeguro" },
  { value: "mercado_pago", label: "Mercado Pago" },
  { value: "nenhum", label: "Nenhum" },
];

const destinoOptions: { value: DestinoFormaPagamento; label: string }[] = [
  { value: "CAIXA", label: "Caixa" },
  { value: "CONTA", label: "Conta" },
  { value: "NENHUM", label: "Nenhum (Permuta)" },
];

const diasReceberOptions: { value: DiasReceber; label: string }[] = [
  { value: "Imediato", label: "Imediato" },
  { value: "1 Dia", label: "1 Dia" },
  { value: "2 Dias", label: "2 Dias" },
  { value: "15 Dias", label: "15 Dias" },
  { value: "30 Dias", label: "30 Dias" },
];

const getBandeiraLabel = (value: BandeiraMaquina) =>
  bandeiraOptions.find((item) => item.value === value)?.label || "Nenhum";

const getDestinoLabel = (value: DestinoFormaPagamento) =>
  destinoOptions.find((item) => item.value === value)?.label || value;

const logoMap: Record<BandeiraMaquina, React.ReactNode> = {
  sumup: <CreditCard className="h-5 w-5 text-primary" />,
  elo: <CreditCard className="h-5 w-5 text-success" />,
  rede: <CreditCard className="h-5 w-5 text-warning" />,
  stone: <CreditCard className="h-5 w-5 text-info" />,
  cielo: <CreditCard className="h-5 w-5 text-primary" />,
  getnet: <CreditCard className="h-5 w-5 text-destructive" />,
  pagseguro: <Smartphone className="h-5 w-5 text-success" />,
  mercado_pago: <ArrowRightLeft className="h-5 w-5 text-info" />,
  nenhum: <Banknote className="h-5 w-5 text-muted-foreground" />,
};

type ModalState =
  | { type: "new" }
  | { type: "edit"; item: FormaPagamento }
  | { type: "delete"; item: FormaPagamento }
  | null;

const createEmptyForm = (): FormaPagamento => ({
  id: 0,
  nome: "",
  tipo: "nenhum",
  taxa: 0,
  destino: "CAIXA",
  tempoParaCair: "Imediato",
  status: "Ativo",
  logo: "nenhum",
});

export default function ListaFormasPagamento() {
  const [allData, setAllData] = useState<FormaPagamento[]>(initialData);
  const [tab, setTab] = useState("todos");
  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<FormaPagamento | null>(null);
  const { toast } = useToast();

  const data = useMemo(() => {
    if (tab === "todos") return allData;
    if (tab === "ativos") return allData.filter((d) => d.status === "Ativo");
    return allData.filter((d) => d.status === "Desativado");
  }, [tab, allData]);

  const openNewModal = () => {
    setForm(createEmptyForm());
    setModal({ type: "new" });
  };

  const openEditModal = (item: FormaPagamento) => {
    setForm({ ...item });
    setModal({ type: "edit", item });
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

  const handleBandeiraChange = (value: BandeiraMaquina) => {
    if (!form) return;
    setForm({
      ...form,
      tipo: value,
      logo: value,
    });
  };

  const handleSave = () => {
    if (!form) return;

    if (!form.nome.trim()) {
      toast({
        title: "Preencha o nome",
        variant: "destructive",
      });
      return;
    }

    if (modal?.type === "new") {
      const nextId = allData.length ? Math.max(...allData.map((item) => item.id)) + 1 : 1;

      setAllData((prev) => [
        {
          ...form,
          id: nextId,
        },
        ...prev,
      ]);

      toast({ title: "Forma de pagamento cadastrada" });
      closeModal();
      return;
    }

    if (modal?.type === "edit") {
      setAllData((prev) => prev.map((item) => (item.id === form.id ? form : item)));
      toast({ title: "Forma de pagamento atualizada" });
      closeModal();
    }
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
    setAllData((prev) => prev.map((d) => (ids.includes(d.id) ? { ...d, status: "Desativado" } : d)));
    toast({ title: `${ids.length} forma(s) desativada(s)` });
  };

  const bulkAtivar = (indices: number[]) => {
    const ids = indices.map((i) => data[i]?.id).filter(Boolean);
    setAllData((prev) => prev.map((d) => (ids.includes(d.id) ? { ...d, status: "Ativo" } : d)));
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
      label: "Forma de Pagamento",
      pinned: true,
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            {logoMap[row.logo] || <CreditCard className="h-5 w-5 text-muted-foreground" />}
          </div>
          <span className="font-medium">{v}</span>
        </div>
      ),
    },
    {
      key: "tipo",
      label: "Bandeira da Máquina",
      render: (v) => getBandeiraLabel(v as BandeiraMaquina),
    },
    {
      key: "taxa",
      label: "Taxa %",
      align: "center",
      render: (v) => `${Number(v).toFixed(2)}%`,
    },
    {
      key: "destino",
      label: "Destino",
      align: "center",
      render: (v) => getDestinoLabel(v as DestinoFormaPagamento),
    },
    {
      key: "tempoParaCair",
      label: "Dias para Receber",
      align: "center",
    },
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
            {
              label: "Editar",
              icon: <Pencil className="h-4 w-4" />,
              onClick: () => openEditModal(row),
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
        novoMenuItems={[
          {
            label: "Nova forma de pagamento",
            onClick: openNewModal,
          },
        ]}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        pageSize={15}
        tableId="lista_formas_pagamento"
      />

      <Dialog open={modal?.type === "new" || modal?.type === "edit"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[560px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>{modal?.type === "new" ? "Nova forma de pagamento" : "Editar forma de pagamento"}</DialogTitle>
            <DialogDescription>
              {modal?.type === "new"
                ? "Preencha os dados para cadastrar uma nova forma de pagamento."
                : "Atualize os dados da forma de pagamento."}
            </DialogDescription>
          </DialogHeader>

          {form && (
            <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium">Nome</label>
                <input
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Digite a forma de pagamento"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium">Bandeira da Máquina</label>
                <select
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  value={form.tipo}
                  onChange={(e) => handleBandeiraChange(e.target.value as BandeiraMaquina)}
                >
                  {bandeiraOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Taxa</label>
                <input
                  type="number"
                  step="0.01"
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  value={form.taxa}
                  onChange={(e) => setForm({ ...form, taxa: Number(e.target.value) })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Destino</label>
                <select
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  value={form.destino}
                  onChange={(e) => setForm({ ...form, destino: e.target.value as DestinoFormaPagamento })}
                >
                  {destinoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium">Dias para Receber</label>
                <select
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  value={form.tempoParaCair}
                  onChange={(e) => setForm({ ...form, tempoParaCair: e.target.value as DiasReceber })}
                >
                  {diasReceberOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={closeModal}
              className="h-10 rounded-xl border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="h-10 rounded-xl bg-[hsl(var(--novo-btn))] px-4 text-sm font-medium text-[hsl(var(--novo-btn-foreground))] transition-colors hover:bg-[hsl(var(--novo-btn)/0.9)]"
            >
              Salvar
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
              className="h-10 rounded-xl border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className={cn(
                "h-10 rounded-xl px-4 text-sm font-medium transition-colors",
                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              )}
            >
              Excluir
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
