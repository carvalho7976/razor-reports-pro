import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, ActionsMenu, TabDef, SummaryCard } from "@/components/DataTable";
import { Trash2, Pencil, Package, CreditCard, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FormModal, TextField, Dropdown, FormRow, DeleteModal, SaveButton } from "@/components/FormModal";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  estoque: number;
  estoqueMinimo: number;
  valor: number;
  status: "Normal" | "Mínimo" | "Sem estoque";
}

const categoriaOptions = [
  { value: "Finalizadores", label: "Finalizadores" },
  { value: "Shampoos", label: "Shampoos" },
  { value: "Condicionadores", label: "Condicionadores" },
  { value: "Barba", label: "Barba" },
  { value: "Tratamento", label: "Tratamento" },
];

const initialData: Produto[] = [
  {
    id: 1,
    nome: "Pomada Modeladora",
    categoria: "Finalizadores",
    estoque: 25,
    estoqueMinimo: 5,
    valor: 40,
    status: "Normal",
  },
  {
    id: 2,
    nome: "Shampoo Anticaspa",
    categoria: "Shampoos",
    estoque: 3,
    estoqueMinimo: 5,
    valor: 35,
    status: "Mínimo",
  },
  { id: 3, nome: "Óleo de Barba", categoria: "Barba", estoque: 0, estoqueMinimo: 3, valor: 40, status: "Sem estoque" },
  {
    id: 4,
    nome: "Condicionador",
    categoria: "Condicionadores",
    estoque: 15,
    estoqueMinimo: 5,
    valor: 30,
    status: "Normal",
  },
  {
    id: 5,
    nome: "Cera Capilar",
    categoria: "Finalizadores",
    estoque: 2,
    estoqueMinimo: 5,
    valor: 35,
    status: "Mínimo",
  },
  {
    id: 6,
    nome: "Tônico Capilar",
    categoria: "Tratamento",
    estoque: 0,
    estoqueMinimo: 3,
    valor: 40,
    status: "Sem estoque",
  },
  {
    id: 7,
    nome: "Gel Fixador",
    categoria: "Finalizadores",
    estoque: 18,
    estoqueMinimo: 5,
    valor: 25,
    status: "Normal",
  },
  {
    id: 8,
    nome: "Spray Fixador",
    categoria: "Finalizadores",
    estoque: 10,
    estoqueMinimo: 5,
    valor: 30,
    status: "Normal",
  },
];

type ModalState = { type: "new" } | { type: "edit"; item: Produto } | { type: "delete"; item: Produto } | null;

const calcStatus = (estoque: number, min: number): Produto["status"] =>
  estoque === 0 ? "Sem estoque" : estoque <= min ? "Mínimo" : "Normal";

const emptyForm = (): Produto => ({
  id: 0,
  nome: "",
  categoria: "Finalizadores",
  estoque: 0,
  estoqueMinimo: 5,
  valor: 0,
  status: "Normal",
});

