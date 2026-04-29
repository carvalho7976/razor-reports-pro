import { useEffect, useRef, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, SummaryCard, TabDef } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { XCircle, DollarSign, CheckCircle2, Plus, ChevronDown, Search, RefreshCw, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FormModal, TextField, FormRow, SaveButton, Dropdown } from "@/components/FormModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Assinante {
  id: number;
  nome: string;
  telefone: string;
  plano: string;
  inicio: string;
  vencimento: string;
  valor: number;
  status: string;
}

interface ClienteCelcoin {
  id: number;
  nome: string;
  documento: string;
  email?: string;
  plano: string;
  status: "Disponível" | "Já importado";
}

interface PlanoOption {
  id: number;
  nome: string;
  recorrencia: string;
  valor: number;
  beneficios: string[];
}

const planosDisponiveis: PlanoOption[] = [
  {
    id: 1,
    nome: "TESTE",
    recorrencia: "Mensal",
    valor: 190.0,
    beneficios: ["Venha quando quiser", "Cortes ilimitados", "Descontos em produtos", "Descontos em serviços"],
  },
  {
    id: 2,
    nome: "Francez Plan Master",
    recorrencia: "Mensal",
    valor: 250.0,
    beneficios: ["5 cortes inclusos", "1 barba inclusa", "10% desconto em produtos"],
  },
  {
    id: 3,
    nome: "LP Barbearia Plano VIP",
    recorrencia: "Mensal",
    valor: 189.0,
    beneficios: ["4 cortes inclusos", "4 barbas inclusas", "15% desconto em produtos"],
  },
  {
    id: 4,
    nome: "ON Barber Plano Master",
    recorrencia: "Mensal",
    valor: 170.0,
    beneficios: ["3 cortes inclusos", "Descontos em serviços"],
  },
];

interface ProfissionalAvatar {
  id: number;
  nome: string;
  iniciais: string;
  cor: string;
}

const profissionaisVenda: ProfissionalAvatar[] = [
  { id: 1, nome: "Cesar", iniciais: "CE", cor: "bg-blue-500" },
  { id: 2, nome: "Claudia", iniciais: "CL", cor: "bg-pink-500" },
  { id: 4, nome: "Henrique", iniciais: "HE", cor: "bg-indigo-500" },
  { id: 5, nome: "Lara", iniciais: "LA", cor: "bg-rose-500" },
  { id: 6, nome: "Marcia Silva", iniciais: "MS", cor: "bg-amber-500" },
  { id: 7, nome: "Matheus", iniciais: "MM", cor: "bg-emerald-500" },
  { id: 9, nome: "Vini", iniciais: "VV", cor: "bg-purple-500" },
];

const clientesCelcoinMock: ClienteCelcoin[] = [
  {
    id: 1,
    nome: "Eduardo Bezerra de Lima",
    documento: "037.880.793-55",
    email: "eduardo@email.com",
    plano: "Barba Club",
    status: "Disponível",
  },
  {
    id: 2,
    nome: "Arthur Almeida",
    documento: "629.148.513-32",
    email: "arthur@email.com",
    plano: "Barba Club",
    status: "Disponível",
  },
  {
    id: 3,
    nome: "Caio Cesar de Souza Fernandes",
    documento: "123.456.789-00",
    email: "caio@email.com",
    plano: "Plano Mensal",
    status: "Disponível",
  },
  {
    id: 4,
    nome: "Caio Cesar de Souza Fernandes",
    documento: "123.456.789-00",
    email: "caio@email.com",
    plano: "Plano Mensal",
    status: "Disponível",
  },
  {
    id: 5,
    nome: "Caio Cesar de Souza Fernandes",
    documento: "123.456.789-00",
    email: "caio@email.com",
    plano: "Plano Mensal",
    status: "Disponível",
  },
  {
    id: 6,
    nome: "Lucas Pereira Rocha",
    documento: "456.789.123-44",
    email: "lucas.rocha@email.com",
    plano: "Barba Club",
    status: "Disponível",
  },
  {
    id: 7,
    nome: "Mariana Silva Costa",
    documento: "789.123.456-77",
    email: "mariana.costa@email.com",
    plano: "Plano Semestral",
    status: "Disponível",
  },
  {
    id: 8,
    nome: "Rafael Souza Oliveira",
    documento: "321.654.987-22",
    email: "rafael.oliveira@email.com",
    plano: "Plano Mensal",
    status: "Disponível",
  },
];

