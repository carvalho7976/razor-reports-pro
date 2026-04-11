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
  comoConheceu: string;
  aniversario: string;
  genero: GeneroCliente;
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
    comoConheceu: "",
    aniversario: "01/05/2017",
    genero: "Masculino",
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
    comoConheceu: "",
    aniversario: "",
    genero: "Feminino",
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
    comoConheceu: "",
    aniversario: "10/05/2025",
    genero: "Feminino",
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
    comoConheceu: "",
    aniversario: "",
    genero: "Feminino",
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
    comoConheceu: "",
    aniversario: "",
    genero: "Masculino",
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
    comoConheceu: "",
    aniversario: "",
    genero: "Masculino",
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
    comoConheceu: "",
    aniversario: "20/01/1988",
    genero: "Masculino",
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
    comoConheceu: "",
    aniversario: "20/03/1988",
    genero: "Masculino",
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
    comoConheceu: "",
    aniversario: "",
    genero: "Feminino",
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
    comoConheceu: "",
    aniversario: "22/03/1988",
    genero: "Feminino",
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
    comoConheceu: "",
    aniversario: "",
    genero: "Feminino",
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
    comoConheceu: "",
    aniversario: "",
    genero: "Feminino",
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
    comoConheceu: "",
    aniversario: "",
    genero: "Feminino",
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
    comoConheceu: "",
    aniversario: "",
    genero: "Feminino",
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
    comoConheceu: "",
    aniversario: "",
    genero: "Feminino",
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
  | null;

const emptyForm = (): Cliente => ({
  cod: "",
  nome: "",
  cpf: "",
  telefone: "",
  celular: "",
  email: "",
  comoConheceu: "",
  aniversario: "",
  genero: "",
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

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
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

  const totalClientes = allData.length;
  const ativos = allData.filter((c) => c.status === "ativo").length;
  const semiAtivos = allData.filter((c) => c.status === "semi-ativo").length;
  const inativos = allData.filter((c) => c.status === "inativo").length;
  const totalMoedas = allData.reduce((s, c) => s + c.moedas, 0);
  const totalCreditos = allData.reduce((s, c) => s + c.creditos, 0);

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

  const summaryCards: SummaryCard[] = [
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

  const columns: Column<Cliente>[] = [
    { key: "cod", label: "ID", width: "90px" },
    {
      key: "nome",
      label: "Nome",
      pinned: true,
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <WhatsAppButton telefone={row.telefone || row.celular} nome={row.nome} />
          <a href="/clientePesquisa" className="hover:underline font-medium">
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
                    End