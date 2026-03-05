import { useLocation, Link } from "react-router-dom";
import {
  Settings, CalendarDays, MessageCircle, Bot, User, Users,
  Scissors, Package, Wallet, BarChart3, Star, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
  { icon: CalendarDays, label: "Agenda", path: "/agenda" },
  { icon: MessageCircle, label: "Chat", path: "/chat", badge: 1 },
  { icon: Bot, label: "Automação", path: "/automacao" },
  { icon: User, label: "Clientes", path: "/relatorio-clientes" },
  { icon: Users, label: "Equipe", path: "/profissionais" },
  { icon: Scissors, label: "Serviços", path: "/servicos" },
  { icon: Package, label: "Produtos", path: "/produtos" },
  { icon: Wallet, label: "Financeiro", path: "/contas-pagar" },
  { icon: BarChart3, label: "Relatórios", path: "/relatorio-profissionais" },
  { icon: Star, label: "Favoritos", path: "/favoritos" },
];

export function AppSidebar() {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={cn(
        "bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-200 shrink-0",
        expanded ? "w-48" : "w-14"
      )}
    >
      <div className="flex-1 flex flex-col gap-1 py-3 px-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              className={cn(
                "relative flex items-center gap-3 rounded-md p-2.5 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active && "bg-sidebar-accent text-sidebar-primary"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {expanded && (
                <span className="text-sm truncate">{item.label}</span>
              )}
              {item.badge && (
                <span className="absolute -top-0.5 -right-0.5 bg-sidebar-primary text-sidebar-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="p-2.5 text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors border-t border-sidebar-border flex justify-center"
      >
        {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </aside>
  );
}
