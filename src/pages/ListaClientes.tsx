import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, ActionsMenu, SelectionAction, TabDef, SummaryCard } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Trash2, Merge, Tag, MessageCircle, Pencil, Coins, CreditCard, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FormModal, TextField, Dropdown, FormRow, DeleteModal, SaveButton } from "@/components/FormModal";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type StatusCliente = "ativo" | "semi-ativo" | "inativo";
type GeneroCliente = "Masculino" | "Feminino" | "Outro" | "";
type ClienteTab = "basicos" | "endereco";

interface Cliente {
  cod: string;
  nome: string;
  cpf: string;
  telefone: string;
  celular: string;
  email: string;
  aniversario: string;
  genero: GeneroCliente;
  conheceu: string;
  tags: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  estado: string;
  cidade: string;
  ultimaVisita: string;
  moedas: number;
  creditos: number;
  status: StatusCliente;
}

const data: Cliente[] = [
  {
    cod: "745142",
    nome: "Abner Ferreira Chaves",
    cpf: "",
    telefone: "(61) 99450-9929",
    celular: "(61) 99450-9929",
    email: "",
    aniversario: "01/05/2017",
    genero: "Masculino",
    conheceu: "",
    tags: "bloquear123",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "04/11/2025",
    moedas: 196,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1037806",
    nome: "Ada Naama",
    cpf: "",
    telefone: "(67) 99162-990",
    celular: "",
    email: "",
    aniversario: "",
    genero: "Feminino",
    conheceu: "",
    tags: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "17/02/2026",
    moedas: 25,
    creditos: 0,
    status: "ativo",
  },
  {
    cod: "1037807",
    nome: "Adara Cerqueira",
    cpf: "",
    telefone: "6181627802",
    celular: "",
    email: "",
    aniversario: "10/05/2025",
    genero: "Feminino",
    conheceu: "",
    tags: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "17/02/2026",
    moedas: 0,
    creditos: 0,
    status: "ativo",
  },
  {
    cod: "1037808",
    nome: "Adelia Maria Sales",
    cpf: "",
    telefone: "12981134764",
    celular: "",
    email: "",
    aniversario: "",
    genero: "Feminino",
    conheceu: "",
    tags: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "26/11/2025",
    moedas: 4,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1167159",
    nome: "Adelio Marçal",
    cpf: "",
    telefone: "(88) 90300-0166",
    celular: "",
    email: "",
    aniversario: "",
    genero: "Masculino",
    conheceu: "",
    tags: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "05/11/2025",
    moedas: 4,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "675732",
    nome: "Ademar Herminio",
    cpf: "",
    telefone: "(55) 55555-5555",
    celular: "",
    email: "",
    aniversario: "",
    genero: "Masculino",
    conheceu: "",
    tags: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "01/10/2025",
    moedas: 397,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1069712",
    nome: "Adenilson",
    cpf: "",
    telefone: "(21) 99999-9999",
    celular: "",
    email: "",
    aniversario: "20/01/1988",
    genero: "Masculino",
    conheceu: "",
    tags: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "12/08/2025",
    moedas: 0,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1204833",
    nome: "Adenilson",
    cpf: "",
    telefone: "(21) 99999-9999",
    celular: "",
    email: "",
    aniversario: "20/03/1988",
    genero: "Masculino",
    conheceu: "",
    tags: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "11/12/2025",
    moedas: 4,
    creditos: 0,
    status: "semi-ativo",
  },
  {
    cod: "1037809",
    nome: "Adhara Maria",
    cpf: "",
    telefone: "",
    celular: "",
    email: "",
    aniversario: "",
    genero: "Feminino",
    conheceu: "",
    tags: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "10/02/2026",
    moedas: 24,
    creditos: 0,
    status: "ativo",
  },
  {
    cod: "848084",
    nome: "Adriana",
    cpf: "",
    telefone: "(99) 99999-99999",
    celular: "",
    email: "",
    aniversario: "22/03/1988",
    genero: "Feminino",
    conheceu: "",
    tags: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "24/06/2025",
    moedas: 97,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1037810",
    nome: "Adriana",
    cpf: "",
    telefone: "11993966288",
    celular: "",
    email: "",
    aniversario: "",
    genero: "Feminino",
    conheceu: "",
    tags: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "",
    moedas: 0,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1037811",
    nome: "Adriana",
    cpf: "",
    telefone: "12982466363",
    celular: "",
    email: "",
    aniversario: "",
    genero: "Feminino",
    conheceu: "",
    tags: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "",
    moedas: 0,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1037812",
    nome: "Adriana Bitencourt",
    cpf: "",
    telefone: "13997288558",
    celular: "",
    email: "",
    aniversario: "",
    genero: "Feminino",
    conheceu: "",
    tags: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "",
    moedas: 0,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1037813",
    nome: "Adriana Cabello",
    cpf: "",
    telefone: "(19) 99239-3840",
    celular: "",
    email: "",
    aniversario: "",
    genero: "Feminino",
    conheceu: "",
    tags: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "",
    moedas: 0,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1037814",
    nome: "Adriana Cherin",
    cpf: "",
    telefone: "11994527149",
    celular: "",
    email: "",
    aniversario: "",
    genero: "Feminino",
    conheceu: "",
    tags: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "",
    moedas: 0,
    creditos: 0,
    status: "inativo",
  },
];

