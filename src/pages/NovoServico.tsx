import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronDown, HelpCircle, X } from "lucide-react";
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
const profissionais = ["Cesar", "Lara", "Bruno", "Marcos"];
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
  todos: boolean;
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
  todos: true,
  profissionais: [],
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
  const [passo, setPasso] = useState<1 | 2>(1);
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
    if (!ok) {
      setPasso(1);
      return;
    }
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
          {/* passos livres: clique para ir e voltar */}
          <div className="mt-2.5 flex items-center gap-2.5" role="tablist">
            {([1, 2] as const).map((n, k) => (
              <div key={n} className="flex items-center gap-2.5">
                {k > 0 && <span className="h-px w-10 bg-border" />}
                <button
                  type="button"
                  role="tab"
                  aria-selected={passo === n}
                  onClick={() => setPasso(n)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-1 py-0.5 text-sm font-semibold transition-colors hover:bg-muted",
                    passo === n ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                      passo === n ? "border-foreground bg-foreground text-background" : n < passo ? "border-border bg-muted text-foreground" : "border-border bg-card",
                    )}
                  >
                    {n < passo ? <Check className="h-3.5 w-3.5" /> : n}
                  </span>
                  {n === 1 ? "Dados" : "Produtos"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2.5 grid items-start gap-3 pb-10 lg:grid-cols-[minmax(0,1fr)_260px]">
          {passo === 1 ? (
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
                      <input
                        className={cn(campo, "pr-9")}
                        inputMode="decimal"
                        placeholder="0"
                        value={f.comissao}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => set("comissao", e.target.value)}
                      />
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
                      <input
                        className={cn(campo, "pr-9")}
                        inputMode="decimal"
                        placeholder="0"
                        value={f.comissaoAssistente}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => set("comissaoAssistente", e.target.value)}
                      />
                    </Prefixo>
                  </Campo>
                  <div className="col-span-12 flex items-center md:col-span-9">
                    <Opcao label="Preço varia" ajuda={'O preço é um valor inicial. O cliente vê "a partir de" e o valor final pode mudar na comanda.'} valor={f.varia} onChange={(v) => set("varia", v)} />
                  </div>
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
                  <Campo label="Moedas Frizzar" ajuda="Moedas que o cliente ganha ao fazer este serviço." className="col-span-12 md:col-span-4">
                    <input type="number" min={0} className={campo} placeholder="0" value={f.moedas} onFocus={(e) => e.target.select()} onChange={(e) => set("moedas", e.target.value)} />
                  </Campo>
                  <Campo label="Pontos da assinatura" ajuda="Quantos pontos este serviço consome do plano de assinatura do cliente." className="col-span-12 md:col-span-4">
                    <input type="number" min={0} className={campo} placeholder="0" value={f.pontos} onFocus={(e) => e.target.select()} onChange={(e) => set("pontos", e.target.value)} />
                  </Campo>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-7 gap-y-1">
                  <Opcao label="Permite agendar online" ajuda="O cliente pode escolher este serviço ao agendar pelo site." valor={f.online} onChange={(v) => set("online", v)} />
                  <Opcao label="Todos os profissionais" ajuda="Vincula este serviço a todos os profissionais. Desligado, você escolhe quais." valor={f.todos} onChange={(v) => set("todos", v)} />
                </div>
                {!f.todos && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {profissionais.map((p) => {
                      const on = f.profissionais.includes(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          aria-pressed={on}
                          onClick={() => set("profissionais", on ? f.profissionais.filter((x) => x !== p) : [...f.profissionais, p])}
                          className={cn(
                            "h-[34px] rounded-full border px-3.5 text-[13px] font-semibold transition-colors",
                            on ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:bg-muted",
                          )}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          ) : (
            <section className="min-w-0 rounded-xl border border-border bg-card p-3.5">
              <p className={tituloSecao}>
                Produtos usados neste serviço <span className="font-normal normal-case tracking-normal text-muted-foreground">· opcional</span>
              </p>
              <Popover open={prodAberto} onOpenChange={setProdAberto}>
                <PopoverTrigger asChild>
                  <button type="button" className={cn(campo, "flex max-w-[420px] items-center justify-between gap-2 text-left text-muted-foreground/70")}>
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
                <div className="mt-3 rounded-[10px] border border-dashed border-border p-5 text-center text-[13px] text-muted-foreground">
                  Nenhum produto. Busque um produto acima para registrar o que o serviço consome.
                </div>
              ) : (
                <table className="mt-3 w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <th className="px-2 pb-2">Produto</th>
                      <th className="px-2 pb-2">Quantidade</th>
                      <th className="px-2 pb-2 text-right">Custo unitário</th>
                      <th className="px-2 pb-2 text-right">Total</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {f.itens.map((it, k) => (
                      <tr key={it.p} className="border-t border-border">
                        <td className="px-2 py-2">{produtos[it.p].nome}</td>
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
                            className={cn(campo, "h-8 w-[72px] text-[13px]")}
                          />
                        </td>
                        <td className="px-2 py-2 text-right text-muted-foreground">{R(produtos[it.p].custo)}</td>
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
              )}
            </section>
          )}

          {/* RESUMO */}
          <aside className="rounded-xl border border-border bg-card p-3.5 lg:sticky lg:top-4">
            <p className={tituloSecao}>Resumo</p>
            {passo === 1 ? (
              <>
                <div className="flex items-center justify-between py-1 text-sm">
                  <span>Preço</span>
                  <b>
                    {f.varia ? "a partir de " : ""}
                    {R(preco)}
                  </b>
                </div>
                <div className="flex items-center justify-between py-1 text-sm">
                  <span>Comissão</span>
                  <b>{R(com)}</b>
                </div>
                <div className="flex items-center justify-between py-1 text-sm">
                  <span>Custo</span>
                  <b>{R(custo)}</b>
                </div>
                <hr className="my-2.5 border-border" />
                <p className="text-xs text-muted-foreground">Margem do salão</p>
                <p className={cn("text-[26px] font-bold leading-tight", margem < 0 && "text-destructive")}>{R(margem)}</p>
                {preco > 0 && <p className="text-xs text-muted-foreground">{Math.round((margem / preco) * 100)}% do preço</p>}
                {comAss > 0 && <p className="mt-2 text-xs text-muted-foreground">Com assistente: {R(margem - comAss)}</p>}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between py-1 text-sm">
                  <span>Produtos</span>
                  <b>{f.itens.length}</b>
                </div>
                <div className="flex items-center justify-between py-1 text-sm">
                  <span>Custo dos produtos</span>
                  <b>{R(custoProdutos)}</b>
                </div>
                {f.itens.length > 0 && (
                  <button
                    type="button"
                    className="mt-2 text-[13px] font-medium text-info hover:underline"
                    onClick={() => {
                      set("custo", virgula(custoProdutos));
                      toast({ title: "Custo do serviço atualizado" });
                    }}
                  >
                    Usar como custo do serviço
                  </button>
                )}
                <hr className="my-2.5 border-border" />
                <p className="text-xs text-muted-foreground">Serviço</p>
                <p className="text-[15px] font-semibold">{f.nome.trim() || "Serviço sem nome"}</p>
                <p className="text-xs text-muted-foreground">
                  {f.varia ? "a partir de " : ""}
                  {R(preco)} · {fmtTempo(f.tempo)}
                </p>
              </>
            )}
          </aside>
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
