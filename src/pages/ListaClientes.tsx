import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, ActionsMenu, SelectionAction, TabDef, SummaryCard } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Trash2, Merge, Tag, MessageCircle, Pencil, Coins, CreditCard } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FormModal, TextField, Dropdown, FormRow, DeleteModal, SaveButton } from "@/components/FormModal";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type StatusCliente = "ativo" | "semi-ativo" | "inativo";

interface Cliente {
  cod: string;
  nome: string;
  telefone: string;
  aniversario: string;
  ultimaVisita: string;
  moedas: number;
  creditos: number;
  tags: string;
  status: StatusCliente;
}

const statusOptions = [
  { value: "ativo", label: "Ativo" },
  { value: "semi-ativo", label: "Semi-ativo" },
  { value: "inativo", label: "Inativo" },
];

const data: Cliente[] = [
  { cod: "745142", nome: "Abner Ferreira Chaves", telefone: "(61) 99450-9929", aniversario: "01/05/2017", ultimaVisita: "04/11/2025", moedas: 196, creditos: 0, tags: "bloquear123", status: "inativo" },
  { cod: "1037806", nome: "Ada Naama", telefone: "(67) 99162-990", aniversario: "", ultimaVisita: "17/02/2026", moedas: 25, creditos: 0, tags: "", status: "ativo" },
  { cod: "1037807", nome: "Adara Cerqueira", telefone: "6181627802", aniversario: "10/05/2025", ultimaVisita: "17/02/2026", moedas: 0, creditos: 0, tags: "", status: "ativo" },
  { cod: "1037808", nome: "Adelia Maria Sales", telefone: "12981134764", aniversario: "", ultimaVisita: "26/11/2025", moedas: 4, creditos: 0, tags: "", status: "inativo" },
  { cod: "1167159", nome: "Adelio Marçal", telefone: "(88) 90300-0166", aniversario: "", ultimaVisita: "05/11/2025", moedas: 4, creditos: 0, tags: "", status: "inativo" },
  { cod: "675732", nome: "Ademar Herminio", telefone: "(55) 55555-5555", aniversario: "", ultimaVisita: "01/10/2025", moedas: 397, creditos: 0, tags: "", status: "inativo" },
  { cod: "1069712", nome: "Adenilson", telefone: "(21) 99999-9999", aniversario: "20/01/1988", ultimaVisita: "12/08/2025", moedas: 0, creditos: 0, tags: "", status: "inativo" },
  { cod: "1204833", nome: "Adenilson", telefone: "(21) 99999-9999", aniversario: "20/03/1988", ultimaVisita: "11/12/2025", moedas: 4, creditos: 0, tags: "", status: "semi-ativo" },
  { cod: "1037809", nome: "Adhara Maria", telefone: "", aniversario: "", ultimaVisita: "10/02/2026", moedas: 24, creditos: 0, tags: "", status: "ativo" },
  { cod: "848084", nome: "Adriana", telefone: "(99) 99999-99999", aniversario: "22/03/1988", ultimaVisita: "24/06/2025", moedas: 97, creditos: 0, tags: "", status: "inativo" },
  { cod: "1037810", nome: "Adriana", telefone: "11993966288", aniversario: "", ultimaVisita: "", moedas: 0, creditos: 0, tags: "", status: "inativo" },
  { cod: "1037811", nome: "Adriana", telefone: "12982466363", aniversario: "", ultimaVisita: "", moedas: 0, creditos: 0, tags: "", status: "inativo" },
  { cod: "1037812", nome: "Adriana Bitencourt", telefone: "13997288558", aniversario: "", ultimaVisita: "", moedas: 0, creditos: 0, tags: "", status: "inativo" },
  { cod: "1037813", nome: "Adriana Cabello", telefone: "(19) 99239-3840", aniversario: "", ultimaVisita: "", moedas: 0, creditos: 0, tags: "", status: "inativo" },
  { cod: "1037814", nome: "Adriana Cherin", telefone: "11994527149", aniversario: "", ultimaVisita: "", moedas: 0, creditos: 0, tags: "", status: "inativo" },
];

type ModalState =
  | { type: "new" }
  | { type: "edit"; item: Cliente }
  | { type: "delete"; item: Cliente }
  | { type: "moedas"; item: Cliente }
  | { type: "credito"; item: Cliente }
  | null;

const emptyForm = (): Cliente => ({ cod: "", nome: "", telefone: "", aniversario: "", ultimaVisita: "", moedas: 0, creditos: 0, tags: "", status: "ativo" });

