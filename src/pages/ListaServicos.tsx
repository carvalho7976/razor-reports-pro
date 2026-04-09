import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, ActionsMenu } from "@/components/DataTable";
import { Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FormModal, TextField, Dropdown, FormRow, DeleteModal, SaveButton } from "@/components/FormModal";

interface Servico {
  id: number;
  nome: string;
  categoria: string;
  duracao: string;
  valor: number;
  comissao: number;
}

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const categoriaOptions = [
  { value: "Cabelo", label: "Cabelo" },
  { value: "Barba", label: "Barba" },
  { value: "Química", label: "Química" },
  { value: "Tratamento", label: "Tratamento" },
  { value: "Unhas", label: "Unhas" },
  { value: "Estética", label: "Estética" },
];

const duracaoOptions = [
  { value: "15 min", label: "15 min" },
  { value: "20 min", label: "20 min" },
  { value: "30 min", label: "30 min" },
  { value: "45 min", label: "45 min" },
  { value: "60 min", label: "60 min" },
  { value: "90 min", label: "90 min" },
  { value: "120 min", label: "120 min" },
];

const initialData: Servico[] = [
  { id: 1, nome: "Corte Masculino", categoria: "Cabelo", duracao: "30 min", valor: 50, comissao: 40 },
  { id: 2, nome: "Escova", categoria: "Cabelo", duracao: "45 min", valor: 80, comissao: 40 },
  { id: 3, nome: "Barba", categoria: "Barba", duracao: "20 min", valor: 35, comissao: 40 },
  { id: 4, nome: "Coloração", categoria: "Química", duracao: "90 min", valor: 200, comissao: 35 },
  { id: 5, nome: "Hidratação", categoria: "Tratamento", duracao: "60 min", valor: 120, comissao: 40 },
  { id: 6, nome: "Manicure", categoria: "Unhas", duracao: "45 min", valor: 50, comissao: 50 },
  { id: 7, nome: "Pedicure", categoria: "Unhas", duracao: "50 min", valor: 55, comissao: 50 },
];

type ModalState = { type: "new" } | { type: "edit"; item: Servico } | { type: "delete"; item: Servico } | null;

const emptyForm = (): Servico => ({ id: 0, nome: "", categoria: "Cabelo", duracao: "30 min", valor: 0, comissao: 40 });

export default function ListaServicos() {
  const [aulaOpen, setAulaOpen] = useState(false);
  const [allData, setAllData] = useState(initialData);
  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<Servico | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const { toast } = useToast();

  const errors = {
    nome: !form?.nome ? "Informe o nome do serviço." : "",
  };

  const openNew = () => { setForm(emptyForm()); setShowErrors(false); setModal({ type: "new" }); };
  const openEdit = (item: Servico) => { setForm({ ...item }); setShowErrors(false); setModal({ type: "edit", item }); };
  const openDelete = (item: Servico) => setModal({ type: "delete", item });
  const closeModal = () => { setModal(null); setForm(null); setShowErrors(false); };

  const handleSave = () => {
    if (!form) return;
    setShowErrors(true);
    if (errors.nome) return;
    if (modal?.type === "new") {
      const nextId = allData.length ? Math.max(...allData.map(d => d.id)) + 1 : 1;
      setAllData(prev => [{ ...form, id: nextId }, ...prev]);
      toast({ title: "Serviço cadastrado" });
    } else if (modal?.type === "edit") {
      setAllData(prev => prev.map(d => d.id === form.id ? form : d));
      toast({ title: "Serviço atualizado" });
    }
    closeModal();
  };

  const handleDelete = () => {
    if (modal?.type !== "delete") return;
    setAllData(prev => prev.filter(d => d.id !== modal.item.id));
    toast({ title: "Serviço removido", variant: "destructive" });
    closeModal();
  };

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
      render: (_, row) => <ActionsMenu items={[
        { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: () => openEdit(row) },
        { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, variant: "destructive", onClick: () => openDelete(row) },
      ]} />,
    },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Serviços"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />}
        data={allData}
        columns={columns}
        selectable
        selectionActions={selectionActions}
        showDateFilter={true}
        novoMenuItems={[{ label: "Novo serviço", onClick: openNew }]}
        pageSize={15}
        tableId="lista_servicos"
      />

      <Dialog open={modal?.type === "new" || modal?.type === "edit"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          {form && (
            <FormModal
              title={modal?.type === "new" ? "Novo serviço" : "Editar serviço"}
              subtitle="Preencha os dados do serviço."
              onClose={closeModal}
              footer={<SaveButton onClick={handleSave} />}
            >
              <TextField label="Nome" value={form.nome} onChange={v => setForm({ ...form, nome: v })} error={showErrors ? errors.nome : ""} />
              <FormRow>
                <Dropdown label="Categoria" value={form.categoria} setValue={v => setForm({ ...form, categoria: v })} options={categoriaOptions} />
                <Dropdown label="Duração" value={form.duracao} setValue={v => setForm({ ...form, duracao: v })} options={duracaoOptions} />
              </FormRow>
              <FormRow>
                <TextField label="Valor (R$)" value={form.valor ? String(form.valor) : ""} onChange={v => setForm({ ...form, valor: Number(v.replace(",", ".")) || 0 })} placeholder="0,00" />
                <TextField label="Comissão (%)" value={form.comissao ? String(form.comissao) : ""} onChange={v => setForm({ ...form, comissao: Number(v) || 0 })} placeholder="0" />
              </FormRow>
            </FormModal>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={modal?.type === "delete"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <DeleteModal
            title="Excluir serviço"
            message={modal?.type === "delete" ? `Deseja excluir "${modal.item.nome}"?` : ""}
            onConfirm={handleDelete}
            onClose={closeModal}
          />
        </DialogContent>
      </Dialog>

      <YouTubeModal open={aulaOpen} onClose={() => setAulaOpen(false)} videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Aula - Serviços" />
    </AppLayout>
  );
}
