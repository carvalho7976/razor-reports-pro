import { AppLayout } from "@/components/AppLayout";
import { Link } from "react-router-dom";
import {
  Wallet, CreditCard, Users, BarChart3, Scissors, FileText, UserMinus, CalendarX,
} from "lucide-react";

const shortcuts = [
  { icon: Wallet, label: "Contas à Pagar", path: "/contasPesquisa", color: "bg-primary" },
  { icon: CreditCard, label: "Movimentação de Comandas", path: "/relatorioMovimentacaoDiaria", color: "bg-accent" },
  { icon: Users, label: "Profissionais", path: "/funcionarioPesquisa", color: "bg-info" },
  { icon: BarChart3, label: "Relatório Profissionais", path: "/relatorioDesempenhoFuncionario", color: "bg-warning" },
  { icon: Scissors, label: "Comissões à Pagar", path: "/comissao", color: "bg-primary" },
  { icon: FileText, label: "Comissões Pagas", path: "/comissoesPagas", color: "bg-accent" },
  { icon: UserMinus, label: "Exclusão de Clientes", path: "/relatorioExclusaoCliente", color: "bg-destructive" },
  { icon: CalendarX, label: "Exclusão de Agendamentos", path: "/relatorioExclusaoAgendamento", color: "bg-destructive" },
  { icon: Users, label: "Relatório de Clientes", path: "/relatorioClientes", color: "bg-info" },
  { icon: Wallet, label: "Adiantamentos", path: "/adiantamento", color: "bg-warning" },
];

const Index = () => (
  <AppLayout>
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-foreground">Painel de Gestão</h1>
      <p className="text-muted-foreground mb-8">Acesse os módulos do sistema</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {shortcuts.map((s) => (
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
  </AppLayout>
);

export default Index;
