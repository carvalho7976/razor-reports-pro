import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { ChevronLeft, ChevronRight, Clock, Eye, Filter, Save, Smile, Star, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { NovoButton } from "@/components/DataTable";
import { DeleteModal, FormModal, Dropdown, MultiDropdown, TextField, DatePickerField, FormRow, SaveButton } from "@/components/FormModal";
import { WhatsAppButton } from "@/components/WhatsAppButton";

// ── tipos ──────────────────────────────────────────────────────────────────
type FilaItem = {
  id: number;
  nome: string;
  servico: string;
  prefere?: string;
  esperaMin: number;
  telefone?: string;
};

type Profissional = {
  id: string;
  nome: string;
  cargo: string;
  iniciais: string;
  corHeader: string;
};

type StatusEvento = "confirmado" | "pendente" | "folga" | "destaque";

type Agendamento = {
  id: number;
  profissional: string;
  inicio: number;
  duracao: number;
  cliente: string;
  servico: string;
  status?: StatusEvento;
};

// ── ícone WhatsApp ─────────────────────────────────────────────────────────
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="currentColor">
      <path d="M16.04 3C9.39 3 4 8.29 4 14.82c0 2.31.69 4.47 1.87 6.29L4 29l8.12-1.83a12.26 12.26 0 0 0 3.92.64C22.69 27.81 28 22.52 28 15.99S22.69 3 16.04 3Zm0 22.78c-1.23 0-2.43-.32-3.49-.91l-.5-.28-4.82 1.09 1.11-4.6-.32-.53a9.24 9.24 0 0 1-1.42-4.91c0-5.1 4.24-9.25 9.45-9.25s9.45 4.15 9.45 9.25-4.24 9.24-9.46 9.24Zm5.19-6.89c-.28-.14-1.66-.8-1.91-.89-.26-.09-.45-.14-.64.14-.19.27-.73.89-.9 1.07-.16.18-.33.2-.61.07-.28-.14-1.19-.43-2.27-1.37-.84-.73-1.41-1.64-1.57-1.91-.16-.28-.02-.43.12-.57.13-.12.28-.32.42-.48.14-.16.19-.27.28-.46.09-.18.05-.34-.02-.48-.07-.14-.64-1.51-.88-2.07-.23-.55-.47-.47-.64-.48h-.55c-.19 0-.49.07-.75.34-.26.27-.98.94-.98 2.29s1.01 2.66 1.15 2.84c.14.18 1.98 2.97 4.8 4.16.67.28 1.2.45 1.61.58.68.21 1.29.18 1.78.11.54-.08 1.66-.66 1.89-1.3.23-.64.23-1.19.16-1.3-.07-.11-.26-.18-.54-.32Z" />
    </svg>
  );
}

// ── dados ──────────────────────────────────────────────────────────────────
const filaInicial: FilaItem[] = [
  { id: 1, nome: "Ada Naama", servico: "Corte Feminino", prefere: "Claudia", esperaMin: 12 },
  { id: 2, nome: "Marcos Vieira", servico: "Barba", esperaMin: 5 },
  { id: 3, nome: "Juliana Reis", servico: "Coloração", prefere: "Marcia", esperaMin: 25 },
];

const profissionais: Profissional[] = [
  { id: "cesar", nome: "Cesar", cargo: "Gerente", iniciais: "CE", corHeader: "bg-amber-700 text-white" },
  { id: "claudia", nome: "Claudia", cargo: "Profissional", iniciais: "CL", corHeader: "bg-pink-500 text-white" },
  { id: "marcia", nome: "Marcia Silva", cargo: "Assistente", iniciais: "MS", corHeader: "bg-rose-400 text-white" },
  { id: "matheus", nome: "Matheus", cargo: "Profissional", iniciais: "MA", corHeader: "bg-stone-700 text-white" },
  { id: "vini", nome: "Vini", cargo: "Auxiliar", iniciais: "VI", corHeader: "bg-indigo-500 text-white" },
];

