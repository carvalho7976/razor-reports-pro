import { AppLayout } from "@/components/AppLayout";
import { Link } from "react-router-dom";
import {
  Wallet, CreditCard, Users, BarChart3, Scissors, FileText, UserMinus, CalendarX,
  ClipboardList, Star, Calendar, PackageX, ShoppingCart, TrendingDown, DollarSign,
  List, Tag, Package, Banknote, LayoutGrid,
} from "lucide-react";

interface ShortcutGroup {
  title: string;
  items: { icon: any; label: string; path: string; color: string }[];
}

const groups: ShortcutGroup[] = [
  {
    title: "Listas & Cadastros",
    items: [
      { icon: Users, label: "Clientes", path: "/clientePesquisa", color: "bg-info" },
      { icon: Users, label: "Profissionais", path: "/funcionarioPesquisa", color: "bg-info" },
      { icon: Users, label: "Assinantes", path: "/assinantePesquisa", color: "bg-info" },
      { icon: List, label: "Serviços", path: "/servicoPesquisa", color: "bg-accent" },
      { icon: Tag, label: "Categorias", path: "/categoriaServicoPesquisa", color: "bg-accent" },
      { icon: Package, label: "Produtos", path: "/produtoPesquisa", color: "bg-accent" },
      { icon: LayoutGrid, label: "Pacotes", path: "/comboPesquisa", color: "bg-accent" },
      { icon: Banknote, label: "Formas de Pagamento", path: "/formaPagamentoPesquisa", color: "bg-accent" },
    ],
  },
  {
    title: "Financeiro",
    items: [
      { icon: Wallet, label: "Contas à Pagar", path: "/contasPesquisa", color: "bg-primary" },
      { icon: CreditCard, label: "Movimentação de Comandas", path: "/relatorioMovimentacaoDiaria", color: "bg-accent" },
      { icon: ClipboardList, label: "Comandas Abertas", path: "/comandasAbertas", color: "bg-warning" },
      { icon: Scissors, label: "Comissões à Pagar", path: "/comissao", color: "bg-primary" },
      { icon: FileText, label: "Comissões Pagas", path: "/comissoesPagas", color: "bg-accent" },
      { icon: Wallet, label: "Adiantamentos", path: "/adiantamento", color: "bg-warning" },
      { icon: DollarSign, label: "Fluxo de Caixa", path: "/relatorioFluxoCaixaNovo", color: "bg-info" },
      { icon: TrendingDown, label: "Débitos de Clientes", path: "/debitoClientes", color: "bg-destructive" },
      { icon: ShoppingCart, label: "Histórico de Compras", path: "/comprasPesquisa", color: "bg-accent" },
    ],
  },
  {
    title: "Relatórios",
    items: [
      { icon: BarChart3, label: "Relatório Profissionais", path: "/relatorioDesempenhoFuncionario", color: "bg-warning" },
      { icon: Users, label: "Relatório de Clientes", path: "/relatorioClientes", color: "bg-info" },
      { icon: Calendar, label: "Relatório de Agendamentos", path: "/relatorioAgendamentos", color: "bg-info" },
      { icon: LayoutGrid, label: "Relatório de Pacotes", path: "/relatorioCombos", color: "bg-accent" },
      { icon: List, label: "Relatório de Serviços", path: "/relatorioServicos", color: "bg-accent" },
      { icon: Package, label: "Relatório de Produtos", path: "/relatorioProdutos", color: "bg-accent" },
      { icon: Star, label: "Avaliações", path: "/avaliacoes", color: "bg-warning" },
      { icon: UserMinus, label: "Exclusão de Clientes", path: "/relatorioExclusaoCliente", color: "bg-destructive" },
      { icon: CalendarX, label: "Exclusão de Agendamentos", path: "/relatorioExclusaoAgendamento", color: "bg-destructive" },
      { icon: PackageX, label: "Cancelamento de Assinaturas", path: "/relatorioExclusaoAssinante", color: "bg-destructive" },
    ],
  },
];

/* Scrollbar global da aplicação */
*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 999px;
}

*::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

const Index = () => (
  <AppLayout>
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Painel de Gestão</h1>
        <p className="text-muted-foreground">Acesse os módulos do sistema</p>
      </div>
      {groups.map((group) => (
        <div key={group.title}>
          <h2 className="text-lg font-semibold text-foreground mb-3">{group.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {group.items.map((s) => (
              <Link
                key={s.path}
                to={s.path}
                className="flex flex-col items-center gap-3 p-6 bg-card rounded-lg border border-border hover:shadow-md transition-shadow text-center"
              >
                <div className={`${s.color} text-primary-foreground p-3 rounded-xl`}>
                  <s.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-foreground">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  </AppLayout>
);

export default Index;
