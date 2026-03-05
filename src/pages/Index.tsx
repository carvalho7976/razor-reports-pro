import { AppLayout } from "@/components/AppLayout";
import { Link } from "react-router-dom";
import {
  Wallet, CreditCard, Users, BarChart3, Scissors, FileText, UserMinus, CalendarX,
} from "lucide-react";

const shortcuts = [
  { icon: Wallet, label: "Contas à Pagar", path: "/contas-pagar", color: "bg-primary" },
  { icon: CreditCard, label: "Movimentação de Comandas", path: "/movimentacao-comandas", color: "bg-accent" },
  { icon: Users, label: "Profissionais", path: "/profissionais", color: "bg-info" },
  { icon: BarChart3, label: "Relatório Profissionais", path: "/relatorio-profissionais", color: "bg-warning" },
  { icon: Scissors, label: "Comissões à Pagar", path: "/comissoes-pagar", color: "bg-primary" },
  { icon: FileText, label: "Comissões Pagas", path: "/comissoes-pagas", color: "bg-accent" },
  { icon: UserMinus, label: "Exclusão de Clientes", path: "/exclusao-clientes", color: "bg-destructive" },
  { icon: CalendarX, label: "Exclusão de Agendamentos", path: "/exclusao-agendamentos", color: "bg-destructive" },
  { icon: Users, label: "Relatório de Clientes", path: "/relatorio-clientes", color: "bg-info" },
  { icon: Wallet, label: "Adiantamentos", path: "/adiantamentos", color: "bg-warning" },
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
