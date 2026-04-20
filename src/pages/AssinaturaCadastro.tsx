import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, ActionsMenu, SelectionAction } from "@/components/DataTable";
import { Pencil, Trash2, Copy, ToggleLeft, ToggleRight, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DeleteModal } from "@/components/FormModal";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ServicoPlano {
  servicoId: number;
  desconto: number;
  usosPorMes: string;
}

export interface ProdutoPlano {
  produtoId: number;
  desconto: number;
  limiteDescontoMes: number | null;
}

export interface PlanoAssinatura {
  id: number;
  nome: string;
  valor: number;
  recorrencia: string;
  formaPagamento: string;
  status: "Ativo" | "Rascunho" | "Arquivado";
  destaque: boolean;
  desativarEm: string;
  beneficios: string[];
  servicos: ServicoPlano[];
  produtos: ProdutoPlano[];
  diasDisponiveis: number[];
  profissionaisIds: number[];
  cancelamentoCarencia: string;
  cancelamentoPausa: boolean;
}

// ─── Initial data ─────────────────────────────────────────────────────────────

export const initialPlanos: PlanoAssinatura[] = [
  {
    id: 1,
    nome: "Clube Premium",
    valor: 89,
    recorrencia: "Mensal",
    formaPagamento: "Cartão de Crédito",
    status: "Ativo",
    destaque: true,
    desativarEm: "",
    beneficios: ["Prioridade no agendamento", "Traga um amigo no aniversário"],
    servicos: [
      { servicoId: 3, desconto: 100, usosPorMes: "Ilimitado" },
      { servicoId: 7, desconto: 100, usosPorMes: "4" },
    ],
    produtos: [{ produtoId: 1, desconto: 20, limiteDescontoMes: 50 }],
    diasDisponiveis: [],
    profissionaisIds: [],
    cancelamentoCarencia: "30 dias",
    cancelamentoPausa: true,
  },
  {
    id: 2,
    nome: "Estagiário",
    valor: 59,
    recorrencia: "Mensal",
    formaPagamento: "PIX",
    status: "Rascunho",
    destaque: false,
    desativarEm: "",
    beneficios: [],
    servicos: [{ servicoId: 4, desconto: 50, usosPorMes: "2" }],
    produtos: [],
    diasDisponiveis: [0, 1, 2, 3, 4],
    profissionaisIds: [1, 3],
    cancelamentoCarencia: "Sem carência",
    cancelamentoPausa: false,
  },
];

// Shared store (simple in-memory, replace with context/zustand as needed)
let _store = initialPlanos;
export const getPlanos = () => _store;
export const setPlanos = (p: PlanoAssinatura[]) => {
  _store = p;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusBadge(status: PlanoAssinatura["status"]) {
  const styles: Record<string, string> = {
    Ativo: "bg-green-100 text-green-800",
    Rascunho: "bg-yellow-100 text-yellow-800",
    Arquivado: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type ModalState = { type: "delete"; item: PlanoAssinatura } | null;

export default function AssinaturaCadastro() {
  const navigate = useNavigate();
  const [allData, setAllData] = useState<PlanoAssinatura[]>(initialPlanos);
  const [modal, setModal] = useState<ModalState>(null);
  const { toast } = useToast();

  const openNew = () => navigate("/planoPerfil");

  const openEdit = (item: PlanoAssinatura) => navigate(`/planoPerfil?id=${item.id}`);

  const openDelete = (item: PlanoAssinatura) => setModal({ type: "delete", item });

  const closeModal = () => setModal(null);

  const handleDelete = () => {
    if (modal?.type !== "delete") return;
    setAllData((prev) => prev.filter((d) => d.id !== modal.item.id));
    toast({ title: "Plano removido", variant: "destructive" });
    closeModal();
  };

  const toggleStatus = (item: PlanoAssinatura) => {
    const next: PlanoAssinatura["status"] = item.status === "Ativo" ? "Arquivado" : "Ativo";
    setAllData((prev) => prev.map((d) => (d.id === item.id ? { ...d, status: next } : d)));
    toast({ title: `Plano ${next === "Ativo" ? "ativado" : "arquivado"}` });
  };

  const duplicate = (item: PlanoAssinatura) => {
    const nextId = Math.max(...allData.map((d) => d.id)) + 1;
    const copy: PlanoAssinatura = {
      ...item,
      id: nextId,
      nome: `${item.nome} (cópia)`,
      status: "Rascunho",
      destaque: false,
    };
    setAllData((prev) => [copy, ...prev]);
    toast({ title: "Plano duplicado como rascunho" });
  };

  const bulkRemove = (indices: number[]) => {
    const ids = indices.map((i) => allData[i]?.id).filter(Boolean);
    setAllData((prev) => prev.filter((d) => !ids.includes(d.id)));
    toast({ title: `${ids.length} plano(s) removido(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    {
      label: "Remover",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: bulkRemove,
      variant: "destructive",
      description: "Remove permanentemente os planos selecionados",
    },
  ];

  const columns: Column<PlanoAssinatura>[] = [
    {
      key: "nome",
      label: "Nome",
      pinned: true,
      render: (v, row) => (
        <div className="flex items-center gap-2">
          {row.destaque && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openEdit(row);
            }}
            className="hover:underline font-medium"
          >
            {v}
          </a>
        </div>
      ),
    },
    {
      key: "valor",
      label: "Valor",
      render: (v, row) => `R$ ${Number(v).toFixed(2).replace(".", ",")} / ${row.recorrencia}`,
    },
    {
      key: "status",
      label: "Status",
      render: (v) => statusBadge(v as PlanoAssinatura["status"]),
    },
    {
      key: "servicos",
      label: "Serviços",
      render: (v) => `${(v as ServicoPlano[]).length} serviço${(v as ServicoPlano[]).length !== 1 ? "s" : ""}`,
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
            {
              label: "Editar",
              icon: <Pencil className="h-4 w-4" />,
              onClick: () => openEdit(row),
            },
            {
              label: "Duplicar",
              icon: <Copy className="h-4 w-4" />,
              onClick: () => duplicate(row),
            },
            {
              label: row.status === "Ativo" ? "Arquivar" : "Ativar",
              icon: row.status === "Ativo" ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />,
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
        data={allData}
        columns={columns}
        selectable
        selectionActions={selectionActions}
        novoMenuItems={[{ label: "Novo plano", onClick: openNew }]}
        pageSize={15}
        tableId="lista_planos"
      />

      <Dialog open={modal?.type === "delete"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <DeleteModal
            title="Excluir plano"
            message={
              modal?.type === "delete"
                ? `Deseja excluir o plano "${modal.item.nome}"? Assinantes ativos podem ser afetados.`
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
