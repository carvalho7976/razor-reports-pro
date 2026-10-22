import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, CheckCircle2, ChevronDown, HelpCircle, X } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/* ------------------------------------------------------------------ dados */

const categorias = ["Cabelo", "Barba", "Química", "Tratamento", "Unhas", "Estética", "Sobrancelha"];
const profissionais = [
  { nome: "Cesar", iniciais: "CC", cor: "bg-blue-500" },
  { nome: "Lara", iniciais: "LP", cor: "bg-pink-500" },
  { nome: "Bruno", iniciais: "BR", cor: "bg-amber-500" },
  { nome: "Marcos", iniciais: "MM", cor: "bg-emerald-500" },
];
// Produtos desta conta com o último custo (exemplo; o sistema real traz o estoque do próprio salão)
const produtos = [
  { nome: "Creme de barbear", custo: 18 },
  { nome: "Gel fixador", custo: 22 },
  { nome: "Pomada modeladora", custo: 35 },
  { nome: "Shampoo anticaspa", custo: 28 },
  { nome: "Óleo de barba", custo: 30 },
  { nome: "Condicionador", custo: 24 },
  { nome: "Máscara facial", custo: 45 },
];

const tempos = [...Array.from({ length: 11 }, (_, i) => (i + 1) * 5), ...Array.from({ length: 18 }, (_, i) => 60 + i * 15)];
const fmtTempo = (m: number) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, "0") : ""}`);

const R = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const paraNumero = (v: string) => {
  const n = parseFloat(v.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};
const virgula = (n: number) => n.toFixed(2).replace(".", ",");
const semAcento = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type Item = { p: number; q: number };

type Form = {
  nome: string;
  categoria: string;
  tempo: number;
  descricao: string;
  preco: string;
  custo: string;
  naoComissionavel: string;
  varia: boolean;
  comissao: string;
  comissaoAssistente: string;
  retorno: string;
  moedas: string;
  pontos: string;
  online: boolean;
  profissionais: string[];
  itens: Item[];
};

const inicial: Form = {
  nome: "",
  categoria: "Cabelo",
  tempo: 30,
  descricao: "",
  preco: "",
  custo: "",
  naoComissionavel: "",
  varia: false,
  comissao: "",
  comissaoAssistente: "",
  retorno: "",
  moedas: "",
  pontos: "",
  online: true,
  profissionais: profissionais.map((p) => p.nome),
  itens: [],
};

/* ------------------------------------------------------------------ estilos */

const campo =
  "h-9 w-full rounded-lg border border-info/50 bg-card px-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:border-info/60 focus:ring-2 focus:ring-info/40";
const btnEscuro =
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 text-sm font-semibold text-background";
const tituloSecao = "mb-2 text-xs font-semibold uppercase tracking-wide text-foreground";

function Campo({ label, ajuda, className, erro, dica, children }: { label: string; ajuda?: string; className?: string; erro?: string; dica?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={cn("grid min-w-0 content-start gap-0.5", className)}>
      <label className="flex items-center gap-1 text-[12.5px] font-semibold text-foreground">
        {label}
        {ajuda && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" aria-label={ajuda} className="text-muted-foreground hover:text-foreground">
                <HelpCircle className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[240px] text-xs">{ajuda}</TooltipContent>
          </Tooltip>
        )}
      </label>
      {children}
      {erro ? <p className="text-xs text-destructive">{erro}</p> : dica ? <p className="text-xs text-muted-foreground">{dica}</p> : null}
    </div>
  );
}

function Prefixo({ lado, texto, children }: { lado: "esq" | "dir"; texto: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground", lado === "esq" ? "left-3" : "right-3")}>{texto}</span>
    </div>
  );
}

function Opcao({ label, ajuda, valor, onChange }: { label: string; ajuda: string; valor: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex h-[34px] items-center gap-2.5">
      <label className="flex cursor-pointer items-center gap-2.5 text-sm">
        <Switch checked={valor} onCheckedChange={onChange} aria-label={label} />
        {label}
      </label>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" aria-label={ajuda} className="text-muted-foreground hover:text-foreground">
            <HelpCircle className="h-[15px] w-[15px]" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[240px] text-xs">{ajuda}</TooltipContent>
      </Tooltip>
    </div>
  );
}

/* ------------------------------------------------------------------ página */

export default function NovoServico() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [aulaOpen, setAulaOpen] = useState(false);
  const [f, setF] = useState<Form>(inicial);
  const [salvo, setSalvo] = useState<Form>(inicial);
  const [erroNome, setErroNome] = useState("");
  const [erroPreco, setErroPreco] = useState("");
  const [catAberta, setCatAberta] = useState(false);
  const [prodAberto, setProdAberto] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  const sujo = useMemo(() => JSON.stringify(f) !== JSON.stringify(salvo), [f, salvo]);

  const preco = paraNumero(f.preco);
  const custo = paraNumero(f.custo);
  const nao = Math.min(preco, paraNumero(f.naoComissionavel));
  const base = Math.max(0, preco - nao);
  const com = (base * paraNumero(f.comissao)) / 100;
  const comAss = (base * paraNumero(f.comissaoAssistente)) / 100;
  const margem = preco - custo - com;
  const custoProdutos = f.itens.reduce((s, i) => s + produtos[i.p].custo * i.q, 0);

  // preço, custo e valor não comissionável: seleciona tudo ao focar e formata ao sair
  const camposReais = (k: "preco" | "custo" | "naoComissionavel") => ({
    value: f[k],
    inputMode: "decimal" as const,
    placeholder: "0,00",
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => e.target.select(),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      set(k, e.target.value);
      if (k === "preco") setErroPreco("");
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value.trim() !== "") set(k, virgula(paraNumero(e.target.value)));
    },
  });

  const salvar = () => {
    let ok = true;
    if (!f.nome.trim()) {
      setErroNome("Informe o nome do serviço.");
      ok = false;
    }
    if (!(preco > 0)) {
      setErroPreco("Informe o preço.");
      ok = false;
    }
    if (!ok) return;
    setSalvo(f);
    toast({ title: "Serviço salvo" });
    navigate("/servicoPesquisa");
  };

  const disponiveis = produtos.map((p, i) => ({ ...p, i })).filter((p) => !f.itens.some((x) => x.p === p.i));

  return (
    <AppLayout>
      <div className="flex flex-col gap-0">
        {/* HEADER */}
        <div className="pb-1">
          <div className="flex flex-row flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold leading-none tracking-tight text-foreground sm:text-2xl">Novo serviço</h1>
              <AulaButton onOpen={() => setAulaOpen(true)} />
            </div>
            <span aria-hidden="true" className="inline-block h-6 w-px bg-border" />
            <button type="button" onClick={salvar} className={btnEscuro}>
              Salvar serviço
            </button>
            {sujo && <span className="text-xs text-muted-foreground">Alterações não salvas</span>}
          </div>
        </div>

        <div className="mt-3 grid w-full max-w-[1280px] items-start gap-3 pb-10 lg:grid-cols-[minmax(0,1fr)_440px]">
          {/* DADOS */}
          <div className="grid min-w-0 gap-3">
            <section className="rounded-xl border border-border bg-card p-3.5">
              <p className={tituloSecao}>Serviço</p>
              <div className="grid grid-cols-12 gap-x-2.5 gap-y-2">
                <Campo label="Nome *" className="col-span-12 md:col-span-6" erro={erroNome}>
                  <input
                    className={cn(campo, erroNome && "border-destructive focus:border-destructive focus:ring-destructive/30")}
                    value={f.nome}
                    placeholder="Ex.: Corte masculino"
                    onChange={(e) => {
                      set("nome", e.target.value);
                      setErroNome("");
                    }}
                  />
                </Campo>
                <Campo label="Categoria" className="col-span-12 md:col-span-3">
                  <Popover open={catAberta} onOpenChange={setCatAberta}>
                    <PopoverTrigger asChild>
                      <button type="button" className={cn(campo, "flex items-center justify-between gap-2 text-left")}>
                        <span className="truncate">{f.categoria}</span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] min-w-[200px] p-0">
                      <Command filter={(value, search) => (semAcento(value).includes(semAcento(search)) ? 1 : 0)}>
                        <CommandInput placeholder="Buscar categoria" />
                        <CommandList>
                          <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">Nenhuma categoria.</CommandEmpty>
                          <CommandGroup>
                            {categorias.map((c) => (
                              <CommandItem
                                key={c}
                                value={c}
                                onSelect={() => {
                                  set("categoria", c);
                                  setCatAberta(false);
                                }}
                              >
                                {c}
                                {f.categoria === c && <Check className="ml-auto h-4 w-4 text-info" />}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </Campo>
                <Campo label="Tempo de serviço" className="col-span-12 md:col-span-3">
                  <select className={campo} value={f.tempo} onChange={(e) => set("tempo", Number(e.target.value))}>
                    {tempos.map((t) => (
                      <option key={t} value={t}>
                        {fmtTempo(t)}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Descrição" className="col-span-12">
                  <input className={campo} value={f.descricao} placeholder="Opcional. O que está incluso no serviço" onChange={(e) => set("descricao", e.target.value)} />
                </Campo>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-3.5">
              <p className={tituloSecao}>Preço e comissão</p>
              <div className="grid grid-cols-12 gap-x-2.5 gap-y-2">
                <Campo label="Preço *" className="col-span-12 sm:col-span-6 md:col-span-3" erro={erroPreco}>
                  <Prefixo lado="esq" texto="R$">
                    <input className={cn(campo, "pl-9", erroPreco && "border-destructive focus:border-destructive focus:ring-destructive/30")} {...camposReais("preco")} />
                  </Prefixo>
                </Campo>
                <Campo label="Custo" className="col-span-12 sm:col-span-6 md:col-span-3">
                  <Prefixo lado="esq" texto="R$">
                    <input className={cn(campo, "pl-9")} {...camposReais("custo")} />
                  </Prefixo>
                </Campo>
                <Campo
                  label="Não comissionável"
                  ajuda="Parte do preço que não entra no cálculo da comissão, como o custo de um produto usado no serviço."
                  className="col-span-12 sm:col-span-6 md:col-span-3"
                >
                  <Prefixo lado="esq" texto="R$">
                    <input className={cn(campo, "pl-9")} {...camposReais("naoComissionavel")} />
                  </Prefixo>
                </Campo>
                <div className="col-span-12 flex items-end sm:col-span-6 md:col-span-3">
                  <Opcao label="Preço varia" ajuda={'O preço é um valor inicial. O cliente vê "a partir de" e o valor final pode mudar na comanda.'} valor={f.varia} onChange={(v) => set("varia", v)} />
                </div>
                <Campo
                  label="Comissão"
                  className="col-span-12 sm:col-span-6 md:col-span-3"
                  dica={
                    f.comissao !== "" ? (
                      <>
                        = <b className="text-foreground">{R(com)}</b> sobre {R(base)}
                      </>
                    ) : nao > 0 ? (
                      <>
                        Calculada sobre <b className="text-foreground">{R(base)}</b>
                      </>
                    ) : undefined
                  }
                >
                  <Prefixo lado="dir" texto="%">
                    <input className={cn(campo, "pr-9")} inputMode="decimal" placeholder="0" value={f.comissao} onFocus={(e) => e.target.select()} onChange={(e) => set("comissao", e.target.value)} />
                  </Prefixo>
                </Campo>
                <Campo
                  label="Comissão assistente"
                  className="col-span-12 sm:col-span-6 md:col-span-3"
                  dica={
                    f.comissaoAssistente !== "" ? (
                      <>
                        = <b className="text-foreground">{R(comAss)}</b> sobre {R(base)}
                      </>
                    ) : undefined
                  }
                >
                  <Prefixo lado="dir" texto="%">
                    <input className={cn(campo, "pr-9")} inputMode="decimal" placeholder="0" value={f.comissaoAssistente} onFocus={(e) => e.target.select()} onChange={(e) => set("comissaoAssistente", e.target.value)} />
                  </Prefixo>
                </Campo>
                <Campo label="Moedas Frizzar" ajuda="Moedas que o cliente ganha ao fazer este serviço." className="col-span-12 sm:col-span-6 md:col-span-3">
                  <input type="number" min={0} className={campo} placeholder="0" value={f.moedas} onFocus={(e) => e.target.select()} onChange={(e) => set("moedas", e.target.value)} />
                </Campo>
                <Campo label="Pontos da assinatura" ajuda="Quantos pontos este serviço consome do plano de assinatura do cliente." className="col-span-12 sm:col-span-6 md:col-span-3">
                  <input type="number" min={0} className={campo} placeholder="0" value={f.pontos} onFocus={(e) => e.target.select()} onChange={(e) => set("pontos", e.target.value)} />
                </Campo>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1 rounded-[10px] bg-muted/60 px-3 py-2 text-[13px] leading-5 text-muted-foreground">
                <div>
                  Margem do salão{" "}
                  <b className={cn("font-semibold", margem < 0 ? "text-destructive" : "text-foreground")}>{R(margem)}</b>
                  {preco > 0 && <span> · {Math.round((margem / preco) * 100)}%</span>}
                </div>
                {comAss > 0 && (
                  <span>
                    Com assistente <b className="font-semibold text-foreground">{R(margem - comAss)}</b>
                  </span>
                )}
                {f.varia && (
                  <span>
                    Preço mostrado como <b className="font-semibold text-foreground">a partir de</b>
                  </span>
                )}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-3.5">
              <p className={tituloSecao}>Retorno e disponibilidade</p>
              <div className="grid grid-cols-12 gap-x-2.5 gap-y-2">
                <Campo label="Previsão de retorno" ajuda="Em quantos dias o cliente costuma voltar. Usado nos lembretes de retorno." className="col-span-12 md:col-span-4">
                  <Prefixo lado="dir" texto="dias">
                    <input type="number" min={0} className={cn(campo, "pr-11")} placeholder="Sem previsão" value={f.retorno} onFocus={(e) => e.target.select()} onChange={(e) => set("retorno", e.target.value)} />
                  </Prefixo>
                </Campo>
                <div className="col-span-12 flex flex-wrap items-end gap-x-7 gap-y-1 md:col-span-8">
                  <Opcao label="Permite agendar online" ajuda="O cliente pode escolher este serviço ao agendar pelo site." valor={f.online} onChange={(v) => set("online", v)} />
                  <Opcao
                    label="Todos os profissionais"
                    ajuda="Vincula este serviço a todos os profissionais. Desligado, você escolhe quais."
                    valor={f.profissionais.length === profissionais.length}
                    onChange={(v) => set("profissionais", v ? profissionais.map((p) => p.nome) : [])}
                  />
                </div>
              </div>
              <p className="mb-1.5 mt-2.5 text-xs text-muted-foreground">Profissionais que fazem este serviço</p>
              <div className="flex flex-wrap gap-2">
                {profissionais.map((p) => {
                  const on = f.profissionais.includes(p.nome);
                  return (
                    <button
                      key={p.nome}
                      type="button"
                      aria-pressed={on}
                      onClick={() => set("profissionais", on ? f.profissionais.filter((x) => x !== p.nome) : [...f.profissionais, p.nome])}
                      className={cn(
                        "flex min-w-[72px] flex-col items-center gap-1.5 rounded-[10px] border p-2 transition",
                        on ? "border-info bg-info/5" : "border-border bg-card opacity-60 hover:opacity-100",
                      )}
                    >
                      <span className="relative">
                        <span className={cn("flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm", p.cor)}>{p.iniciais}</span>
                        {on && <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-background fill-info text-white" />}
                      </span>
                      <span className={cn("max-w-[72px] truncate text-[11px] font-medium", on ? "text-foreground" : "text-muted-foreground")}>{p.nome}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* PRODUTOS */}
          <section className="rounded-xl border border-border bg-card p-3.5 lg:sticky lg:top-4">
            <p className={tituloSecao}>
              Produtos usados neste serviço <span className="font-normal normal-case tracking-normal text-muted-foreground">· opcional</span>
            </p>
            <Popover open={prodAberto} onOpenChange={setProdAberto}>
              <PopoverTrigger asChild>
                <button type="button" className={cn(campo, "flex items-center justify-between gap-2 text-left text-muted-foreground/70")}>
                  Adicionar produto
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0">
                <Command filter={(value, search) => (semAcento(value).includes(semAcento(search)) ? 1 : 0)}>
                  <CommandInput placeholder="Buscar produto" />
                  <CommandList>
                    <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                      {disponiveis.length === 0 ? "Todos os produtos já foram adicionados." : "Nenhum produto encontrado."}
                    </CommandEmpty>
                    <CommandGroup>
                      {disponiveis.map((p) => (
                        <CommandItem
                          key={p.i}
                          value={p.nome}
                          onSelect={() => {
                            set("itens", [...f.itens, { p: p.i, q: 1 }]);
                            setProdAberto(false);
                          }}
                        >
                          <span className="flex-1 truncate">{p.nome}</span>
                          <span className="text-muted-foreground">{R(p.custo)}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {f.itens.length === 0 ? (
              <div className="mt-2.5 rounded-[10px] border border-dashed border-border p-4 text-center text-[13px] text-muted-foreground">
                Nenhum produto. Busque um produto acima para registrar o que o serviço consome.
              </div>
            ) : (
              <>
                <table className="mt-2.5 w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <th className="px-2 pb-2">Produto</th>
                      <th className="px-2 pb-2">Qtd</th>
                      <th className="px-2 pb-2 text-right">Total</th>
                      <th className="w-9" />
                    </tr>
                  </thead>
                  <tbody>
                    {f.itens.map((it, k) => (
                      <tr key={it.p} className="border-t border-border">
                        <td className="px-2 py-2">
                          {produtos[it.p].nome}
                          <div className="text-xs text-muted-foreground">{R(produtos[it.p].custo)} cada</div>
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min={1}
                            aria-label="Quantidade"
                            value={it.q}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              const q = Math.max(1, Math.floor(Number(e.target.value)) || 1);
                              set("itens", f.itens.map((x, i) => (i === k ? { ...x, q } : x)));
                            }}
                            className={cn(campo, "h-8 w-[60px] text-[13px]")}
                          />
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums">{R(produtos[it.p].custo * it.q)}</td>
                        <td className="px-2 py-2 text-right">
                          <button
                            type="button"
                            aria-label="Remover"
                            onClick={() => set("itens", f.itens.filter((_, i) => i !== k))}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-2.5 grid gap-1.5 border-t border-border pt-2.5 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Custo total dos produtos</span>
                    <b className="font-semibold text-foreground">{R(custoProdutos)}</b>
                  </div>
                  <button
                    type="button"
                    className="justify-self-start font-medium text-info hover:underline"
                    onClick={() => {
                      set("custo", virgula(custoProdutos));
                      toast({ title: "Custo do serviço atualizado" });
                    }}
                  >
                    Usar como custo do serviço
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Novo serviço"
      />
    </AppLayout>
  );
}