const servicosOpcoes = ["Corte Feminino", "Corte Masculino", "Barba", "Coloração", "Manicure", "Pedicure", "Escova"];

const agendamentos: Agendamento[] = [
  { id: 1, profissional: "cesar", inicio: 360, duracao: 30, cliente: "", servico: "Bloqueado", status: "folga" },
  { id: 2, profissional: "cesar", inicio: 420, duracao: 60, cliente: "Daniel Lucas Santos Araújo", servico: "Luzes" },
  { id: 3, profissional: "cesar", inicio: 480, duracao: 30, cliente: "Jean Carlos", servico: "corte social" },
  { id: 4, profissional: "cesar", inicio: 510, duracao: 30, cliente: "José Ales Junior", servico: "Corte Masculino" },
  { id: 5, profissional: "cesar", inicio: 540, duracao: 30, cliente: "Victor Renan", servico: "Barba + Sobrancelha" },
  { id: 6, profissional: "cesar", inicio: 570, duracao: 30, cliente: "Pedro Henrique", servico: "Corte Masculino" },
  { id: 7, profissional: "cesar", inicio: 615, duracao: 25, cliente: "cristian", servico: "corte social" },
  { id: 10, profissional: "claudia", inicio: 360, duracao: 90, cliente: "", servico: "Disponível", status: "pendente" },
  { id: 11, profissional: "claudia", inicio: 450, duracao: 30, cliente: "César", servico: "Corte Masculino" },
  {
    id: 12,
    profissional: "claudia",
    inicio: 480,
    duracao: 45,
    cliente: "Alice Costa Melis",
    servico: "Corte Feminino",
  },
  { id: 13, profissional: "claudia", inicio: 525, duracao: 30, cliente: "César", servico: "Corte Masculino" },
  { id: 14, profissional: "claudia", inicio: 540, duracao: 60, cliente: "Adriana Quiros", servico: "Mechas" },
  {
    id: 15,
    profissional: "claudia",
    inicio: 630,
    duracao: 90,
    cliente: "Promo do dia",
    servico: "Pacote Especial",
    status: "destaque",
  },
  { id: 20, profissional: "marcia", inicio: 390, duracao: 30, cliente: "Cristiane Soares Santos", servico: "Manicure" },
  { id: 21, profissional: "marcia", inicio: 420, duracao: 30, cliente: "Sabrina Ramak", servico: "Pedicure" },
  { id: 22, profissional: "marcia", inicio: 450, duracao: 60, cliente: "Luciana Cunha", servico: "Esmaltação em gel" },
  { id: 23, profissional: "marcia", inicio: 510, duracao: 30, cliente: "Andréia Pérez Magalhães", servico: "Manicure" },
  { id: 24, profissional: "marcia", inicio: 540, duracao: 30, cliente: "Sofia santos rocha", servico: "Pedicure" },
  { id: 25, profissional: "marcia", inicio: 570, duracao: 30, cliente: "carmen leia", servico: "Manicure" },
  { id: 26, profissional: "marcia", inicio: 630, duracao: 30, cliente: "", servico: "Disponível" },
  { id: 30, profissional: "matheus", inicio: 390, duracao: 40, cliente: "Michael Nunes", servico: "Barba!" },
  { id: 31, profissional: "matheus", inicio: 435, duracao: 40, cliente: "Rafael Anderson Machado", servico: "Barba!" },
  { id: 32, profissional: "matheus", inicio: 480, duracao: 30, cliente: "Gabriel Correia", servico: "Corte Masculino" },
  { id: 33, profissional: "matheus", inicio: 510, duracao: 45, cliente: "Enzo Ferreira", servico: "Corte na navalha" },
  { id: 34, profissional: "matheus", inicio: 555, duracao: 40, cliente: "sergio lopes", servico: "Barba!" },
  { id: 40, profissional: "vini", inicio: 375, duracao: 30, cliente: "Otavio Rodrigues", servico: "corte social" },
  { id: 41, profissional: "vini", inicio: 405, duracao: 30, cliente: "Folga", servico: "da ao banco", status: "folga" },
  { id: 42, profissional: "vini", inicio: 435, duracao: 25, cliente: "Claudio Aparecido", servico: "corte social" },
  { id: 43, profissional: "vini", inicio: 465, duracao: 25, cliente: "Jonas Cavalin", servico: "corte social" },
  { id: 44, profissional: "vini", inicio: 495, duracao: 40, cliente: "Glauber Rafael Silva Souza", servico: "Barba!" },
  { id: 45, profissional: "vini", inicio: 540, duracao: 25, cliente: "Rômulo Alef", servico: "" },
  { id: 46, profissional: "vini", inicio: 570, duracao: 30, cliente: "Jonatas Cerqueira", servico: "Barba!" },
];

