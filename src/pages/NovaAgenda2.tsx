import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppLayout } from "@/components/AppLayout";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Users,
  X,
  Filter,
  Smile,
  Star,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type FilaItem = {
  id: number;
  nome: string;
  servico: string;
  prefere?: string;
  esperaMin: number;
};

const filaInicial: FilaItem[] = [
  { id: 1, nome: "Ada Naama", servico: "Corte Feminino", prefere: "Claudia", esperaMin: 12 },
  { id: 2, nome: "Marcos Vieira", servico: "Barba", esperaMin: 5 },
  { id: 3, nome: "Juliana Reis", servico: "Coloração", prefere: "Marcia", esperaMin: 25 },
];

type Profissional = { id: string; nome: string; cargo: string; iniciais: string; corHeader: string };
const profissionais: Profissional[] = [
  { id: "cesar", nome: "Cesar", cargo: "Gerente", iniciais: "CE", corHeader: "bg-amber-700 text-white" },
  { id: "claudia", nome: "Claudia", cargo: "Profissional", iniciais: "CL", corHeader: "bg-pink-500 text-white" },
  { id: "marcia", nome: "Marcia Silva", cargo: "Assistente", iniciais: "MS", corHeader: "bg-rose-400 text-white" },
  { id: "matheus", nome: "Matheus", cargo: "Profissional", iniciais: "MA", corHeader: "bg-stone-700 text-white" },
  { id: "vini", nome: "Vini", cargo: "Auxiliar", iniciais: "VI", corHeader: "bg-indigo-500 text-white" },
];

const servicosOpcoes = [
  "Corte Feminino",
  "Corte Masculino",
  "Barba",
  "Coloração",
  "Manicure",
  "Pedicure",
  "Escova",
];

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

const agendamentos: Agendamento[] = [
  { id: 1, profissional: "cesar", inicio: 360, duracao: 30, cliente: "", servico: "Bloqueado", status: "folga" },
  { id: 2, profissional: "cesar", inicio: 420, duracao: 60, cliente: "Daniel Lucas Santos Araújo", servico: "Luzes" },
  { id: 3, profissional: "cesar", inicio: 480, duracao: 30, cliente: "Jean Carlos", servico: "corte social" },
  { id: 4, profissional: "cesar", inicio: 510, duracao: 30, cliente: "José Ales Junior", servico: "Corte Masculino" },
  { id: 5, profissional: "cesar", inicio: 540, duracao: 30, cliente: "Victor Renan Cavalcante da mato", servico: "Barba + Sobrancelha" },
  { id: 6, profissional: "cesar", inicio: 570, duracao: 30, cliente: "Pedro Henrique", servico: "Corte Masculino" },
  { id: 7, profissional: "cesar", inicio: 615, duracao: 25, cliente: "cristian", servico: "corte social" },
  { id: 10, profissional: "claudia", inicio: 360, duracao: 90, cliente: "", servico: "Disponível", status: "pendente" },
  { id: 11, profissional: "claudia", inicio: 450, duracao: 30, cliente: "César", servico: "Corte Masculino" },
  { id: 12, profissional: "claudia", inicio: 480, duracao: 45, cliente: "Alice Costa Melis", servico: "Corte Feminino" },
  { id: 13, profissional: "claudia", inicio: 525, duracao: 30, cliente: "César", servico: "Corte Masculino" },
  { id: 14, profissional: "claudia", inicio: 540, duracao: 60, cliente: "Adriana Quiros", servico: "Mechas" },
  { id: 15, profissional: "claudia", inicio: 630, duracao: 90, cliente: "Promo do dia", servico: "Pacote Especial", status: "destaque" },
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
  { id: 45, profissional: "vini", inicio: 540, duracao: 25, cliente: "Rômulo Alef Alvez de Sousa", servico: "" },
  { id: 46, profissional: "vini", inicio: 570, duracao: 30, cliente: "Jonatas Cerqueira", servico: "Barba!" },
];

const HORA_INICIO = 8;
const HORA_FIM = 20;
const SLOT_MIN = 30;
const PX_POR_MIN = 1.6;

