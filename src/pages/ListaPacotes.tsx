import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, ActionsMenu, TabDef } from "@/components/DataTable";
import { Trash2, Eye, Power, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FormModal, TextField, FormRow, DeleteModal, SaveButton, Dropdown } from "@/components/FormModal";

interface Pacote {
  id: number;
  nome: string;
  servicos: string;
  valor: number;
  validade: string;
  status: "Ativo" | "Desativado";
}

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const validadeOptions = [
  { value: "30 dias", label: "30 dias" },
  { value: "60 dias", label: "60 dias" },
  { value: "90 dias", label: "90 dias" },
  { value: "120 dias", label: "120 dias" },
  { value: "180 dias", label: "180 dias" },
  { value: "365 dias", label: "365 dias" },
];

const initialData: Pacote[] = [
  { id: 1, nome: "Pacote Barba + Corte 4x", servicos: "Corte Masculino, Barba", valor: 160, validade: "60 dias", status: "Ativo" },
  { id: 2, nome: "Pacote Hidratação 3x", servicos: "Hidratação", valor: 270, validade: "90 dias", status: "Ativo" },
  { id: 3, nome: "Pacote Corte 5x", servicos: "Corte Masculino", valor: 200, validade: "120 dias", status: "Ativo" },
  { id: 4, nome: "Pacote Coloração 2x", servicos: "Coloração", valor: 350, validade: "60 dias", status: "Desativado" },
  { id: 5, nome: "Pacote Manicure 4x", servicos: "Manicure", valor: 160, validade: "60 dias", status: "Desativado" },
];

type ModalState =
  | { type: "new" }
  | { type: "edit"; item: Pacote }
  | { type: "delete"; item: Pacote }
  | { type: "view"; item: Pacote }
  | null;

const emptyForm = (): Pacote => ({ id: 0, nome: "", servicos: "", valor: 0, validade: "60 dias", status: "Ativo" });

