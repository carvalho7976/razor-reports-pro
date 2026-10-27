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
  Gem,
  ChevronDown,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type SubLink = { label: string; path: string; external?: boolean };
type SubGroup = { heading?: string; links: SubLink[] };

type NavItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  badge?: number;
  // itens com submenu: aberto em acordeão (expandido) ou em painel flutuante (recolhido)
  sub?: SubGroup[];
};

type NavGroup = {
  title?: string;
  items: NavItem[];
};

const AJUDA = "https://ajuda.frizzar.com.br";

const navGroups: NavGroup[] = [
  {
    items: [
      { icon: CalendarDays, label: "Agenda", path: "/agenda" },
      { icon: MessageCircle, label: "Marketing", path: "/chat", badge: 1 },
      { icon: Globe, label: "Meu site", path: "/frenteCliente" },
      {
        icon: Wallet,
        label: "Financeiro",
        path: "/contasPesquisa",
        sub: [
          {
            heading: "Caixa",
            links: [
              { label: "Comandas abertas", path: "/comandasAbertas" },
              {
                label: "Movimentação diária",
                path: "/relatorioMovimentacaoDiaria",
              },
              { label: "Fluxo de caixa", path: "/relatorioFluxoCaixaNovo" },
            ],
          },
          {
            heading: "Contas",
            links: [
              { label: "Contas a pagar e receber", path: "/contasPesquisa" },
              { label: "Compras", path: "/comprasPesquisa" },
              { label: "Formas de pagamento", path: "/formaPagamentoPesquisa" },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Seu negócio",
    items: [
      {
        icon: User,
        label: "Clientes",
        path: "/clientePesquisa",
        sub: [
          {
            links: [
              { label: "Pesquisar / adicionar", path: "/clientePesquisa" },
              { label: "Relatório de clientes", path: "/relatorioClientes" },
              { label: "Débitos", path: "/debitoClientes" },
              {
                label: "Relatório de exclusão",
                path: "/relatorioExclusaoCliente",
              },
              { label: "Lixeira", path: "/clientePesquisa?lixeira=1" },
              { label: "Ajuda", path: AJUDA, external: true },
            ],
          },
        ],
      },
      {
        icon: Users,
        label: "Profissionais",
        path: "/funcionarioPesquisa",
        sub: [
          {
            links: [
              { label: "Pesquisar / adicionar", path: "/funcionarioPesquisa" },
              { label: "Desempenho", path: "/relatorioDesempenhoFuncionario" },
            ],
          },
          {
            heading: "Financeiro",
            links: [
              { label: "Comissões", path: "/comissao" },
              { label: "Comissões pagas", path: "/comissoesPagas" },
              { label: "Adiantamentos", path: "/adiantamento" },
            ],
          },
          {
            heading: "Relatórios",
            links: [
              {
                label: "Agendamentos excluídos",
                path: "/relatorioExclusaoAgendamento",
              },
            ],
          },
        ],
      },
      {
        icon: Scissors,
        label: "Serviços",
        path: "/servicos",
        sub: [
          {
            links: [
              { label: "Serviços", path: "/servicoPesquisa" },
              { label: "Categorias", path: "/categoriaServicoPesquisa" },
              { label: "Pacotes", path: "/comboPesquisa" },
            ],
          },
          {
            heading: "Relatórios",
            links: [
              { label: "Relatório de serviços", path: "/relatorioServicos" },
              { label: "Relatório de pacotes", path: "/relatorioCombos" },
            ],
          },
        ],
      },
      {
        icon: Package,
        label: "Produtos",
        path: "/produtos",
        sub: [
          {
            links: [
              { label: "Produtos", path: "/produtoPesquisa" },
              { label: "Entrada de produtos", path: "/novaCompra" },
            ],
          },
          {
            heading: "Relatórios",
            links: [
              { label: "Relatório de produtos", path: "/relatorioProdutos" },
            ],
          },
        ],
      },
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
      {
        icon: BarChart3,
        label: "Relatórios",
        path: "/relatorioDesempenhoFuncionario",
        sub: [
          {
            heading: "Atendimento",
            links: [
              { label: "Agendamentos", path: "/relatorioAgendamentos" },
              { label: "Avaliações", path: "/avaliacoes" },
              {
                label: "Agendamentos excluídos",
                path: "/relatorioExclusaoAgendamento",
              },
            ],
          },
          {
            heading: "Vendas",
            links: [
              { label: "Serviços", path: "/relatorioServicos" },
              { label: "Produtos", path: "/relatorioProdutos" },
              { label: "Pacotes", path: "/relatorioCombos" },
            ],
          },
          {
            heading: "Pessoas",
            links: [
              {
                label: "Desempenho",
                path: "/relatorioDesempenhoFuncionario",
              },
              { label: "Clientes", path: "/relatorioClientes" },
            ],
          },
        ],
      },
      { icon: Settings, label: "Configurações", path: "/configuracoes" },
      { icon: Star, label: "Favoritos", path: "/favoritos" },
    ],
  },
  {
    title: "Extras",
    items: [
      {
        icon: Gem,
        label: "Módulos extras",
        path: "/assinaturaPesquisa",
        sub: [
          { links: [{ label: "Frizzar Pay", path: "/frizzar-pay" }] },
          {
            heading: "Assinaturas",
            links: [
              { label: "Assinatura", path: "/assinaturaPesquisa" },
              {
                label: "Relatório de assinaturas",
                path: "/relatorioAssinatura",
              },
              { label: "Página de planos", path: "/assinaturaConfigFrente" },
              {
                label: "Relatório de cancelamento",
                path: "/relatorioExclusaoAssinante",
              },
              { label: "Ajuda das assinaturas", path: AJUDA, external: true },
            ],
          },
          {
            heading: "Integrações",
            links: [
              { label: "Frizzar Connections", path: "/frizzar-connections" },
              { label: "Nota fiscal", path: "/configuracoes" },
            ],
          },
        ],
      },
    ],
  },
];

const semAcento = (t: string) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const pathOf = (p: string) => p.split("?")[0];

// link do submenu que representa a página atual (distingue "?lixeira=1" da lista principal)
function linkAtivo(
  item: NavItem,
  pathname: string,
  search: string,
): SubLink | undefined {
  const mesmos = (item.sub ?? [])
    .flatMap((g) => g.links)
    .filter((l) => !l.external && pathOf(l.path) === pathname);
  return (
    mesmos.find(
      (l) =>
        l.path.includes("?") &&
        search &&
        l.path.slice(l.path.indexOf("?")) === search,
    ) ?? mesmos.find((l) => !l.path.includes("?"))
  );
}

function itemAtivo(item: NavItem, pathname: string, search: string) {
  if (item.sub) return !!linkAtivo(item, pathname, search);
  return pathname === item.path || pathname.startsWith(item.path + "/");
}

function ActiveBar({ collapsed }: { collapsed: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        left: collapsed ? "-4px" : "-16px",
        top: "50%",
        transform: "translateY(-50%)",
        width: collapsed ? "4px" : "6px",
        height: collapsed ? "24px" : "28px",
        backgroundColor: "#ffffff",
        borderRadius: collapsed ? "4px" : "0 4px 4px 0",
        zIndex: 50,
      }}
    />
  );
}

// grupos de links do submenu: cabeçalho pequeno em caixa alta + links de 13px (usado no acordeão e no painel flutuante)
function SubLinks({
  groups,
  ativo,
  onNavigate,
}: {
  groups: SubGroup[];
  ativo?: SubLink;
  onNavigate?: () => void;
}) {
  return (
    <>
      {groups.map((g, i) => (
        <div key={i}>
          {g.heading && (
            <p className="px-2.5 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/35 first:pt-2">
              {g.heading}
            </p>
          )}
          <ul className="flex flex-col gap-0.5">
            {g.links.map((l) => {
              const cls = cn(
                "flex h-8 items-center justify-between gap-2 whitespace-nowrap rounded-lg text-[13px] leading-5 transition-colors",
                g.heading ? "pl-5 pr-2.5" : "px-2.5",
                ativo === l
                  ? "bg-white/10 font-medium text-white"
                  : "font-normal text-white/60 hover:bg-white/[0.08] hover:text-white",
              );
              return (
                <li key={l.label}>
                  {l.external ? (
                    <a
                      href={l.path}
                      target="_blank"
                      rel="noreferrer"
                      className={cls}
                      onClick={onNavigate}
                    >
                      <span>{l.label}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-white/40" />
                    </a>
                  ) : (
                    <Link to={l.path} className={cls} onClick={onNavigate}>
                      <span>{l.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}

const botaoBase =
  "relative rounded-lg text-sm leading-5 transition-colors duration-200";
const botaoAtivo =
  "!bg-white font-medium !text-black hover:!bg-white hover:!text-black";
const botaoInativo =
  "font-normal text-white/70 hover:bg-white/[0.08] hover:text-white/70";

function Badge({ n, collapsed }: { n: number; collapsed: boolean }) {
  return (
    <span
      className={cn(
        "absolute flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-medium leading-none text-white",
        collapsed ? "right-0.5 top-0.5" : "right-2.5 top-1/2 -translate-y-1/2",
      )}
    >
      {n}
    </span>
  );
}

// item simples (sem submenu)
function SidebarNavItem({
  item,
  collapsed,
  active,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem
      className={cn(
        "relative",
        collapsed && "flex h-9 items-center justify-center",
      )}
    >
      {active && <ActiveBar collapsed={collapsed} />}
      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={{ children: item.label, className: "text-sm" }}
        className={cn(
          botaoBase,
          // expandido: linha de 34px, 10px de padding lateral; recolhido: quadrado de 32px centralizado
          collapsed
            ? "!size-8 flex items-center justify-center !p-0"
            : "h-[34px] gap-2.5 px-2.5",
          // ativo: branco com texto/ícone preto, igual expandido e recolhido (a barra branca reforça)
          active ? botaoAtivo : botaoInativo,
        )}
      >
        <Link
          to={item.path}
          className={cn(
            "flex items-center gap-2.5",
            collapsed && "justify-center",
          )}
          onClick={onNavigate}
        >
          <Icon
            className={cn(
              "shrink-0",
              active ? "text-black" : "text-current",
              collapsed ? "!h-[18px] !w-[18px]" : "!h-4 !w-4",
            )}
          />
          {!collapsed && <span>{item.label}</span>}
        </Link>
      </SidebarMenuButton>
      {item.badge ? <Badge n={item.badge} collapsed={collapsed} /> : null}
    </SidebarMenuItem>
  );
}

// expandido: linha com seta que abre os links por baixo, com uma guia vertical alinhada ao centro do ícone
function SidebarParentItem({
  item,
  active,
  ativo,
  open,
  onToggle,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  ativo?: SubLink;
  open: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      {/* a barra fica só na linha do item, não no bloco inteiro com os links abertos */}
      <div className="relative">
        {active && <ActiveBar collapsed={false} />}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className={cn(
            botaoBase,
            "flex h-[34px] w-full items-center gap-2.5 px-2.5 text-left hover:bg-white/[0.08]",
            // pai que contém a página atual: pílula branca, igual aos itens simples
            active ? botaoAtivo : botaoInativo,
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1">{item.label}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-white/40 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className={cn("overflow-hidden", !open && "invisible")}>
          <div className="ml-[18px] mt-0.5 border-l border-white/10 pb-1 pl-3">
            <SubLinks
              groups={item.sub ?? []}
              ativo={ativo}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      </div>
    </SidebarMenuItem>
  );
}

// recolhido: ao passar o mouse abre um painel ao lado com o título do item e os mesmos links
function SidebarFlyout({
  item,
  active,
  ativo,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  ativo?: SubLink;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<number>();
  const abrir = () => {
    window.clearTimeout(timer.current);
    setOpen(true);
  };
  const fechar = () => {
    timer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <SidebarMenuItem className="relative flex h-9 items-center justify-center">
      {active && <ActiveBar collapsed />}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={item.label}
            onMouseEnter={abrir}
            onMouseLeave={fechar}
            className={cn(
              botaoBase,
              "flex size-8 items-center justify-center outline-none focus:outline-none focus-visible:ring-0",
              active ? botaoAtivo : botaoInativo,
            )}
          >
            <Icon
              className={cn(
                "!h-[18px] !w-[18px] shrink-0",
                active ? "text-black" : "text-current",
              )}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="start"
          sideOffset={14}
          alignOffset={-6}
          onMouseEnter={abrir}
          onMouseLeave={fechar}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-60 rounded-xl border border-white/10 bg-black p-2 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
        >
          <p className="px-2.5 pb-1 pt-1.5 text-sm font-semibold leading-5 text-white">
            {item.label}
          </p>
          <SubLinks
            groups={item.sub ?? []}
            ativo={ativo}
            onNavigate={() => {
              setOpen(false);
              onNavigate?.();
            }}
          />
        </PopoverContent>
      </Popover>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const { state, isMobile, toggleSidebar, setOpenMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";
  const [termo, setTermo] = React.useState("");
  const [abertos, setAbertos] = React.useState<Record<string, boolean>>({});
  const campoBusca = React.useRef<HTMLInputElement>(null);
  const busca = semAcento(termo.trim());

  // abre sozinho o item que contém a página atual
  React.useEffect(() => {
    const dono = navGroups
      .flatMap((g) => g.items)
      .find((i) => i.sub && itemAtivo(i, location.pathname, location.search));
    if (dono)
      setAbertos((a) => (a[dono.label] ? a : { ...a, [dono.label]: true }));
  }, [location.pathname, location.search]);

  // a busca olha o nome do item e dos links do submenu; item que casa só por um link mostra só esses links
  const filtrados = navGroups
    .map((g) => ({
      ...g,
      items: g.items
        .map((i) => {
          if (!busca || semAcento(i.label).includes(busca)) return i;
          if (!i.sub) return null;
          const sub = i.sub
            .map((s) => ({
              ...s,
              links: s.links.filter((l) => semAcento(l.label).includes(busca)),
            }))
            .filter((s) => s.links.length > 0);
          return sub.length ? { ...i, sub } : null;
        })
        .filter((i): i is NavItem => i !== null),
    }))
    .filter((g) => g.items.length > 0);

  const fecharMobile = isMobile ? () => setOpenMobile(false) : undefined;

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
              <div
                key={groupIndex}
                className={cn(!collapsed && "mb-3 last:mb-0")}
              >
                {collapsed && groupIndex > 0 && (
                  <div
                    aria-hidden="true"
                    className="my-2 h-0 border-t-[0.5px] border-white/15"
                  />
                )}
                {!collapsed && group.title && (
                  <div className="px-2.5 pb-1.5 pt-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-white/45">
                      {group.title}
                    </p>
                  </div>
                )}

                <SidebarMenu className="gap-0.5 overflow-visible">
                  {group.items.map((item) => {
                    const active = itemAtivo(
                      item,
                      location.pathname,
                      location.search,
                    );
                    if (!item.sub) {
                      return (
                        <SidebarNavItem
                          key={item.label}
                          item={item}
                          collapsed={collapsed}
                          active={active}
                          onNavigate={fecharMobile}
                        />
                      );
                    }
                    const ativo = linkAtivo(
                      item,
                      location.pathname,
                      location.search,
                    );
                    return collapsed ? (
                      <SidebarFlyout
                        key={item.label}
                        item={item}
                        active={active}
                        ativo={ativo}
                        onNavigate={fecharMobile}
                      />
                    ) : (
                      <SidebarParentItem
                        key={item.label}
                        item={item}
                        active={active}
                        ativo={ativo}
                        open={!!busca || !!abertos[item.label]}
                        onToggle={() =>
                          setAbertos((a) => ({
                            ...a,
                            [item.label]: !a[item.label],
                          }))
                        }
                        onNavigate={fecharMobile}
                      />
                    );
                  })}
                </SidebarMenu>
              </div>
            ))}
          </SidebarContent>

          <div className={cn("mt-auto pb-3 pt-2", collapsed ? "px-2" : "px-4")}>
            <div
              className={cn(
                collapsed && "flex h-9 items-center justify-center",
              )}
            >
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
                className={cn(
                  "flex items-center rounded-lg text-sm font-normal leading-5 text-white/70 transition-colors hover:bg-white/[0.08]",
                  collapsed
                    ? "h-8 w-8 justify-center"
                    : "h-[34px] w-full gap-2.5 px-2.5",
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
