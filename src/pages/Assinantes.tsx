import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, SummaryCard, TabDef } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CreditCard, XCircle, DollarSign, CheckCircle2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
    nome: "Plano Mensal",
    recorrencia: "Mensal",
    valor: 89.9,
    beneficios: ["Venha quando quiser", "Cortes ilimitados", "Descontos em produtos", "Descontos em serviços"],
  },
  {
    id: 2,
    nome: "Plano Trimestral",
    recorrencia: "Trimestral",
    valor: 239.9,
    beneficios: ["Venha quando quiser", "Cortes ilimitados", "Descontos em produtos", "Barba ilimitada"],
  },
  {
    id: 3,
    nome: "Plano Semestral",
    recorrencia: "Semestral",
    valor: 449.9,
    beneficios: ["Venha quando quiser", "Cortes ilimitados", "Descontos em produtos", "Descontos em serviços", "Barba ilimitada"],
  },
];

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
    status: "Ativo",
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
    status: "Ativo",
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
    status: "Ativo",
  },
];

const tabFilter = (row: Assinante, tab: string) => {
  if (tab === "total") return true;
  if (tab === "ativo") return row.status === "Ativo";
  return row.status === "Atrasado";
};

const buildCards = (filtered: Assinante[]): SummaryCard[] => [
  {
    label: "Total em Dia",
    value: R$(filtered.filter((d) => d.status === "Ativo").reduce((s, r) => s + r.valor, 0)),
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
  const [planoSelecionado, setPlanoSelecionado] = useState<number>(planosDisponiveis[0].id);
  const [formNome, setFormNome] = useState("");
  const [formCpf, setFormCpf] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formTelefone, setFormTelefone] = useState("");

  const planoAtual = planosDisponiveis.find((p) => p.id === planoSelecionado) ?? planosDisponiveis[0];

  const resetForm = () => {
    setFormNome("");
    setFormCpf("");
    setFormEmail("");
    setFormTelefone("");
    setPlanoSelecionado(planosDisponiveis[0].id);
  };

  const handleAssinar = () => {
    if (!formNome.trim()) {
      toast({ title: "Informe o nome do assinante", variant: "destructive" });
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
      status: "Ativo",
    };
    setAllData((prev) => [novo, ...prev]);
    toast({ title: "Assinatura criada com sucesso!" });
    setNovoOpen(false);
    resetForm();
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
        <span className="font-medium" style={{ color: v === "Ativo" ? "#00c5b4" : "#ff2f2f" }}>
          {v}
        </span>
      ),
    },
  ];

  const tabs: TabDef[] = [
    { label: "Total", value: "total", color: "neutral" },
    { label: "Ativos", value: "ativo", color: "success" },
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
        ]}
      />

      <Dialog open={novoOpen} onOpenChange={(o) => { setNovoOpen(o); if (!o) resetForm(); }}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-0 bg-transparent shadow-none">
          <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden bg-[hsl(220_15%_12%)] text-white">
            {/* LEFT — Plan selection + summary */}
            <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-white/10">
              <h2 className="text-2xl font-bold leading-tight">
                Realizar<br />Assinatura
              </h2>

              <div className="mt-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-2">
                  Escolha o plano
                </p>
                <div className="flex flex-col gap-2">
                  {planosDisponiveis.map((p) => {
                    const active = p.id === planoSelecionado;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPlanoSelecionado(p.id)}
                        className={cn(
                          "flex items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors",
                          active
                            ? "border-sky-400 bg-sky-500/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10",
                        )}
                      >
                        <span className="text-sm font-semibold uppercase">{p.nome}</span>
                        <span className="text-xs text-white/70">R$ {p.valor.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold uppercase">{planoAtual.nome}</h3>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-rose-500">
                  Incluso:
                </p>
                <ul className="mt-2 flex flex-col gap-2">
                  {planoAtual.beneficios.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-medium uppercase">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-rose-500" />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <span className="text-2xl font-bold">R$ {planoAtual.valor.toFixed(2)}</span>
                  <span className="ml-2 text-sm text-white/70">{planoAtual.recorrencia}</span>
                </div>
              </div>
            </div>

            {/* RIGHT — Subscriber data */}
            <div className="p-6 sm:p-8 bg-[hsl(220_15%_14%)]">
              <h2 className="text-2xl font-bold">Seus dados</h2>

              <div className="mt-5 flex flex-col gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                    Seu nome
                  </label>
                  <input
                    type="text"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    placeholder="Insira seu nome"
                    className="mt-1 w-full h-11 rounded-md bg-transparent border border-white/20 px-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={formCpf}
                    onChange={(e) => setFormCpf(e.target.value)}
                    placeholder="CPF"
                    className="mt-1 w-full h-11 rounded-md bg-transparent border border-white/20 px-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="Insira seu email"
                    className="mt-1 w-full h-11 rounded-md bg-transparent border border-white/20 px-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={formTelefone}
                    onChange={(e) => setFormTelefone(e.target.value)}
                    placeholder="Telefone"
                    className="mt-1 w-full h-11 rounded-md bg-transparent border border-white/20 px-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAssinar}
                  className="mt-2 h-12 w-full rounded-md bg-sky-400 text-white font-semibold text-base hover:bg-sky-500 transition-colors"
                >
                  Assinar
                </button>
              </div>
            </div>
          </div>
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
