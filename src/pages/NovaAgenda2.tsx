import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppLayout } from "@/components/AppLayout";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  Plus,
  Save,
  Smile,
  Star,
  Users,
  X,
} from "lucide-react";
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

// ── tipos ──────────────────────────────────────────────────────────────────
type FilaItem = {
  id: number;
  nome: string;
  servico: string;
  prefere?: string;
  esperaMin: number;
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

// ── constantes da agenda ───────────────────────────────────────────────────
const HORA_INICIO = 8;
const HORA_FIM = 20;
const SLOT_MIN = 30;
const PX_POR_MIN = 1.6;

// ── helper: calcula horários livres de um profissional ─────────────────────
// Se onlyFuture=true, descarta horários anteriores ao momento atual
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
  return livres.slice(0, 5); // máx 5 slots no story
}

// ── componente do story escalado ───────────────────────────────────────────
function StoryProfissional({ prof, data, tema }: { prof: Profissional; data: Date; tema: "claro" | "escuro" }) {
  const slots = horariosLivres(prof.id, true);
  const dataFmt = format(data, "EEE, dd MMM", { locale: ptBR });
  const totalAg = agendamentos.filter((a) => a.profissional === prof.id).length;

  const isDark = tema === "escuro";

  const bg = isDark ? "#111111" : "#F2F0ED";
  const txtMain = isDark ? "#F2F0ED" : "#111111";
  const txtMuted = isDark ? "#555555" : "#aaaaaa";
  const slotBg = isDark ? "#1e1e1e" : "#ffffff";
  const slotBdr = isDark ? "#2a2a2a" : "#dddddd";
  const chipBg = isDark ? "#222222" : "#e5e2dd";
  const chipTxt = isDark ? "#bbbbbb" : "#333333";
  const badgeBg = isDark ? "#F2F0ED" : "#111111";
  const badgeTxt = isDark ? "#111111" : "#F2F0ED";

  // scale: 1080px → ~320px preview no modal
  const SCALE = 320 / 1080;

  return (
    <div
      style={{
        width: 320,
        height: Math.round(1920 * SCALE),
        overflow: "hidden",
        borderRadius: 12,
        flexShrink: 0,
      }}
    >
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
        {/* Logo bar */}
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

        {/* Body */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "80px 96px 90px",
          }}
        >
          {/* Topo: data + profissional */}
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

          {/* Headline */}
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

            {/* Slots */}
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

          {/* Rodapé */}
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

// ── componente principal ───────────────────────────────────────────────────
export default function NovaAgenda2() {
  const [fila, setFila] = useState<FilaItem[]>(filaInicial);
  const [data, setData] = useState<Date>(new Date(2026, 3, 22));
  const [filtroProf, setFiltroProf] = useState<string>("todos");
  const [filtroDias, setFiltroDias] = useState<string>("1");
  const [addFilaOpen, setAddFilaOpen] = useState(false);

  // story
  const [storyProf, setStoryProf] = useState<Profissional | null>(null);
  const [storyTema, setStoryTema] = useState<"claro" | "escuro">("escuro");

  // form fila
  const [novoCliente, setNovoCliente] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoCelular, setNovoCelular] = useState("");
  const [novoAniversario, setNovoAniversario] = useState("");
  const [novoSexo, setNovoSexo] = useState("F");
  const [novoServico, setNovoServico] = useState("");
  const [novoProfPreferido, setNovoProfPreferido] = useState("");

  const removerFila = (id: number) => setFila((prev) => prev.filter((f) => f.id !== id));

  const handleSalvarFila = () => {
    if (!novoCliente.trim() || !novoServico) return;
    setFila((prev) => [
      ...prev,
      {
        id: Date.now(),
        nome: novoCliente.trim(),
        servico: novoServico,
        prefere: novoProfPreferido || undefined,
        esperaMin: 0,
      },
    ]);
    setNovoCliente("");
    setNovoEmail("");
    setNovoCelular("");
    setNovoAniversario("");
    setNovoSexo("F");
    setNovoServico("");
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
      {/* Importa Barlow Condensed para o story */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div className="mx-auto flex max-w-[1600px] flex-col gap-2">
        {/* ── TOOLBAR ─────────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-30 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
          {/* Esquerda — Ações */}
          <div className="flex items-center gap-2">
            {/* Navegação de data */}
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
                    className="h-8 min-w-[170px] justify-center gap-2 px-3 text-xs font-medium hover:bg-muted hover:text-foreground"
                  >
                    <span className="capitalize">{format(data, "EEEE, dd MMM", { locale: ptBR })}</span>
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

            {/* Filtros */}
            <Popover>
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
              <PopoverContent align="end" sideOffset={8} className="w-[280px] p-3">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Profissional</Label>
                    <Select value={filtroProf} onValueChange={setFiltroProf}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos" className="text-xs">
                          Todos os profissionais
                        </SelectItem>
                        {profissionais.map((p) => (
                          <SelectItem key={p.id} value={p.id} className="text-xs">
                            {p.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Visualizar dias</Label>
                    <Select value={filtroDias} onValueChange={setFiltroDias}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1" className="text-xs">
                          1 dia
                        </SelectItem>
                        <SelectItem value="2" className="text-xs">
                          2 dias
                        </SelectItem>
                        <SelectItem value="3" className="text-xs">
                          3 dias
                        </SelectItem>
                        <SelectItem value="5" className="text-xs">
                          Semana útil
                        </SelectItem>
                        <SelectItem value="7" className="text-xs">
                          Semana
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(filtroProf !== "todos" || filtroDias !== "1") && (
                    <button
                      type="button"
                      onClick={() => {
                        setFiltroProf("todos");
                        setFiltroDias("1");
                      }}
                      className="w-full text-left text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Fila */}
            <Popover>
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
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 px-2 text-xs"
                    onClick={() => setAddFilaOpen(true)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Adicionar
                  </Button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {fila.length === 0 ? (
                    <p className="px-2 py-8 text-center text-sm text-muted-foreground">Ninguém na fila no momento.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {fila.map((item, idx) => (
                        <div
                          key={item.id}
                          className="group relative flex items-start gap-3 rounded-md border border-border bg-background p-2.5 transition-shadow hover:shadow-sm"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-info/10 text-xs font-semibold text-info">
                            {idx + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-sm font-medium text-foreground">{item.nome}</p>
                              <button
                                type="button"
                                onClick={() => removerFila(item.id)}
                                className="opacity-0 transition-opacity group-hover:opacity-100"
                                aria-label="Remover da fila"
                              >
                                <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                              </button>
                            </div>
                            <p className="truncate text-xs text-muted-foreground">
                              {item.servico}
                              {item.prefere && (
                                <>
                                  {" "}
                                  · Prefere <span className="text-foreground">{item.prefere}</span>
                                </>
                              )}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {item.esperaMin > 0 ? `${item.esperaMin} min` : "Agora"}
                              </span>
                              <Button
                                size="sm"
                                className="h-6 rounded-md bg-success px-2 text-[11px] font-semibold text-success-foreground hover:bg-success/90"
                              >
                                Chamar
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Direita — KPIs */}
          <div className="ml-auto flex items-center divide-x divide-border">
            <div className="flex flex-col px-4 first:pl-0">
              <span className="text-[11px] text-muted-foreground leading-tight">Agendamentos</span>
              <span className="text-[15px] font-semibold text-foreground leading-snug">18</span>
            </div>
            <div className="flex flex-col px-4">
              <span className="text-[11px] text-muted-foreground leading-tight">Concluídos</span>
              <span className="text-[15px] font-semibold text-foreground leading-snug">11</span>
            </div>
            <div className="flex flex-col px-4">
              <span className="text-[11px] text-muted-foreground leading-tight">Horários Livres</span>
              <span className="text-[15px] font-semibold text-foreground leading-snug">7</span>
            </div>
            <div className="flex flex-col pl-4">
              <span className="text-[11px] text-muted-foreground leading-tight">Ocupação</span>
              <span className="text-[15px] font-semibold text-foreground leading-snug">74%</span>
            </div>
          </div>
        </div>

        {/* ── AGENDA ──────────────────────────────────────────────────────── */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div
            className="grid min-w-[900px]"
            style={{ gridTemplateColumns: `56px repeat(${profissionaisVisiveis.length}, minmax(180px, 1fr))` }}
          >
            {/* Header sticky */}
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
                {/* Ícone de olho — aparece no hover */}
                <button
                  type="button"
                  onClick={() => setStoryProf(p)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100"
                  aria-label={`Ver story de ${p.nome}`}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            ))}

            {/* Coluna de horários */}
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

            {/* Colunas dos profissionais */}
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

      {/* ── MODAL: story do profissional ─────────────────────────────────── */}
      <Dialog open={!!storyProf} onOpenChange={(o) => !o && setStoryProf(null)}>
        <DialogContent className="max-w-fit gap-0 p-0 bg-transparent border-none shadow-none">
          {storyProf && (
            <div className="flex flex-col items-center gap-3">
              {/* Toggle tema */}
              <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
                {(["escuro", "claro"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setStoryTema(t)}
                    className={cn(
                      "rounded-md px-4 py-1.5 text-xs font-medium capitalize transition-colors",
                      storyTema === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {/* Story */}
              <StoryProfissional prof={storyProf} data={data} tema={storyTema} />
              {/* Ação de compartilhar */}
              <Button size="sm" className="gap-2 w-full">
                Compartilhar story
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── MODAL: adicionar na fila ─────────────────────────────────────── */}
      <Dialog open={addFilaOpen} onOpenChange={setAddFilaOpen}>
        <DialogContent className="max-w-md p-0 gap-0">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold text-foreground">Adicionar na fila de espera</h2>
          </div>
          <div className="grid gap-3 px-5 py-4">
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold text-foreground">Cliente</Label>
              <Input
                value={novoCliente}
                onChange={(e) => setNovoCliente(e.target.value)}
                placeholder="Buscar cliente..."
                maxLength={100}
                className="h-10"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold text-foreground">Email</Label>
              <Input
                type="email"
                value={novoEmail}
                onChange={(e) => setNovoEmail(e.target.value)}
                maxLength={255}
                className="h-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold text-foreground">Celular</Label>
                <Input
                  value={novoCelular}
                  onChange={(e) => setNovoCelular(e.target.value)}
                  placeholder="(00) 00000-0000"
                  maxLength={20}
                  className="h-10"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold text-foreground">Aniversário</Label>
                <Input
                  type="date"
                  value={novoAniversario}
                  onChange={(e) => setNovoAniversario(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold text-foreground">Sexo</Label>
              <RadioGroup value={novoSexo} onValueChange={setNovoSexo} className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="M" id="sexo-m" />
                  <Label htmlFor="sexo-m" className="text-sm font-normal">
                    M
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="F" id="sexo-f" />
                  <Label htmlFor="sexo-f" className="text-sm font-normal">
                    F
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold text-foreground">Serviços</Label>
              <Select value={novoServico} onValueChange={setNovoServico}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {servicosOpcoes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold text-foreground">Profissional preferido (opcional)</Label>
              <Select value={novoProfPreferido} onValueChange={setNovoProfPreferido}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {profissionais.map((p) => (
                    <SelectItem key={p.id} value={p.nome}>
                      {p.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/30 px-5 py-3">
            <Button variant="outline" size="sm" onClick={() => setAddFilaOpen(false)} className="h-9">
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSalvarFila}
              disabled={!novoCliente.trim() || !novoServico}
              className="h-9 gap-2 bg-success text-success-foreground hover:bg-success/90"
            >
              <Save className="h-3.5 w-3.5" />
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
