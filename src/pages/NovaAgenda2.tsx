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

type Profissional = { id: string; nome: string; cor: string };
const profissionais: Profissional[] = [
  { id: "cesar", nome: "Cesar", cor: "bg-info/15 border-info/40 text-info" },
  { id: "claudia", nome: "Claudia", cor: "bg-success/15 border-success/40 text-success" },
  { id: "marcia", nome: "Marcia", cor: "bg-warning/15 border-warning/40 text-warning" },
  { id: "matheus", nome: "Matheus", cor: "bg-accent/15 border-accent/40 text-accent" },
  { id: "vini", nome: "Vini", cor: "bg-destructive/15 border-destructive/40 text-destructive" },
];

type Agendamento = {
  id: number;
  profissional: string;
  inicio: number; // minutos desde 08:00
  duracao: number; // em minutos
  cliente: string;
  servico: string;
};

const agendamentos: Agendamento[] = [
  { id: 1, profissional: "cesar", inicio: 0, duracao: 45, cliente: "João P.", servico: "Corte + Barba" },
  { id: 2, profissional: "cesar", inicio: 90, duracao: 30, cliente: "Lucas M.", servico: "Barba" },
  { id: 3, profissional: "claudia", inicio: 30, duracao: 60, cliente: "Ada Naama", servico: "Corte Feminino" },
  { id: 4, profissional: "claudia", inicio: 150, duracao: 90, cliente: "Mariana", servico: "Escova + Hidratação" },
  { id: 5, profissional: "marcia", inicio: 60, duracao: 120, cliente: "Juliana R.", servico: "Coloração" },
  { id: 6, profissional: "matheus", inicio: 15, duracao: 30, cliente: "Pedro H.", servico: "Corte" },
  { id: 7, profissional: "matheus", inicio: 75, duracao: 45, cliente: "Rafael S.", servico: "Corte + Sobrancelha" },
  { id: 8, profissional: "vini", inicio: 45, duracao: 60, cliente: "Carol L.", servico: "Manicure" },
];

const HORA_INICIO = 8;
const HORA_FIM = 20;
const SLOT_MIN = 30;
const PX_POR_MIN = 1.4; // altura por minuto

export default function NovaAgenda2() {
  const [fila, setFila] = useState<FilaItem[]>(filaInicial);
  const [data, setData] = useState<Date>(new Date(2026, 3, 22));

  const removerFila = (id: number) =>
    setFila((prev) => prev.filter((f) => f.id !== id));

  const horarios: string[] = [];
  for (let h = HORA_INICIO; h < HORA_FIM; h++) {
    for (let m = 0; m < 60; m += SLOT_MIN) {
      horarios.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  const totalMin = (HORA_FIM - HORA_INICIO) * 60;

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
        {/* TOOLBAR ÚNICA */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
          {/* Esquerda: navegação por data unificada */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md border border-border bg-background">
              <button
                type="button"
                onClick={() => setData((d) => { const n = new Date(d); n.setDate(d.getDate() - 1); return n; })}
                className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Dia anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setData(new Date())}
                className="border-l border-r border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted h-8"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => setData((d) => { const n = new Date(d); n.setDate(d.getDate() + 1); return n; })}
                className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Próximo dia"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2 px-3 text-xs font-medium"
                >
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="capitalize">
                    {format(data, "EEEE, dd 'de' MMM yyyy", { locale: ptBR })}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
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
          </div>

          {/* Direita: Filtros · Fila · Novo agendamento */}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>

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
                  <Button size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs">
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

            <Button size="sm" className="h-8 gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4" />
              Novo agendamento
            </Button>
          </div>
        </div>

        {/* AGENDA SIMULADA — grade horários × profissionais */}
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <div
              className="grid min-w-[800px]"
              style={{ gridTemplateColumns: `64px repeat(${profissionais.length}, minmax(140px, 1fr))` }}
            >
              {/* Header */}
              <div className="sticky top-0 z-20 border-b border-r border-border bg-muted/40" />
              {profissionais.map((p) => (
                <div
                  key={p.id}
                  className="sticky top-0 z-20 border-b border-r border-border bg-muted/40 px-3 py-2 text-center last:border-r-0"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold", p.cor)}>
                      {p.nome.charAt(0)}
                    </span>
                    <span className="text-xs font-medium text-foreground">{p.nome}</span>
                  </div>
                </div>
              ))}

              {/* Coluna de horários */}
              <div className="relative border-r border-border">
                {horarios.map((h, i) => (
                  <div
                    key={h}
                    className={cn(
                      "flex items-start justify-end pr-2 pt-1 text-[10px] font-medium text-muted-foreground",
                      i % 2 === 0 ? "" : "text-muted-foreground/60"
                    )}
                    style={{ height: `${SLOT_MIN * PX_POR_MIN}px` }}
                  >
                    {h}
                  </div>
                ))}
              </div>

              {/* Colunas dos profissionais */}
              {profissionais.map((p) => (
                <div
                  key={p.id}
                  className="relative border-r border-border last:border-r-0"
                  style={{ height: `${totalMin * PX_POR_MIN}px` }}
                >
                  {/* linhas de slot */}
                  {horarios.map((h, i) => (
                    <div
                      key={h}
                      className={cn(
                        "absolute left-0 right-0 border-b border-border/60",
                        i % 2 === 0 ? "" : "border-dashed"
                      )}
                      style={{ top: `${i * SLOT_MIN * PX_POR_MIN}px`, height: `${SLOT_MIN * PX_POR_MIN}px` }}
                    />
                  ))}

                  {/* Eventos */}
                  {agendamentos
                    .filter((a) => a.profissional === p.id)
                    .map((a) => (
                      <div
                        key={a.id}
                        className={cn(
                          "absolute left-1 right-1 cursor-pointer overflow-hidden rounded-md border px-2 py-1 text-[11px] shadow-sm transition-all hover:shadow-md hover:z-10",
                          p.cor
                        )}
                        style={{
                          top: `${a.inicio * PX_POR_MIN}px`,
                          height: `${a.duracao * PX_POR_MIN - 2}px`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <p className="truncate font-semibold text-foreground">{a.cliente}</p>
                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {String(HORA_INICIO + Math.floor(a.inicio / 60)).padStart(2, "0")}:
                            {String(a.inicio % 60).padStart(2, "0")}
                          </span>
                        </div>
                        <p className="truncate text-[10px] text-foreground/80">{a.servico}</p>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
