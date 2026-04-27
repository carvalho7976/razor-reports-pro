import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard } from "@/components/DataTable";
import { FormModal, FormRow, TextField, Dropdown } from "@/components/FormModal";
import { User, CheckCircle2, Trash2, Cake, Percent, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { cn } from "@/lib/utils";

const R$ = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface LinhaProfissional {
  id: number;
  profissional: string;
  qtdServicosTempo: number;
  tempoTrabalhado: number; // minutos
  qtdServicosPorcentagem: number;
  qtdProdutos: number;
  clientesAtendidos: number;
  valor: number; // valor a pagar (gerado a partir do bolo)
}

interface PeriodoData {
  totalBolo: number;
  percEquipe: number;
  pago: boolean;
  linhas: LinhaProfissional[];
}

const baseProfissionais: Omit<LinhaProfissional, "valor">[] = [
  { id: 1, profissional: "Cesar", qtdServicosTempo: 0, tempoTrabalhado: 0, qtdServicosPorcentagem: 0, qtdProdutos: 0, clientesAtendidos: 0 },
  { id: 2, profissional: "Claudia", qtdServicosTempo: 2, tempoTrabalhado: 90, qtdServicosPorcentagem: 0, qtdProdutos: 0, clientesAtendidos: 1 },
  { id: 3, profissional: "Fila de espera", qtdServicosTempo: 0, tempoTrabalhado: 0, qtdServicosPorcentagem: 0, qtdProdutos: 0, clientesAtendidos: 0 },
  { id: 4, profissional: "Henrique", qtdServicosTempo: 0, tempoTrabalhado: 0, qtdServicosPorcentagem: 0, qtdProdutos: 0, clientesAtendidos: 0 },
  { id: 5, profissional: "Lara", qtdServicosTempo: 1, tempoTrabalhado: 45, qtdServicosPorcentagem: 0, qtdProdutos: 0, clientesAtendidos: 1 },
  { id: 6, profissional: "Marcia Silva", qtdServicosTempo: 3, tempoTrabalhado: 120, qtdServicosPorcentagem: 1, qtdProdutos: 0, clientesAtendidos: 2 },
  { id: 7, profissional: "Matheus", qtdServicosTempo: 4, tempoTrabalhado: 180, qtdServicosPorcentagem: 0, qtdProdutos: 1, clientesAtendidos: 3 },
  { id: 8, profissional: "Ramon", qtdServicosTempo: 0, tempoTrabalhado: 0, qtdServicosPorcentagem: 0, qtdProdutos: 0, clientesAtendidos: 0 },
  { id: 9, profissional: "Vini", qtdServicosTempo: 1, tempoTrabalhado: 30, qtdServicosPorcentagem: 0, qtdProdutos: 0, clientesAtendidos: 1 },
];

const periodosOptions = [
  { value: "abr/2025", label: "Abr/2025" },
  { value: "mai/2025", label: "Mai/2025" },
  { value: "jun/2025", label: "Jun/2025" },
  { value: "mar/2026", label: "Mar/2026" },
  { value: "abr/2026", label: "Abr/2026" },
];

// Período já pago de exemplo
const periodosIniciais: Record<string, PeriodoData> = {
  "abr/2025": {
    totalBolo: 5998,
    percEquipe: 50,
    pago: true,
    linhas: baseProfissionais.map((p, idx) => ({
      ...p,
      valor: Math.round(((p.tempoTrabalhado + p.qtdProdutos * 30 + p.clientesAtendidos * 10) / 600) * 5998 * 0.5 * 100) / 100,
    })),
  },
};

// Máscara monetária pt-BR (centavos da direita p/ esquerda)
function parseCurrency(input: string): number {
  const digits = input.replace(/\D/g, "");
  if (!digits) return 0;
  return parseInt(digits, 10) / 100;
}
function formatCurrency(v: number): string {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function parsePercent(input: string): number {
  const digits = input.replace(/\D/g, "");
  if (!digits) return 0;
  return Math.min(10000, parseInt(digits, 10)) / 100;
}

export default function RelatorioAssinatura() {
  const { toast } = useToast();
  const [aulaOpen, setAulaOpen] = useState(false);
  const [periodo, setPeriodo] = useState<string>("abr/2026");
  const [periodos, setPeriodos] = useState<Record<string, PeriodoData>>(periodosIniciais);

  // Modal "Novo" → Gerar bolo
  const [novoOpen, setNovoOpen] = useState(false);
  const [novoPeriodo, setNovoPeriodo] = useState<string>(periodo);
  const [novoBolo, setNovoBolo] = useState<string>("");
  const [novoPerc, setNovoPerc] = useState<string>("");
  const [errors, setErrors] = useState<{ bolo?: string; perc?: string }>({});

  const dadosPeriodo: PeriodoData | undefined = periodos[periodo];
  const gerado = !!dadosPeriodo;

  const linhas: LinhaProfissional[] = useMemo(() => {
    if (dadosPeriodo) return dadosPeriodo.linhas;
    // Sem geração: mostra zeros para os profissionais base
    return baseProfissionais.map((p) => ({ ...p, valor: 0 }));
  }, [dadosPeriodo]);

  const summaryCards: SummaryCard[] = useMemo(() => {
    const cards: SummaryCard[] = [
      {
        label: "Total Bolo",
        value: dadosPeriodo ? R$(dadosPeriodo.totalBolo) : R$(0),
        icon: <Cake className="h-4 w-4" />,
        color: "blue",
      },
      {
        label: "% da Equipe",
        value: dadosPeriodo ? `${dadosPeriodo.percEquipe.toFixed(2)}%` : "0,00%",
        icon: <Percent className="h-4 w-4" />,
        color: "blue",
      },
      {
        label: "Valor Distribuído",
        value: dadosPeriodo
          ? R$(dadosPeriodo.totalBolo * (dadosPeriodo.percEquipe / 100))
          : R$(0),
        icon: <Users className="h-4 w-4" />,
        color: dadosPeriodo?.pago ? "green" : "blue",
      },
    ];
    return cards;
  }, [dadosPeriodo]);

  const onGerar = () => {
    const bolo = parseCurrency(novoBolo);
    const perc = parsePercent(novoPerc);
    const errs: typeof errors = {};
    if (!bolo) errs.bolo = "Informe o total do bolo";
    if (!perc) errs.perc = "Informe a % da equipe";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const valorEquipe = bolo * (perc / 100);
    const totalPeso = baseProfissionais.reduce(
      (s, p) => s + p.tempoTrabalhado + p.qtdProdutos * 30 + p.clientesAtendidos * 10,
      0,
    );
    const novasLinhas: LinhaProfissional[] = baseProfissionais.map((p) => {
      const peso = p.tempoTrabalhado + p.qtdProdutos * 30 + p.clientesAtendidos * 10;
      const valor = totalPeso > 0 ? Math.round((peso / totalPeso) * valorEquipe * 100) / 100 : 0;
      return { ...p, valor };
    });

    setPeriodos((prev) => ({
      ...prev,
      [novoPeriodo]: { totalBolo: bolo, percEquipe: perc, pago: false, linhas: novasLinhas },
    }));
    setPeriodo(novoPeriodo);
    setNovoOpen(false);
    setNovoBolo("");
    setNovoPerc("");
    toast({ title: "Bolo gerado", description: `Período ${novoPeriodo} gerado com sucesso.` });
  };

  const onPagarLinha = (id: number) => {
    setPeriodos((prev) => {
      const atual = prev[periodo];
      if (!atual) return prev;
      // marca o período inteiro como pago (regra: pagamento por período)
      return { ...prev, [periodo]: { ...atual, pago: true } };
    });
    toast({ title: "Pagamento registrado", description: `Profissional pago no período ${periodo}.` });
  };

  const onExcluirLinha = (id: number) => {
    setPeriodos((prev) => {
      const atual = prev[periodo];
      if (!atual) return prev;
      return { ...prev, [periodo]: { ...atual, pago: false } };
    });
    toast({ title: "Pagamento excluído", description: `Pagamento removido no período ${periodo}.` });
  };

  const ActionPill = ({
    variant,
    icon,
    label,
    onClick,
  }: {
    variant: "success" | "destructive";
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        variant === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
          : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
      )}
    >
      {icon}
      {label}
    </button>
  );

  const columns: Column<LinhaProfissional>[] = [
    {
      key: "profissional",
      label: "Profissional",
      pinned: true,
      render: (v) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <a href="/funcionarioPesquisa" className="hover:underline font-medium">
            {v}
          </a>
        </div>
      ),
    },
    { key: "qtdServicosTempo", label: "Qtd serviços por tempo", align: "right" },
    { key: "tempoTrabalhado", label: "Tempo trabalhado", align: "right", render: (v) => `${v} min` },
    { key: "qtdServicosPorcentagem", label: "Qtd serviços por porcentagem", align: "right" },
    { key: "qtdProdutos", label: "Qtd produtos", align: "right" },
    { key: "clientesAtendidos", label: "Clientes atendidos", align: "right" },
    {
      key: "valor",
      label: "Valor",
      align: "right",
      render: (v: number) => (
        <span className="font-medium text-foreground">{R$(v)}</span>
      ),
    },
    {
      key: "id",
      label: "Ações",
      align: "center",
      render: (_v, row) => {
        if (!gerado) {
          return <span className="text-xs text-muted-foreground">—</span>;
        }
        return dadosPeriodo?.pago ? (
          <ActionPill
            variant="destructive"
            icon={<Trash2 className="h-3.5 w-3.5" />}
            label="Excluir"
            onClick={() => onExcluirLinha(row.id)}
          />
        ) : (
          <ActionPill
            variant="success"
            icon={<CheckCircle2 className="h-3.5 w-3.5" />}
            label="Pagar"
            onClick={() => onPagarLinha(row.id)}
          />
        );
      },
    },
  ];

  const totalValor = linhas.reduce((s, r) => s + r.valor, 0);

  return (
    <AppLayout>
      <DataTable
        title="Comissões assinaturas"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />}
        data={linhas}
        columns={columns}
        totalRow={{ profissional: "Total:", valor: R$(totalValor) }}
        summaryCards={summaryCards}
        slotBetweenCardsAndTabs={
          <div className="flex items-end gap-3">
            <div className="grid gap-0.5 min-w-[160px]">
              <label className="text-[13px] font-semibold text-foreground">Período</label>
              <Dropdown
                label=""
                value={periodo}
                setValue={setPeriodo}
                options={periodosOptions}
              />
            </div>
          </div>
        }
        pageSize={15}
        tableId="relatorio_assinatura"
        novoMenuItems={[
          {
            label: "Novo",
            onClick: () => {
              setNovoPeriodo(periodo);
              setNovoBolo("");
              setNovoPerc("");
              setErrors({});
              setNovoOpen(true);
            },
          },
        ]}
      />

      {novoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <FormModal
            title="Gerar bolo de assinaturas"
            subtitle="Defina o total do bolo e a % destinada à equipe"
            onClose={() => setNovoOpen(false)}
            footer={
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNovoOpen(false)}
                  className="h-9 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={onGerar}
                  className="h-9 rounded-lg bg-[hsl(var(--novo-btn))] px-4 text-sm font-medium text-[hsl(var(--novo-btn-foreground))] hover:bg-[hsl(var(--novo-btn)/0.85)]"
                >
                  Gerar
                </button>
              </div>
            }
          >
            <FormRow cols={3}>
              <Dropdown
                label="Período"
                value={novoPeriodo}
                setValue={setNovoPeriodo}
                options={periodosOptions}
              />
              <TextField
                label="Total Bolo (R$)"
                value={novoBolo ? `R$ ${formatCurrency(parseCurrency(novoBolo))}` : ""}
                onChange={(v) => setNovoBolo(v)}
                placeholder="R$ 0,00"
                error={errors.bolo}
              />
              <TextField
                label="% da Equipe"
                value={novoPerc ? `${formatCurrency(parsePercent(novoPerc))}%` : ""}
                onChange={(v) => setNovoPerc(v)}
                placeholder="0,00%"
                error={errors.perc}
              />
            </FormRow>
          </FormModal>
        </div>
      )}

      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Comissões Assinaturas"
      />
    </AppLayout>
  );
}