export default function ListaProdutos() {
  const [aulaOpen, setAulaOpen] = useState(false);
  const [allData, setAllData] = useState(initialData);
  const [tab, setTab] = useState("todos");
  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<Produto | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const { toast } = useToast();

  const data = useMemo(() => {
    if (tab === "todos") return allData;
    if (tab === "estoque") return allData.filter((d) => d.status === "Normal");
    if (tab === "minimo") return allData.filter((d) => d.status === "Mínimo");
    return allData.filter((d) => d.status === "Sem estoque");
  }, [tab, allData]);

  const errors = { nome: !form?.nome ? "Informe o nome do produto." : "" };

  const openNew = () => {
    setForm(emptyForm());
    setShowErrors(false);
    setModal({ type: "new" });
  };
  const openEdit = (item: Produto) => {
    setForm({ ...item });
    setShowErrors(false);
    setModal({ type: "edit", item });
  };
  const openDelete = (item: Produto) => setModal({ type: "delete", item });
  const closeModal = () => {
    setModal(null);
    setForm(null);
    setShowErrors(false);
  };

  const handleSave = () => {
    if (!form) return;
    setShowErrors(true);
    if (errors.nome) return;
    const finalForm = { ...form, status: calcStatus(form.estoque, form.estoqueMinimo) };
    if (modal?.type === "new") {
      const nextId = allData.length ? Math.max(...allData.map((d) => d.id)) + 1 : 1;
      setAllData((prev) => [{ ...finalForm, id: nextId }, ...prev]);
      toast({ title: "Produto cadastrado" });
    } else if (modal?.type === "edit") {
      setAllData((prev) => prev.map((d) => (d.id === finalForm.id ? finalForm : d)));
      toast({ title: "Produto atualizado" });
    }
    closeModal();
  };

  const handleDelete = () => {
    if (modal?.type !== "delete") return;
    setAllData((prev) => prev.filter((d) => d.id !== modal.item.id));
    toast({ title: "Produto removido", variant: "destructive" });
    closeModal();
  };

  const totalEstoque = allData.reduce((s, d) => s + d.estoque, 0);
  const valorEstoque = allData.reduce((s, d) => s + d.estoque * d.valor, 0);

  const summaryCards: SummaryCard[] = [
    {
      label: "Produtos em Estoque",
      value: String(totalEstoque),
      type: "quantity",
      icon: <Package className="h-4 w-4" />,
      size: "compact",
      color: "blue",
    },
    {
      label: "Valor em Estoque",
      value: R$(valorEstoque),
      icon: <DollarSign className="h-4 w-4" />,
      size: "wide",
      color: "blue",
    },
  ];

  const bulkRemove = (indices: number[]) => {
    const ids = indices.map((i) => data[i]?.id).filter(Boolean);
    setAllData((prev) => prev.filter((d) => !ids.includes(d.id)));
    toast({ title: `${ids.length} produto(s) removido(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    {
      label: "Remover",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: bulkRemove,
      variant: "destructive",
      description: "Remove os produtos selecionados",
    },
  ];

  const columns: Column<Produto>[] = [
    { key: "nome", label: "Produto", pinned: true },
    { key: "categoria", label: "Categoria" },
    { key: "estoque", label: "Estoque", align: "center" },
    { key: "estoqueMinimo", label: "Estoque Mín.", align: "center" },
    { key: "valor", label: "Valor", align: "right", render: (v) => R$(v) },
    {
      key: "status",
      label: "Status",
      render: (v) => (
        <span
          className="font-medium"
          style={{ color: v === "Normal" ? "#00c5b4" : v === "Mínimo" ? "#f59e0b" : "#ff2f2f" }}
        >
          {v}
        </span>
      ),
    },
    {
      key: "acoes" as any,
      label: "Ações",
      sortable: false,
      filterable: false,
      align: "center",
      render: (_, row) => (
        <ActionsMenu
          items={[
            { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: () => openEdit(row) },
            {
              label: "Excluir",
              icon: <Trash2 className="h-4 w-4" />,
              variant: "destructive",
              onClick: () => openDelete(row),
            },
          ]}
        />
      ),
    },
  ];

  const tabs: TabDef[] = [
    { label: "Todos", value: "todos", count: allData.length, color: "neutral" },
    {
      label: "Estoque",
      value: "estoque",
      count: allData.filter((d) => d.status === "Normal").length,
      color: "success",
    },
    { label: "Mínimo", value: "minimo", count: allData.filter((d) => d.status === "Mínimo").length, color: "warning" },
    {
      label: "Sem estoque",
      value: "sem",
      count: allData.filter((d) => d.status === "Sem estoque").length,
      color: "destructive",
    },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Produtos"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />}
        data={data}
        columns={columns}
        summaryCards={summaryCards}
        selectable
        selectionActions={selectionActions}
        showDateFilter={true}
        novoMenuItems={[{ label: "Novo produto", onClick: openNew }]}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        pageSize={15}
        tableId="lista_produtos"
      />

      <Dialog open={modal?.type === "new" || modal?.type === "edit"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          {form && (
            <FormModal
              title={modal?.type === "new" ? "Novo produto" : "Editar produto"}
              subtitle="Preencha os dados do produto."
              onClose={closeModal}
              footer={<SaveButton onClick={handleSave} />}
            >
              <TextField
                label="Nome"
                value={form.nome}
                onChange={(v) => setForm({ ...form, nome: v })}
                error={showErrors ? errors.nome : ""}
              />
              <Dropdown
                label="Categoria"
                value={form.categoria}
                setValue={(v) => setForm({ ...form, categoria: v })}
                options={categoriaOptions}
                searchable
              />
              <FormRow cols={3}>
                <TextField
                  label="Estoque"
                  value={form.estoque ? String(form.estoque) : ""}
                  onChange={(v) => setForm({ ...form, estoque: Number(v) || 0 })}
                  placeholder="0"
                />
                <TextField
                  label="Estoque Mín."
                  value={form.estoqueMinimo ? String(form.estoqueMinimo) : ""}
                  onChange={(v) => setForm({ ...form, estoqueMinimo: Number(v) || 0 })}
                  placeholder="0"
                />
                <TextField
                  label="Valor (R$)"
                  value={form.valor ? String(form.valor) : ""}
                  onChange={(v) => setForm({ ...form, valor: Number(v.replace(",", ".")) || 0 })}
                  placeholder="0,00"
                />
              </FormRow>
            </FormModal>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={modal?.type === "delete"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <DeleteModal
            title="Excluir produto"
            message={modal?.type === "delete" ? `Deseja excluir "${modal.item.nome}"?` : ""}
            onConfirm={handleDelete}
            onClose={closeModal}
          />
        </DialogContent>
      </Dialog>

      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Produtos"
      />
    </AppLayout>
  );
}
