import { useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Copy,
  Plus,
  Sparkles,
  Trash2,
  Wallet,
  Coins,
  Gift,
  CalendarPlus,
  ShoppingBag,
  History,
  X,
  Check,
} from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cn } from "@/lib/utils";

export type ComandaAgendamento = {
  id: number;
  cliente: string;
  servico: string;
  profissional: string;
  inicio: string;
  fim: string;
  data: string;
  telefone?: string;
};

type Item = {
  id: number;
  descricao: string;
  profissional: string;
  valor: number;
  tipo?: "servico" | "produto" | "pack";
  assinatura?: boolean;
};

type Pagamento = { id: number; forma: string; valor: number };

type Recompra = { id: number; nome: string; intervalo: string; valor: number };

const formasPagamento = [
  "Dinheiro",
  "Pix",
  "Crédito",
  "Débito",
  "Assinatura",
  "Cashback",
];

const recompraSugestoes: Recompra[] = [
  { id: 1, nome: "Pomada Modeladora", intervalo: "comprou há 28 dias", valor: 49 },
  { id: 2, nome: "Shampoo Anticaspa", intervalo: "comprou há 45 dias", valor: 38 },
];

const historicoServicos = [
  { data: "27/04/2026", servico: "Corte Feminino", prof: "Matheus", valor: 0 },
  { data: "27/04/2026", servico: "Design de sobrancelha", prof: "Marcia", valor: 0 },
  { data: "30/03/2026", servico: "Coloração", prof: "Claudia", valor: 180 },
];

