import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CalendarDays,
  MessageCircle,
  Wallet,
  Users,
  User,
  Scissors,
  Package,
  BarChart3,
  Star,
  Bot,
  Settings,
  GraduationCap,
  BookOpen,
  Crown,
  ShoppingBag,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type NavItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  badge?: number;
};

type NavGroup = {
  title?: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    items: [
      { icon: CalendarDays, label: "Agenda", path: "/agenda" },
      { icon: MessageCircle, label: "Marketing", path: "/chat", badge: 1 },
      { icon: Wallet, label: "Financeiro", path: "/contasPesquisa" },
    ],
  },
  {
    title: "Seu negócio",
    items: [
      { icon: User, label: "Clientes", path: "/clientePesquisa" },
      { icon: Users, label: "Profissionais", path: "/funcionarioPesquisa" },
      { icon: Scissors, label: "Serviços", path: "/servicos" },
      { icon: Package, label: "Produtos", path: "/produtos" },
    ],
  },
  {
    title: "Desenvolvimento",
    items: [
      { icon: GraduationCap, label: "Treinamentos", path: "/treinamentos" },
      { icon: BookOpen, label: "Academy", path: "/academy" },
    ],
  },
  {
    title: "Facilitadores",
    items: [
      { icon: ShoppingBag, label: "Frizzar Pack", path: "/frizzar-pack" },
      { icon: Crown, label: "Planos Frizzar", path: "/planos-frizzar" },
      { icon: Bot, label: "Automação", path: "/automacao" },
      { icon: BarChart3, label: "Relatórios", path: "/relatorioDesempenhoFuncionario" },
      { icon: Settings, label: "Configurações", path: "/configuracoes" },
      { icon: Star, label: "Favoritos", path: "/favoritos" },
    ],
  },
];

function SidebarNavItem({ item, collapsed, active }: { item: NavItem; collapsed: boolean; active: boolean }) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem className="relative">
      {active && (
        // Palito mais largo (7px) e mais próximo à margem esquerda (left-0)
        <span className="absolute left-0 top-1/2 z-20 h-9 w-[7px] -translate-y-1/2 rounded-full bg-white" />
      )}

      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={item.label}
        className={cn(
          "relative h-10 text-sm font-medium transition-all duration-200",
          collapsed ? "ml-1 justify-center rounded-lg px-0" : "ml-1 rounded-lg px-3",
          active
            ? "!bg-white !text-black hover:!bg-white hover:!text-black"
            : "text-white/72 hover:bg-white/8 hover:text-white",
        )}
      >
        <Link to={item.path}>
          <Icon className={cn("h-4 w-4 shrink-0", active ? "text-black" : "text-current")} />
          {!collapsed && <span>{item.label}</span>}
        </Link>
      </SidebarMenuButton>

      {!collapsed && item.badge ? (
        <span className="absolute right-3 top-1/2 flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {item.badge}
        </span>
      ) : null}
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();

  const collapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="border-none bg-transparent p-0"
      style={
        {
          // Larguras um pouco menores
          "--sidebar-width": "240px",
          "--sidebar-width-icon": "60px",
        } as React.CSSProperties
      }
    >
      {/* bg transparente igual ao bg da página, só o inner é preto */}
      <div className="h-full w-full bg-transparent py-2 pl-2 pr-0">
        {/* Bordas arredondadas apenas no lado direito */}
        <div className="flex h-full w-full flex-col overflow-hidden rounded-r-[12px] bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
          <SidebarHeader className={cn("px-3 pb-3 pt-3", collapsed && "px-2")}>
            <Link
              to="/"
              className={cn(
                "flex items-center gap-3 transition-colors",
                collapsed ? "justify-center px-0 py-1" : "px-1 py-1.5",
              )}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white/10 text-white">
                <Scissors className="h-5 w-5" />
              </div>

              {!collapsed && (
                <div className="min-w-0">
                  <p className="truncate text-[18px] font-bold leading-none text-white">
                    FRIZZAR<span className="text-primary">.</span>
                  </p>
                  <p className="mt-1 truncate text-[11px] text-white/45">Painel de gestão</p>
                </div>
              )}
            </Link>
          </SidebarHeader>

          <SidebarContent
            className={cn(
              "px-3 pb-3",
              collapsed && "px-2",
              "overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
            )}
          >
            {navGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-4 last:mb-0">
                {!collapsed && group.title && (
                  <div className="px-3 pb-2 pt-2">
                    <p className="text-[11px] font-semibold text-white/22">{group.title}</p>
                  </div>
                )}

                <SidebarMenu className="gap-1.5">
                  {group.items.map((item) => {
                    const active = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
                    return <SidebarNavItem key={item.path} item={item} collapsed={collapsed} active={active} />;
                  })}
                </SidebarMenu>
              </div>
            ))}
          </SidebarContent>

          <div className="mt-auto px-3 pb-3 pt-2">
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex h-10 w-full items-center justify-center rounded-lg text-white/65 transition-colors hover:bg-white/8 hover:text-white"
            >
              {/* Ícone antigo estilo painel */}
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
