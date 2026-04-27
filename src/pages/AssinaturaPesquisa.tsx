import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, ActionsMenu, SelectionAction, TabDef, SummaryCard } from "@/components/DataTable";
import {
  Trash2,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Users,
  DollarSign,
  Star,
  Eye,
  Ticket,
  CheckCircle2,
  X,
  Copy,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DeleteModal } from "@/components/FormModal";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { cn } from "@/lib/utils";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type StatusPlano = "ativo" | "inativo";

interface Plano {
  cod: string;
  nome: string;
  preco: number;
  cortesIncluidos: number;
  barbasIncluidas: number;
  assinantes: number;
  vendas: number;
  desconto: number;
  destaque: boolean;
  status: StatusPlano;
}

const data: Plano[] = [
  {
    cod: "1",
    nome: "TESTE",
    preco: 190.0,
    cortesIncluidos: 0,
    barbasIncluidas: 0,
    assinantes: 0,
    vendas: 0,
    desconto: 0,
    destaque: true,
    status: "ativo",
  },
  {
    cod: "2",
    nome: "Francez Plan Master",
    preco: 250.0,
    cortesIncluidos: 5,
    barbasIncluidas: 1,
    assinantes: 3,
    vendas: 12,
    desconto: 10,
    destaque: false,
    status: "ativo",
  },
  {
    cod: "3",
    nome: "LP Barbearia Plano VIP",
    preco: 189.0,
    cortesIncluidos: 4,
    barbasIncluidas: 4,
    assinantes: 7,
    vendas: 28,
    desconto: 15,
    destaque: false,
    status: "ativo",
  },
  {
    cod: "4",
    nome: "ON Barber Plano Master",
    preco: 170.0,
    cortesIncluidos: 3,
    barbasIncluidas: 0,
    assinantes: 11,
    vendas: 44,
    desconto: 0,
    destaque: false,
    status: "ativo",
  },
  {
    cod: "5",
    nome: "Karina Marmeliz Plano VIP",
    preco: 270.0,
    cortesIncluidos: 4,
    barbasIncluidas: 4,
    assinantes: 2,
    vendas: 8,
    desconto: 20,
    destaque: false,
    status: "ativo",
  },
  {
    cod: "6",
    nome: "Barbearia Arts Plano Ouro",
    preco: 120.0,
    cortesIncluidos: 2,
    barbasIncluidas: 2,
    assinantes: 19,
    vendas: 76,
    desconto: 10,
    destaque: false,
    status: "ativo",
  },
  {
    cod: "7",
    nome: "Barbearia das Cores Plano Gold",
    preco: 175.0,
    cortesIncluidos: 3,
    barbasIncluidas: 4,
    assinantes: 5,
    vendas: 20,
    desconto: 5,
    destaque: false,
    status: "ativo",
  },
  {
    cod: "8",
    nome: "Plano Vibes Gold",
    preco: 155.0,
    cortesIncluidos: 2,
    barbasIncluidas: 4,
    assinantes: 8,
    vendas: 32,
    desconto: 10,
    destaque: false,
    status: "ativo",
  },
  {
    cod: "9",
    nome: "Studio Barber Henrique Plano Gold",
    preco: 100.0,
    cortesIncluidos: 3,
    barbasIncluidas: 0,
    assinantes: 14,
    vendas: 56,
    desconto: 0,
    destaque: false,
    status: "ativo",
  },
  {
    cod: "10",
    nome: "VF Barbearia Plano Gold",
    preco: 99.0,
    cortesIncluidos: 2,
    barbasIncluidas: 0,
    assinantes: 22,
    vendas: 88,
    desconto: 0,
    destaque: false,
    status: "ativo",
  },
  {
    cod: "11",
    nome: "Sean Palácio Barbearia Plano Gold",
    preco: 160.0,
    cortesIncluidos: 5,
    barbasIncluidas: 0,
    assinantes: 9,
    vendas: 36,
    desconto: 15,
    destaque: false,
    status: "ativo",
  },
  {
    cod: "12",
    nome: "Belo Cuntã Salão Plano Gold",
    preco: 400.0,
    cortesIncluidos: 4,
    barbasIncluidas: 4,
    assinantes: 1,
    vendas: 4,
    desconto: 25,
    destaque: false,
    status: "ativo",
  },
  {
    cod: "13",
    nome: "Espaço Kenné Plano Gold",
    preco: 250.0,
    cortesIncluidos: 5,
    barbasIncluidas: 4,
    assinantes: 3,
    vendas: 12,
    desconto: 10,
    destaque: false,
    status: "inativo",
  },
  {
    cod: "14",
    nome: "Barbearia Arte Plano Diamante",
    preco: 290.0,
    cortesIncluidos: 8,
    barbasIncluidas: 4,
    assinantes: 0,
    vendas: 2,
    desconto: 30,
    destaque: false,
    status: "inativo",
  },
  {
    cod: "15",
    nome: "Master VIP Plano Platina",
    preco: 290.0,
    cortesIncluidos: 5,
    barbasIncluidas: 5,
    assinantes: 0,
    vendas: 0,
    desconto: 20,
    destaque: false,
    status: "inativo",
  },
  {
    cod: "16",
    nome: "Julia Oliveira Plano Gold",
    preco: 580.0,
    cortesIncluidos: 3,
    barbasIncluidas: 2,
    assinantes: 0,
    vendas: 1,
    desconto: 0,
    destaque: false,
    status: "inativo",
  },
  {
    cod: "17",
    nome: "Corte",
    preco: 100.0,
    cortesIncluidos: 1,
    barbasIncluidas: 0,
    assinantes: 31,
    vendas: 124,
    desconto: 5,
    destaque: false,
    status: "ativo",
  },
];

