import { Link, useLocation } from "react-router-dom";
import {
  Settings,
  CalendarDays,
  MessageCircle,
  Bot,
  User,
  Users,
  Scissors,
  Package,
  Wallet,
  BarChart3,
  Star,
  LogOut,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

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

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();

  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="px-3 py-3">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-3 transition-colors hover:bg-sidebar-accent",
            collapsed && "justify-center px-2",
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Scissors className="h-4 w-4" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-sidebar-foreground">
                BARBER<span className="text-primary">PRO</span>
              </p>
              <p className="truncate text-[11px] text-sidebar-foreground/65">Painel de gestão</p>
            </div>
          )}
        </Link>

        {!collapsed && (
          <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/30 px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-sidebar-foreground/75">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium">Acesso rápido aos módulos</span>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2 py-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const active = location.pathname === item.path || location.pathname.startsWith(item.path + "/");

            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.label}
                  className={cn("h-10 rounded-lg", active && "font-semibold")}
                >
                  <Link to={item.path}>
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>

                {item.badge ? (
                  <SidebarMenuBadge className="bg-primary text-primary-foreground">{item.badge}</SidebarMenuBadge>
                ) : null}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sair" className="h-10 rounded-lg text-sidebar-foreground/85">
              <button type="button">
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Sair</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {!collapsed && (
            <div className="mt-2 rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-sidebar-foreground">Lara Pereira</p>
                  <p className="truncate text-[11px] text-sidebar-foreground/65">Administradora</p>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  LP
                </div>
              </div>

              <button
                type="button"
                className="mt-3 inline-flex w-full items-center justify-between rounded-md border border-sidebar-border px-2.5 py-2 text-xs font-medium text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent"
              >
                Minha conta
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
