import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, ActionsMenu } from "@/components/DataTable";
import { Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FormModal, TextField, DeleteModal, SaveButton } from "@/components/FormModal";

const PALETTE = [
  "#ff2f2f", "#ff6b35", "#f59e0b", "#84cc16", "#00c5b4", "#06b6d4",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
  "#f43f5e", "#78716c", "#334155", "#000000",
];

function ColorCell({ color, onChange }: { color: string; onChange: (c: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="h-6 w-6 rounded-full border border-border shadow-sm hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="grid grid-cols-4 gap-2">
          {PALETTE.map((c) => (
            <button key={c} onClick={() => { onChange(c); setOpen(false); }} className="h-7 w-7 rounded-full border border-border hover:scale-110 transition-transform" style={{ backgroundColor: c }}>
              {c === color && <span className="text-white text-xs">✓</span>}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ColorPicker({ color, onChange }: { color: string; onChange: (c: string) => void }) {
  return (
    <div className="grid gap-1">
      <label className="text-sm font-semibold text-foreground">Cor</label>
      <div className="flex flex-wrap gap-2">
        {PALETTE.map((c) => (
          <button key={c} onClick={() => onChange(c)} className="h-8 w-8 rounded-full border-2 transition-transform hover:scale-110" style={{ backgroundColor: c, borderColor: c === color ? "hsl(var(--foreground))" : "transparent" }}>
            {c === color && <span className="text-white text-xs font-bold">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

interface Categoria {
  id: number;
  nome: string;
  cor: string;
  qtdServicos: number;
  descricao: string;
}

const initialData: Categoria[] = [
  { id: 1, nome: "Cabelo", cor: "#3b82f6", qtdServicos: 5, descricao: "Cortes, escovas e penteados" },
  { id: 2, nome: "Barba", cor: "#78716c", qtdServicos: 3, descricao: "Barba e bigode" },
  { id: 3, nome: "Química", cor: "#a855f7", qtdServicos: 4, descricao: "Coloração, relaxamento, progressiva" },
  { id: 4, nome: "Tratamento", cor: "#00c5b4", qtdServicos: 3, descricao: "Hidratação, cauterização, reconstrução" },
  { id: 5, nome: "Unhas", cor: "#ec4899", qtdServicos: 2, descricao: "Manicure e pedicure" },
  { id: 6, nome: "Estética", cor: "#f59e0b", qtdServicos: 2, descricao: "Limpeza de pele, sobrancelha" },
];

type ModalState = { type: "new" } | { type: "edit"; item: Categoria } | { type: "delete"; item: Categoria } | null;

const emptyForm = (): Categoria => ({ id: 0, nome: "", cor: "#3b82f6", qtdServicos: 0, descricao: "" });

export default function ListaCategorias() {
  const [aulaOpen, setAulaOpen] = useState(false);
  const [allData, setAllData] = useState(initialData);
  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<Categoria | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const { toast } = useToast();

  const errors = { nome: !form?.nome ? "Informe o nome da categoria." : "" };

  const openNew = () => { setForm(emptyForm()); setShowErrors(false); setModal({ type: "new" }); };
  const openEdit = (item: Categoria) => { setForm({ ...item }); setShowErrors(false); setModal({ type: "edit", item }); };
  const openDelete = (item: Categoria) => setModal({ type: "delete", item });
  const closeModal = () => { setModal(null); setForm(null); setShowErrors(false); };

  const handleSave = () => {
    if (!form) return;
    setShowErrors(true);
    if (errors.nome) return;
    if (modal?.type === "new") {
      const nextId = allData.length ? Math.max(...allData.map(d => d.id)) + 1 : 1;
      setAllData(prev => [{ ...form, id: nextId }, ...prev]);
      toast({ title: "Categoria cadastrada" });
    } else if (modal?.type === "edit") {
      setAllData(prev => prev.map(d => d.id === form.id ? form : d));
      toast({ title: "Categoria atualizada" });
    }
    closeModal();
  };

  const handleDelete = () => {
    if (modal?.type !== "delete") return;
    setAllData(prev => prev.filter(d => d.id !== modal.item.id));
    toast({ title: "Categoria removida", variant: "destructive" });
    closeModal();
  };

  const handleColorChange = (id: number, newColor: string) => {
    setAllData(prev => prev.map(c => c.id === id ? { ...c, cor: newColor } : c));
  };

  const bulkRemove = (indices: number[]) => {
    const ids = indices.map(i => allData[i]?.id).filter(Boolean);
    setAllData(prev => prev.filter(d => !ids.includes(d.id)));
    toast({ title: `${ids.length} categoria(s) removida(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Remover", icon: <Trash2 className="h-4 w-4" />, onClick: bulkRemove, variant: "destructive", description: "Remove as categorias selecionadas" },
  ];

  const columns: Column<Categoria>[] = [
    {
      key: "nome", label: "Nome", pinned: true,
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <ColorCell color={row.cor} onChange={(c) => handleColorChange(row.id, c)} />
          <span className="font-medium">{v}</span>
        </div>
      ),
    },
    { key: "qtdServicos", label: "Quantidade de Serviços", align: "center" },
    {
      key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
      render: (_, row) => (
        <ActionsMenu items={[
          { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: () => openEdit(row) },
          { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, variant: "destructive", onClick: () => openDelete(row) },
        ]} />
      ),
    },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Categorias"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />}
        data={allData}
        columns={columns}
        selectable
        selectionActions={selectionActions}
        showDateFilter={true}
        novoMenuItems={[{ label: "Nova categoria", onClick: openNew }]}
        pageSize={15}
        tableId="lista_categorias"
      />

      <Dialog open={modal?.type === "new" || modal?.type === "edit"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          {form && (
            <FormModal
              title={modal?.type === "new" ? "Nova categoria" : "Editar categoria"}
              subtitle="Preencha os dados da categoria."
              onClose={closeModal}
              footer={<SaveButton onClick={handleSave} />}
            >
              <TextField label="Nome" value={form.nome} onChange={v => setForm({ ...form, nome: v })} error={showErrors ? errors.nome : ""} />
              <TextField label="Descrição" value={form.descricao} onChange={v => setForm({ ...form, descricao: v })} placeholder="Descrição opcional" />
              <ColorPicker color={form.cor} onChange={c => setForm({ ...form, cor: c })} />
            </FormModal>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={modal?.type === "delete"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <DeleteModal title="Excluir categoria" message={modal?.type === "delete" ? `Deseja excluir "${modal.item.nome}"?` : ""} onConfirm={handleDelete} onClose={closeModal} />
        </DialogContent>
      </Dialog>

      <YouTubeModal open={aulaOpen} onClose={() => setAulaOpen(false)} videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Aula - Categorias" />
    </AppLayout>
  );
}
