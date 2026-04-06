import { useState, useMemo, useRef } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard, TabDef } from "@/components/DataTable";
import { User, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface FluxoItem { id: number; usuario: string; data: string; tipo: string; descricao: string; fp: string; comprovante: string; valor: number; }
interface FluxoResumido { id: number; data: string; abertura: number; adicao: number; entrada: number; saida: number; sangria: number; fechamento: number; saldo: number; }

const initialData: FluxoItem[] = [
  { id: 1, usuario: "Lara", data: "05/01/2026 10:22:39", tipo: "Abertura de Gaveta", descricao: "", fp: "", comprovante: "", valor: 176.55 },
  { id: 2, usuario: "Lara", data: "05/01/2026 10:22:39", tipo: "Lançamento avulso", descricao: "", fp: "", comprovante: "", valor: 0 },
  { id: 3, usuario: "", data: "05/01/2026 23:30:12", tipo: "Fechamento de Gaveta", descricao: "", fp: "", comprovante: "", valor: 176.55 },
  { id: 4, usuario: "Carlos", data: "04/01/2026 09:00:00", tipo: "Entrada", descricao: "Corte Masculino - João Silva", fp: "Pix", comprovante: "", valor: 50 },
  { id: 5, usuario: "Carlos", data: "04/01/2026 11:00:00", tipo: "Entrada", descricao: "Pomada Modeladora", fp: "Cartão Crédito", comprovante: "", valor: 40 },
  { id: 6, usuario: "Ana", data: "04/01/2026 14:00:00", tipo: "Saída", descricao: "Material de limpeza", fp: "Dinheiro", comprovante: "", valor: -150 },
  { id: 7, usuario: "Lara", data: "03/01/2026 08:30:00", tipo: "Abertura de Gaveta", descricao: "", fp: "", comprovante: "", valor: 500 },
];

const formaPagCards = [
  { label: "Assinatura", value: "R$ 50,00" },
  { label: "Crédito", value: "R$ 706,00" },
  { label: "Frizzar_Pack", value: "R$ 100,00" },
  { label: "Débito", value: "R$ 23.250,89" },
  { label: "PIX", value: "R$ 429,23" },
  { label: "Dinheiro", value: "R$ 1.075,00" },
  { label: "Debito sumup", value: "R$ 243,05" },
];

function FormasPagamentoCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  };
  return (
    <div className="relative">
      <p className="text-xs text-muted-foreground mb-1.5">Formas de pagamento</p>
      <div className="flex items-center gap-1">
        <button onClick={() => scroll(-1)} className="shrink-0 p-1 rounded hover:bg-muted text-muted-foreground">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {formaPagCards.map((fp) => (
            <div key={fp.label} className="border rounded-lg px-3 py-2 min-w-[120px] shrink-0 bg-card">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-0.5">
                <div className="h-2.5 w-2.5 rounded-full bg-muted" />
                <span>{fp.label}</span>
              </div>
              <p className="text-sm font-medium">{fp.value}</p>
            </div>
          ))}
        </div>
        <button onClick={() => scroll(1)} className="shrink-0 p-1 rounded hover:bg-muted text-muted-foreground">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function FluxoCaixa() {
  const [tab, setTab] = useState("detalhado");

  const totalEntrada = initialData.filter(d => d.valor > 0).reduce((s, r) => s + r.valor, 0);
  const totalSaida = Math.abs(initialData.filter(d => d.valor < 0).reduce((s, r) => s + r.valor, 0));
  const saldo = totalEntrada - totalSaida;

  const summaryCards: SummaryCard[] = [
    { label: "Saldo", value: R$(saldo), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
    { label: "Entradas", value: R$(totalEntrada), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
    { label: "Saídas", value: R$(totalSaida), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
  ];

  const resumidoData: FluxoResumido[] = useMemo(() => {
    const dates = [...new Set(initialData.map(d => d.data.split(" ")[0]))];
    return dates.map((dt, i) => {
      const items = initialData.filter(d => d.data.startsWith(dt));
      const entrada = items.filter(d => d.valor > 0 && d.tipo === "Entrada").reduce((s, r) => s + r.valor, 0);
      const saida = Math.abs(items.filter(d => d.valor < 0).reduce((s, r) => s + r.valor, 0));
      const abertura = i === 0 ? 500 : 0;
      const adicao = 100;
      const sangria = 50;
      const fechamento = abertura + adicao + entrada - saida - sangria;
      return { id: i + 1, data: dt, abertura, adicao, entrada, saida, sangria, fechamento, saldo: entrada - saida };
    });
  }, []);

  const columnsDetalhado: Column<FluxoItem>[] = [
    {
      key: "usuario", label: "Usuário",
      render: (v) => v ? (
        <div className="flex items-center gap-1.5">
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3 w-3 text-muted-foreground" />
          </div>
          <span className="font-medium">{v}</span>
        </div>
      ) : "—",
    },
    { key: "data", label: "Data", pinned: true },
    { key: "tipo", label: "Tipo" },
    { key: "descricao", label: "Descrição" },
    { key: "fp", label: "FP", render: v => v || "—" },
    { key: "comprovante", label: "Comprovante", render: v => v || "—" },
    {
      key: "valor", label: "Valor", align: "right",
      render: (v: number) => (
        <span style={{ color: v > 0 ? "#00c5b4" : v < 0 ? "#ff2f2f" : undefined }}>
          {v >= 0 ? v.toFixed(2) : v.toFixed(2)}
        </span>
      ),
    },
  ];

  const columnsResumido: Column<FluxoResumido>[] = [
    { key: "data", label: "Data", pinned: true },
    { key: "abertura", label: "Abertura", align: "right", render: (v: number) => R$(v) },
    { key: "adicao", label: "Adição", align: "right", render: (v: number) => R$(v) },
    { key: "entrada", label: "Entrada", align: "right", render: (v: number) => <span style={{ color: "#00c5b4" }}>{R$(v)}</span> },
    { key: "saida", label: "Saída", align: "right", render: (v: number) => <span style={{ color: "#ff2f2f" }}>{R$(v)}</span> },
    { key: "sangria", label: "Sangria", align: "right", render: (v: number) => R$(v) },
    { key: "fechamento", label: "Fechamento", align: "right", render: (v: number) => R$(v) },
    { key: "saldo", label: "Saldo", align: "right", render: (v: number) => <span className="font-bold" style={{ color: v >= 0 ? "#00c5b4" : "#ff2f2f" }}>{R$(v)}</span> },
  ];

  const tabs: TabDef[] = [
    { label: "Detalhado", value: "detalhado", color: "neutral" },
    { label: "Resumido", value: "resumido", color: "info" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Fluxo de Caixa"
        data={tab === "detalhado" ? initialData as any[] : resumidoData as any[]}
        columns={tab === "detalhado" ? columnsDetalhado as any : columnsResumido as any}
        summaryCards={summaryCards}
        slotBetweenCardsAndTabs={<FormasPagamentoCarousel />}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        showDateFilter={true}
        pageSize={15}
        tableId="fluxo_caixa"
      />
    </AppLayout>
  );
}
