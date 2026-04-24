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
} from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DeleteModal } from "@/components/FormModal";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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

export default function ListaPlanos() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("todos");
  const [allData, setAllData] = useState<Plano[]>(data);
  const [modal, setModal] = useState<ModalState>(null);
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

  const selectionActions: SelectionAction[] = [
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
        data={filteredData}
        columns={columns}
        summaryCards={summaryCards}
        selectable
        selectionActions={selectionActions}
        pageSize={15}
        novoMenuItems={[{ label: "Novo plano", onClick: openNew }]}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tableId="lista_planos"
      />

      {/* Modal novo/editar */}
      <Dialog open={modal?.type === "new" || modal?.type === "edit"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          {form && (
            <div className="overflow-hidden rounded-[24px] bg-background shadow-2xl">
              <div className="flex items-start justify-between border-b border-border px-8 pb-5 pt-7">
                <div>
                  <h2 className="text-[24px] font-semibold leading-none tracking-tight">
                    {modal?.type === "new" ? "Novo plano" : "Editar plano"}
                  </h2>
                  <p className="mt-3 text-[14px] text-muted-foreground">
                    Configure os benefícios e condições do plano.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <span className="sr-only">Fechar</span>✕
                </button>
              </div>

              <div className="px-8 pb-8 pt-6 space-y-4">
                <TextField
                  label="Nome do plano"
                  value={form.nome}
                  onChange={(v) => setForm({ ...form, nome: v })}
                  error={showErrors ? errors.nome : ""}
                />

                <div className="grid grid-cols-2 gap-4">
                  <TextField
                    label="Preço mensal (R$)"
                    value={String(form.preco)}
                    onChange={(v) => setForm({ ...form, preco: Number(v.replace(",", ".")) || 0 })}
                    placeholder="0,00"
                  />
                  <TextField
                    label="Desconto em produtos (%)"
                    value={String(form.desconto)}
                    onChange={(v) => setForm({ ...form, desconto: Number(v) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <TextField
                    label="Cortes incluídos"
                    value={String(form.cortesIncluidos)}
                    onChange={(v) => setForm({ ...form, cortesIncluidos: Number(v) || 0 })}
                    placeholder="0"
                  />
                  <TextField
                    label="Barbas incluídas"
                    value={String(form.barbasIncluidas)}
                    onChange={(v) => setForm({ ...form, barbasIncluidas: Number(v) || 0 })}
                    placeholder="0"
                  />
                </div>

                <Dropdown
                  label="Status"
                  value={form.status}
                  setValue={(v) => setForm({ ...form, status: v as StatusPlano })}
                  options={[
                    { value: "ativo", label: "Ativo" },
                    { value: "inativo", label: "Inativo" },
                  ]}
                />

                <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Marcar como destaque</p>
                    <p className="text-xs text-muted-foreground">Exibe badge de destaque na listagem</p>
                  </div>
                  <Switch
                    checked={form.destaque}
                    onCheckedChange={(v) => setForm({ ...form, destaque: v })}
                    className="data-[state=checked]:bg-amber-500"
                  />
                </div>
              </div>

              <div className="border-t border-border px-8 py-4">
                <SaveButton onClick={handleSave} />
              </div>
            </div>
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
    </AppLayout>
  );
}
