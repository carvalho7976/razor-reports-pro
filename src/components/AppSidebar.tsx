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
        <span
          style={{
            position: "absolute",
            // no collapsed fica dentro do item (left: 0), no expandido sai para a borda (left: -16px)
            left: collapsed ? "-10px" : "-16px",
            top: "50%",
            transform: "translateY(-50%)",
            width: collapsed ? "20px" : "7px",
            height: collapsed ? "50px" : "40px",
            backgroundColor: "#ffffff",
            borderRadius: collapsed ? "4px" : "0 4px 4px 0",
            zIndex: 50,
          }}
        />
      )}

      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={item.label}
        className={cn(
          "relative h-10 text-sm font-medium transition-all duration-200 rounded-lg",
          collapsed ? "flex justify-center items-center px-0 w-full" : "px-3",
          active
            ? "!bg-white !text-black hover:!bg-white hover:!text-black"
            : "text-white/72 hover:bg-white/8 hover:text-white",
        )}
      >
        <Link to={item.path} className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
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
      className="border-none bg-transparent p-0 [&>[data-sidebar=sidebar]]:bg-transparent [&>[data-sidebar=sidebar]]:transition-all [&>[data-sidebar=sidebar]]:duration-300 [&>[data-sidebar=sidebar]]:ease-in-out"
      style={
        {
          "--sidebar-width": "272px",
          "--sidebar-width-icon": "65px",
        } as React.CSSProperties
      }
    >
      <div className="p-2 h-full w-full bg-transparent">
        <div
          className="flex h-full w-full flex-col rounded-[12px] bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)]"
          style={{ overflow: "visible" }}
        >
          <SidebarHeader className={cn("px-4 pb-3 pt-3", collapsed && "px-2")}>
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
              "pb-3",
              collapsed ? "px-2" : "px-4",
              // scroll invisível mas funcional
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
              "overflow-x-visible overflow-y-scroll",
            )}
          >
            {navGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-4 last:mb-0">
                {!collapsed && group.title && (
                  <div className="px-3 pb-2 pt-2">
                    <p className="text-[11px] font-semibold text-white/22">{group.title}</p>
                  </div>
                )}

                <SidebarMenu className="gap-1.5 overflow-visible">
                  {group.items.map((item) => {
                    const active = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
                    return <SidebarNavItem key={item.path} item={item} collapsed={collapsed} active={active} />;
                  })}
                </SidebarMenu>
              </div>
            ))}
          </SidebarContent>

          <div className={cn("mt-auto pb-3 pt-2", collapsed ? "px-2" : "px-4")}>
            <button
              type="button"
              onClick={toggleSidebar}
              className={cn(
                "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-white/65 transition-colors hover:bg-white/8 hover:text-white",
                collapsed && "justify-center px-0",
              )}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4 shrink-0" />
              ) : (
                <>
                  <PanelLeftClose className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">Recolher menu</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
