import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, ActionsMenu, SelectionAction, SummaryCard, TabDef } from "@/components/DataTable";
import { CheckCircle, XCircle, Pencil, Trash2, DollarSign, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FormModal, TextField, Dropdown, FormRow, DeleteModal, SaveButton } from "@/components/FormModal";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function formatCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "R$ 0,00";
  const numberValue = Number(digits) / 100;
  return numberValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseCurrency(value: string): number {
  const digits = value.replace(/\D/g, "");
  return Number(digits) / 100;
}

interface Conta {
  id: number;
  conta: string;
  credor: string;
  descricao: string;
  vencimento: string;
  valor: number;
  status: string;
  dataPagamento: string;
  recorrente: boolean;
  recorrencia: number;
}

const contaOptions = [
  { value: "Aluguel", label: "Aluguel" },
  { value: "Energia", label: "Energia" },
  { value: "Água", label: "Água" },
  { value: "Internet", label: "Internet" },
  { value: "Fornecedor", label: "Fornecedor" },
  { value: "Manutenção", label: "Manutenção" },
  { value: "Outros", label: "Outros" },
];

const initialData: Conta[] = [
  { id: 1, conta: "Aluguel", credor: "Imobiliária XYZ", descricao: "Aluguel do salão", vencimento: "10/03/2026", valor: 3500, status: "Pendente", dataPagamento: "", recorrente: false, recorrencia: 1 },
  { id: 2, conta: "Energia", credor: "Copel", descricao: "Conta de luz", vencimento: "15/03/2026", valor: 890, status: "Pendente", dataPagamento: "", recorrente: false, recorrencia: 1 },
  { id: 3, conta: "Água", credor: "Sanepar", descricao: "Conta de água", vencimento: "12/03/2026", valor: 280, status: "Pago", dataPagamento: "12/03/2026", recorrente: false, recorrencia: 1 },
  { id: 4, conta: "Internet", credor: "WellFibra", descricao: "Internet fibra", vencimento: "20/03/2026", valor: 199.9, status: "Pendente", dataPagamento: "", recorrente: false, recorrencia: 1 },
  { id: 5, conta: "Fornecedor", credor: "Barba & Cia", descricao: "Produtos de barba", vencimento: "05/03/2026", valor: 1250, status: "Pago", dataPagamento: "04/03/2026", recorrente: false, recorrencia: 1 },
  { id: 6, conta: "Manutenção", credor: "João Técnico", descricao: "Reparo cadeira", vencimento: "25/03/2026", valor: 450, status: "Pendente", dataPagamento: "", recorrente: false, recorrencia: 1 },
];

const tabFilter = (row: Conta, tab: string) => {
  if (tab === "todas") return true;
  if (tab === "pendentes") return row.status === "Pendente";
  return row.status === "Pago";
};

const buildCards = (filtered: Conta[]): SummaryCard[] => [
  { label: "Em aberto", value: R$(filtered.filter((d) => d.status === "Pendente").reduce((s, r) => s + r.valor, 0)), icon: <DollarSign className="h-4 w-4" />, color: "red" },
  { label: "Pago", value: R$(filtered.filter((d) => d.status === "Pago").reduce((s, r) => s + r.valor, 0)), icon: <DollarSign className="h-4 w-4" />, color: "green" },
];

type ModalState =
  | { type: "new" }
  | { type: "edit"; item: Conta }
  | { type: "pay"; item: Conta }
  | { type: "delete"; item: Conta }
  | null;

interface ContaForm {
  conta: string;
  credor: string;
  descricao: string;
  valor: string;
  vencimento: string;
  recorrente: boolean;
  recorrencia: string;
}

const emptyForm: ContaForm = { conta: "", credor: "", descricao: "", valor: "R$ 0,00", vencimento: "", recorrente: false, recorrencia: "1" };

function contaToForm(c: Conta): ContaForm {
  return {
    conta: c.conta,
    credor: c.credor,
    descricao: c.descricao,
    valor: c.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    vencimento: c.vencimento,
    recorrente: c.recorrente,
    recorrencia: String(c.recorrencia),
  };
}

