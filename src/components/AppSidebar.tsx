import { useLocation, Link } from "react-router-dom";
import {
  Settings, CalendarDays, MessageCircle, Bot, User, Users,
  Scissors, Package, Wallet, BarChart3, Star, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
  { icon: CalendarDays, label: "Agenda", path: "/agenda" },
  { icon: MessageCircle, label: "Chat", path: "/chat", badge: 1 },
  { icon: Bot, label: "Automação", path: "/automacao" },
  { icon: User, label: "Clientes", path: "/clientePesquisa" },
  { icon: Users, label: "Equipe", path: "/funcionarioPesquisa" },
  { icon: Scissors, label: "Serviços", path: "/servicos" },
  { icon: Package, label: "Produtos", path: "/produtos" },
  { icon: Wallet, label: "Financeiro", path: "/contasPesquisa" },
  { icon: BarChart3, label: "Relatórios", path: "/relatorioDesempenhoFuncionario" },
  { icon: Star, label: "Favoritos", path: "/favoritos" },
];

interface AppSidebarProps {
  onClose?: () => void;
}

export function AppSidebar({ onClose }: AppSidebarProps) {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  // On mobile the sidebar is always shown expanded (full labels)
  const showLabels = expanded;

  return (
    <aside
      className={cn(
        "bg-sidebar flex flex-col border-r border-sidebar-border h-full transition-all duration-200 shrink-0",
        "w-56 md:w-14",
        expanded && "md:w-48"
      )}
    >
      {/* Mobile close button */}
      <div className="flex items-center justify-between p-3 md:hidden">
        <span className="text-sidebar-foreground text-sm font-semibold">Menu</span>
        <button onClick={onClose} className="p-1 text-sidebar-foreground hover:text-sidebar-accent-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-1 py-3 px-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              onClick={onClose}
              className={cn(
                "relative flex items-center gap-3 rounded-md p-2.5 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active && "bg-sidebar-accent text-sidebar-primary"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {/* Always show on mobile, conditional on desktop */}
              <span className={cn("text-sm truncate", !showLabels && "md:hidden")}>
                {item.label}
              </span>
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
        className="p-2.5 text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors border-t border-sidebar-border hidden md:flex justify-center"
      >
        {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </aside>
  );
}