const HORA_INICIO = 8;
const HORA_FIM = 20;
const SLOT_MIN = 30;
const PX_POR_MIN = 1.6;

function horariosLivres(profId: string, onlyFuture = false): string[] {
  const ocupados = agendamentos
    .filter((a) => a.profissional === profId && a.status !== "folga")
    .map((a) => ({ ini: a.inicio, fim: a.inicio + a.duracao }));

  const agora = new Date();
  const minAgora = agora.getHours() * 60 + agora.getMinutes();

  const livres: string[] = [];
  for (let min = HORA_INICIO * 60; min < HORA_FIM * 60; min += SLOT_MIN) {
    if (onlyFuture && min <= minAgora) continue;
    const minRelativo = min - HORA_INICIO * 60;
    const ocupado = ocupados.some((o) => minRelativo < o.fim && minRelativo + SLOT_MIN > o.ini);
    if (!ocupado) {
      const h = Math.floor(min / 60);
      const m = min % 60;
      livres.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return livres.slice(0, 5);
}

function StoryProfissional({ prof, data, tema }: { prof: Profissional; data: Date; tema: "claro" | "escuro" }) {
  const slots = horariosLivres(prof.id, true);
  const dataFmt = format(data, "EEEE", { locale: ptBR }).replace("-feira", "");
  const totalAg = agendamentos.filter((a) => a.profissional === prof.id).length;

  const isDark = tema === "escuro";

  const bg = isDark ? "#111111" : "#F2F0ED";
  const txtMain = isDark ? "#F2F0ED" : "#111111";
  const txtMuted = isDark ? "#555555" : "#aaaaaa";
  const slotBg = isDark ? "#1e1e1e" : "#ffffff";
  const slotBdr = isDark ? "#2a2a2a" : "#dddddd";
  const badgeBg = isDark ? "#F2F0ED" : "#111111";
  const badgeTxt = isDark ? "#111111" : "#F2F0ED";

  const SCALE = 280 / 1080;

  return (
    <div style={{ width: 280, height: Math.round(1920 * SCALE), overflow: "hidden", borderRadius: 12, flexShrink: 0 }}>
      <div
        style={{
          width: 1080,
          height: 1920,
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
          background: bg,
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Barlow Condensed', sans-serif",
        }}
      >
        <div
          style={{
            background: "#111",
            padding: "52px 80px 44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              color: "#fff",
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            O BARBEIRO
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "80px 96px 90px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                background: badgeBg,
                color: badgeTxt,
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "14px 34px",
                borderRadius: 10,
              }}
            >
              {dataFmt}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  background: "#E63329",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "0.04em",
                }}
              >
                {prof.iniciais}
              </div>

              <div>
                <div
                  style={{
                    fontSize: 44,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    color: txtMain,
                    letterSpacing: "0.06em",
                    lineHeight: 1,
                  }}
                >
                  {prof.nome}
                </div>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 400,
                    color: txtMuted,
                    fontFamily: "'Barlow', sans-serif",
                    letterSpacing: "0.04em",
                  }}
                >
                  {prof.cargo}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <h2
              style={{
                fontSize: 200,
                fontWeight: 800,
                lineHeight: 0.9,
                letterSpacing: "-0.01em",
                textTransform: "uppercase",
                color: txtMain,
                margin: 0,
              }}
            >
              Últimas
              <br />
              vagas
              <br />
              do dia.
            </h2>

            <div style={{ width: 120, height: 10, background: "#E63329" }} />

            <div>
              <p
                style={{
                  fontSize: 30,
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: txtMuted,
                  marginBottom: 28,
                  fontFamily: "'Barlow Condensed', sans-serif",
                }}
              >
                Horários disponíveis
              </p>

              <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
                {slots.length === 0 ? (
                  <span style={{ fontSize: 44, fontWeight: 600, color: txtMuted }}>Agenda cheia</span>
                ) : (
                  slots.map((s, i) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 48,
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        padding: "20px 44px",
                        borderRadius: 12,
                        background: i === 0 ? "#E63329" : slotBg,
                        color: i === 0 ? "#fff" : txtMain,
                        border: i === 0 ? "none" : `2px solid ${slotBdr}`,
                      }}
                    >
                      {s}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 60, fontWeight: 800, color: txtMain, lineHeight: 1 }}>{totalAg}</div>
              <div style={{ fontSize: 30, fontWeight: 400, color: txtMuted, fontFamily: "'Barlow', sans-serif" }}>
                atendimentos hoje
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 32, fontWeight: 400, color: txtMuted, fontFamily: "'Barlow', sans-serif" }}>
                @obarbeiro
              </div>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#E63329",
                }}
              >
                Agendar agora
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NovaAgenda2() {
  const [fila, setFila] = useState<FilaItem[]>(filaInicial);
  const [data, setData] = useState<Date>(new Date(2026, 3, 22));
  const [filtroProf, setFiltroProf] = useState<string>("todos");
  const [filtroDias, setFiltroDias] = useState<string>("1");
  const [addFilaOpen, setAddFilaOpen] = useState(false);
  const [filaDeleteItem, setFilaDeleteItem] = useState<FilaItem | null>(null);
  const [chamarItem, setChamarItem] = useState<FilaItem | null>(null);
  const [chamarProf, setChamarProf] = useState<string>("");

  const [filtroOpen, setFiltroOpen] = useState(false);
  const [filtroBusca, setFiltroBusca] = useState("");
  const [filtroProfsSel, setFiltroProfsSel] = useState<string[]>([]);
  const [filtroDiasSel, setFiltroDiasSel] = useState<string>("1");

  const [filaOpen, setFilaOpen] = useState(false);

  const [storyProf, setStoryProf] = useState<Profissional | null>(null);
  const [storyTema, setStoryTema] = useState<"claro" | "escuro">("escuro");

  const [novoCliente, setNovoCliente] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoCelular, setNovoCelular] = useState("");
  const [novoAniversario, setNovoAniversario] = useState("");
  const [novoSexo, setNovoSexo] = useState("F");
  const [novoServicos, setNovoServicos] = useState<string[]>([]);
  const [novoProfPreferido, setNovoProfPreferido] = useState("");

  const removerFila = (id: number) => setFila((prev) => prev.filter((f) => f.id !== id));

  const handleSalvarFila = () => {
    if (!novoCliente.trim() || novoServicos.length === 0) return;
    setFila((prev) => [
      ...prev,
      {
        id: Date.now(),
        nome: novoCliente.trim(),
        servico: novoServicos.join(", "),
        prefere: novoProfPreferido || undefined,
        esperaMin: 0,
      },
    ]);
    setNovoCliente("");
    setNovoEmail("");
    setNovoCelular("");
    setNovoAniversario("");
    setNovoSexo("F");
    setNovoServicos([]);
    setNovoProfPreferido("");
    setAddFilaOpen(false);
  };

  const profissionaisVisiveis =
    filtroProf === "todos" ? profissionais : profissionais.filter((p) => p.id === filtroProf);

  const horarios: string[] = [];
  for (let h = HORA_INICIO; h < HORA_FIM; h++)
    for (let m = 0; m < 60; m += SLOT_MIN) horarios.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);

  const totalMin = (HORA_FIM - HORA_INICIO) * 60;

  const formatHora = (minDesdeInicio: number) => {
    const h = HORA_INICIO + Math.floor(minDesdeInicio / 60);
    const m = minDesdeInicio % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  return (
    <AppLayout>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div className="mx-auto flex max-w-[1600px] flex-col gap-2">
        {(filtroOpen || filaOpen) && (
          <div
            className="fixed inset-0 z-40 bg-black/80 animate-in fade-in-0"
            aria-hidden="true"
          />
        )}
        <div className="sticky top-0 z-30 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setData((d) => {
                    const n = new Date(d);
                    n.setDate(d.getDate() - 1);
                    return n;
                  })
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Dia anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 min-w-[130px] justify-center gap-2 px-3 text-xs font-medium hover:bg-muted hover:text-foreground"
                  >
                    <span className="capitalize">
                      {format(data, "EEEE, dd MMM", { locale: ptBR }).replace("-feira", "")}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="center" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={data}
                    onSelect={(d) => d && setData(d)}
                    initialFocus
                    locale={ptBR}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <button
                type="button"
                onClick={() =>
                  setData((d) => {
                    const n = new Date(d);
                    n.setDate(d.getDate() + 1);
                    return n;
                  })
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Próximo dia"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="h-5 w-px bg-border" />

            <Popover
              open={filtroOpen}
              onOpenChange={(open) => {
                setFiltroOpen(open);
                if (open) {
                  setFiltroProfsSel(filtroProf === "todos" ? [] : [filtroProf]);
                  setFiltroDiasSel(filtroDias);
                  setFiltroBusca("");
                }
              }}
            >
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="relative flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Filtros"
                      >
                        <Filter className="h-4 w-4" />
                        {(filtroProf !== "todos" || filtroDias !== "1") && (
                          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-foreground text-[9px] font-semibold text-background">
                            {(filtroProf !== "todos" ? 1 : 0) + (filtroDias !== "1" ? 1 : 0)}
                          </span>
                        )}
                      </button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                   <TooltipContent className="bg-popover text-popover-foreground border border-border shadow-sm text-xs px-2 py-1">
                     Filtros
                   </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <PopoverContent align="end" sideOffset={8} className="w-[300px] p-0">
                <div className="relative border-b border-border px-4 pb-3 pt-4">
                  <Input
                    value={filtroBusca}
                    onChange={(e) => setFiltroBusca(e.target.value)}
                    placeholder="Profissional"
                    className="h-9 border-0 px-0 pr-7 text-sm shadow-none focus-visible:ring-0"
                  />
                  <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                <div className="max-h-[220px] overflow-y-auto px-2 py-2">
                  {profissionais
                    .filter((p) => p.nome.toLowerCase().includes(filtroBusca.toLowerCase()))
                    .map((p) => {
                      const checked = filtroProfsSel.includes(p.id);
                      return (
                        <label
                          key={p.id}
                          className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 hover:bg-muted"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={cn("text-xs font-semibold", p.corHeader)}>
                              {p.iniciais}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex-1 text-sm text-foreground">{p.nome}</span>
                          <Checkbox
                            checked={checked}
                            className="h-4 w-4 rounded-[4px] border-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                            onCheckedChange={(v) => {
                              setFiltroProfsSel((prev) => (v ? [...prev, p.id] : prev.filter((id) => id !== p.id)));
                            }}
                          />
                        </label>
                      );
                    })}
                </div>

                <div className="border-t border-border px-4 py-3">
                  <p className="mb-3 text-center text-sm font-semibold text-foreground">Dias visualizados</p>
                  <div className="flex items-center justify-center gap-1.5">
                    {["1", "2", "3", "4", "5", "6", "7"].map((n) => {
                      const active = Number(n) <= Number(filtroDiasSel);
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setFiltroDiasSel(n)}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                            active
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-background text-muted-foreground hover:bg-muted",
                          )}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-border p-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFiltroProfsSel([]);
                      setFiltroDiasSel("1");
                      setFiltroBusca("");
                    }}
                    className="flex-1 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition-colors hover:bg-muted"
                  >
                    Limpar filtro
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFiltroProf(filtroProfsSel.length === 1 ? filtroProfsSel[0] : "todos");
                      setFiltroDias(filtroDiasSel);
                      setFiltroOpen(false);
                    }}
                    className="flex-1 rounded-md bg-foreground px-3 py-2 text-xs font-semibold uppercase tracking-wide text-background transition-colors hover:bg-foreground/90"
                  >
                    Confirmar
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={filaOpen} onOpenChange={setFilaOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex h-8 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Users className="h-4 w-4" />
                  Fila
                  <Badge variant="secondary" className="h-4 rounded-full px-1.5 text-[10px] font-semibold">
                    {fila.length}
                  </Badge>
                </button>
              </PopoverTrigger>

              <PopoverContent align="end" sideOffset={8} className="w-[360px] p-0">
                <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                      <Users className="h-4 w-4 text-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Fila de espera</span>
                    <Badge variant="secondary" className="h-5 rounded-full px-2 text-[11px] font-semibold">
                      {fila.length}
                    </Badge>
                  </div>
                  <NovoButton items={[{ label: "Adicionar", onClick: () => setAddFilaOpen(true) }]} />
                </div>

                <div className="max-h-[60vh] overflow-y-auto bg-muted/20 p-2">
                  {fila.length === 0 ? (
                    <p className="px-2 py-8 text-center text-sm text-muted-foreground">Ninguém na fila no momento.</p>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {fila.map((item, idx) => (
                        <div
                          key={item.id}
                          className="group relative flex items-center gap-2.5 rounded-md border border-border bg-card px-2.5 py-2 transition-shadow hover:shadow-sm"
                        >
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
                            {idx + 1}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-medium text-foreground leading-tight">
                              {item.nome}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground leading-tight mt-0.5">
                              {item.servico}
                              {item.prefere && (
                                <>
                                  {" · "}
                                  <span className="text-foreground">{item.prefere}</span>
                                </>
                              )}
                              <span className="mx-1">·</span>
                              <span className="inline-flex items-center gap-0.5">
                                <Clock className="h-2.5 w-2.5" />
                                {item.esperaMin > 0 ? `${item.esperaMin}min` : "Agora"}
                              </span>
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setChamarItem(item);
                              setChamarProf(
                                item.prefere
                                  ? profissionais.find((p) => p.nome === item.prefere)?.id ?? ""
                                  : ""
                              );
                            }}
                            className="inline-flex h-7 items-center rounded-md border border-foreground bg-card px-2.5 text-[11px] font-semibold text-foreground transition-colors hover:bg-[hsl(var(--novo-btn))] hover:text-[hsl(var(--novo-btn-foreground))] hover:border-[hsl(var(--novo-btn))]"
                          >
                            Chamar
                          </button>

                          <WhatsAppButton telefone={item.telefone || "11999999999"} nome={item.nome} />

                          <button
                            type="button"
                            onClick={() => setFilaDeleteItem(item)}
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                            aria-label="Remover da fila"
                          >
                            <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <TooltipProvider delayDuration={0}>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-1.5 border-r border-border pr-4">
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Agendamentos
                </span>
                <Badge variant="secondary" className="h-5 rounded-full px-2 text-[11px] font-semibold">
                  {agendamentos.filter((a) => a.status !== "folga").length}
                </Badge>
              </div>
              {[
                { emoji: "😌", label: "Agendado", valor: 8 },
                { emoji: "😉", label: "Confirmado", valor: 5 },
                { emoji: "🤗", label: "Chegou", valor: 2 },
                { emoji: "💆🏻‍♂️", label: "Em atendimento", valor: 1 },
                { emoji: "😍", label: "Finalizado", valor: 7 },
                { emoji: "😱", label: "Faltou", valor: 1 },
                { emoji: "😢", label: "Desmarcou", valor: 2 },
              ].map((k) => (
                <Tooltip key={k.label}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 cursor-default">
                      <span className="text-base leading-none">{k.emoji}</span>
                      <span className="text-[13px] font-semibold text-foreground leading-none">{k.valor}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-popover text-popover-foreground border border-border shadow-sm text-xs px-2 py-1">
                    {k.label}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div
            className="grid min-w-[900px]"
            style={{ gridTemplateColumns: `56px repeat(${profissionaisVisiveis.length}, minmax(180px, 1fr))` }}
          >
            <div className="sticky top-[53px] z-20 flex items-center justify-center border-b border-r border-border bg-card py-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>

            {profissionaisVisiveis.map((p) => (
              <div
                key={p.id}
                className="group sticky top-[53px] z-20 flex items-center gap-2 border-b border-r border-border bg-card px-3 py-2 last:border-r-0"
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    p.corHeader,
                  )}
                >
                  {p.iniciais}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{p.nome}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{p.cargo}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStoryProf(p)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={`Ver story de ${p.nome}`}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            ))}

            <div className="relative border-r border-border bg-muted/20">
              {horarios.map((h) => (
                <div
                  key={h}
                  className="flex items-start justify-end pr-2 pt-0 text-[11px] font-medium text-muted-foreground"
                  style={{ height: `${SLOT_MIN * PX_POR_MIN}px` }}
                >
                  <span className="-mt-1.5">{h}</span>
                </div>
              ))}
            </div>

            {profissionaisVisiveis.map((p) => (
              <div
                key={p.id}
                className="relative border-r border-border last:border-r-0"
                style={{ height: `${totalMin * PX_POR_MIN}px` }}
              >
                {horarios.map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 border-b border-border/50"
                    style={{ top: `${i * SLOT_MIN * PX_POR_MIN}px`, height: `${SLOT_MIN * PX_POR_MIN}px` }}
                  />
                ))}

                {agendamentos
                  .filter((a) => a.profissional === p.id)
                  .map((a) => {
                    const isFolga = a.status === "folga";
                    const isPendente = a.status === "pendente";
                    const isDestaque = a.status === "destaque";

                    return (
                      <div
                        key={a.id}
                        className={cn(
                          "absolute left-0 right-0 cursor-pointer overflow-hidden border-l-[3px] px-2 py-1 text-[11px] transition-all hover:z-10 hover:shadow-md",
                          isFolga && "border-l-foreground bg-foreground text-background",
                          isPendente && "border-l-sky-400 bg-sky-100 text-sky-900",
                          isDestaque && "border-l-pink-600 bg-gradient-to-r from-pink-500 to-rose-500 text-white",
                          !isFolga &&
                            !isPendente &&
                            !isDestaque &&
                            "border-l-foreground/80 bg-card text-foreground hover:bg-muted/40",
                        )}
                        style={{ top: `${a.inicio * PX_POR_MIN}px`, height: `${a.duracao * PX_POR_MIN - 1}px` }}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span
                            className={cn(
                              "text-[10px] font-medium",
                              isFolga ? "text-background/70" : isDestaque ? "text-white/90" : "text-muted-foreground",
                            )}
                          >
                            {formatHora(a.inicio)} - {formatHora(a.inicio + a.duracao)}
                          </span>
                          {!isFolga &&
                            (isDestaque ? (
                              <Star className="h-3 w-3 shrink-0 fill-yellow-300 text-yellow-300" />
                            ) : (
                              <Smile className="h-3 w-3 shrink-0 text-amber-400" />
                            ))}
                        </div>

                        <p
                          className={cn(
                            "truncate text-[11px] font-semibold leading-tight mt-0.5",
                            isFolga ? "text-background" : isDestaque ? "text-white" : "text-foreground",
                          )}
                        >
                          {a.cliente && a.servico ? `${a.cliente} - ${a.servico}` : a.cliente || a.servico}
                        </p>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!storyProf} onOpenChange={(o) => !o && setStoryProf(null)}>
        <DialogContent className="w-auto max-w-[360px] gap-0 border-none bg-transparent p-0 shadow-none">
          {storyProf && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-sm">
                {(["claro", "escuro"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setStoryTema(t)}
                    className={cn(
                      "rounded-md px-4 py-1 text-xs font-medium capitalize transition-colors",
                      storyTema === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <StoryProfissional prof={storyProf} data={data} tema={storyTema} />
              <Button size="sm" className="w-full gap-2 shadow-sm">
                Compartilhar story
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!filaDeleteItem} onOpenChange={(open) => !open && setFilaDeleteItem(null)}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <DeleteModal
            title="Remover da fila"
            message={filaDeleteItem ? `Deseja remover "${filaDeleteItem.nome}" da fila de espera?` : ""}
            onConfirm={() => {
              if (!filaDeleteItem) return;
              removerFila(filaDeleteItem.id);
              setFilaDeleteItem(null);
            }}
            onClose={() => setFilaDeleteItem(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={addFilaOpen} onOpenChange={setAddFilaOpen}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden max-w-xl">
          <FormModal
            title="Adicionar na fila de espera"
            subtitle="Preencha os dados do cliente"
            onClose={() => setAddFilaOpen(false)}
            footer={<SaveButton onClick={handleSalvarFila} />}
          >
            <FormRow>
              <TextField
                label="Nome"
                value={novoCliente}
                onChange={setNovoCliente}
                placeholder="Buscar cliente..."
              />
              <TextField
                label="Email"
                value={novoEmail}
                onChange={setNovoEmail}
                type="text"
              />
            </FormRow>
            <FormRow cols={3}>
              <TextField
                label="Celular"
                value={novoCelular}
                onChange={setNovoCelular}
                placeholder="(00) 00000-0000"
              />
              <DatePickerField
                label="Aniversário"
                value={novoAniversario}
                onChange={setNovoAniversario}
              />
              <Dropdown
                label="Gênero"
                value={novoSexo}
                setValue={setNovoSexo}
                options={[
                  { value: "M", label: "Masculino" },
                  { value: "F", label: "Feminino" },
                  { value: "O", label: "Outro" },
                ]}
              />
            </FormRow>
            <MultiDropdown
              label="Serviços"
              values={novoServicos}
              setValues={setNovoServicos}
              options={servicosOpcoes.map((s) => ({ value: s, label: s }))}
              searchable
            />
            <Dropdown
              label="Profissional preferido (opcional)"
              value={novoProfPreferido}
              setValue={setNovoProfPreferido}
              options={profissionais.map((p) => ({ value: p.nome, label: p.nome }))}
            />
          </FormModal>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!chamarItem}
        onOpenChange={(open) => {
          if (!open) {
            setChamarItem(null);
            setChamarProf("");
          }
        }}
      >
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <FormModal
            title="Confirme o profissional"
            subtitle={chamarItem ? `${chamarItem.nome} · ${chamarItem.servico}` : undefined}
            onClose={() => {
              setChamarItem(null);
              setChamarProf("");
            }}
            footer={
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!chamarProf}
                  onClick={() => {
                    if (chamarItem) removerFila(chamarItem.id);
                    setChamarItem(null);
                    setChamarProf("");
                  }}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-foreground bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-[0.98] disabled:opacity-50"
                >
                  Atender e pagar
                </button>
                <button
                  type="button"
                  disabled={!chamarProf}
                  onClick={() => {
                    if (chamarItem) removerFila(chamarItem.id);
                    setChamarItem(null);
                    setChamarProf("");
                  }}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/90 active:scale-[0.98] disabled:opacity-50"
                >
                  Atender
                </button>
              </div>
            }
          >
            <Dropdown
              label="Profissional"
              value={chamarProf}
              setValue={setChamarProf}
              options={profissionais.map((p) => ({ value: p.id, label: p.nome }))}
            />
          </FormModal>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