export default function ListaClientes() {
  const [aulaOpen, setAulaOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");
  const [allData, setAllData] = useState(data);
  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<Cliente | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [moedasQtd, setMoedasQtd] = useState("");
  const [creditoValor, setCreditoValor] = useState("");
  const { toast } = useToast();

  const filteredData = useMemo(() => {
    if (activeTab === "todos") return allData;
    return allData.filter((c) => c.status === activeTab);
  }, [activeTab, allData]);

  const errors = { nome: !form?.nome ? "Informe o nome do cliente." : "" };

  const openNew = () => { setForm(emptyForm()); setShowErrors(false); setModal({ type: "new" }); };
  const openEdit = (item: Cliente) => { setForm({ ...item }); setShowErrors(false); setModal({ type: "edit", item }); };
  const openDelete = (item: Cliente) => setModal({ type: "delete", item });
  const openMoedas = (item: Cliente) => { setMoedasQtd(""); setModal({ type: "moedas", item }); };
  const openCredito = (item: Cliente) => { setCreditoValor(""); setModal({ type: "credito", item }); };
  const closeModal = () => { setModal(null); setForm(null); setShowErrors(false); };

  const handleSave = () => {
    if (!form) return;
    setShowErrors(true);
    if (errors.nome) return;
    if (modal?.type === "new") {
      const nextCod = String(Math.max(...allData.map(d => Number(d.cod) || 0)) + 1);
      setAllData(prev => [{ ...form, cod: nextCod }, ...prev]);
      toast({ title: "Cliente cadastrado" });
    } else if (modal?.type === "edit") {
      setAllData(prev => prev.map(d => d.cod === form.cod ? form : d));
      toast({ title: "Cliente atualizado" });
    }
    closeModal();
  };

  const handleDelete = () => {
    if (modal?.type !== "delete") return;
    setAllData(prev => prev.filter(d => d.cod !== modal.item.cod));
    toast({ title: "Cliente removido", variant: "destructive" });
    closeModal();
  };

  const handleMoedas = () => {
    if (modal?.type !== "moedas") return;
    const qtd = Number(moedasQtd) || 0;
    setAllData(prev => prev.map(d => d.cod === modal.item.cod ? { ...d, moedas: d.moedas + qtd } : d));
    toast({ title: `${qtd} moeda(s) adicionada(s) para ${modal.item.nome}` });
    closeModal();
  };

  const handleCredito = () => {
    if (modal?.type !== "credito") return;
    const val = Number(creditoValor.replace(",", ".")) || 0;
    setAllData(prev => prev.map(d => d.cod === modal.item.cod ? { ...d, creditos: d.creditos + val } : d));
    toast({ title: `Crédito de ${R$(val)} adicionado para ${modal.item.nome}` });
    closeModal();
  };

  const totalClientes = allData.length;
  const ativos = allData.filter(c => c.status === "ativo").length;
  const semiAtivos = allData.filter(c => c.status === "semi-ativo").length;
  const inativos = allData.filter(c => c.status === "inativo").length;
  const totalMoedas = allData.reduce((s, c) => s + c.moedas, 0);
  const totalCreditos = allData.reduce((s, c) => s + c.creditos, 0);

  const bulkRemove = (indices: number[]) => {
    const cods = indices.map(i => filteredData[i]?.cod).filter(Boolean);
    setAllData(prev => prev.filter(d => !cods.includes(d.cod)));
    toast({ title: `${cods.length} cliente(s) removido(s)`, variant: "destructive" });
  };
  const bulkMerge = (indices: number[]) => toast({ title: `Mesclar ${indices.length} clientes`, description: "Funcionalidade em desenvolvimento" });
  const bulkMessage = (indices: number[]) => toast({ title: `Enviar mensagem para ${indices.length} cliente(s)`, description: "Funcionalidade em desenvolvimento" });
  const bulkTag = (indices: number[]) => toast({ title: `Adicionar tag a ${indices.length} cliente(s)`, description: "Funcionalidade em desenvolvimento" });

  const selectionActions: SelectionAction[] = [
    { label: "Mesclar", icon: <Merge className="h-4 w-4" />, onClick: bulkMerge, description: "Unifica cadastros duplicados em um único registro" },
    { label: "Remover", icon: <Trash2 className="h-4 w-4" />, onClick: bulkRemove, variant: "destructive", description: "Remove permanentemente os clientes selecionados da lista" },
    { label: "Mensagem", icon: <MessageCircle className="h-4 w-4" />, onClick: bulkMessage, description: "Envia mensagem via WhatsApp para os clientes selecionados" },
    { label: "Tag", icon: <Tag className="h-4 w-4" />, onClick: bulkTag, description: "Adiciona uma tag aos clientes selecionados" },
  ];

  const summaryCards: SummaryCard[] = [
    { label: "Moedas Distribuídas", value: String(totalMoedas), type: "quantity", icon: <Coins className="h-4 w-4" />, size: "compact", color: "blue" },
    { label: "Créditos em Aberto", value: R$(totalCreditos), icon: <CreditCard className="h-4 w-4" />, size: "wide", color: "blue" },
  ];

  const columns: Column<Cliente>[] = [
    { key: "cod", label: "ID", width: "90px" },
    {
      key: "nome", label: "Nome", pinned: true,
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <WhatsAppButton telefone={row.telefone} nome={row.nome} />
          <a href="/clientePesquisa" className="hover:underline font-medium">{v}</a>
        </div>
      ),
    },
    { key: "aniversario", label: "Aniversário" },
    { key: "ultimaVisita", label: "Última Visita" },
    { key: "moedas", label: "Moedas", align: "center" },
    { key: "creditos", label: "Créditos", align: "center", render: v => v.toFixed(1) },
    { key: "tags", label: "Tags" },
    {
      key: "status", label: "Status",
      render: (v: StatusCliente) => {
        const config: Record<StatusCliente, { label: string; color: string }> = {
          ativo: { label: "Ativo", color: "#00c5b4" },
          "semi-ativo": { label: "Semi-ativo", color: "#f59e0b" },
          inativo: { label: "Inativo", color: "#ff2f2f" },
        };
        const c = config[v];
        return <span className="font-medium" style={{ color: c.color }}>{c.label}</span>;
      },
    },
    {
      key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
      render: (_, row) => (
        <ActionsMenu items={[
          { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: () => openEdit(row) },
          { label: "Moedas", icon: <Coins className="h-4 w-4" />, onClick: () => openMoedas(row) },
          { label: "Crédito", icon: <CreditCard className="h-4 w-4" />, onClick: () => openCredito(row) },
          { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, variant: "destructive", onClick: () => openDelete(row) },
        ]} />
      ),
    },
  ];

  const tabs: TabDef[] = [
    { label: "Todos", value: "todos", count: totalClientes, color: "neutral" },
    { label: "Ativos", value: "ativo", count: ativos, color: "success" },
    { label: "Semi-ativos", value: "semi-ativo", count: semiAtivos, color: "warning" },
    { label: "Inativos", value: "inativo", count: inativos, color: "destructive" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Lista de Clientes"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />}
        data={filteredData}
        columns={columns}
        summaryCards={summaryCards}
        showDateFilter={true}
        selectable
        selectionActions={selectionActions}
        pageSize={15}
        novoMenuItems={[{ label: "Novo cliente", onClick: openNew }]}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tableId="lista_clientes"
      />

      {/* New / Edit */}
      <Dialog open={modal?.type === "new" || modal?.type === "edit"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          {form && (
            <FormModal
              title={modal?.type === "new" ? "Novo cliente" : "Editar cliente"}
              subtitle="Preencha os dados do cliente."
              onClose={closeModal}
              footer={<SaveButton onClick={handleSave} />}
            >
              <TextField label="Nome" value={form.nome} onChange={v => setForm({ ...form, nome: v })} error={showErrors ? errors.nome : ""} />
              <FormRow>
                <TextField label="Telefone" value={form.telefone} onChange={v => setForm({ ...form, telefone: v })} placeholder="(00) 00000-0000" />
                <TextField label="Aniversário" value={form.aniversario} onChange={v => setForm({ ...form, aniversario: v })} placeholder="DD/MM/AAAA" />
              </FormRow>
              <FormRow>
                <TextField label="Tags" value={form.tags} onChange={v => setForm({ ...form, tags: v })} />
                <Dropdown label="Status" value={form.status} setValue={v => setForm({ ...form, status: v as StatusCliente })} options={statusOptions} />
              </FormRow>
            </FormModal>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={modal?.type === "delete"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <DeleteModal title="Excluir cliente" message={modal?.type === "delete" ? `Deseja excluir "${modal.item.nome}"?` : ""} onConfirm={handleDelete} onClose={closeModal} />
        </DialogContent>
      </Dialog>

      {/* Moedas */}
      <Dialog open={modal?.type === "moedas"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <FormModal
            title="Adicionar moedas"
            subtitle={modal?.type === "moedas" ? `Para ${modal.item.nome}` : ""}
            onClose={closeModal}
            footer={<SaveButton onClick={handleMoedas} />}
          >
            <TextField label="Quantidade de moedas" value={moedasQtd} onChange={setMoedasQtd} placeholder="0" />
          </FormModal>
        </DialogContent>
      </Dialog>

      {/* Crédito */}
      <Dialog open={modal?.type === "credito"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <FormModal
            title="Adicionar crédito"
            subtitle={modal?.type === "credito" ? `Para ${modal.item.nome}` : ""}
            onClose={closeModal}
            footer={<SaveButton onClick={handleCredito} />}
          >
            <TextField label="Valor do crédito (R$)" value={creditoValor} onChange={setCreditoValor} placeholder="0,00" />
          </FormModal>
        </DialogContent>
      </Dialog>

      <YouTubeModal open={aulaOpen} onClose={() => setAulaOpen(false)} videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Aula - Lista de Clientes" />
    </AppLayout>
  );
}