const R$ = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function ComandaSheet({
  open,
  onOpenChange,
  agendamento,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  agendamento: ComandaAgendamento | null;
}) {
  const [status, setStatus] = useState("agendado");
  const [obs, setObs] = useState("");
  const [itens, setItens] = useState<Item[]>([
    { id: 1, descricao: agendamento?.servico ?? "Serviço", profissional: agendamento?.profissional ?? "", valor: 0, tipo: "servico", assinatura: true },
    { id: 2, descricao: "Água", profissional: "—", valor: 5, tipo: "produto" },
  ]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [novoPgForma, setNovoPgForma] = useState("");
  const [novoPgValor, setNovoPgValor] = useState("");

  const total = useMemo(() => itens.reduce((s, i) => s + i.valor, 0), [itens]);
  const pago = useMemo(() => pagamentos.reduce((s, p) => s + p.valor, 0), [pagamentos]);
  const resta = Math.max(0, total - pago);

  const removerItem = (id: number) =>
    setItens((prev) => prev.filter((i) => i.id !== id));

  const addPagamento = () => {
    const v = parseFloat(novoPgValor.replace(",", "."));
    if (!novoPgForma || isNaN(v) || v <= 0) return;
    setPagamentos((prev) => [
      ...prev,
      { id: Date.now(), forma: novoPgForma, valor: v },
    ]);
    setNovoPgForma("");
    setNovoPgValor("");
  };

  if (!agendamento) return null;

  const iniciais = agendamento.cliente
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-[920px]"
      >
        {/* Header */}
        <SheetHeader className="flex-row items-center justify-between gap-3 space-y-0 border-b border-border bg-muted/30 px-5 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {iniciais}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <SheetTitle className="truncate text-sm font-semibold leading-tight">
                {agendamento.cliente}
              </SheetTitle>
              <p className="truncate text-[11px] text-muted-foreground">
                {agendamento.servico} · {agendamento.profissional} ·{" "}
                {agendamento.inicio} – {agendamento.fim}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <WhatsAppButton telefone={agendamento.telefone} nome={agendamento.cliente} />
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Copiar link">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" title="Excluir">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Body 2-col */}
        <div className="grid flex-1 grid-cols-1 gap-0 overflow-hidden md:grid-cols-[1fr_320px]">
          {/* Center: comanda */}
          <div className="flex min-h-0 flex-col overflow-y-auto border-r border-border">
            {/* Status / observações compacto */}
            <div className="grid grid-cols-1 gap-3 border-b border-border bg-card px-5 py-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agendado">Agendado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="atendendo">Atendendo</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                    <SelectItem value="faltou">Faltou</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Período</Label>
                <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-xs">
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{agendamento.data} · {agendamento.inicio} – {agendamento.fim}</span>
                </div>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Observações</Label>
                <Textarea
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  placeholder="Ex: alérgico a dipirona, não cortar franja..."
                  className="min-h-[60px] resize-none text-xs"
                />
              </div>
            </div>

            {/* Adicionar item */}
            <div className="border-b border-border px-5 py-3">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Adicionar item</h3>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <Select>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Profissional" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claudia">Claudia</SelectItem>
                    <SelectItem value="matheus">Matheus</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Serviço" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corte">Corte</SelectItem>
                    <SelectItem value="barba">Barba</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Produto" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pomada">Pomada</SelectItem>
                    <SelectItem value="shampoo">Shampoo</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" className="h-9 gap-1 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Adicionar
                </Button>
              </div>
            </div>

            {/* Resumo da comanda */}
            <div className="px-5 py-3">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Resumo da comanda</h3>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs">Editar</Button>
              </div>
              <div className="divide-y divide-border rounded-md border border-border">
                {itens.map((i) => (
                  <div key={i.id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate font-medium">{i.descricao}</p>
                        {i.assinatura && (
                          <Badge variant="secondary" className="h-4 px-1.5 text-[9px] font-medium">Assinatura</Badge>
                        )}
                      </div>
                      <p className="truncate text-[11px] text-muted-foreground">{i.profissional}</p>
                    </div>
                    <span className="font-semibold tabular-nums">{R$(i.valor)}</span>
                    <button
                      onClick={() => removerItem(i.id)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                      aria-label="Remover"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagamento */}
            <div className="border-t border-border bg-muted/20 px-5 py-3">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pagamento</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <Select value={novoPgForma} onValueChange={setNovoPgForma}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Selecione forma..." /></SelectTrigger>
                  <SelectContent>
                    {formasPagamento.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={novoPgValor}
                  onChange={(e) => setNovoPgValor(e.target.value)}
                  placeholder="R$ valor"
                  className="h-9 text-xs"
                />
                <Button size="sm" variant="outline" className="h-9 gap-1 text-xs" onClick={addPagamento}>
                  <Plus className="h-3.5 w-3.5" /> Adicionar
                </Button>
              </div>
              {pagamentos.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {pagamentos.map((p) => (
                    <li key={p.id} className="flex items-center justify-between rounded bg-card px-2 py-1.5 text-xs">
                      <span>{p.forma}</span>
                      <span className="font-semibold tabular-nums">{R$(p.valor)}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-3 space-y-1 border-t border-border pt-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-base font-bold tabular-nums">{R$(total)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Resta</span>
                  <span className="tabular-nums">{R$(resta)}</span>
                </div>
              </div>

              <Button
                className={cn("mt-3 h-10 w-full gap-2 text-sm font-semibold", resta > 0 && "opacity-60")}
                disabled={resta > 0}
              >
                <Check className="h-4 w-4" /> Pagar comanda
              </Button>
            </div>
          </div>

          {/* Right column */}
          <aside className="flex min-h-0 flex-col overflow-y-auto bg-muted/20">
            {/* Cliente resumo */}
            <div className="space-y-3 border-b border-border bg-card px-4 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{agendamento.cliente}</p>
                <Button variant="ghost" size="icon" className="h-7 w-7"><Sparkles className="h-3.5 w-3.5" /></Button>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Assinaturas</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="outline" className="h-5 bg-foreground text-[10px] text-background">TESTE</Badge>
                  <span className="text-[11px] text-muted-foreground">N/A</span>
                </div>
              </div>
              <Button size="sm" variant="default" className="h-8 w-full text-xs">Cobrar avulso</Button>

              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="rounded-md bg-muted/40 p-2">
                  <div className="flex items-center gap-1 text-muted-foreground"><Coins className="h-3 w-3" /> Moedas</div>
                  <p className="mt-1 font-semibold">0</p>
                </div>
                <div className="rounded-md bg-muted/40 p-2">
                  <div className="flex items-center gap-1 text-muted-foreground"><Gift className="h-3 w-3" /> Packs</div>
                  <p className="mt-1 font-semibold">0</p>
                </div>
                <div className="rounded-md bg-muted/40 p-2">
                  <div className="flex items-center gap-1 text-muted-foreground"><Wallet className="h-3 w-3" /> Débitos</div>
                  <p className="mt-1 font-semibold">R$ 0</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-md bg-muted/40 p-2">
                  <p className="text-muted-foreground">Ficha</p>
                  <p className="mt-1 font-semibold">—</p>
                </div>
                <div className="rounded-md bg-muted/40 p-2">
                  <p className="text-muted-foreground">Créditos</p>
                  <p className="mt-1 font-semibold">R$ 0,00</p>
                </div>
              </div>
            </div>

            {/* Sugestões de recompra */}
            <div className="border-b border-border px-4 py-3">
              <div className="mb-2 flex items-center gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5 text-primary" />
                <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground">Sugestões de recompra</h4>
              </div>
              <ul className="space-y-1.5">
                {recompraSugestoes.map((r) => (
                  <li key={r.id} className="flex items-center justify-between rounded-md border border-border bg-card px-2.5 py-2 text-xs">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{r.nome}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{r.intervalo}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold tabular-nums">{R$(r.valor)}</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6"><Plus className="h-3.5 w-3.5" /></Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Próximo agendamento */}
            <div className="border-b border-border px-4 py-3">
              <div className="mb-2 flex items-center gap-1.5">
                <CalendarPlus className="h-3.5 w-3.5 text-primary" />
                <h4 className="text-xs font-semibold uppercase tracking-wide">Oferecer novo agendamento</h4>
              </div>
              <p className="mb-2 text-[11px] text-muted-foreground">Sugestão: em 28 dias com {agendamento.profissional}.</p>
              <Button size="sm" variant="outline" className="h-8 w-full text-xs">Agendar retorno</Button>
            </div>

            {/* Histórico */}
            <div className="px-4 py-3">
              <div className="mb-2 flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-muted-foreground" />
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Última visita</h4>
              </div>
              <ul className="space-y-2">
                {historicoServicos.map((h, idx) => (
                  <li key={idx} className="rounded-md bg-card px-2.5 py-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{h.servico}</span>
                      <span className="text-[11px] font-semibold tabular-nums">{R$(h.valor)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{h.prof}</span>
                      <span>{h.data}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <Button variant="link" size="sm" className="mt-1 h-auto w-full p-0 text-[11px]">Ver mais...</Button>
            </div>
          </aside>
        </div>
      </SheetContent>
    </Sheet>
  );
}