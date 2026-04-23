import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Users,
  X,
  Filter,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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

const profissionais = [
  { id: "todos", nome: "Todos os profissionais" },
  { id: "cesar", nome: "Cesar" },
  { id: "claudia", nome: "Claudia" },
  { id: "marcia", nome: "Marcia Silva" },
  { id: "matheus", nome: "Matheus" },
  { id: "vini", nome: "Vini" },
];

const visualizacoes = [
  { value: "1", label: "1 dia" },
  { value: "2", label: "2 dias" },
  { value: "3", label: "3 dias" },
  { value: "5", label: "Semana útil" },
  { value: "7", label: "Semana" },
];

export default function NovaAgenda2() {
  const [filaAberta, setFilaAberta] = useState(false);
  const [fila, setFila] = useState<FilaItem[]>(filaInicial);
  const [profissional, setProfissional] = useState("todos");
  const [diasView, setDiasView] = useState("1");
  const [data, setData] = useState("22/04/2026");

  const removerFila = (id: number) =>
    setFila((prev) => prev.filter((f) => f.id !== id));

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
        {/* PAGE HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">Agenda</h1>
            <button
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Aula"
            >
              <PlayCircle className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button size="sm" className="h-9 gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4" />
              Novo agendamento
            </Button>
          </div>
        </div>

        {/* FILA DE ESPERA — colapsável e compacta */}
        <div
          className={cn(
            "rounded-lg border border-border bg-card shadow-sm transition-all",
            filaAberta ? "" : ""
          )}
        >
          {/* Cabeçalho da fila — sempre visível */}
          <button
            type="button"
            onClick={() => setFilaAberta((v) => !v)}
            className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                <Users className="h-4 w-4 text-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  Fila de espera
                </span>
                <Badge
                  variant="secondary"
                  className="h-5 rounded-full px-2 text-[11px] font-semibold"
                >
                  {fila.length}
                </Badge>
              </div>

              {/* Preview inline quando colapsada */}
              {!filaAberta && fila.length > 0 && (
                <div className="ml-2 hidden items-center gap-2 md:flex">
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    Próximo:{" "}
                    <span className="font-medium text-foreground">
                      {fila[0].nome}
                    </span>{" "}
                    — {fila[0].servico}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => e.stopPropagation()}
                className="hidden h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex"
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar
              </span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground">
                {filaAberta ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </span>
            </div>
          </button>

          {/* Conteúdo expansível */}
          {filaAberta && (
            <div className="border-t border-border p-3">
              {fila.length === 0 ? (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                  Ninguém na fila no momento.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {fila.map((item, idx) => (
                    <div
                      key={item.id}
                      className="group relative flex items-start gap-3 rounded-md border border-border bg-background p-3 transition-shadow hover:shadow-sm"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-info/10 text-xs font-semibold text-info">
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium text-foreground">
                            {item.nome}
                          </p>
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
                              <span className="text-foreground">
                                {item.prefere}
                              </span>
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
          )}
        </div>

        {/* TOOLBAR DA AGENDA */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
          {/* Esquerda: navegação por data */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md border border-border bg-background">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Dia anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="border-l border-r border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted h-8"
              >
                Hoje
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Próximo dia"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="relative">
              <CalendarIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="h-8 w-[120px] pl-8 text-xs"
              />
            </div>

            <span className="hidden text-sm font-medium text-foreground md:inline">
              Quarta-feira, 22/04/2026
            </span>
          </div>

          {/* Direita: filtros e visualização */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Profissional</span>
              <Select value={profissional} onValueChange={setProfissional}>
                <SelectTrigger className="h-8 w-[180px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {profissionais.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-xs">
                      {p.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Visualizar</span>
              <Select value={diasView} onValueChange={setDiasView}>
                <SelectTrigger className="h-8 w-[120px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {visualizacoes.map((v) => (
                    <SelectItem key={v.value} value={v.value} className="text-xs">
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* PLACEHOLDER DA AGENDA — não mexer ainda */}
        <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center shadow-sm">
          <CalendarIcon className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-foreground">
            Área da grade de horários
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            A agenda em si não foi alterada — esta é apenas a nova organização do
            cabeçalho, fila de espera e toolbar.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