export default function ListaPacotes() {
  const [aulaOpen, setAulaOpen] = useState(false);
  const [allData, setAllData] = useState(initialData);
  const [tab, setTab] = useState("todos");
  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<Pacote | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const { toast } = useToast();

  const tabFilter = (row: Pacote, t: string) => {
    if (t === "todos") return true;
    if (t === "ativos") return row.status === "Ativo";
    return row.status === "Desativado";
  };

  const errors = { nome: !form?.nome ? "Informe o nome do pacote." : "" };

  const openNew = () => { setForm(emptyForm()); setShowErrors(false); setModal({ type: "new" }); };
  const openEdit = (item: Pacote) => { setForm({ ...item }); setShowErrors(false); setModal({ type: "edit", item }); };
  const openDelete = (item: Pacote) => setModal({ type: "delete", item });
  const openView = (item: Pacote) => setModal({ type: "view", item });
  const closeModal = () => { setModal(null); setForm(null); setShowErrors(false); };

  const toggleStatus = (item: Pacote) => {
    const newStatus = item.status === "Ativo" ? "Desativado" : "Ativo";
    setAllData(prev => prev.map(d => d.id === item.id ? { ...d, status: newStatus } : d));
    toast({ title: `Pacote ${newStatus === "Ativo" ? "ativado" : "desativado"}` });
  };

  const handleSave = () => {
    if (!form) return;
    setShowErrors(true);
    if (errors.nome) return;
    if (modal?.type === "new") {
      const nextId = allData.length ? Math.max(...allData.map(d => d.id)) + 1 : 1;
      setAllData(prev => [{ ...form, id: nextId }, ...prev]);
      toast({ title: "Pacote cadastrado" });
    } else if (modal?.type === "edit") {
      setAllData(prev => prev.map(d => d.id === form.id ? form : d));
      toast({ title: "Pacote atualizado" });
    }
    closeModal();
  };

  const handleDelete = () => {
    if (modal?.type !== "delete") return;
    setAllData(prev => prev.filter(d => d.id !== modal.item.id));
    toast({ title: "Pacote removido", variant: "destructive" });
    closeModal();
  };

  const bulkRemove = (indices: number[]) => {
    const ids = indices.map(i => allData[i]?.id).filter(Boolean);
    setAllData(prev => prev.filter(d => !ids.includes(d.id)));
    toast({ title: `${ids.length} pacote(s) removido(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Remover", icon: <Trash2 className="h-4 w-4" />, onClick: bulkRemove, variant: "destructive", description: "Remove os pacotes selecionados" },
  ];

  const columns: Column<Pacote>[] = [
    { key: "nome", label: "Pacote", pinned: true },
    { key: "servicos", label: "Serviços Inclusos" },
    { key: "valor", label: "Preço", align: "right", render: v => R$(v) },
    { key: "validade", label: "Validade" },
    {
      key: "status", label: "Status",
      render: v => <span className="font-medium" style={{ color: v === "Ativo" ? "#00c5b4" : "#ff2f2f" }}>{v}</span>,
    },
    {
      key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
      render: (_, row) => (
        <ActionsMenu items={[
          { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: () => openView(row) },
          { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: () => openEdit(row) },
          { label: row.status === "Ativo" ? "Desativar" : "Ativar", icon: <Power className="h-4 w-4" />, onClick: () => toggleStatus(row) },
          { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, variant: "destructive", onClick: () => openDelete(row) },
        ]} />
      ),
    },
  ];

  const tabs: TabDef[] = [
    { label: "Todos", value: "todos", count: allData.length, color: "neutral" },
    { label: "Ativos", value: "ativos", count: allData.filter(d => d.status === "Ativo").length, color: "success" },
    { label: "Desativados", value: "desativados", count: allData.filter(d => d.status === "Desativado").length, color: "destructive" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Pacotes"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />}
        data={data}
        columns={columns}
        selectable
        selectionActions={selectionActions}
        showDateFilter={true}
        novoMenuItems={[{ label: "Novo pacote", onClick: openNew }]}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        pageSize={15}
        tableId="lista_pacotes"
      />

      {/* New / Edit */}
      <Dialog open={modal?.type === "new" || modal?.type === "edit"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          {form && (
            <FormModal
              title={modal?.type === "new" ? "Novo pacote" : "Editar pacote"}
              subtitle="Preencha os dados do pacote."
              onClose={closeModal}
              footer={<SaveButton onClick={handleSave} />}
            >
              <TextField label="Nome" value={form.nome} onChange={v => setForm({ ...form, nome: v })} error={showErrors ? errors.nome : ""} />
              <TextField label="Serviços Inclusos" value={form.servicos} onChange={v => setForm({ ...form, servicos: v })} placeholder="Ex: Corte, Barba" />
              <FormRow>
                <TextField label="Valor (R$)" value={form.valor ? String(form.valor) : ""} onChange={v => setForm({ ...form, valor: Number(v.replace(",", ".")) || 0 })} placeholder="0,00" />
                <Dropdown label="Validade" value={form.validade} setValue={v => setForm({ ...form, validade: v })} options={validadeOptions} />
              </FormRow>
            </FormModal>
          )}
        </DialogContent>
      </Dialog>

      {/* View */}
      <Dialog open={modal?.type === "view"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          {modal?.type === "view" && (
            <FormModal title="Detalhes do pacote" onClose={closeModal} footer={<div />}>
              <div className="grid gap-3 text-sm">
                <div><span className="font-semibold text-foreground">Nome:</span> <span className="text-muted-foreground">{modal.item.nome}</span></div>
                <div><span className="font-semibold text-foreground">Serviços:</span> <span className="text-muted-foreground">{modal.item.servicos}</span></div>
                <div><span className="font-semibold text-foreground">Valor:</span> <span className="text-muted-foreground">{R$(modal.item.valor)}</span></div>
                <div><span className="font-semibold text-foreground">Validade:</span> <span className="text-muted-foreground">{modal.item.validade}</span></div>
                <div><span className="font-semibold text-foreground">Status:</span> <span className="font-medium" style={{ color: modal.item.status === "Ativo" ? "#00c5b4" : "#ff2f2f" }}>{modal.item.status}</span></div>
              </div>
            </FormModal>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={modal?.type === "delete"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <DeleteModal title="Excluir pacote" message={modal?.type === "delete" ? `Deseja excluir "${modal.item.nome}"?` : ""} onConfirm={handleDelete} onClose={closeModal} />
        </DialogContent>
      </Dialog>

      <YouTubeModal open={aulaOpen} onClose={() => setAulaOpen(false)} videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Aula - Pacotes" />
    </AppLayout>
  );
}