export default function ContasPagar() {
  const [aulaOpen, setAulaOpen] = useState(false);
  const [tab, setTab] = useState("pendentes");
  const [allData, setAllData] = useState(initialData);
  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<ContaForm>(emptyForm);
  const [payDate, setPayDate] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const { toast } = useToast();

  const closeModal = () => { setModal(null); setForm(emptyForm); setPayDate(""); setShowErrors(false); };

  const openNew = () => { setForm(emptyForm); setModal({ type: "new" }); };
  const openEdit = (item: Conta) => { setForm(contaToForm(item)); setModal({ type: "edit", item }); };
  const openPay = (item: Conta) => { setPayDate(new Date().toISOString().slice(0, 10)); setModal({ type: "pay", item }); };
  const openDelete = (item: Conta) => { setModal({ type: "delete", item }); };

  const handleSave = () => {
    setShowErrors(true);
    if (!form.conta || !form.descricao || parseCurrency(form.valor) <= 0 || !form.vencimento) return;

    if (modal?.type === "new") {
      const newId = Math.max(...allData.map((d) => d.id), 0) + 1;
      setAllData((prev) => [...prev, {
        id: newId, conta: form.conta, credor: form.credor, descricao: form.descricao,
        valor: parseCurrency(form.valor), vencimento: form.vencimento,
        status: "Pendente", dataPagamento: "",
        recorrente: form.recorrente, recorrencia: Number(form.recorrencia) || 1,
      }]);
      toast({ title: "Conta criada com sucesso" });
    } else if (modal?.type === "edit") {
      setAllData((prev) => prev.map((d) => d.id === modal.item.id ? {
        ...d, conta: form.conta, credor: form.credor, descricao: form.descricao,
        valor: parseCurrency(form.valor), vencimento: form.vencimento,
        recorrente: form.recorrente, recorrencia: Number(form.recorrencia) || 1,
      } : d));
      toast({ title: "Conta atualizada" });
    }
    closeModal();
  };

  const handlePay = () => {
    if (modal?.type !== "pay") return;
    if (!payDate) { setShowErrors(true); return; }
    const formatted = new Date(payDate + "T12:00:00").toLocaleDateString("pt-BR");
    setAllData((prev) => prev.map((d) => d.id === modal.item.id ? { ...d, status: "Pago", dataPagamento: formatted } : d));
    toast({ title: "Pagamento registrado" });
    closeModal();
  };

  const handleDelete = () => {
    if (modal?.type !== "delete") return;
    setAllData((prev) => prev.filter((d) => d.id !== modal.item.id));
    toast({ title: "Conta removida", variant: "destructive" });
    closeModal();
  };

  const handleRemovePayment = (id: number) => {
    setAllData((prev) => prev.map((d) => d.id === id ? { ...d, status: "Pendente", dataPagamento: "" } : d));
    toast({ title: "Confirmação de pagamento removida" });
  };

  const bulkMarkPaid = (indices: number[]) => {
    const ids = indices.map((i) => allData[i]?.id).filter(Boolean);
    setAllData((prev) => prev.map((d) => ids.includes(d.id) ? { ...d, status: "Pago", dataPagamento: new Date().toLocaleDateString("pt-BR") } : d));
    toast({ title: `${ids.length} conta(s) marcada(s) como paga(s)` });
  };

  const bulkDelete = (indices: number[]) => {
    const ids = indices.map((i) => allData[i]?.id).filter(Boolean);
    setAllData((prev) => prev.filter((d) => !ids.includes(d.id)));
    toast({ title: `${ids.length} conta(s) removida(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Pagar", icon: <CheckCircle className="h-4 w-4" />, onClick: bulkMarkPaid, description: "Marca as contas selecionadas como pagas" },
    { label: "Deletar", icon: <Trash2 className="h-4 w-4" />, onClick: bulkDelete, variant: "destructive", description: "Remove permanentemente as contas selecionadas" },
  ];

  const columns: Column<Conta>[] = [
    { key: "conta", label: "Conta", pinned: true },
    { key: "credor", label: "Credor" },
    { key: "descricao", label: "Descrição" },
    { key: "vencimento", label: "Vencimento" },
    { key: "valor", label: "Valor", align: "right", render: (v) => R$(v) },
    {
      key: "status", label: "Status",
      render: (v) => <span className="font-medium" style={{ color: v === "Pago" ? "#00c5b4" : "#ff2f2f" }}>{v}</span>,
    },
    { key: "dataPagamento", label: "Data do Pagamento" },
    {
      key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
      render: (_v: any, row: Conta) => (
        <ActionsMenu
          items={[
            ...(row.status === "Pendente"
              ? [{ label: "Pagar", icon: <Coins className="h-4 w-4" />, onClick: () => openPay(row) }]
              : [{ label: "Remover pagamento", icon: <XCircle className="h-4 w-4" />, onClick: () => handleRemovePayment(row.id) }]
            ),
            { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: () => openEdit(row) },
            { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, variant: "destructive", onClick: () => openDelete(row) },
          ]}
        />
      ),
    },
  ];

  const tabs: TabDef[] = [
    { label: "Todas", value: "todas", color: "neutral" },
    { label: "Pendentes", value: "pendentes", color: "destructive" },
    { label: "Pagas", value: "pagas", color: "success" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Contas a Pagar"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />}
        data={allData}
        columns={columns}
        selectable
        selectionActions={selectionActions}
        novoMenuItems={[{ label: "Nova conta", onClick: openNew }]}
        summaryCards={buildCards}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        tabFilterFn={tabFilter}
        pageSize={15}
        showDateFilter={true}
        tableId="contas_pagar"
      />

      {/* Modal Nova / Editar */}
      <Dialog open={modal?.type === "new" || modal?.type === "edit"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <FormModal
            title={modal?.type === "new" ? "Nova conta" : "Editar conta"}
            subtitle="Preencha os dados da conta."
            onClose={closeModal}
            footer={<SaveButton onClick={handleSave} />}
          >
            <FormRow>
              <Dropdown
                label="Tipo de conta"
                value={form.conta}
                setValue={(v) => setForm({ ...form, conta: v })}
                options={contaOptions}
                error={showErrors && !form.conta ? "Selecione o tipo" : ""}
              />
              <TextField label="Credor" value={form.credor} onChange={(v) => setForm({ ...form, credor: v })} placeholder="Nome do credor" />
            </FormRow>
            <TextField label="Descrição" value={form.descricao} onChange={(v) => setForm({ ...form, descricao: v })} placeholder="Descrição da conta" error={showErrors && !form.descricao ? "Informe a descrição" : ""} />
            <FormRow>
              <TextField label="Valor" value={form.valor} onChange={(v) => setForm({ ...form, valor: formatCurrencyInput(v) })} placeholder="R$ 0,00" error={showErrors && parseCurrency(form.valor) <= 0 ? "Informe o valor" : ""} />
              <TextField label="Vencimento" value={form.vencimento} onChange={(v) => setForm({ ...form, vencimento: v })} type="date" error={showErrors && !form.vencimento ? "Informe o vencimento" : ""} />
            </FormRow>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="recorrente"
                checked={form.recorrente}
                onChange={(e) => setForm({ ...form, recorrente: e.target.checked })}
                className="h-4 w-4 rounded border-border accent-foreground"
              />
              <label htmlFor="recorrente" className="text-sm text-foreground">Essa conta se repete?</label>
            </div>
            {form.recorrente && (
              <TextField label="Quantas vezes?" value={form.recorrencia} onChange={(v) => setForm({ ...form, recorrencia: v })} type="number" placeholder="1" />
            )}
          </FormModal>
        </DialogContent>
      </Dialog>

      {/* Modal Pagar */}
      <Dialog open={modal?.type === "pay"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          {modal?.type === "pay" && (
            <FormModal
              title="Pagamento"
              subtitle={`${modal.item.conta} — ${modal.item.descricao}`}
              onClose={closeModal}
              size="sm"
              footer={
                <div className="flex">
                  <button
                    type="button"
                    onClick={handlePay}
                    className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/90 active:scale-[0.98]"
                  >
                    Confirmar pagamento
                  </button>
                </div>
              }
            >
              <div className="text-center pb-2">
                <p className="text-2xl font-bold text-foreground">{R$(modal.item.valor)}</p>
                <p className="text-xs text-muted-foreground mt-1">Vencimento: {modal.item.vencimento}</p>
              </div>
              <TextField
                label="Data do pagamento"
                value={payDate}
                onChange={setPayDate}
                type="date"
                error={showErrors && !payDate ? "Informe a data" : ""}
              />
            </FormModal>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Excluir */}
      <Dialog open={modal?.type === "delete"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          {modal?.type === "delete" && (
            <DeleteModal
              title="Excluir conta"
              message={`Tem certeza que deseja excluir a conta "${modal.item.conta} — ${modal.item.descricao}"?`}
              onConfirm={handleDelete}
              onClose={closeModal}
            />
          )}
        </DialogContent>
      </Dialog>

      <YouTubeModal open={aulaOpen} onClose={() => setAulaOpen(false)} videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Aula - Contas a Pagar" />
    </AppLayout>
  );
}
