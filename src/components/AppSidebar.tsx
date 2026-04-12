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
  ChevronRight,
  LogOut,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
        <span
          className={cn(
            "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white transition-all duration-200",
            collapsed ? "-left-1 h-8 w-1.5" : "-left-2 h-8 w-1.5",
          )}
        />
      )}

      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={item.label}
        className={cn(
          "relative h-11 rounded-xl px-3 text-sm font-medium transition-all duration-200",
          active
            ? "bg-white text-zinc-900 hover:bg-white hover:text-zinc-900"
            : "text-sidebar-foreground/85 hover:bg-white/8 hover:text-white",
          collapsed && "justify-center px-0",
        )}
      >
        <Link to={item.path}>
          <Icon className={cn("h-4 w-4 shrink-0", active ? "text-zinc-900" : "text-current")} />
          {!collapsed && <span>{item.label}</span>}
        </Link>
      </SidebarMenuButton>

      {!collapsed && item.badge ? (
        <span className="absolute right-3 top-1/2 flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
          {item.badge}
        </span>
      ) : null}
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();

  const collapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      className={cn("border-none bg-transparent p-2", collapsed ? "w-[88px]" : "w-[280px]")}
    >
      <div className="flex h-full w-full flex-col overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,#191a27_0%,#171827_35%,#11131f_100%)] text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
        <SidebarHeader className={cn("px-4 pt-4 pb-3", collapsed && "px-3")}>
          <Link
            to="/"
            className={cn(
              "flex items-center gap-3 rounded-xl transition-colors",
              collapsed ? "justify-center px-0 py-1" : "px-1 py-1.5",
            )}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
              <Scissors className="h-5 w-5" />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-[18px] font-bold leading-none text-white">
                  FRIZZAR<span className="text-primary">.</span>
                </p>
                <p className="mt-1 truncate text-[11px] text-white/55">Painel de gestão</p>
              </div>
            )}
          </Link>
        </SidebarHeader>

        <SidebarContent className={cn("px-3 pb-3", collapsed && "px-2")}>
          {navGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-4 last:mb-0">
              {!collapsed && group.title && (
                <div className="px-3 pb-2 pt-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.02em] text-white/28">{group.title}</p>
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

        <SidebarFooter className={cn("mt-auto px-3 pb-3 pt-2", collapsed && "px-2")}>
          <div className="space-y-2">
            <div
              className={cn(
                "flex items-center rounded-xl bg-white/6",
                collapsed ? "justify-center px-0 py-2.5" : "justify-between px-3 py-2.5",
              )}
            >
              {collapsed ? (
                <ThemeToggle />
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Moon className="h-4 w-4" />
                    <span>Dark Mode</span>
                  </div>
                  <ThemeToggle />
                </>
              )}
            </div>

            <SidebarMenu className="gap-1.5">
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Logout"
                  className={cn(
                    "h-11 rounded-xl text-white/70 hover:bg-white/8 hover:text-white",
                    collapsed && "justify-center px-0",
                  )}
                  onClick={() => {
                    console.log("logout");
                  }}
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>Logout</span>}
                  {!collapsed && <ChevronRight className="ml-auto h-4 w-4 opacity-45" />}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
