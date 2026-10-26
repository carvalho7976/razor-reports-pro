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
  Globe,
  ShoppingBag,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
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
      { icon: Globe, label: "Meu site", path: "/frenteCliente" },
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

function SidebarNavItem({ item, collapsed, active, onNavigate }: { item: NavItem; collapsed: boolean; active: boolean; onNavigate?: () => void }) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem className={cn("relative", collapsed && "flex h-9 items-center justify-center")}>
      {active && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: collapsed ? "0" : "-16px",
            top: "50%",
            transform: "translateY(-50%)",
            width: collapsed ? "4px" : "6px",
            height: collapsed ? "24px" : "28px",
            backgroundColor: "#ffffff",
            borderRadius: collapsed ? "4px" : "0 4px 4px 0",
            zIndex: 50,
          }}
        />
      )}
      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={{ children: item.label, className: "text-sm" }}
        className={cn(
          "relative rounded-lg text-sm leading-5 transition-colors duration-200",
          // expandido: linha de 34px, 10px de padding lateral; recolhido: quadrado de 32px centralizado
          collapsed ? "!size-8 flex items-center justify-center !p-0" : "h-[34px] gap-2.5 px-2.5",
          // hierarquia por cor e peso: inativo apagado (400), ativo escuro (500) com fundo sutil
          // expandido: pílula branca; recolhido: quadrado sutil com ícone claro (a barra branca marca o ativo)
          active
            ? collapsed
              ? "!bg-white/10 font-medium !text-white hover:!bg-white/10 hover:!text-white"
              : "!bg-white font-medium !text-black hover:!bg-white hover:!text-black"
            : "font-normal text-white/70 hover:bg-white/[0.08] hover:text-white/70",
        )}
      >
        <Link to={item.path} className={cn("flex items-center gap-2.5", collapsed && "justify-center")} onClick={onNavigate}>
          <Icon className={cn("shrink-0", active ? (collapsed ? "text-white" : "text-black") : "text-current", collapsed ? "!h-[18px] !w-[18px]" : "!h-4 !w-4")} />
          {!collapsed && <span>{item.label}</span>}
        </Link>
      </SidebarMenuButton>

      {item.badge ? (
        <span
          className={cn(
            "absolute flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-medium leading-none text-white",
            collapsed ? "right-0.5 top-0.5" : "right-2.5 top-1/2 -translate-y-1/2",
          )}
        >
          {item.badge}
        </span>
      ) : null}
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const { state, isMobile, toggleSidebar, setOpenMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";
  const [termo, setTermo] = React.useState("");
  const campoBusca = React.useRef<HTMLInputElement>(null);
  const semAcento = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const filtrados = navGroups
    .map((g) => ({ ...g, items: g.items.filter((i) => !termo.trim() || semAcento(i.label).includes(semAcento(termo.trim()))) }))
    .filter((g) => g.items.length > 0);

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="border-none bg-transparent p-0 [&>[data-sidebar=sidebar]]:bg-transparent [&>[data-sidebar=sidebar]]:transition-all [&>[data-sidebar=sidebar]]:duration-300 [&>[data-sidebar=sidebar]]:ease-in-out"
      style={
        {
          "--sidebar-width": "272px",
          // painel recolhido de 48px (o contêiner tem 8px de respiro de cada lado)
          "--sidebar-width-icon": "64px",
          "--sidebar-transition": "width 0.3s ease-in-out",
        } as React.CSSProperties
      }
    >
      <div className="p-2 h-full w-full bg-transparent">
        <div
          className="flex h-full w-full flex-col rounded-[12px] bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)]"
          style={{ overflow: "visible" }}
        >
          {/* PESQUISAR: filtra os itens do menu; recolhido, vira um ícone que expande e foca o campo */}
          <div className={cn("pb-2 pt-3", collapsed ? "px-2" : "px-4")}>
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="Pesquisar"
                    onClick={() => {
                      toggleSidebar();
                      setTimeout(() => campoBusca.current?.focus(), 350);
                    }}
                    className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/[0.08]"
                  >
                    <Search className="h-[18px] w-[18px]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-sm">
                  Pesquisar
                </TooltipContent>
              </Tooltip>
            ) : (
              <label className="flex h-[34px] items-center gap-2.5 rounded-lg bg-white/[0.08] px-2.5 text-white/70 focus-within:bg-white/[0.12]">
                <Search className="h-4 w-4 shrink-0" />
                <input
                  ref={campoBusca}
                  value={termo}
                  onChange={(e) => setTermo(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setTermo("");
                  }}
                  placeholder="Pesquisar"
                  aria-label="Pesquisar no menu"
                  className="min-w-0 flex-1 bg-transparent text-sm font-normal leading-5 text-white outline-none placeholder:text-white/45"
                />
              </label>
            )}
          </div>

          <SidebarContent
            className={cn(
              "pb-3",
              collapsed ? "px-2" : "px-4",
              // scroll invisível mas funcional
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
              "overflow-x-visible overflow-y-scroll",
            )}
          >
            {filtrados.map((group, groupIndex) => (
              <div key={groupIndex} className={cn(!collapsed && "mb-3 last:mb-0")}>
                {collapsed && groupIndex > 0 && <div aria-hidden="true" className="my-2 h-0 border-t-[0.5px] border-white/15" />}
                {!collapsed && group.title && (
                  <div className="px-2.5 pb-1.5 pt-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-white/45">{group.title}</p>
                  </div>
                )}

                <SidebarMenu className="gap-0.5 overflow-visible">
                  {group.items.map((item) => {
                    const active = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
                    return <SidebarNavItem key={item.path} item={item} collapsed={collapsed} active={active} onNavigate={isMobile ? () => setOpenMobile(false) : undefined} />;
                  })}
                </SidebarMenu>
              </div>
            ))}
          </SidebarContent>

          <div className={cn("mt-auto pb-3 pt-2", collapsed ? "px-2" : "px-4")}>
            <div className={cn(collapsed && "flex h-9 items-center justify-center")}>
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
                className={cn(
                  "flex items-center rounded-lg text-sm font-normal leading-5 text-white/70 transition-colors hover:bg-white/[0.08]",
                  collapsed ? "h-8 w-8 justify-center" : "h-[34px] w-full gap-2.5 px-2.5",
                )}
              >
                {collapsed ? (
                  <PanelLeftOpen className="h-[18px] w-[18px] shrink-0" />
                ) : (
                  <>
                    <PanelLeftClose className="h-4 w-4 shrink-0" />
                    <span>Recolher menu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