function ProfissionalAvatarBadge({ p, size = "md" }: { p: ProfissionalAvatar; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-6 w-6 text-[10px]" : "h-7 w-7 text-[11px]";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0",
        p.cor,
        dim,
      )}
    >
      {p.iniciais}
    </span>
  );
}

function BeneficiosCard({ plano }: { plano: PlanoOption }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-bold uppercase text-foreground truncate">{plano.nome}</h3>
        <span className="text-base font-bold text-foreground shrink-0">
          {plano.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          <span className="ml-1 text-xs font-normal text-muted-foreground">{plano.recorrencia}</span>
        </span>
      </div>

      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-info">Incluso:</p>

      <ul className="mt-2 flex flex-col gap-2">
        {plano.beneficios.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px] leading-snug font-medium text-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 fill-emerald-500/20" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResponsavelDropdown({ value, onChange }: { value: number | null; onChange: (id: number) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = profissionaisVenda.find((p) => p.id === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = profissionaisVenda.filter((p) => p.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative grid gap-0.5" ref={ref}>
      <label className="text-[13px] font-semibold text-foreground">Responsável pela venda</label>

      <div
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
        className={cn(
          "flex h-10 w-full cursor-text items-center justify-between gap-2 rounded-lg border bg-card px-3 text-sm text-foreground transition-all",
          "border-info/50 hover:border-info",
          open && "border-info ring-4 ring-info/20",
        )}
      >
        {selected && !open && <ProfissionalAvatarBadge p={selected} size="sm" />}

        <input
          ref={inputRef}
          value={open ? search : (selected?.nome ?? "")}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setSearch("");
            setOpen(true);
          }}
          placeholder={selected ? "" : "Selecione..."}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />

        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </div>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-lg border border-border bg-card shadow-xl">
          <div className="max-h-60 overflow-auto">
            {filtered.length === 0 && <div className="px-4 py-3 text-sm text-muted-foreground">Nenhum resultado.</div>}

            {filtered.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onChange(p.id);
                  setOpen(false);
                  setSearch("");
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition",
                  p.id === value ? "bg-foreground text-background" : "hover:bg-muted",
                )}
              >
                <ProfissionalAvatarBadge p={p} size="sm" />
                <span className="truncate">{p.nome}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const initialData: Assinante[] = [
  {
    id: 1,
    nome: "CAIO CESAR DE SOUZA FERNANDES",
    telefone: "(41) 99123-4567",
    plano: "Plano Mensal",
    inicio: "01/01/2026",
    vencimento: "01/04/2026",
    valor: 89.9,
    status: "Em dia",
  },
  {
    id: 2,
    nome: "Everton",
    telefone: "(41) 99876-5432",
    plano: "Plano Trimestral",
    inicio: "15/12/2025",
    vencimento: "15/03/2026",
    valor: 239.9,
    status: "Atrasado",
  },
  {
    id: 3,
    nome: "Luis Alberto Santos",
    telefone: "(41) 98432-1098",
    plano: "Plano Mensal",
    inicio: "10/02/2026",
    vencimento: "10/03/2026",
    valor: 89.9,
    status: "Atrasado",
  },
  {
    id: 4,
    nome: "Gean",
    telefone: "(41) 99654-3210",
    plano: "Plano Semestral",
    inicio: "01/11/2025",
    vencimento: "01/05/2026",
    valor: 449.9,
    status: "Em dia",
  },
  {
    id: 5,
    nome: "Marcel Pires",
    telefone: "(41) 99111-2233",
    plano: "Plano Mensal",
    inicio: "20/02/2026",
    vencimento: "20/03/2026",
    valor: 89.9,
    status: "Atrasado",
  },
  {
    id: 6,
    nome: "Diego Almeida",
    telefone: "(41) 98765-4321",
    plano: "Plano Mensal",
    inicio: "05/03/2026",
    vencimento: "05/04/2026",
    valor: 89.9,
    status: "Em dia",
  },
];

const tabFilter = (row: Assinante, tab: string) => {
  if (tab === "total") return true;
  if (tab === "ativo") return row.status === "Em dia";
  return row.status === "Atrasado";
};