type ModalState =
  | { type: "view"; item: Plano }
  | { type: "delete"; item: Plano }
  | null;

function PlanoResumoCard({ plano, onClose }: { plano: Plano; onClose: () => void }) {
  // Lista mock de itens inclusos baseada no plano
  const inclusos: string[] = [];
  if (plano.cortesIncluidos > 0)
    inclusos.push(
      plano.cortesIncluidos > 4
        ? "Cortes ilimitados"
        : `${plano.cortesIncluidos}x corte`,
    );
  if (plano.barbasIncluidas > 0)
    inclusos.push(
      plano.barbasIncluidas > 4
        ? "Barbas ilimitadas"
        : `${plano.barbasIncluidas}x barba`,
    );
  if (plano.desconto > 0) inclusos.push("Descontos em produtos");
  inclusos.push("Válido todos os dias");

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-border p-4">
        <h3 className="text-lg font-bold uppercase leading-tight text-foreground">
          {plano.nome}
        </h3>
        <div className="flex items-center gap-1.5">
          {plano.destaque && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-600">
              <Star className="h-3 w-3 fill-amber-500" />
              Destaque
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-3 p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-sky-500">
          Incluso:
        </p>
        <ul className="flex flex-col gap-1.5">
          {inclusos.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[13px] font-medium text-foreground"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 fill-emerald-500/20 text-emerald-600" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card px-4 py-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <span className="text-lg font-bold text-foreground">
              {R$(plano.preco)}
            </span>
            <span className="ml-1 text-xs text-muted-foreground">Mensal</span>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
              plano.status === "ativo"
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                : "bg-muted text-muted-foreground",
            )}
          >
            {plano.status === "ativo" ? "Ativo" : "Inativo"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ListaPlanos() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("todos");
  const [allData, setAllData] = useState<Plano[]>(data);
  const [modal, setModal] = useState<ModalState>(null);
  const [aulaOpen, setAulaOpen] = useState(false);
  const { toast } = useToast();

  const filteredData = useMemo(() => {
    if (activeTab === "todos") return allData;
    return allData.filter((p) => p.status === activeTab);
  }, [activeTab, allData]);

  const openView = (item: Plano) => setModal({ type: "view", item });
  const openEdit = (item: Plano) =>
    navigate(`/assinaturaCadastro?nome=${encodeURIComponent(item.nome)}`);
  const openDelete = (item: Plano) => setModal({ type: "delete", item });
  const goAssinantes = () => navigate("/assinantePesquisa");

  const duplicatePlano = (item: Plano) => {
    const novoNome = `${item.nome} (cópia)`;
    navigate(`/assinaturaCadastro?nome=${encodeURIComponent(novoNome)}&duplicar=${encodeURIComponent(item.cod)}`);
  };

  const closeModal = () => setModal(null);

  const handleDelete = () => {
    if (modal?.type !== "delete") return;
    setAllData((prev) => prev.filter((d) => d.cod !== modal.item.cod));
    toast({ title: "Plano removido", variant: "destructive" });
    closeModal();
  };

  const toggleStatus = (item: Plano) => {
    const next: StatusPlano = item.status === "ativo" ? "inativo" : "ativo";
    setAllData((prev) => prev.map((d) => (d.cod === item.cod ? { ...d, status: next } : d)));
    toast({ title: `Plano ${next === "ativo" ? "ativado" : "desativado"}` });
  };

  const toggleDestaque = (item: Plano) => {
    setAllData((prev) => prev.map((d) => (d.cod === item.cod ? { ...d, destaque: !d.destaque } : d)));
  };

  const bulkDelete = (indices: number[]) => {
    const cods = indices.map((i) => filteredData[i]?.cod).filter(Boolean);
    setAllData((prev) => prev.filter((d) => !cods.includes(d.cod)));
    toast({ title: `${cods.length} plano(s) removido(s)`, variant: "destructive" });
  };

  const bulkDeactivate = (indices: number[]) => {
    const cods = indices.map((i) => filteredData[i]?.cod).filter(Boolean);
    setAllData((prev) =>
      prev.map((d) => (cods.includes(d.cod) ? { ...d, status: "inativo" as StatusPlano } : d)),
    );
    toast({ title: `${cods.length} plano(s) desativado(s)` });
  };

  const bulkActivate = (indices: number[]) => {
    const cods = indices.map((i) => filteredData[i]?.cod).filter(Boolean);
    setAllData((prev) =>
      prev.map((d) => (cods.includes(d.cod) ? { ...d, status: "ativo" as StatusPlano } : d)),
    );
    toast({ title: `${cods.length} plano(s) ativado(s)` });
  };

  const selectionActions: SelectionAction[] = [
    {
      label: "Ativar",
      icon: <ToggleRight className="h-4 w-4" />,
      onClick: bulkActivate,
      description: "Ativa os planos selecionados",
    },
    {
      label: "Desativar",
      icon: <ToggleLeft className="h-4 w-4" />,
      onClick: bulkDeactivate,
      variant: "destructive",
      description: "Desativa os planos selecionados",
    },
    {
      label: "Remover",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: bulkDelete,
      variant: "destructive",
      description: "Remove os planos selecionados permanentemente",
    },
  ];

  // KPI cards
  const summaryCards = (filtered: Plano[]): SummaryCard[] => {
    const totalAssinantes = filtered.reduce((s, p) => s + p.assinantes, 0);
    const receitaMensal = filtered
      .filter((p) => p.status === "ativo")
      .reduce((s, p) => s + p.preco * p.assinantes, 0);
    const ticketMedio = totalAssinantes > 0 ? receitaMensal / totalAssinantes : 0;

    return [
      {
        label: "Total de Assinantes",
        value: String(totalAssinantes),
        icon: <Star className="h-4 w-4" />,
        size: "compact",
        color: "blue",
      },
      {
        label: "Receita Mensal Est.",
        value: R$(receitaMensal),
        icon: <DollarSign className="h-4 w-4" />,
        size: "wide",
        color: "blue",
      },
      {
        label: "Ticket Médio",
        value: R$(ticketMedio),
        icon: <Ticket className="h-4 w-4" />,
        size: "compact",
        color: "blue",
      },
    ];
  };

  const totalPlanos = allData.length;
  const ativos = allData.filter((p) => p.status === "ativo").length;
  const inativos = allData.filter((p) => p.status === "inativo").length;

  const tabs: TabDef[] = [
    { label: "Todos", value: "todos", count: totalPlanos, color: "neutral" },
    { label: "Ativos", value: "ativo", count: ativos, color: "success" },
    { label: "Inativos", value: "inativo", count: inativos, color: "destructive" },
  ];

  const columns: Column<Plano>[] = [
    {
      key: "nome",
      label: "Nome",
      pinned: true,
      render: (v, row) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">{v}</span>
          {row.destaque && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-amber-100 text-amber-700 border-0">
              destaque
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "preco",
      label: "Preço",
      align: "right",
      render: (v) => <span className="tabular-nums">{R$(v)}</span>,
    },
    {
      key: "assinantes",
      label: "Assinantes",
      align: "center",
      render: (v) => (
        <div className="flex items-center justify-center gap-1">
          <Star className="h-3 w-3 text-muted-foreground" />
          <span className="tabular-nums">{v}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (v: StatusPlano, row) => (
        <Switch
          checked={v === "ativo"}
          onCheckedChange={() => toggleStatus(row)}
          className="scale-90 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
        />
      ),
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
            { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: () => openView(row) },
            { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: () => openEdit(row) },
            { label: "Duplicar", icon: <Copy className="h-4 w-4" />, onClick: () => duplicatePlano(row) },
            {
              label: "Assinantes",
              icon: <Users className="h-4 w-4" />,
              onClick: goAssinantes,
            },
            {
              label: row.destaque ? "Remover destaque" : "Marcar destaque",
              icon: <Star className="h-4 w-4" />,
              onClick: () => toggleDestaque(row),
            },
            {
              label: row.status === "ativo" ? "Desativar" : "Ativar",
              icon: row.status === "ativo" ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />,
              onClick: () => toggleStatus(row),
            },
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

  return (
    <AppLayout>
      <DataTable
        title="Planos de Assinatura"
        titleHref={EXTERNAL_PLANS_URL}
        titleHrefCopy
        titleIcon={
          <div className="flex items-center gap-1.5">
            <PlanoExternalLink />
            <AulaButton onOpen={() => setAulaOpen(true)} />
          </div>
        }
        data={filteredData}
        columns={columns}
        summaryCards={summaryCards}
        selectable
        selectionActions={selectionActions}
        pageSize={15}
        novoMenuItems={[
          { label: "Novo plano", onClick: () => navigate("/assinaturaCadastro") },
        ]}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tableId="lista_planos"
      />

      {/* Modal de Visualização (resumo do plano) */}
      <Dialog open={modal?.type === "view"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-sm border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          {modal?.type === "view" && (
            <PlanoResumoCard
              plano={modal.item}
              onClose={closeModal}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal excluir */}
      <Dialog open={modal?.type === "delete"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <DeleteModal
            title="Excluir plano"
            message={
              modal?.type === "delete"
                ? `Deseja excluir o plano "${modal.item.nome}"? Esta ação não pode ser desfeita.`
                : ""
            }
            onConfirm={handleDelete}
            onClose={closeModal}
          />
        </DialogContent>
      </Dialog>

      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Planos de Assinatura"
      />
    </AppLayout>
  );
}

const EXTERNAL_PLANS_URL =
  "https://admin.frizzar.com.br/assinatura/assinaturas.xhtml?empresa=frizzar";

function PlanoExternalLink() {
  const { toast } = useToast();
  const handleClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(EXTERNAL_PLANS_URL).catch(() => {});
    }
    toast({ title: "Link copiado", description: "Abrindo página externa de planos…" });
    window.open(EXTERNAL_PLANS_URL, "_blank", "noopener,noreferrer");
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      title="Abrir página externa de planos (link copiado)"
      className="inline-flex items-center justify-center text-base leading-none text-muted-foreground transition-colors hover:text-foreground"
    >
      <span aria-hidden>↗</span>
    </button>
  );
}
