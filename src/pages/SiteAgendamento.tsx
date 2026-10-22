import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Clock,
  Copy,
  Facebook,
  GripVertical,
  Image as ImageIcon,
  Instagram,
  MapPin,
  MoreHorizontal,
  Music2,
  Pencil,
  Plus,
  Star,
  Sun,
  Moon,
  Ticket,
  Trash2,
  Upload,
  X,
  ZoomIn,
  MessageCircle,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

/* ------------------------------------------------------------------ dados */

const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const horas = Array.from({ length: 38 }, (_, i) => {
  const min = 5 * 60 + i * 30;
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${min % 60 === 0 ? "00" : "30"}`;
});

const difsBase = [
  "Café", "Estacionamento", "Estúdio de fotos", "Wifi", "Entrada acessível", "Espaço Kids", "Bebidas", "Fliperama",
  "Sala de espera", "Jogos", "Lanchonete", "Sinuca", "Video Game", "Programa de Benefícios", "Delivery de produto",
  "Pagamento online", "Espaço para fumantes", "Agendamento online", "Pagamento via cartão", "Pagamento via Pix",
];

type Foto = { src: string | null; link: string };
type Destaque = { n: string; cover: string | null; fotos: Foto[] };
type Link = { n: string; u: string };
type Modulo = { n: string; on: boolean };
type CapaPos = [number, number, number]; // x%, y%, zoom

type Site = {
  slug: string;
  nome: string;
  tel: string;
  dias: string[];
  h1: string;
  h2: string;
  end: string;
  video: string;
  desc: string;
  pixel: string;
  gtm: string;
  tema: "dark" | "light";
  cor: string;
  telobr: boolean;
  wa: string;
  ig: string;
  fb: string;
  mapa: string;
  assin: string;
  spot: string;
  outros: Link[];
  logo: string | null;
  caps: string[];
  capP: CapaPos[];
  dest: Destaque[];
  difs: string[];
  extraDifs: string[];
  mods: Modulo[];
  avon: boolean;
  avt: string;
  avd: string;
  avl: string;
  avm: "pronta" | "sem" | "url";
  avs: number;
  avu: string;
};

const inicial: Site = {
  slug: "frizzar",
  nome: "Frizzar",
  tel: "(41) 99551-1677",
  dias: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  h1: "09:00",
  h2: "18:00",
  end: "Rua Ubaldino do Amaral, 108",
  video: "https://www.youtube.com/watch?v=iJxtycU2_Xg",
  desc: "Nosso objetivo é deixar você sempre alinhado e pronto para impressionar quem estiver à volta, pela sua autoridade e presença. Seja Frizzar!",
  pixel: "8329908",
  gtm: "GTM-NWJ8",
  tema: "dark",
  cor: "#3578d0",
  telobr: true,
  wa: "(41) 99255-1927",
  ig: "frizzar_",
  fb: "frizzar_",
  mapa: "",
  assin: "https://admin.frizzar.com.br/assinaturas",
  spot: "https://open.spotify.com/playlist/37i9dQZF1DX",
  outros: [],
  logo: null,
  caps: [],
  capP: [],
  dest: [
    { n: "Barba", cover: null, fotos: [{ src: null, link: "" }, { src: null, link: "" }] },
    { n: "Parceiros", cover: null, fotos: [{ src: null, link: "" }] },
    { n: "Corte", cover: null, fotos: [{ src: null, link: "" }, { src: null, link: "" }] },
    { n: "Espaço", cover: null, fotos: [{ src: null, link: "" }] },
  ],
  difs: [
    "Café", "Estacionamento", "Estúdio de fotos", "Wifi", "Entrada acessível", "Espaço Kids", "Video Game",
    "Programa de Benefícios", "Pagamento online", "Agendamento online", "Pagamento via cartão",
  ],
  extraDifs: [],
  mods: ["Sobre", "Horário de funcionamento", "Assinaturas", "Diferenciais", "Spotify", "Avaliações", "Contato", "Outras unidades"].map(
    (n) => ({ n, on: true }),
  ),
  avon: true,
  avt: "Promoção de corte apenas HOJE",
  avd: "Marque seu corte agora.",
  avl: "https://www.instagram.com/frizzar_",
  avm: "pronta",
  avs: 0,
  avu: "",
};

const abas = [
  ["dados", "Dados básicos"],
  ["imagens", "Logo e capas"],
  ["links", "Links"],
  ["destaques", "Destaques"],
  ["diferenciais", "Diferenciais"],
  ["modulos", "Módulos"],
  ["aviso", "Central de Avisos"],
  ["acessos", "Acessos"],
] as const;
type AbaId = (typeof abas)[number][0];

const chaves: Record<AbaId, (keyof Site)[]> = {
  dados: ["slug", "nome", "tel", "dias", "h1", "h2", "end", "video", "desc", "pixel", "gtm", "tema", "cor", "telobr"],
  imagens: ["logo", "caps", "capP"],
  links: ["wa", "ig", "fb", "mapa", "assin", "spot", "outros"],
  destaques: ["dest"],
  diferenciais: ["difs", "extraDifs"],
  modulos: ["mods"],
  aviso: ["avon", "avt", "avd", "avl", "avm", "avs", "avu"],
  acessos: [],
};

const ehLink = (v: string) => /^https?:\/\/\S+\.\S+/.test(v);

const resumoDias = (ds: string[]) => {
  const ix = ds.map((d) => dias.indexOf(d)).sort((a, b) => a - b);
  if (ix.length === 0) return "Nenhum dia";
  if (ix.length === 7) return "Todos os dias";
  const seguidos = ix.every((v, i) => i === 0 || v === ix[i - 1] + 1);
  if (seguidos && ix.length > 2) return `${dias[ix[0]]} a ${dias[ix[ix.length - 1]]}`;
  const nomes = ix.map((i) => dias[i]);
  return nomes.length === 1 ? nomes[0] : `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`;
};

const capaDe = (d: Destaque) => d.cover || d.fotos.find((f) => f.src)?.src || null;

/* ------------------------------------------------------------------ estilos */

const campo =
  "h-10 w-full rounded-lg border border-info/50 bg-card px-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:border-info/60 focus:ring-2 focus:ring-info/40";
const linkAcao = "inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-info hover:underline";
const btnEscuro =
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 text-sm font-semibold text-background";
const tituloSecao = "text-xs font-semibold uppercase tracking-wide text-foreground";

function Secao({ titulo, desc, acao, children }: { titulo: string; desc?: string; acao?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">{titulo}</h2>
          {desc && <p className="mt-0.5 text-[13px] text-muted-foreground">{desc}</p>}
        </div>
        {acao}
      </div>
      {children}
    </section>
  );
}

function Campo({
  label,
  icone,
  className,
  erro,
  children,
}: {
  label: string;
  icone?: React.ReactNode;
  className?: string;
  erro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid min-w-0 content-start gap-0.5", className)}>
      <label className="flex items-center gap-1.5 text-[13px] font-semibold text-foreground">
        {icone && <span className="text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">{icone}</span>}
        {label}
      </label>
      {children}
      {erro && <p className="text-xs text-destructive">{erro}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ arrastar para ordenar */

// Cria um "fantasma" que segue o mouse; o item original vira um espaço pontilhado.
// Ao soltar, devolve a nova ordem (índices originais) e restaura o DOM para o React renderizar.
function useOrdenar(aoSoltar: (ordem: number[]) => void) {
  return (e: React.PointerEvent<HTMLElement>) => {
    const caixa = e.currentTarget;
    const alca = (e.target as HTMLElement).closest("[data-grip]");
    if (!alca) return;
    const item = alca.closest("[data-i]") as HTMLElement | null;
    if (!item || item.parentElement !== caixa) return;
    e.preventDefault();

    const original = Array.from(caixa.children) as HTMLElement[];
    const q0 = item.getBoundingClientRect();
    const dx = e.clientX - q0.left;
    const dy = e.clientY - q0.top;

    const fantasma = item.cloneNode(true) as HTMLElement;
    Object.assign(fantasma.style, {
      position: "fixed",
      zIndex: "80",
      pointerEvents: "none",
      margin: "0",
      opacity: "0.92",
      boxShadow: "none",
      width: `${q0.width}px`,
      height: `${q0.height}px`,
      left: `${q0.left}px`,
      top: `${q0.top}px`,
    });
    document.body.appendChild(fantasma);
    item.style.opacity = "0.35";
    item.style.borderStyle = "dashed";
    document.body.style.cursor = "grabbing";

    const mover = (ev: PointerEvent) => {
      fantasma.style.left = `${ev.clientX - dx}px`;
      fantasma.style.top = `${ev.clientY - dy}px`;
      let ref: Element | null = null;
      for (const irmao of Array.from(caixa.children)) {
        if (irmao === item) continue;
        const q = irmao.getBoundingClientRect();
        const cheio = q.width > caixa.clientWidth * 0.9;
        const antes = cheio
          ? ev.clientY < q.top + q.height / 2
          : ev.clientY < q.top || (ev.clientY < q.bottom && ev.clientX < q.left + q.width / 2);
        if (antes) {
          ref = irmao;
          break;
        }
      }
      if (ref !== item.nextSibling) caixa.insertBefore(item, ref);
    };
    const soltar = () => {
      document.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerup", soltar);
      fantasma.remove();
      document.body.style.cursor = "";
      item.style.opacity = "";
      item.style.borderStyle = "";
      const ordem = (Array.from(caixa.children) as HTMLElement[]).map((c) => Number(c.dataset.i));
      original.forEach((c) => caixa.appendChild(c));
      if (ordem.some((v, i) => v !== i)) aoSoltar(ordem);
    };
    document.addEventListener("pointermove", mover);
    document.addEventListener("pointerup", soltar);
  };
}

const Alca = ({ className }: { className?: string }) => (
  <span
    data-grip
    title="Arraste para reordenar"
    className={cn(
      "flex h-7 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
      className,
    )}
  >
    <GripVertical className="h-4 w-4" />
  </span>
);

const reordenar = <T,>(lista: T[], ordem: number[]) => ordem.map((i) => lista[i]);

/* ------------------------------------------------------------------ pequenos componentes */

function DiaNoite({ valor, onChange }: { valor: "dark" | "light"; onChange: (v: "dark" | "light") => void }) {
  const noite = valor === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={noite}
      aria-label="Tema padrão do site"
      onClick={() => onChange(noite ? "light" : "dark")}
      className={cn("relative h-8 w-16 shrink-0 rounded-full transition-colors", noite ? "bg-neutral-900" : "bg-neutral-200")}
    >
      <Sun className={cn("absolute left-2 top-2 h-4 w-4", noite ? "text-white/80" : "text-neutral-500")} />
      <Moon className={cn("absolute right-2 top-2 h-4 w-4", noite ? "text-white/80" : "text-neutral-500")} />
      <span
        className={cn(
          "absolute left-[3px] top-[3px] flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white text-neutral-900 shadow transition-transform",
          noite && "translate-x-8",
        )}
      >
        {noite ? <Moon className="h-[15px] w-[15px]" /> : <Sun className="h-[15px] w-[15px]" />}
      </span>
    </button>
  );
}

// Capa com enquadramento: arraste para mover e use o zoom quando a imagem for maior que a medida
function CapaItem({ src, pos, onPos, onRemove }: { src: string; pos: CapaPos; onPos: (p: CapaPos) => void; onRemove: () => void }) {
  const caixa = useRef<HTMLDivElement>(null);
  const [nat, setNat] = useState<[number, number] | null>(null);
  const [fw, setFw] = useState(280);
  const [fh, setFh] = useState(140);
  const [x, y, z] = pos;

  useEffect(() => {
    if (caixa.current) {
      setFw(caixa.current.clientWidth);
      setFh(caixa.current.clientHeight);
    }
  }, []);

  const geo = useMemo(() => {
    if (!nat) return null;
    const sc = Math.max(fw / nat[0], fh / nat[1]) * z;
    const w = nat[0] * sc;
    const h = nat[1] * sc;
    return { w, h, left: -(w - fw) * (x / 100), top: -(h - fh) * (y / 100) };
  }, [nat, fw, fh, x, y, z]);

  const arrastar = (e: React.PointerEvent) => {
    if (!geo || (e.target as HTMLElement).closest("[data-nodrag]")) return;
    e.preventDefault();
    const x0 = e.clientX;
    const y0 = e.clientY;
    const ow = geo.w - fw;
    const oh = geo.h - fh;
    const mover = (ev: PointerEvent) =>
      onPos([
        ow > 1 ? Math.min(100, Math.max(0, x - ((ev.clientX - x0) / ow) * 100)) : x,
        oh > 1 ? Math.min(100, Math.max(0, y - ((ev.clientY - y0) / oh) * 100)) : y,
        z,
      ]);
    const soltar = () => {
      document.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerup", soltar);
    };
    document.addEventListener("pointermove", mover);
    document.addEventListener("pointerup", soltar);
  };

  return (
    <div
      ref={caixa}
      onPointerDown={arrastar}
      className="relative h-[140px] w-[280px] max-w-full cursor-grab touch-none select-none overflow-hidden rounded-lg border border-border bg-muted/40 active:cursor-grabbing"
    >
      <img
        src={src}
        alt=""
        draggable={false}
        onLoad={(e) => setNat([e.currentTarget.naturalWidth, e.currentTarget.naturalHeight])}
        className="pointer-events-none absolute max-w-none"
        style={geo ? { width: geo.w, height: geo.h, left: geo.left, top: geo.top } : { width: "100%", height: "100%", objectFit: "cover" }}
      />
      <button
        type="button"
        data-nodrag
        onClick={onRemove}
        aria-label="Remover capa"
        className="absolute right-1.5 top-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-black/60 text-white"
      >
        <X className="h-3 w-3" />
      </button>
      <div data-nodrag className="absolute inset-x-1.5 bottom-1.5 flex items-center gap-2 rounded-full bg-black/60 px-2 py-1 text-white">
        <ZoomIn className="h-3.5 w-3.5 shrink-0" />
        <input
          type="range"
          min={100}
          max={300}
          value={z * 100}
          aria-label="Zoom da capa"
          onChange={(e) => onPos([x, y, Number(e.target.value) / 100])}
          className="h-3.5 min-w-0 flex-1 accent-white"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ página */

type Rascunho = { idx: number; n: string; cover: string | null; fotos: Foto[]; aberta: number };

export default function SiteAgendamento() {
  const { toast } = useToast();
  const [aulaOpen, setAulaOpen] = useState(false);
  const [salvo, setSalvo] = useState<Site>(inicial);
  const [s, setS] = useState<Site>(inicial);
  const [aba, setAba] = useState<AbaId>(() => {
    const h = window.location.hash.slice(1);
    return (abas.find((a) => a[0] === h)?.[0] ?? "dados") as AbaId;
  });
  const [horarioAberto, setHorarioAberto] = useState(false);
  const [rascunhoHorario, setRascunhoHorario] = useState({ dias: s.dias, h1: s.h1, h2: s.h2 });
  const [novoDif, setNovoDif] = useState("");
  const [menuDest, setMenuDest] = useState<number | null>(null);
  const [rd, setRd] = useState<Rascunho | null>(null);

  const set = <K extends keyof Site>(k: K, v: Site[K]) => setS((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (horarioAberto) setRascunhoHorario({ dias: s.dias, h1: s.h1, h2: s.h2 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [horarioAberto]);

  const irPara = (id: AbaId) => {
    setAba(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const abaSuja = (id: AbaId) => chaves[id].some((k) => JSON.stringify(s[k]) !== JSON.stringify(salvo[k]));
  const sujo = useMemo(() => JSON.stringify(s) !== JSON.stringify(salvo), [s, salvo]);

  const erroVideo = s.video && !ehLink(s.video) ? "Use o link completo, começando com https://" : "";
  const horarioTexto = `${resumoDias(s.dias)} · ${s.h1} às ${s.h2}`;

  const salvar = () => {
    if (erroVideo) {
      toast({ title: "Corrija o link do vídeo", variant: "destructive" });
      return;
    }
    setSalvo(s);
    toast({ title: "Site salvo" });
  };

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://app.frizzar.com.br/p/${s.slug}`);
    } catch {
      /* sem permissão de área de transferência */
    }
    toast({ title: "Link copiado" });
  };

  const enviarArquivos = (arqs: FileList | null) => (arqs ? Array.from(arqs).map((f) => URL.createObjectURL(f)) : []);

  const ordemMods = useOrdenar((o) => set("mods", reordenar(s.mods, o)));
  const ordemDest = useOrdenar((o) => set("dest", reordenar(s.dest, o)));
  const ordemFotos = useOrdenar((o) => setRd((r) => (r ? { ...r, fotos: reordenar(r.fotos, o), aberta: -1 } : r)));

  const salvarDestaque = () => {
    if (!rd) return;
    const n = rd.n.trim();
    if (!n) {
      toast({ title: "Dê um nome ao destaque", variant: "destructive" });
      return;
    }
    const item: Destaque = { n, cover: rd.cover, fotos: rd.fotos };
    setS((p) => ({ ...p, dest: rd.idx < 0 ? [...p.dest, item] : p.dest.map((d, i) => (i === rd.idx ? item : d)) }));
    setRd(null);
  };

  const todosDifs = [...difsBase, ...s.extraDifs];
  const capPos = (i: number): CapaPos => s.capP[i] ?? [50, 50, 1];

  /* ---- prévia ---- */
  const claro = s.tema === "light";
  const blocos: Record<string, React.ReactNode> = {
    Sobre: <Bloco t="Sobre nós">{s.desc}</Bloco>,
    "Horário de funcionamento": <Bloco t="Horário de funcionamento">{horarioTexto}</Bloco>,
    Assinaturas: <Bloco t="Assinaturas">Conheça os planos do clube.</Bloco>,
    Diferenciais: s.difs.length ? (
      <Bloco t="Diferenciais">
        {s.difs.slice(0, 8).map((d) => (
          <span key={d} className="mb-1 mr-1 inline-block rounded-full bg-current/10 px-2 py-0.5 text-[10.5px]" style={{ background: claro ? "#0001" : "#fff2" }}>
            {d}
          </span>
        ))}
        {s.difs.length > 8 && <span className="text-[10.5px] opacity-70">+{s.difs.length - 8}</span>}
      </Bloco>
    ) : null,
    Spotify: s.spot ? <Bloco t="Spotify">Playlist do salão</Bloco> : null,
    Avaliações: <Bloco t="Avaliações">★★★★★ 5,0 · avaliações dos clientes</Bloco>,
    Contato: (
      <Bloco t="Contato">
        {s.tel}
        {s.ig && <div>@{s.ig.replace(/^@/, "")}</div>}
        {s.outros.map((o, i) => (
          <div key={i}>{o.n}</div>
        ))}
      </Bloco>
    ),
    "Outras unidades": <Bloco t="Outras unidades">Veja nossas outras unidades.</Bloco>,
  };
  function Bloco({ t, children }: { t: string; children: React.ReactNode }) {
    return (
      <div className="mx-3.5 mb-3 rounded-xl p-2.5 text-[11.5px]" style={{ background: claro ? "#0000000d" : "#ffffff12" }}>
        <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide opacity-65">{t}</h4>
        {children}
      </div>
    );
  }

  const prever = (
    <div className="mx-auto w-[280px] rounded-[34px] bg-neutral-900 p-2.5 shadow-xl">
      <div
        className="relative flex h-[560px] flex-col overflow-hidden rounded-[26px]"
        style={{ background: claro ? "#fafafa" : "#0d0d0d", color: claro ? "#111" : "#fff" }}
      >
        <div className="flex-1 overflow-y-auto [scrollbar-width:none]">
          <div className="h-24 overflow-hidden" style={{ background: `linear-gradient(135deg, ${s.cor}, #000)` }}>
            {s.caps[0] && (
              <img
                src={s.caps[0]}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: `${capPos(0)[0]}% ${capPos(0)[1]}%` }}
              />
            )}
          </div>
          <div
            className="ml-3.5 -mt-[27px] flex h-[54px] w-[54px] items-center justify-center overflow-hidden rounded-[14px] text-[9px] font-bold text-white"
            style={{ background: s.cor, border: `3px solid ${claro ? "#fafafa" : "#0d0d0d"}` }}
          >
            {s.logo ? <img src={s.logo} alt="" className="h-full w-full object-cover" /> : "FRIZZAR."}
          </div>
          <p className="mx-3.5 mt-1.5 text-base font-bold">{s.nome || "Nome do salão"}</p>
          <p className="mx-3.5 mt-0.5 text-[11px] opacity-70">{s.end}</p>
          <div className="mx-3.5 my-3 grid h-[38px] place-items-center rounded-[10px] text-[13px] font-bold text-white" style={{ background: s.cor }}>
            Agendar horário
          </div>
          {s.dest.length > 0 && (
            <Bloco t="Destaques">
              {s.dest.map((d, i) => (
                <span key={i} className="mb-1 mr-1 inline-block rounded-full px-2 py-0.5 text-[10.5px]" style={{ background: claro ? "#0001" : "#fff2" }}>
                  {d.n}
                </span>
              ))}
            </Bloco>
          )}
          {s.mods.filter((m) => m.on).map((m) => <div key={m.n}>{blocos[m.n]}</div>)}
          <div className="h-[70px]" />
        </div>
        {s.avon && (
          <div className="absolute inset-x-2.5 bottom-2.5 rounded-[14px] bg-white p-2.5 text-[11.5px] text-neutral-900 shadow-lg">
            <b className="block text-[12.5px]">{s.avt}</b>
            {s.avd}
            <br />
            <small className="opacity-70">Exibido uma vez por dia</small>
          </div>
        )}
      </div>
    </div>
  );

  const nomeDestaque = rd && rd.idx >= 0 ? s.dest[rd.idx]?.n : "";

  return (
    <AppLayout>
      <div className="flex flex-col gap-0">
        {/* HEADER */}
        <div className="pb-1">
          <div className="flex flex-row flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold leading-none tracking-tight text-foreground sm:text-2xl">Site e agendamento online</h1>
              <AulaButton onOpen={() => setAulaOpen(true)} />
            </div>
            <span aria-hidden="true" className="inline-block h-6 w-px bg-border" />
            <button type="button" onClick={salvar} className={btnEscuro}>
              Salvar alterações
            </button>
            {sujo && <span className="text-xs text-muted-foreground">Alterações não salvas</span>}
          </div>
          <div role="tablist" className="mt-3 flex gap-6 overflow-x-auto overflow-y-hidden border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {abas.map(([id, nome]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={aba === id}
                onClick={() => irPara(id)}
                className={cn(
                  "relative -mb-px whitespace-nowrap border-b-2 pb-2.5 pt-2 text-sm font-medium transition-colors",
                  aba === id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {nome}
                {abaSuja(id) && <span title="Alterações não salvas" className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-destructive align-middle" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-4 pb-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex min-w-0 flex-col gap-4">
            {/* ---------------- DADOS BÁSICOS ---------------- */}
            {aba === "dados" && (
              <Secao titulo="Dados básicos">
                <div className="grid grid-cols-12 gap-3">
                  <Campo label="Nome do salão" className="col-span-12 md:col-span-3">
                    <input className={campo} value={s.nome} onChange={(e) => set("nome", e.target.value)} />
                  </Campo>
                  <Campo label="Link do seu site e agendamento online" className="col-span-12 md:col-span-5">
                    <div className="flex h-10 items-center overflow-hidden rounded-lg border border-info/50 bg-card text-sm transition-all focus-within:border-info/60 focus-within:ring-2 focus-within:ring-info/40">
                      <span className="whitespace-nowrap pl-3 pr-1 text-muted-foreground">app.frizzar.com.br/p/</span>
                      <input
                        value={s.slug}
                        aria-label="Endereço do site"
                        onChange={(e) => set("slug", e.target.value)}
                        className="h-full min-w-0 flex-1 bg-transparent pr-2 outline-none"
                      />
                      <button type="button" onClick={copiarLink} title="Copiar link" aria-label="Copiar link" className="flex h-full items-center px-3 text-info">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </Campo>
                  <Campo label="Horário de funcionamento" className="col-span-12 md:col-span-4">
                    <Popover open={horarioAberto} onOpenChange={setHorarioAberto}>
                      <PopoverTrigger asChild>
                        <button type="button" className={cn(campo, "flex items-center justify-between gap-2 text-left")}>
                          <span className="truncate">{horarioTexto}</span>
                          <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-[22rem] p-0">
                        <div className="px-4 py-3">
                          <p className="mb-2.5 text-center text-sm font-semibold text-foreground">Dias de funcionamento</p>
                          <div className="flex flex-nowrap items-center justify-center gap-1.5">
                            {dias.map((d) => {
                              const ativo = rascunhoHorario.dias.includes(d);
                              return (
                                <button
                                  key={d}
                                  type="button"
                                  aria-pressed={ativo}
                                  onClick={() =>
                                    setRascunhoHorario((r) => ({
                                      ...r,
                                      dias: (ativo ? r.dias.filter((x) => x !== d) : [...r.dias, d]).sort((a, b) => dias.indexOf(a) - dias.indexOf(b)),
                                    }))
                                  }
                                  className={cn(
                                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors",
                                    ativo ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:bg-muted",
                                  )}
                                >
                                  {d}
                                </button>
                              );
                            })}
                          </div>
                          {rascunhoHorario.dias.length === 0 && <p className="mt-2 text-center text-xs text-destructive">Escolha ao menos um dia</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-2.5 border-t border-border px-4 py-3">
                          {(["h1", "h2"] as const).map((k) => (
                            <label key={k} className="grid gap-0.5 text-[13px] font-semibold text-foreground">
                              {k === "h1" ? "Abre às" : "Fecha às"}
                              <select
                                value={rascunhoHorario[k]}
                                onChange={(e) => setRascunhoHorario((r) => ({ ...r, [k]: e.target.value }))}
                                className={cn(campo, "cursor-pointer font-normal")}
                              >
                                {horas.map((h) => (
                                  <option key={h}>{h}</option>
                                ))}
                              </select>
                            </label>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 border-t border-border p-3">
                          <button
                            type="button"
                            onClick={() => setRascunhoHorario({ dias: inicial.dias, h1: inicial.h1, h2: inicial.h2 })}
                            className="flex-1 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition-colors hover:bg-muted"
                          >
                            Limpar
                          </button>
                          <button
                            type="button"
                            disabled={rascunhoHorario.dias.length === 0}
                            onClick={() => {
                              setS((p) => ({ ...p, ...rascunhoHorario }));
                              setHorarioAberto(false);
                            }}
                            className="flex-1 rounded-md bg-foreground px-3 py-2 text-xs font-semibold uppercase tracking-wide text-background transition-colors hover:bg-foreground/90 disabled:opacity-40"
                          >
                            Confirmar
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </Campo>

                  <Campo label="Telefone" className="col-span-12 md:col-span-4">
                    <input className={campo} value={s.tel} onChange={(e) => set("tel", e.target.value)} />
                  </Campo>
                  <Campo label="Endereço" className="col-span-12 md:col-span-4">
                    <input className={campo} value={s.end} onChange={(e) => set("end", e.target.value)} />
                  </Campo>
                  <Campo label="Vídeo do YouTube" className="col-span-12 md:col-span-4" erro={erroVideo}>
                    <input
                      className={cn(campo, erroVideo && "border-destructive focus:border-destructive focus:ring-destructive/30")}
                      value={s.video}
                      placeholder="https://www.youtube.com/watch?v="
                      onChange={(e) => set("video", e.target.value)}
                    />
                  </Campo>

                  <Campo label="Breve descrição do estabelecimento" className="col-span-12">
                    <textarea
                      rows={2}
                      value={s.desc}
                      onChange={(e) => set("desc", e.target.value)}
                      className={cn(campo, "h-auto min-h-[88px] resize-y py-2.5 leading-relaxed")}
                    />
                  </Campo>

                  <Campo label="Meta Pixel ID" className="col-span-12 md:col-span-6">
                    <input className={campo} value={s.pixel} onChange={(e) => set("pixel", e.target.value)} />
                  </Campo>
                  <Campo label="Tag Manager ID" className="col-span-12 md:col-span-6">
                    <input className={campo} value={s.gtm} placeholder="GTM-XXXXXXX" onChange={(e) => set("gtm", e.target.value)} />
                  </Campo>

                  <div className="col-span-12 flex flex-wrap items-start gap-7">
                    <Campo label="Tema padrão">
                      <div className="flex h-10 items-center">
                        <DiaNoite valor={s.tema} onChange={(v) => set("tema", v)} />
                      </div>
                    </Campo>
                    <Campo label="Cor principal do site">
                      <div className="flex h-10 items-center gap-2 rounded-lg border border-info/50 bg-card pl-2 pr-3 text-sm">
                        <input
                          type="color"
                          value={s.cor}
                          aria-label="Cor principal"
                          onChange={(e) => set("cor", e.target.value)}
                          className="h-[26px] w-[26px] cursor-pointer rounded-full border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0"
                        />
                        <input
                          value={s.cor}
                          aria-label="Cor em hexadecimal"
                          onChange={(e) => set("cor", e.target.value)}
                          className="w-[84px] bg-transparent outline-none"
                        />
                      </div>
                    </Campo>
                    <Campo label="Telefone obrigatório no cadastro">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={s.telobr}
                        onClick={() => set("telobr", !s.telobr)}
                        className="flex h-10 items-center gap-2.5 rounded-lg border border-info/50 bg-card pl-3 pr-3.5 text-sm"
                      >
                        <Switch checked={s.telobr} tabIndex={-1} className="pointer-events-none" />
                        {s.telobr ? "Obrigatório" : "Opcional"}
                      </button>
                    </Campo>
                  </div>
                </div>
              </Secao>
            )}

            {/* ---------------- LOGO E CAPAS ---------------- */}
            {aba === "imagens" && (
              <Secao titulo="Logo e capas">
                <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-foreground text-[11px] font-bold tracking-[0.08em] text-background">
                      {s.logo ? <img src={s.logo} alt="Logo" className="h-full w-full object-cover" /> : "FRIZZAR."}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold">Logo</p>
                      <p className="mb-1.5 mt-0.5 text-xs text-muted-foreground">Imagem quadrada, ex.: 300 × 300</p>
                      <label className={linkAcao}>
                        <Upload className="h-4 w-4" /> Editar logo
                        <input type="file" accept="image/*" hidden onChange={(e) => enviarArquivos(e.target.files)[0] && set("logo", enviarArquivos(e.target.files)[0])} />
                      </label>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold">Capas</p>
                    <p className="mb-2 mt-0.5 text-xs text-muted-foreground">
                      Ideal 1000 × 500 px. Se a imagem for maior, arraste-a para enquadrar e use o zoom.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {s.caps.map((c, i) => (
                        <CapaItem
                          key={c}
                          src={c}
                          pos={capPos(i)}
                          onPos={(p) => setS((prev) => ({ ...prev, capP: prev.caps.map((_, k) => (k === i ? p : prev.capP[k] ?? [50, 50, 1])) }))}
                          onRemove={() =>
                            setS((prev) => ({ ...prev, caps: prev.caps.filter((_, k) => k !== i), capP: prev.capP.filter((_, k) => k !== i) }))
                          }
                        />
                      ))}
                      <label className="flex h-[140px] w-[280px] max-w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-info/50 text-[13px] font-medium text-info hover:bg-muted">
                        <Plus className="h-5 w-5" /> Adicionar capa
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={(e) => {
                            const novas = enviarArquivos(e.target.files);
                            setS((p) => ({
                              ...p,
                              caps: [...p.caps, ...novas],
                              capP: [...p.caps.map((_, k) => p.capP[k] ?? ([50, 50, 1] as CapaPos)), ...novas.map(() => [50, 50, 1] as CapaPos)],
                            }));
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </Secao>
            )}

            {/* ---------------- LINKS ---------------- */}
            {aba === "links" && (
              <Secao titulo="Links">
                <div className="grid grid-cols-12 gap-3">
                  <Campo label="WhatsApp" icone={<MessageCircle />} className="col-span-12 md:col-span-6">
                    <input className={campo} value={s.wa} onChange={(e) => set("wa", e.target.value)} />
                  </Campo>
                  <Campo label="Instagram" icone={<Instagram />} className="col-span-12 md:col-span-6">
                    <input className={campo} value={s.ig} placeholder="@usuario" onChange={(e) => set("ig", e.target.value)} />
                  </Campo>
                  <Campo label="Facebook" icone={<Facebook />} className="col-span-12 md:col-span-6">
                    <input className={campo} value={s.fb} onChange={(e) => set("fb", e.target.value)} />
                  </Campo>
                  <Campo label="Link do Google Maps" icone={<MapPin />} className="col-span-12 md:col-span-6">
                    <input className={campo} value={s.mapa} placeholder="Link do Google Maps" onChange={(e) => set("mapa", e.target.value)} />
                  </Campo>
                  <Campo label="Link das assinaturas" icone={<Ticket />} className="col-span-12 md:col-span-6">
                    <input className={campo} value={s.assin} onChange={(e) => set("assin", e.target.value)} />
                  </Campo>
                  <Campo label="Playlist do Spotify" icone={<Music2 />} className="col-span-12 md:col-span-6">
                    <input className={campo} value={s.spot} onChange={(e) => set("spot", e.target.value)} />
                  </Campo>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold">Outros links</p>
                    <button type="button" className={linkAcao} onClick={() => set("outros", [...s.outros, { n: "", u: "" }])}>
                      <Plus className="h-4 w-4" /> Novo link
                    </button>
                  </div>
                  <div className="mt-2 grid gap-2">
                    {s.outros.length === 0 && <p className="text-xs text-muted-foreground">Nenhum link extra. Use para TikTok, iFood, YouTube…</p>}
                    {s.outros.map((o, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          className={cn(campo, "w-[34%]")}
                          placeholder="Nome, ex.: TikTok"
                          value={o.n}
                          aria-label="Nome do link"
                          onChange={(e) => set("outros", s.outros.map((x, k) => (k === i ? { ...x, n: e.target.value } : x)))}
                        />
                        <input
                          className={campo}
                          placeholder="Digite aqui o seu link"
                          value={o.u}
                          aria-label="Endereço do link"
                          onChange={(e) => set("outros", s.outros.map((x, k) => (k === i ? { ...x, u: e.target.value } : x)))}
                        />
                        <button
                          type="button"
                          aria-label="Remover link"
                          onClick={() => set("outros", s.outros.filter((_, k) => k !== i))}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </Secao>
            )}

            {/* ---------------- DESTAQUES ---------------- */}
            {aba === "destaques" && (
              <Secao
                titulo="Destaques"
                desc="Coleções de fotos para mostrar serviços, ambientes e promoções no seu site. Arraste para reordenar."
                acao={
                  <button type="button" className={btnEscuro} onClick={() => setRd({ idx: -1, n: "", cover: null, fotos: [], aberta: -1 })}>
                    <Plus className="h-4 w-4" /> Criar destaque
                  </button>
                }
              >
                {s.dest.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum destaque criado. Use “Criar destaque”.</p>
                ) : (
                  <div onPointerDown={ordemDest} className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
                    {s.dest.map((d, i) => {
                      const c = capaDe(d);
                      return (
                        <div key={i} data-i={i} className="flex flex-col rounded-xl border border-border bg-card">
                          <div className="relative h-[84px] overflow-hidden rounded-t-[11px] bg-muted/60">
                            {c && <img src={c} alt="" className="h-full w-full scale-125 object-cover blur-[6px] brightness-90" />}
                            <Alca className="absolute left-1.5 top-1.5 h-[26px] w-[26px] bg-black/55 text-white hover:bg-black/75 hover:text-white" />
                          </div>
                          <div className="relative mx-auto -mt-8 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-[3px] border-card bg-muted text-muted-foreground">
                            {c ? <img src={c} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5" />}
                          </div>
                          <div className="px-3 pb-0.5 pt-1.5 text-center">
                            <b className="block text-sm font-semibold">{d.n}</b>
                            <small className="text-xs text-muted-foreground">
                              {d.fotos.length} {d.fotos.length === 1 ? "imagem" : "imagens"}
                            </small>
                          </div>
                          <div className="mt-2.5 flex items-center justify-center gap-2.5 border-t border-border px-3 pb-3 pt-2">
                            <button type="button" className={linkAcao} onClick={() => setRd({ idx: i, n: d.n, cover: d.cover, fotos: d.fotos.map((f) => ({ ...f })), aberta: -1 })}>
                              <Pencil className="h-4 w-4" /> Editar
                            </button>
                            <Popover open={menuDest === i} onOpenChange={(o) => setMenuDest(o ? i : null)}>
                              <PopoverTrigger asChild>
                                <button type="button" aria-label="Mais opções" className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent align="end" className="w-48 p-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    set("dest", s.dest.filter((_, k) => k !== i));
                                    setMenuDest(null);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-destructive hover:bg-muted"
                                >
                                  <Trash2 className="h-4 w-4" /> Excluir destaque
                                </button>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Secao>
            )}

            {/* ---------------- DIFERENCIAIS ---------------- */}
            {aba === "diferenciais" && (
              <Secao titulo="Diferenciais" desc="Toque para ativar ou desativar o que o seu salão oferece.">
                <div className="flex flex-wrap gap-2">
                  {todosDifs.map((d) => {
                    const on = s.difs.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        aria-pressed={on}
                        onClick={() => set("difs", on ? s.difs.filter((x) => x !== d) : [...s.difs, d])}
                        className={cn(
                          "inline-flex h-8 items-center gap-1.5 rounded-[30px] border px-3.5 text-[13px] font-medium transition-colors",
                          on ? "border-info bg-info/10 text-info" : "border-border text-muted-foreground hover:bg-muted",
                        )}
                      >
                        {on && <Check className="h-3.5 w-3.5" />}
                        {d}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 grid grid-cols-12 items-end gap-3">
                  <Campo label="Adicionar diferencial" className="col-span-12 md:col-span-8">
                    <input className={campo} value={novoDif} placeholder="Ex.: Cerveja gelada" onChange={(e) => setNovoDif(e.target.value)} />
                  </Campo>
                  <button
                    type="button"
                    className={cn(btnEscuro, "col-span-12 h-10 md:col-span-4")}
                    onClick={() => {
                      const n = novoDif.trim();
                      if (!n) return;
                      setS((p) => ({
                        ...p,
                        extraDifs: [...difsBase, ...p.extraDifs].includes(n) ? p.extraDifs : [...p.extraDifs, n],
                        difs: p.difs.includes(n) ? p.difs : [...p.difs, n],
                      }));
                      setNovoDif("");
                    }}
                  >
                    Adicionar
                  </button>
                </div>
              </Secao>
            )}

            {/* ---------------- MÓDULOS ---------------- */}
            {aba === "modulos" && (
              <Secao titulo="Módulos" desc="Ative o que aparece no site e arraste para mudar a ordem. A prévia ao lado acompanha.">
                <div onPointerDown={ordemMods} className="grid gap-2">
                  {s.mods.map((m, i) => (
                    <div key={m.n} data-i={i} className="flex items-center gap-2.5 rounded-[10px] border border-border bg-card px-3 py-2">
                      <Alca />
                      <span className={cn("flex-1 text-sm font-medium", !m.on && "text-muted-foreground")}>{m.n}</span>
                      <Switch
                        checked={m.on}
                        aria-label={`Mostrar ${m.n}`}
                        onCheckedChange={(v) => set("mods", s.mods.map((x, k) => (k === i ? { ...x, on: v } : x)))}
                      />
                    </div>
                  ))}
                </div>
              </Secao>
            )}

            {/* ---------------- CENTRAL DE AVISOS ---------------- */}
            {aba === "aviso" && (
              <Secao
                titulo="Central de Avisos"
                desc="Aviso exibido uma vez por dia no seu site."
                acao={
                  <label className="flex items-center gap-2 text-[13px] font-semibold">
                    Ativar aviso
                    <Switch checked={s.avon} onCheckedChange={(v) => set("avon", v)} />
                  </label>
                }
              >
                <div className={cn("grid grid-cols-12 gap-3", !s.avon && "pointer-events-none opacity-45")}>
                  <Campo label="Título" className="col-span-12 md:col-span-8">
                    <input className={campo} value={s.avt} onChange={(e) => set("avt", e.target.value)} />
                  </Campo>
                  <Campo label="Link opcional" className="col-span-12 md:col-span-4">
                    <input className={campo} value={s.avl} placeholder="https://" onChange={(e) => set("avl", e.target.value)} />
                  </Campo>
                  <Campo label="Descrição" className="col-span-12">
                    <textarea rows={2} value={s.avd} onChange={(e) => set("avd", e.target.value)} className={cn(campo, "h-auto min-h-[88px] resize-y py-2.5 leading-relaxed")} />
                  </Campo>
                  <div className="col-span-12">
                    <p className="text-[13px] font-semibold">
                      Imagem do aviso <span className="font-normal text-muted-foreground">· recomendado 430 × 230 px</span>
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {(
                        [
                          ["pronta", "Imagem pronta"],
                          ["sem", "Sem imagem"],
                          ["url", "URL própria"],
                        ] as const
                      ).map(([m, nome]) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => set("avm", m)}
                          className={cn(
                            "h-9 rounded-lg border px-3.5 text-[13px] font-medium",
                            s.avm === m ? "border-foreground bg-muted text-foreground" : "border-border text-muted-foreground hover:bg-muted",
                          )}
                        >
                          {nome}
                        </button>
                      ))}
                    </div>
                    {s.avm === "pronta" && (
                      <div className="mt-2 flex gap-2">
                        {[0, 1, 2].map((i) => (
                          <button
                            key={i}
                            type="button"
                            aria-label={`Imagem pronta ${i + 1}`}
                            onClick={() => set("avs", i)}
                            className={cn(
                              "h-[52px] w-24 rounded-lg border-2 bg-gradient-to-br from-muted to-info/20",
                              s.avs === i ? "border-info" : "border-transparent",
                            )}
                          />
                        ))}
                      </div>
                    )}
                    {s.avm === "url" && (
                      <input className={cn(campo, "mt-2")} value={s.avu} placeholder="URL da imagem" onChange={(e) => set("avu", e.target.value)} />
                    )}
                  </div>
                </div>
              </Secao>
            )}

            {/* ---------------- ACESSOS ---------------- */}
            {aba === "acessos" && (
              <Secao titulo="Acessos" desc="Estatística de acessos dos últimos 7 dias.">
                <div className="mb-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-[28px] font-bold">0</span> <span className="text-xs text-muted-foreground">acessos no período</span>
                  </div>
                  <span className="text-xs text-muted-foreground">16/10 a 22/10</span>
                </div>
                <div className="flex h-16 items-end gap-1.5">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="min-h-[3px] flex-1 rounded-t-sm bg-info/25" style={{ height: 3 }} />
                  ))}
                </div>
                <p className="mt-3 text-center text-xs text-muted-foreground">Nenhum acesso registrado nos últimos 7 dias.</p>
              </Secao>
            )}
          </div>

          {/* PRÉVIA */}
          <aside>
            <div className="lg:sticky lg:top-4">
              <p className="mb-2 text-center text-xs text-muted-foreground">Prévia do site</p>
              {prever}
            </div>
          </aside>
        </div>
      </div>

      {/* ---------------- JANELA DO DESTAQUE ---------------- */}
      <Dialog open={!!rd} onOpenChange={(o) => !o && setRd(null)}>
        <DialogContent className="max-h-[calc(100vh-32px)] max-w-[640px] gap-0 overflow-hidden p-0">
          {rd && (
            <>
              <DialogHeader className="border-b border-border px-5 py-4">
                <DialogTitle className="text-base font-semibold">{rd.idx < 0 ? "Novo destaque" : `Editar destaque: ${nomeDestaque}`}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 overflow-y-auto px-5 py-4">
                <div>
                  <p className={cn(tituloSecao, "mb-2")}>Informações do destaque</p>
                  <div className="flex items-start gap-3.5">
                    <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-[10px] border border-border bg-muted/50">
                      {(rd.cover || rd.fotos.find((f) => f.src)?.src) && (
                        <img src={rd.cover || rd.fotos.find((f) => f.src)?.src || ""} alt="" className="h-full w-full object-cover" />
                      )}
                      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-card px-2 py-1 text-xs">
                        Capa atual <ImageIcon className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <div className="grid min-w-0 flex-1 gap-2">
                      <Campo label="Nome do destaque">
                        <input className={campo} value={rd.n} placeholder="Ex.: Barba" autoFocus onChange={(e) => setRd({ ...rd, n: e.target.value })} />
                        <p className="text-xs text-muted-foreground">Esse nome será exibido para seus clientes no site.</p>
                      </Campo>
                      <label className={cn(linkAcao, "justify-self-start")}>
                        <ImageIcon className="h-4 w-4" /> Trocar capa
                        <input type="file" accept="image/*" hidden onChange={(e) => { const u = enviarArquivos(e.target.files)[0]; if (u) setRd({ ...rd, cover: u }); }} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className={tituloSecao}>Conteúdos do destaque</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Arraste para ordenar e, se quiser, defina o link de cada foto.</p>
                    </div>
                    <label className={cn(btnEscuro, "cursor-pointer")}>
                      <Plus className="h-4 w-4" /> Adicionar fotos
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={(e) => {
                          const novas = enviarArquivos(e.target.files).map((src) => ({ src, link: "" }));
                          setRd({ ...rd, fotos: [...rd.fotos, ...novas] });
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  <div onPointerDown={ordemFotos} className="grid gap-2">
                    {rd.fotos.length === 0 && <p className="py-2.5 text-xs text-muted-foreground">Nenhuma foto ainda. Use “Adicionar fotos”.</p>}
                    {rd.fotos.map((f, i) => (
                      <div key={i} data-i={i} className="flex items-center gap-2.5 rounded-[10px] border border-border bg-card px-2.5 py-2">
                        <Alca />
                        <span className="w-3.5 text-xs text-muted-foreground">{i + 1}</span>
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/50">
                          {f.src && <img src={f.src} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <b className="block text-[13px] font-semibold">Foto do destaque</b>
                          {rd.aberta === i ? (
                            <input
                              className={cn(campo, "mt-1 h-8 text-[13px]")}
                              placeholder="https://"
                              value={f.link}
                              aria-label={`Link da foto ${i + 1}`}
                              onChange={(e) => setRd({ ...rd, fotos: rd.fotos.map((x, k) => (k === i ? { ...x, link: e.target.value } : x)) })}
                            />
                          ) : (
                            <small className="block truncate text-xs text-muted-foreground">{f.link || "Sem link configurado"}</small>
                          )}
                        </div>
                        <button
                          type="button"
                          title="Usar como capa"
                          aria-label="Usar como capa"
                          disabled={!f.src}
                          onClick={() => {
                            setRd({ ...rd, cover: f.src });
                            toast({ title: "Capa atualizada" });
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                        >
                          <Star className={cn("h-4 w-4", rd.cover && rd.cover === f.src && "text-info")} />
                        </button>
                        <button type="button" className={linkAcao} onClick={() => setRd({ ...rd, aberta: rd.aberta === i ? -1 : i })}>
                          {rd.aberta === i ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                          {rd.aberta === i ? "Ok" : "Editar"}
                        </button>
                        <button
                          type="button"
                          aria-label="Remover foto"
                          onClick={() => setRd({ ...rd, fotos: rd.fotos.filter((_, k) => k !== i), aberta: -1 })}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-destructive hover:bg-muted"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
                <button type="button" onClick={() => setRd(null)} className="h-8 rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted">
                  Cancelar
                </button>
                <button type="button" onClick={salvarDestaque} className={btnEscuro}>
                  <Check className="h-4 w-4" /> Salvar destaque
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Site e agendamento online"
      />
    </AppLayout>
  );
}