const buildCards = (filtered: Assinante[]): SummaryCard[] => [
  {
    label: "Total em Dia",
    value: R$(filtered.filter((d) => d.status === "Em dia").reduce((s, r) => s + r.valor, 0)),
    icon: <DollarSign className="h-4 w-4" />,
    color: "green",
  },
  {
    label: "Total Atrasado",
    value: R$(filtered.filter((d) => d.status === "Atrasado").reduce((s, r) => s + r.valor, 0)),
    icon: <DollarSign className="h-4 w-4" />,
    color: "red",
  },
];

export default function Assinantes() {
  const [aulaOpen, setAulaOpen] = useState(false);
  const [allData, setAllData] = useState(initialData);
  const { toast } = useToast();

  const [tab, setTab] = useState("total");

  const [novoOpen, setNovoOpen] = useState(false);
  const [celcoinOpen, setCelcoinOpen] = useState(false);

  const [planoSelecionado, setPlanoSelecionado] = useState<number>(planosDisponiveis[0].id);
  const [formNome, setFormNome] = useState("");
  const [formCpf, setFormCpf] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formTelefone, setFormTelefone] = useState("");
  const [responsavelId, setResponsavelId] = useState<number | null>(null);

  const [celcoinSearch, setCelcoinSearch] = useState("");
  const [clientesCelcoin, setClientesCelcoin] = useState<ClienteCelcoin[]>(clientesCelcoinMock);
  const [clientesSelecionados, setClientesSelecionados] = useState<number[]>([]);

  const planoAtual = planosDisponiveis.find((p) => p.id === planoSelecionado) ?? planosDisponiveis[0];

  const clientesCelcoinVisiveis = clientesCelcoin.filter((cliente) => cliente.status !== "Já importado");

  const todosSelecionados =
    clientesCelcoinVisiveis.length > 0 &&
    clientesCelcoinVisiveis.every((cliente) => clientesSelecionados.includes(cliente.id));

  const toggleTodosClientesCelcoin = () => {
    if (todosSelecionados) {
      setClientesSelecionados([]);
      return;
    }

    setClientesSelecionados(clientesCelcoinVisiveis.map((cliente) => cliente.id));
  };

  const resetForm = () => {
    setFormNome("");
    setFormCpf("");
    setFormEmail("");
    setFormTelefone("");
    setResponsavelId(null);
    setPlanoSelecionado(planosDisponiveis[0].id);
  };

  const resetCelcoin = () => {
    setCelcoinSearch("");
    setClientesSelecionados([]);
    setClientesCelcoin(clientesCelcoinMock);
  };

  const handleAssinar = () => {
    if (!formNome.trim()) {
      toast({ title: "Informe o nome do assinante", variant: "destructive" });
      return;
    }

    if (!responsavelId) {
      toast({ title: "Selecione o responsável pela venda", variant: "destructive" });
      return;
    }

    const novo: Assinante = {
      id: Math.max(0, ...allData.map((a) => a.id)) + 1,
      nome: formNome.trim().toUpperCase(),
      telefone: formTelefone || "",
      plano: planoAtual.nome,
      inicio: new Date().toLocaleDateString("pt-BR"),
      vencimento: new Date().toLocaleDateString("pt-BR"),
      valor: planoAtual.valor,
      status: "Em dia",
    };

    setAllData((prev) => [novo, ...prev]);
    toast({ title: "Assinatura criada com sucesso!" });
    setNovoOpen(false);
    resetForm();
  };

  const handleBuscarCelcoin = () => {
    const termo = celcoinSearch.trim().toLowerCase();

    if (!termo) {
      setClientesCelcoin(clientesCelcoinMock);
      return;
    }

    const filtrados = clientesCelcoinMock.filter((cliente) => {
      return (
        cliente.nome.toLowerCase().includes(termo) ||
        cliente.documento.replace(/\D/g, "").includes(termo.replace(/\D/g, "")) ||
        cliente.email?.toLowerCase().includes(termo)
      );
    });

    setClientesCelcoin(filtrados);
  };

  const handleSincronizarCelcoin = () => {
    toast({
      title: "Lista Celcoin sincronizada",
      description: "Os clientes disponíveis foram atualizados.",
    });

    setClientesCelcoin(clientesCelcoinMock);
  };

  const toggleClienteCelcoin = (id: number) => {
    setClientesSelecionados((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const adicionarClientesCelcoin = (clientes: ClienteCelcoin[]) => {
    const disponiveis = clientes.filter((cliente) => cliente.status === "Disponível");

    if (disponiveis.length === 0) {
      toast({
        title: "Nenhum cliente disponível para importar",
        variant: "destructive",
      });
      return;
    }

    setAllData((prev) => {
      const ultimoId = Math.max(0, ...prev.map((a) => a.id));

      const novos: Assinante[] = disponiveis.map((cliente, index) => ({
        id: ultimoId + index + 1,
        nome: cliente.nome.toUpperCase(),
        telefone: "",
        plano: cliente.plano,
        inicio: new Date().toLocaleDateString("pt-BR"),
        vencimento: new Date().toLocaleDateString("pt-BR"),
        valor: 0,
        status: "Em dia",
      }));

      return [...novos, ...prev];
    });

    toast({
      title: `${disponiveis.length} cliente(s) importado(s) da Celcoin`,
    });

    setClientesSelecionados([]);
    setCelcoinOpen(false);
    resetCelcoin();
  };

  const handleAdicionarSelecionadosCelcoin = () => {
    const selecionados = clientesCelcoinVisiveis.filter((cliente) => clientesSelecionados.includes(cliente.id));

    adicionarClientesCelcoin(selecionados);
  };

  const bulkCancel = (indices: number[]) => {
    const ids = indices.map((i) => allData[i]?.id).filter(Boolean);
    setAllData((prev) => prev.filter((d) => !ids.includes(d.id)));
    toast({ title: `${ids.length} assinatura(s) cancelada(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    {
      label: "Cancelar Assinatura",
      icon: <XCircle className="h-4 w-4" />,
      onClick: bulkCancel,
      variant: "destructive",
      description: "Cancela as assinaturas selecionadas",
    },
  ];

  const columns: Column<Assinante>[] = [
    {
      key: "nome",
      label: "Nome",
      pinned: true,
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <WhatsAppButton telefone={row.telefone} nome={row.nome} />
          <a href="/clientePesquisa" className="hover:underline font-medium">
            {v}
          </a>
        </div>
      ),
    },
    { key: "plano", label: "Plano" },
    { key: "inicio", label: "Início" },
    { key: "vencimento", label: "Vencimento" },
    { key: "valor", label: "Valor", align: "right", render: (v) => R$(v) },
    {
      key: "status",
      label: "Status",
      render: (v) => (
        <span className="font-medium" style={{ color: v === "Em dia" ? "#00c5b4" : "#ff2f2f" }}>
          {v}
        </span>
      ),
    },
  ];

  const tabs: TabDef[] = [
    { label: "Total", value: "total", color: "neutral" },
    { label: "Em dia", value: "ativo", color: "success" },
    { label: "Atrasados", value: "atrasado", color: "destructive" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Assinantes"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />}
        data={allData}
        columns={columns}
        showDateFilter={true}
        summaryCards={buildCards}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        tabFilterFn={tabFilter}
        selectable
        selectionActions={selectionActions}
        pageSize={15}
        tableId="assinantes"
        novoMenuItems={[
          {
            label: "Nova Assinatura",
            icon: <Plus className="h-4 w-4" />,
            onClick: () => setNovoOpen(true),
          },
          {
            label: "Adicionar pela Celcoin",
            icon: <UserPlus className="h-4 w-4" />,
            onClick: () => setCelcoinOpen(true),
          },
        ]}
      />

      <Dialog
        open={novoOpen}
        onOpenChange={(o) => {
          setNovoOpen(o);
          if (!o) resetForm();
        }}
      >
        <DialogContent className="max-w-2xl border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <FormModal
            title="Nova Assinatura"
            subtitle="Escolha o plano e preencha os dados do assinante."
            onClose={() => {
              setNovoOpen(false);
              resetForm();
            }}
            size="md"
            footer={<SaveButton onClick={handleAssinar} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[380px]">
              <div className="flex flex-col gap-3">
                <Dropdown
                  label="Plano"
                  value={String(planoSelecionado)}
                  setValue={(v) => setPlanoSelecionado(Number(v))}
                  options={planosDisponiveis.map((p) => ({
                    value: String(p.id),
                    label: `${p.nome} — ${R$(p.valor)}`,
                  }))}
                  searchable
                />

                <BeneficiosCard plano={planoAtual} />
              </div>

              <div className="flex flex-col gap-3">
                <TextField label="Nome" value={formNome} onChange={setFormNome} placeholder="Insira o nome" />

                <FormRow cols={2}>
                  <TextField label="CPF" value={formCpf} onChange={setFormCpf} placeholder="000.000.000-00" />
                  <TextField
                    label="Telefone"
                    value={formTelefone}
                    onChange={setFormTelefone}
                    placeholder="(00) 00000-0000"
                  />
                </FormRow>

                <TextField label="Email" value={formEmail} onChange={setFormEmail} placeholder="Insira o email" />

                <ResponsavelDropdown value={responsavelId} onChange={setResponsavelId} />
              </div>
            </div>
          </FormModal>
        </DialogContent>
      </Dialog>

      <Dialog
        open={celcoinOpen}
        onOpenChange={(o) => {
          setCelcoinOpen(o);
          if (!o) resetCelcoin();
        }}
      >
        <DialogContent className="max-w-[740px] border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <FormModal
            title="Adicionar pela Celcoin"
            subtitle="Busque, sincronize e importe clientes da Celcoin para assinantes."
            onClose={() => {
              setCelcoinOpen(false);
              resetCelcoin();
            }}
            size="lg"
            footer={
              <button
                type="button"
                onClick={handleAdicionarSelecionadosCelcoin}
                disabled={clientesSelecionados.length === 0}
                className={cn(
                  "inline-flex h-11 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold transition",
                  clientesSelecionados.length > 0
                    ? "bg-foreground text-background hover:opacity-90"
                    : "cursor-not-allowed bg-muted text-muted-foreground",
                )}
              >
                Adicionar selecionados
              </button>
            }
          >
            <div className="flex flex-col gap-2">
              <div className="px-0 pb-1">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={celcoinSearch}
                      onChange={(e) => setCelcoinSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleBuscarCelcoin();
                      }}
                      placeholder="Buscar por CPF ou e-mail"
                      className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-info focus:ring-4 focus:ring-info/20"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleBuscarCelcoin}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition hover:opacity-90"
                  >
                    <Search className="h-4 w-4" />
                    Buscar
                  </button>

                  <button
                    type="button"
                    onClick={handleSincronizarCelcoin}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Sincronizar
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-border bg-card">
                {clientesCelcoinVisiveis.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                      <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">Nenhum cliente encontrado</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Tente buscar outro CPF ou e-mail, ou sincronize a lista.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[264px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          <TableHead className="w-[44px] h-10">
                            <Checkbox
                              checked={todosSelecionados}
                              onCheckedChange={toggleTodosClientesCelcoin}
                              className="h-4 w-4 rounded-md border border-zinc-400 bg-background shadow-sm data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                            />
                          </TableHead>
                          <TableHead className="h-10 text-xs font-bold uppercase tracking-wide">Cliente</TableHead>
                          <TableHead className="h-10 text-xs font-bold uppercase tracking-wide">Documento</TableHead>
                          <TableHead className="h-10 text-xs font-bold uppercase tracking-wide">Plano</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientesCelcoinVisiveis.map((cliente) => {
                          const checked = clientesSelecionados.includes(cliente.id);
                          return (
                            <TableRow
                              key={cliente.id}
                              onClick={() => toggleClienteCelcoin(cliente.id)}
                              className={cn("cursor-pointer", checked && "bg-blue-500/5 hover:bg-blue-500/10")}
                            >
                              <TableCell className="py-2">
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={() => toggleClienteCelcoin(cliente.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-4 w-4 rounded-md border border-zinc-400 bg-background shadow-sm data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                                />
                              </TableCell>
                              <TableCell className="py-2">
                                <div className="min-w-0">
                                  <p className="truncate font-semibold text-foreground">{cliente.nome}</p>
                                  {cliente.email && (
                                    <p className="truncate text-xs text-muted-foreground">{cliente.email}</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="py-2 text-muted-foreground">{cliente.documento}</TableCell>
                              <TableCell className="py-2 font-medium text-foreground">{cliente.plano}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
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
        title="Aula - Assinantes"
      />
    </AppLayout>
  );
}
