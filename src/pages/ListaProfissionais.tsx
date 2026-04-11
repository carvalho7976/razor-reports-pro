import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, ActionsMenu, SelectionAction } from "@/components/DataTable";
import { Lock, Pencil, Trash2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FormModal, TextField, Dropdown, FormRow, DeleteModal, PasswordModal, SaveButton } from "@/components/FormModal";

interface Profissional {
  id: number;
  nome: string;
  email: string;
  celular: string;
  aniversario: string;
  funcao: string;
}

const funcaoOptions = [
  { value: "Gerente", label: "Gerente" },
  { value: "Profissional", label: "Profissional" },
  { value: "Recepção", label: "Recepção" },
  { value: "Caixa", label: "Caixa" },
  { value: "Auxiliar", label: "Auxiliar" },
  { value: "Assistente", label: "Assistente" },
];

const initialData: Profissional[] = [
  { id: 1, nome: "Cesar", email: "gerente@frizzar.com.br", celular: "", aniversario: "", funcao: "Gerente" },
  { id: 2, nome: "Claudia", email: "rogerio_carvalho15@hotmail.com", celular: "", aniversario: "", funcao: "Profissional" },
  { id: 3, nome: "Fila de espera", email: "fila@gmail.com", celular: "", aniversario: "", funcao: "Recepção" },
  { id: 4, nome: "Henrique", email: "henrique@henrique.com", celular: "", aniversario: "", funcao: "Recepção" },
  { id: 5, nome: "Lara", email: "frizzar@gmail.com", celular: "", aniversario: "29/07/1988", funcao: "Frizzar" },
  { id: 6, nome: "Marcia Silva", email: "marcia123@mail.com", celular: "", aniversario: "", funcao: "Assistente" },
  { id: 7, nome: "Matheus", email: "douglasneres06@gmail.com", celular: "", aniversario: "", funcao: "Profissional" },
  { id: 8, nome: "Ramon", email: "asodji@gmail.com", celular: "(41) 99898-9898", aniversario: "10/05/1988", funcao: "Caixa" },
  { id: 9, nome: "Vini", email: "vi@gmail.com", celular: "", aniversario: "", funcao: "Auxiliar" },
];

type ModalState =
  | { type: "new" }
  | { type: "edit"; item: Profissional }
  | { type: "delete"; item: Profissional }
  | { type: "password"; item: Profissional }
  | null;

const emptyForm = (): Profissional => ({ id: 0, nome: "", email: "", celular: "", aniversario: "", funcao: "Profissional" });

export default function ListaProfissionais() {
  const [aulaOpen, setAulaOpen] = useState(false);
  const [allData, setAllData] = useState(initialData);
  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<Profissional | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const { toast } = useToast();

  const errors = {
    nome: !form?.nome ? "Informe o nome." : "",
    email: !form?.email ? "Informe o email." : "",
  };

  const openNew = () => { setForm(emptyForm()); setShowErrors(false); setModal({ type: "new" }); };
  const openEdit = (item: Profissional) => { setForm({ ...item }); setShowErrors(false); setModal({ type: "edit", item }); };
  const openDelete = (item: Profissional) => setModal({ type: "delete", item });
  const openPassword = (item: Profissional) => setModal({ type: "password", item });
  const closeModal = () => { setModal(null); setForm(null); setShowErrors(false); };

  const handleSave = () => {
    if (!form) return;
    setShowErrors(true);
    if (errors.nome || errors.email) return;
    if (modal?.type === "new") {
      const nextId = allData.length ? Math.max(...allData.map(d => d.id)) + 1 : 1;
      setAllData(prev => [{ ...form, id: nextId }, ...prev]);
      toast({ title: "Profissional cadastrado" });
    } else if (modal?.type === "edit") {
      setAllData(prev => prev.map(d => d.id === form.id ? form : d));
      toast({ title: "Profissional atualizado" });
    }
    closeModal();
  };

  const handleDelete = () => {
    if (modal?.type !== "delete") return;
    setAllData(prev => prev.filter(d => d.id !== modal.item.id));
    toast({ title: "Profissional removido", variant: "destructive" });
    closeModal();
  };

  const handlePassword = () => {
    if (modal?.type !== "password") return;
    toast({ title: `Senha alterada para ${modal.item.nome}` });
    closeModal();
  };

  const bulkRemove = (indices: number[]) => {
    const ids = indices.map(i => allData[i]?.id).filter(Boolean);
    setAllData(prev => prev.filter(d => !ids.includes(d.id)));
    toast({ title: `${ids.length} profissional(is) removido(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Remover", icon: <Trash2 className="h-4 w-4" />, onClick: bulkRemove, variant: "destructive", description: "Remove permanentemente os profissionais selecionados" },
  ];

  const columns: Column<Profissional>[] = [
    {
      key: "nome", label: "Nome", pinned: true,
      render: v => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <a href="/funcionarioPesquisa" className="hover:underline font-medium">{v}</a>
        </div>
      ),
    },
    { key: "email", label: "Email" },
    { key: "celular", label: "Celular" },
    { key: "aniversario", label: "Aniversário" },
    {
      key: "funcao", label: "Função",
      render: v => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-foreground">{v}</span>
      ),
    },
    {
      key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
      render: (_, row) => (
        <ActionsMenu items={[
          { label: "Alterar senha", icon: <Lock className="h-4 w-4" />, onClick: () => openPassword(row) },
          { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: () => openEdit(row) },
          { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, variant: "destructive", onClick: () => openDelete(row) },
        ]} />
      ),
    },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Profissionais"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />}
        data={allData}
        columns={columns}
        showDateFilter={true}
        selectable
        selectionActions={selectionActions}
        novoMenuItems={[{ label: "Novo profissional", onClick: openNew }]}
        pageSize={15}
        tableId="lista_profissionais"
      />

      {/* New / Edit */}
      <Dialog open={modal?.type === "new" || modal?.type === "edit"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          {form && (
            <FormModal
              title={modal?.type === "new" ? "Novo profissional" : "Editar profissional"}
              subtitle="Preencha os dados do profissional."
              onClose={closeModal}
              footer={<SaveButton onClick={handleSave} />}
            >
              <FormRow>
                <TextField label="Nome" value={form.nome} onChange={v => setForm({ ...form, nome: v })} error={showErrors ? errors.nome : ""} />
                <TextField label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} error={showErrors ? errors.email : ""} />
              </FormRow>
              <FormRow cols={3}>
                <TextField label="Celular" value={form.celular} onChange={v => setForm({ ...form, celular: v })} placeholder="(00) 00000-0000" />
                <TextField label="Aniversário" value={form.aniversario} onChange={v => setForm({ ...form, aniversario: v })} placeholder="DD/MM/AAAA" />
                <Dropdown label="Função" value={form.funcao} setValue={v => setForm({ ...form, funcao: v })} options={funcaoOptions} />
              </FormRow>
            </FormModal>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={modal?.type === "delete"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <DeleteModal title="Excluir profissional" message={modal?.type === "delete" ? `Deseja excluir "${modal.item.nome}"?` : ""} onConfirm={handleDelete} onClose={closeModal} />
        </DialogContent>
      </Dialog>

      {/* Password */}
      <Dialog open={modal?.type === "password"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          {modal?.type === "password" && (
            <PasswordModal nome={modal.item.nome} onConfirm={handlePassword} onClose={closeModal} />
          )}
        </DialogContent>
      </Dialog>

      <YouTubeModal open={aulaOpen} onClose={() => setAulaOpen(false)} videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Aula - Profissionais" />
    </AppLayout>
  );
}