type ModalState =
  | { type: "new" }
  | { type: "edit"; item: Cliente }
  | { type: "delete"; item: Cliente }
  | { type: "moedas"; item: Cliente }
  | { type: "credito"; item: Cliente }
  | { type: "tags"; item: Cliente }
  | { type: "bulk-tags"; cods: string[] }
  | null;

const emptyForm = (): Cliente => ({
  cod: "",
  nome: "",
  cpf: "",
  telefone: "",
  celular: "",
  email: "",
  aniversario: "",
  genero: "",
  conheceu: "",
    tags: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
  estado: "",
  cidade: "",
  ultimaVisita: "",
  moedas: 0,
  creditos: 0,
  status: "ativo",
});

function TabButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative px-1 pb-2 text-sm font-medium transition ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
      <span
        className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full transition ${
          active ? "bg-primary" : "bg-transparent"
        }`}
      />
    </button>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
      >
        <option value="">Selecione</option>
        {options.map((option) => (
          <option key={`${label}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ListaClientes() {
  const [aulaOpen, setAulaOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");
  const [clienteTab, setClienteTab] = useState<ClienteTab>("basicos");
  const [allData, setAllData] = useState(data);
  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<Cliente | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [moedasQtd, setMoedasQtd] = useState("");
  const [creditoValor, setCreditoValor] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tagsList, setTagsList] = useState<string[]>([]);
  const { toast } = useToast();

  const filteredData = useMemo(() => {
    if (activeTab === "todos") return allData;
    return allData.filter((c) => c.status === activeTab);
  }, [activeTab, allData]);

  const errors = {
    nome: !form?.nome ? "Informe o nome do cliente." : "",
  };

  const openNew = () => {
    setForm(emptyForm());
    setShowErrors(false);
    setClienteTab("basicos");
    setModal({ type: "new" });
  };

  const openEdit = (item: Cliente) => {
    setForm({ ...item });
    setShowErrors(false);
    setClienteTab("basicos");
    setModal({ type: "edit", item });
  };

  const openDelete = (item: Cliente) => setModal({ type: "delete", item });

  const openMoedas = (item: Cliente) => {
    setMoedasQtd("");
    setModal({ type: "moedas", item });
  };

  const openCredito = (item: Cliente) => {
    setCreditoValor("");
    setModal({ type: "credito", item });
  };

  const openTags = (item: Cliente) => {
    setTagInput("");
    setTagsList(
      item.tags
        ? item.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    );
    setModal({ type: "tags", item });
  };

  const closeModal = () => {
    setModal(null);
    setForm(null);
    setShowErrors(false);
    setMoedasQtd("");
    setCreditoValor("");
    setTagInput("");
    setTagsList([]);
    setClienteTab("basicos");
  };

  const handleSave = () => {
    if (!form) return;
    setShowErrors(true);
    if (errors.nome) return;

    if (modal?.type === "new") {
      const nextCod = String(Math.max(...allData.map((d) => Number(d.cod) || 0)) + 1);
      setAllData((prev) => [{ ...form, cod: nextCod }, ...prev]);
      toast({ title: "Cliente cadastrado" });
    } else if (modal?.type === "edit") {
      setAllData((prev) => prev.map((d) => (d.cod === form.cod ? form : d)));
      toast({ title: "Cliente atualizado" });
    }

    closeModal();
  };

  const handleDelete = () => {
    if (modal?.type !== "delete") return;
    setAllData((prev) => prev.filter((d) => d.cod !== modal.item.cod));
    toast({ title: "Cliente removido", variant: "destructive" });
    closeModal();
  };

  const handleMoedas = () => {
    if (modal?.type !== "moedas") return;
    const qtd = Number(moedasQtd) || 0;
    setAllData((prev) => prev.map((d) => (d.cod === modal.item.cod ? { ...d, moedas: d.moedas + qtd } : d)));
    toast({ title: `${qtd} moeda(s) adicionada(s) para ${modal.item.nome}` });
    closeModal();
  };

  const handleCredito = () => {
    if (modal?.type !== "credito") return;
    const val = Number(creditoValor.replace(",", ".")) || 0;
    setAllData((prev) => prev.map((d) => (d.cod === modal.item.cod ? { ...d, creditos: d.creditos + val } : d)));
    toast({ title: `Crédito de ${R$(val)} adicionado para ${modal.item.nome}` });
    closeModal();
  };

  const handleAddTag = () => {
    const normalized = tagInput.trim();
    if (!normalized) return;

    const exists = tagsList.some((tag) => tag.toLowerCase() === normalized.toLowerCase());
    if (exists) return;

    setTagsList((prev) => [...prev, normalized]);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTagsList((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSaveTags = () => {
    if (modal?.type !== "tags") return;

    setAllData((prev) =>
      prev.map((d) =>
        d.cod === modal.item.cod
          ? {
              ...d,
              tags: tagsList.join(", "),
            }
          : d,
      ),
    );

    toast({ title: "Tags atualizadas" });
    closeModal();
  };

  const summaryCards = (filtered: Cliente[]): SummaryCard[] => {
    const totalMoedas = filtered.reduce((s, c) => s + c.moedas, 0);
    const totalCreditos = filtered.reduce((s, c) => s + c.creditos, 0);
    return [
      {
        label: "Moedas Distribuídas",
        value: String(totalMoedas),
        type: "quantity",
        icon: <Coins className="h-4 w-4" />,
        size: "compact",
        color: "blue",
      },
      {
        label: "Créditos em Aberto",
        value: R$(totalCreditos),
        icon: <CreditCard className="h-4 w-4" />,
        size: "wide",
        color: "blue",
      },
    ];
  };

  const totalClientes = allData.length;
  const ativos = allData.filter((c) => c.status === "ativo").length;
  const semiAtivos = allData.filter((c) => c.status === "semi-ativo").length;
  const inativos = allData.filter((c) => c.status === "inativo").length;

  const bulkRemove = (indices: number[]) => {
    const cods = indices.map((i) => filteredData[i]?.cod).filter(Boolean);
    setAllData((prev) => prev.filter((d) => !cods.includes(d.cod)));
    toast({ title: `${cods.length} cliente(s) removido(s)`, variant: "destructive" });
  };

  const bulkMerge = (indices: number[]) =>
    toast({ title: `Mesclar ${indices.length} clientes`, description: "Funcionalidade em desenvolvimento" });

  const bulkMessage = (indices: number[]) =>
    toast({
      title: `Enviar mensagem para ${indices.length} cliente(s)`,
      description: "Funcionalidade em desenvolvimento",
    });

  const bulkTag = (indices: number[]) =>
    toast({ title: `Adicionar tag a ${indices.length} cliente(s)`, description: "Funcionalidade em desenvolvimento" });

  const selectionActions: SelectionAction[] = [
    {
      label: "Mesclar",
      icon: <Merge className="h-4 w-4" />,
      onClick: bulkMerge,
      description: "Unifica cadastros duplicados em um único registro",
    },
    {
      label: "Remover",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: bulkRemove,
      variant: "destructive",
      description: "Remove permanentemente os clientes selecionados da lista",
    },
    {
      label: "Mensagem",
      icon: <MessageCircle className="h-4 w-4" />,
      onClick: bulkMessage,
      description: "Envia mensagem via WhatsApp para os clientes selecionados",
    },
    {
      label: "Tag",
      icon: <Tag className="h-4 w-4" />,
      onClick: bulkTag,
      description: "Adiciona uma tag aos clientes selecionados",
    },
  ];

  const columns: Column<Cliente>[] = [
    { key: "cod", label: "ID", width: "90px" },
    {
      key: "nome",
      label: "Nome",
      pinned: true,
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <WhatsAppButton telefone={row.telefone || row.celular} nome={row.nome} />
          <a href="/clientePesquisa" className="hover:underline font-medium text-foreground">
            {v}
          </a>
        </div>
      ),
    },
    { key: "aniversario", label: "Aniversário" },
    { key: "ultimaVisita", label: "Última Visita" },
    { key: "moedas", label: "Moedas", align: "center" },
    { key: "creditos", label: "Créditos", align: "center", render: (v) => v.toFixed(1) },
    { key: "tags", label: "Tags" },
    {
      key: "status",
      label: "Status",
      render: (v: StatusCliente) => {
        const config: Record<StatusCliente, { label: string; color: string }> = {
          ativo: { label: "Ativo", color: "#00c5b4" },
          "semi-ativo": { label: "Semi-ativo", color: "#f59e0b" },
          inativo: { label: "Inativo", color: "#ff2f2f" },
        };
        const c = config[v];
        return (
          <span className="font-medium" style={{ color: c.color }}>
            {c.label}
          </span>
        );
      },
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
            { label: "Tags", icon: <Tag className="h-4 w-4" />, onClick: () => openTags(row) },
            { label: "Moedas", icon: <Coins className="h-4 w-4" />, onClick: () => openMoedas(row) },
            { label: "Crédito", icon: <CreditCard className="h-4 w-4" />, onClick: () => openCredito(row) },
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

      <Dialog open={modal?.type === "new" || modal?.type === "edit"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          {form && (
            <div className="overflow-hidden rounded-[24px] bg-background shadow-2xl">
              <div className="flex items-start justify-between border-b border-border px-8 pb-5 pt-7">
                <div>
                  <h2 className="text-[24px] font-semibold leading-none tracking-tight">
                    {modal?.type === "new" ? "Novo cliente" : "Editar cliente"}
                  </h2>
                  <p className="mt-3 text-[14px] text-muted-foreground">Preencha os dados do cliente.</p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label="Fechar"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="px-8 pt-5">
                <div className="flex gap-8 border-b border-border">
                  <TabButton active={clienteTab === "basicos"} onClick={() => setClienteTab("basicos")}>
                    Dados Básicos
                  </TabButton>
                  <TabButton active={clienteTab === "endereco"} onClick={() => setClienteTab("endereco")}>
                    Endereço
                  </TabButton>
                </div>
              </div>

              <div className="px-8 pb-8 pt-6">
                {clienteTab === "basicos" && (
                  <div className="space-y-4">
                    <TextField
                      label="Nome"
                      value={form.nome}
                      onChange={(v) => setForm({ ...form, nome: v })}
                      error={showErrors ? errors.nome : ""}
                    />

                    <TextField label="CPF" value={form.cpf} onChange={(v) => setForm({ ...form, cpf: v })} />

                    <div className="grid grid-cols-2 gap-4">
                      <TextField
                        label="Celular"
                        value={form.celular}
                        onChange={(v) => setForm({ ...form, celular: v })}
                        placeholder="(00) 00000-0000"
                      />
                      <TextField label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <TextField
                        label="Aniversário"
                        value={form.aniversario}
                        onChange={(v) => setForm({ ...form, aniversario: v })}
                        placeholder="DD/MM/AAAA"
                      />

<Dropdown
  label="Gênero"
  value={form.genero}
  setValue={(v) => setForm({ ...form, genero: v as GeneroCliente })}
  options={[
    { value: "Masculino", label: "Masculino" },
    { value: "Feminino", label: "Feminino" },
    { value: "Outro", label: "Outro" },
  ]}
/>
                      <Dropdown
                        label="Como Conheceu"
                        value={form.conheceu}
                        setValue={(v) => setForm({ ...form, conheceu: v })}
                        options={[
                          { value: "Google", label: "Google" },
                          { value: "Instagram", label: "Instagram" },
                          { value: "Anúncio", label: "Anúncio" },
                        ]}
                      />
                    </div>
                  </div>
                )}

                {clienteTab === "endereco" && (
                  <div className="space-y-4">
                    <TextField
                      label="Endereço"
                      value={form.endereco}
                      onChange={(v) => setForm({ ...form, endereco: v })}
                    />

                    <TextField label="N" value={form.numero} onChange={(v) => setForm({ ...form, numero: v })} />

                    <TextField
                      label="Complemento"
                      value={form.complemento}
                      onChange={(v) => setForm({ ...form, complemento: v })}
                    />

                    <TextField label="Bairro" value={form.bairro} onChange={(v) => setForm({ ...form, bairro: v })} />

                    <div className="grid grid-cols-2 gap-4">
                      <TextField label="Estado" value={form.estado} onChange={(v) => setForm({ ...form, estado: v })} />
                      <TextField label="Cidade" value={form.cidade} onChange={(v) => setForm({ ...form, cidade: v })} />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-border px-8 py-4">
                <SaveButton onClick={handleSave} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={modal?.type === "delete"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <DeleteModal
            title="Excluir cliente"
            message={modal?.type === "delete" ? `Deseja excluir "${modal.item.nome}"?` : ""}
            onConfirm={handleDelete}
            onClose={closeModal}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={modal?.type === "moedas"} onOpenChange={(open) => !open && closeModal()}>
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

      <Dialog open={modal?.type === "credito"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <FormModal
            title="Adicionar crédito"
            subtitle={modal?.type === "credito" ? `Para ${modal.item.nome}` : ""}
            onClose={closeModal}
            footer={<SaveButton onClick={handleCredito} />}
          >
            <TextField
              label="Valor do crédito (R$)"
              value={creditoValor}
              onChange={setCreditoValor}
              placeholder="0,00"
            />
          </FormModal>
        </DialogContent>
      </Dialog>

      <Dialog open={modal?.type === "tags"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <FormModal
            title="Gerenciar tags"
            subtitle={modal?.type === "tags" ? `Cliente: ${modal.item.nome}` : ""}
            onClose={closeModal}
            footer={<SaveButton onClick={handleSaveTags} />}
          >
            <div className="space-y-3">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <TextField label="Nova tag" value={tagInput} onChange={setTagInput} placeholder="Digite uma tag" />
                </div>

                <button
                  type="button"
                  onClick={handleAddTag}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  Adicionar
                </button>
              </div>

              <div className="min-h-[44px] rounded-xl border border-border bg-background px-3 py-2">
                {tagsList.length === 0 ? (
                  <span className="text-sm text-muted-foreground">Nenhuma tag adicionada.</span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tagsList.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition hover:bg-background hover:text-destructive"
                          aria-label={`Remover tag ${tag}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </FormModal>
        </DialogContent>
      </Dialog>

      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Lista de Clientes"
      />
    </AppLayout>
  );
}