export default function NovaAgenda2() {
  const [fila, setFila] = useState<FilaItem[]>(filaInicial);
  const [data, setData] = useState<Date>(new Date(2026, 3, 22));
  const [filtroProf, setFiltroProf] = useState<string>("todos");
  const [filtroDias, setFiltroDias] = useState<string>("1");
  const [addFilaOpen, setAddFilaOpen] = useState(false);

  // Form state — adicionar à fila
  const [novoCliente, setNovoCliente] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoCelular, setNovoCelular] = useState("");
  const [novoAniversario, setNovoAniversario] = useState("");
  const [novoSexo, setNovoSexo] = useState("F");
  const [novoServico, setNovoServico] = useState("");
  const [novoProfPreferido, setNovoProfPreferido] = useState("");

  const removerFila = (id: number) =>
    setFila((prev) => prev.filter((f) => f.id !== id));

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
    // reset
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
  for (let h = HORA_INICIO; h < HORA_FIM; h++) {
    for (let m = 0; m < 60; m += SLOT_MIN) {
      horarios.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  const totalMin = (HORA_FIM - HORA_INICIO) * 60;

  const formatHora = (minDesdeInicio: number) => {
    const h = HORA_INICIO + Math.floor(minDesdeInicio / 60);
    const m = minDesdeInicio % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2">
        {/* TOOLBAR FIXA */}
        <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
          {/* Esquerda: navegação data centralizada */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setData((d) => { const n = new Date(d); n.setDate(d.getDate() - 1); return n; })}
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
                  className="h-8 min-w-[220px] justify-center gap-2 px-3 text-xs font-medium"
                >
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="capitalize">
                    {format(data, "EEEE, dd 'de' MMM yyyy", { locale: ptBR })}
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
              onClick={() => setData((d) => { const n = new Date(d); n.setDate(d.getDate() + 1); return n; })}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Próximo dia"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Direita: Filtros · Fila */}
          <div className="flex flex-wrap items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                  {(filtroProf !== "todos" || filtroDias !== "1") && (
                    <Badge variant="secondary" className="h-5 rounded-full px-1.5 text-[10px] font-semibold">
                      {(filtroProf !== "todos" ? 1 : 0) + (filtroDias !== "1" ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
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
                        <SelectItem value="todos" className="text-xs">Todos os profissionais</SelectItem>
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
                        <SelectItem value="1" className="text-xs">1 dia</SelectItem>
                        <SelectItem value="2" className="text-xs">2 dias</SelectItem>
                        <SelectItem value="3" className="text-xs">3 dias</SelectItem>
                        <SelectItem value="5" className="text-xs">Semana útil</SelectItem>
                        <SelectItem value="7" className="text-xs">Semana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(filtroProf !== "todos" || filtroDias !== "1") && (
                    <button
                      type="button"
                      onClick={() => { setFiltroProf("todos"); setFiltroDias("1"); }}
                      className="w-full text-left text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <Users className="h-4 w-4" />
                  Fila de espera
                  <Badge variant="secondary" className="h-5 rounded-full px-2 text-[11px] font-semibold">
                    {fila.length}
                  </Badge>
                </Button>
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
                    <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                      Ninguém na fila no momento.
                    </p>
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
                                  {" · Prefere "}
                                  <span className="text-foreground">{item.prefere}</span>
                                </>
                              )}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {item.esperaMin} min
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
        </div>

        {/* AGENDA */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div
            className="grid min-w-[900px]"
            style={{ gridTemplateColumns: `56px repeat(${profissionaisVisiveis.length}, minmax(180px, 1fr))` }}
          >
              {/* Header sticky — colado abaixo da toolbar */}
              <div className="sticky top-[53px] z-20 flex items-center justify-center border-b border-r border-border bg-card py-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              {profissionaisVisiveis.map((p) => (
                <div
                  key={p.id}
                  className="sticky top-[53px] z-20 flex items-center gap-2 border-b border-r border-border bg-card px-3 py-2 last:border-r-0"
                >
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold", p.corHeader)}>
                    {p.iniciais}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{p.nome}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{p.cargo}</p>
                  </div>
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
                            !isFolga && !isPendente && !isDestaque && "border-l-foreground/80 bg-card text-foreground hover:bg-muted/40"
                          )}
                          style={{
                            top: `${a.inicio * PX_POR_MIN}px`,
                            height: `${a.duracao * PX_POR_MIN - 1}px`,
                          }}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className={cn(
                              "text-[10px] font-medium",
                              isFolga ? "text-background/70" : isDestaque ? "text-white/90" : "text-muted-foreground"
                            )}>
                              {formatHora(a.inicio)} - {formatHora(a.inicio + a.duracao)}
                            </span>
                            {!isFolga && (
                              isDestaque ? (
                                <Star className="h-3 w-3 shrink-0 fill-yellow-300 text-yellow-300" />
                              ) : (
                                <Smile className="h-3 w-3 shrink-0 text-amber-400" />
                              )
                            )}
                          </div>
                          <p className={cn(
                            "truncate text-[11px] font-semibold leading-tight mt-0.5",
                            isFolga ? "text-background" : isDestaque ? "text-white" : "text-foreground"
                          )}>
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

      {/* MODAL: Adicionar na fila de espera */}
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
                  <Label htmlFor="sexo-m" className="text-sm font-normal">M</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="F" id="sexo-f" />
                  <Label htmlFor="sexo-f" className="text-sm font-normal">F</Label>
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
                    <SelectItem key={s} value={s}>{s}</SelectItem>
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
                    <SelectItem key={p.id} value={p.nome}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/30 px-5 py-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddFilaOpen(false)}
              className="h-9"
            >
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
