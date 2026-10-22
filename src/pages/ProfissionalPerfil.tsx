import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Camera, Check, ChevronDown, Clock, HelpCircle, Plus, X } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

/* ------------------------------------------------------------------ dados */

// Serviços desta conta (exemplo; o sistema real traz os serviços do próprio salão)
const catalogo = [
  { id: 1, nome: "Corte Masculino", preco: 45, tempo: 30 },
  { id: 2, nome: "Corte Feminino", preco: 65, tempo: 45 },
  { id: 3, nome: "Barba", preco: 30, tempo: 20 },
  { id: 4, nome: "Hidratação", preco: 80, tempo: 60 },
  { id: 5, nome: "Coloração", preco: 120, tempo: 90 },
  { id: 6, nome: "Escova Progressiva", preco: 200, tempo: 120 },
  { id: 7, nome: "Manicure", preco: 35, tempo: 40 },
  { id: 8, nome: "Pedicure", preco: 40, tempo: 50 },
];

type Vinculo = { id: number; preco: number; tempo: number; comissao: string };
type Intervalo = { i: string; f: string };
type Grupo = { dias: boolean[]; ints: Intervalo[] };

const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const niveis = ["Gerente", "Profissional", "Recepção", "Caixa", "Auxiliar", "Assistente"];
const sexos = ["Feminino", "Masculino", "Outro"];
const logradouros = ["Rua", "Avenida", "Alameda", "Travessa", "Rodovia", "Estrada", "Praça"];
const ufs = ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"];

// Permissões: ligado = o profissional pode. (No sistema antigo eram "Bloquear ..." com checkbox.)
const gruposPerm = [
  {
    titulo: "Agenda",
    itens: [
      ["online", "Aparece no agendamento online", "O cliente pode escolher este profissional ao agendar pelo site."],
      ["agendaInterna", "Aparece na agenda interna", "Desligado, o profissional deixa de ser uma coluna na agenda do salão."],
      ["criar", "Criar agendamentos e folgas", "No app, o profissional pode criar agendamentos e folgas."],
      ["reagendar", "Reagendar", "No app, o profissional pode mudar o horário de um agendamento."],
      ["maisAgend", "Adicionar agendamentos a um agendamento aberto", "Permite incluir mais agendamentos manualmente dentro de um agendamento que já está aberto."],
      ["deletar", "Excluir agendamentos e folgas", "No app, o profissional pode excluir agendamentos e folgas."],
      ["verServicos", "Ver a lista de serviços", "No app, o profissional enxerga a lista de serviços do salão."],
    ],
  },
  {
    titulo: "Comandas",
    itens: [
      ["verComanda", "Ver a comanda do agendamento", "No app, abrir a comanda a partir de um agendamento."],
      ["verLista", "Ver a lista de comandas abertas", "No app, enxergar todas as comandas abertas do salão."],
      ["fechar", "Fechar comanda", "No app, o profissional pode fechar uma comanda."],
      ["incluir", "Incluir itens na comanda", "No app, o profissional pode adicionar itens à comanda."],
      ["editar", "Editar itens da comanda", "No app, o profissional pode alterar ou remover itens da comanda."],
      ["opcoes", "Usar as opções da comanda", "No app, o profissional acessa as opções da comanda (desconto, transferir etc.)."],
    ],
  },
  {
    titulo: "Clientes",
    itens: [
      ["verDados", "Ver dados cadastrais do cliente", "Desligado, os dados do cliente (como telefone) ficam escondidos para este profissional."],
      ["enviarAval", "Enviar avaliação ao cliente", "No app, enviar manualmente o pedido de avaliação."],
      ["enviarLemb", "Enviar lembrete ao cliente", "No app, enviar manualmente o lembrete de agendamento."],
      ["notificar", "Receber e-mail de novo agendamento", "Envia um e-mail ao profissional a cada novo agendamento."],
    ],
  },
] as const;

type PermKey = (typeof gruposPerm)[number]["itens"][number][0];
const todasPerm = gruposPerm.flatMap((g) => g.itens.map((i) => i[0])) as PermKey[];

type Form = {
  nome: string;
  email: string;
  celular: string;
  nivel: string;
  aniversario: string;
  sexo: string;
  cep: string;
  tipoLogradouro: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  parceiro: boolean;
  cnpj: string;
  foto: string;
  servicos: Vinculo[];
  grupos: Grupo[];
  perm: Record<PermKey, boolean>;
};

const permInicial = Object.fromEntries(todasPerm.map((k) => [k, k !== "notificar"])) as Record<PermKey, boolean>;

const abas = [
  ["perfil", "Perfil"],
  ["servicos", "Serviços"],
  ["expediente", "Expediente"],
  ["permissoes", "Permissões"],
] as const;
type AbaId = (typeof abas)[number][0];

const chaves: Record<AbaId, (keyof Form)[]> = {
  perfil: ["nome", "email", "celular", "nivel", "aniversario", "sexo", "cep", "tipoLogradouro", "endereco", "numero", "complemento", "bairro", "cidade", "estado", "parceiro", "cnpj", "foto"],
  servicos: ["servicos"],
  expediente: ["grupos"],
  permissoes: ["perm"],
};

/* ------------------------------------------------------------------ utilitários */

const R = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const paraNumero = (v: string) => {
  const n = parseFloat(v.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};
const virgula = (n: number) => n.toFixed(2).replace(".", ",");
const mins = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const hhmm = (n: number) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
const semAcento = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function nomeDias(ds: boolean[]) {
  const ix = ds.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
  if (!ix.length) return "Nenhum dia";
  if (ix.length === 7) return "Todos os dias";
  const seq = ix.every((v, i) => i === 0 || v === ix[i - 1] + 1);
  if (seq && ix.length > 2) return `${dias[ix[0]]} a ${dias[ix[ix.length - 1]]}`;
  const n = ix.map((i) => dias[i]);
  return n.length === 1 ? n[0] : `${n.slice(0, -1).join(", ")} e ${n[n.length - 1]}`;
}
const horasDoDia = (ints: Intervalo[]) => ints.reduce((s, x) => s + Math.max(0, mins(x.f) - mins(x.i)), 0) / 60;
const fmtHoras = (h: number) => {
  const t = Math.round(h * 2) / 2;
  return `${Number.isInteger(t) ? t : String(t).replace(".", ",")}h`;
};
const duracao = (d: number) => (d >= 60 ? `${Math.floor(d / 60)}h${d % 60 ? String(d % 60).padStart(2, "0") : ""}` : `${d} min`);

const campo =
  "h-10 w-full rounded-lg border border-info/50 bg-card px-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:border-info/60 focus:ring-2 focus:ring-info/40";
const linkAcao = "inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-info hover:underline";
const btnEscuro =
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 text-sm font-semibold text-background";
const subtitulo = "mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-foreground first:mt-0";

function Campo({ label, className, erro, dica, children }: { label: string; className?: string; erro?: string; dica?: string; children: React.ReactNode }) {
  return (
    <div className={cn("grid min-w-0 content-start gap-0.5", className)}>
      <label className="text-[13px] font-semibold text-foreground">{label}</label>
      {children}
      {erro ? <p className="text-xs text-destructive">{erro}</p> : dica ? <p className="text-xs text-muted-foreground">{dica}</p> : null}
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

export default function ProfissionalPerfil() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [aulaOpen, setAulaOpen] = useState(false);

  const inicial = useMemo<Form>(
    () => ({
      nome: searchParams.get("nome") || "",
      email: searchParams.get("email") || "",
      celular: searchParams.get("celular") || "",
      nivel: searchParams.get("funcao") || "Profissional",
      aniversario: "",
      sexo: "",
      cep: "",
      tipoLogradouro: "Rua",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "PR",
      parceiro: false,
      cnpj: "",
      foto: "",
      servicos: [],
      grupos: [
        { dias: [true, true, true, true, true, false, false], ints: [{ i: "09:00", f: "12:00" }, { i: "13:00", f: "18:00" }] },
        { dias: [false, false, false, false, false, true, false], ints: [{ i: "09:00", f: "14:00" }] },
      ],
      perm: permInicial,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [salvo, setSalvo] = useState<Form>(inicial);
  const [f, setF] = useState<Form>(inicial);
  const [aba, setAba] = useState<AbaId>(() => {
    const h = window.location.hash.slice(1);
    return (abas.find((a) => a[0] === h)?.[0] ?? "perfil") as AbaId;
  });
  const [erroNome, setErroNome] = useState("");
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [grupoEdit, setGrupoEdit] = useState<{ idx: number; dias: boolean[]; ints: Intervalo[] } | null>(null);
  const [erroGrupo, setErroGrupo] = useState("");

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  const irPara = (id: AbaId) => {
    setAba(id);
    window.history.replaceState(null, "", `#${id}`);
  };
  const abaSuja = (id: AbaId) => chaves[id].some((k) => JSON.stringify(f[k]) !== JSON.stringify(salvo[k]));
  const sujo = useMemo(() => JSON.stringify(f) !== JSON.stringify(salvo), [f, salvo]);

  // CEP preenche rua, bairro, cidade e estado
  useEffect(() => {
    const d = f.cep.replace(/\D/g, "");
    if (d.length !== 8) return;
    let ativo = true;
    fetch(`https://viacep.com.br/ws/${d}/json/`)
      .then((r) => r.json())
      .then((j) => {
        if (!ativo || j.erro) return;
        setF((p) => ({
          ...p,
          endereco: j.logradouro || p.endereco,
          bairro: j.bairro || p.bairro,
          cidade: j.localidade || p.cidade,
          estado: j.uf || p.estado,
        }));
      })
      .catch(() => undefined);
    return () => {
      ativo = false;
    };
  }, [f.cep]);

  const salvar = () => {
    if (!f.nome.trim()) {
      irPara("perfil");
      setErroNome("Informe o nome.");
      return;
    }
    setSalvo(f);
    toast({ title: "Profissional salvo" });
    navigate("/funcionarioPesquisa");
  };

  /* ---- serviços ---- */
  const disponiveis = catalogo.filter((c) => !f.servicos.some((s) => s.id === c.id));
  const adicionarServico = (id: number) => {
    const c = catalogo.find((x) => x.id === id);
    if (!c) return;
    set("servicos", [...f.servicos, { id, preco: c.preco, tempo: c.tempo, comissao: "" }]);
    setBuscaAberta(false);
  };
  const upServico = (id: number, patch: Partial<Vinculo>) => set("servicos", f.servicos.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  /* ---- expediente ---- */
  const diaOcupado = (k: number) => f.grupos.some((g, i) => i !== grupoEdit?.idx && g.dias[k]);
  const livres = dias.filter((_, k) => !f.grupos.some((g) => g.dias[k]));

  const abrirGrupo = (idx: number) => {
    setErroGrupo("");
    if (idx >= 0) {
      const g = f.grupos[idx];
      setGrupoEdit({ idx, dias: [...g.dias], ints: g.ints.map((x) => ({ ...x })) });
      return;
    }
    const k = dias.findIndex((_, i) => !f.grupos.some((g) => g.dias[i]));
    if (k < 0) return;
    const d = dias.map((_, i) => i === k);
    setGrupoEdit({ idx: -1, dias: d, ints: [{ i: "09:00", f: "18:00" }] });
  };

  const salvarGrupo = () => {
    if (!grupoEdit) return;
    if (!grupoEdit.dias.some(Boolean)) return setErroGrupo("Escolha ao menos um dia.");
    const ints = grupoEdit.ints.filter((x) => x.i && x.f).sort((a, b) => mins(a.i) - mins(b.i));
    if (!ints.length) return setErroGrupo("Informe ao menos um intervalo.");
    for (let n = 0; n < ints.length; n++) {
      if (mins(ints[n].f) <= mins(ints[n].i)) return setErroGrupo("O horário final precisa ser depois do inicial.");
      if (n && mins(ints[n].i) < mins(ints[n - 1].f)) return setErroGrupo("Os intervalos não podem se sobrepor.");
    }
    const g: Grupo = { dias: grupoEdit.dias, ints };
    const lista = grupoEdit.idx < 0 ? [...f.grupos, g] : f.grupos.map((x, i) => (i === grupoEdit.idx ? g : x));
    lista.sort((a, b) => a.dias.indexOf(true) - b.dias.indexOf(true));
    set("grupos", lista);
    setGrupoEdit(null);
  };

  const upInt = (n: number, c: "i" | "f", v: string) =>
    setGrupoEdit((g) => (g ? { ...g, ints: g.ints.map((x, i) => (i === n ? { ...x, [c]: v } : x)) } : g));

  const adicionarInt = () =>
    setGrupoEdit((g) => {
      if (!g) return g;
      const u = g.ints[g.ints.length - 1];
      const ini = u.f && mins(u.f) < 22 * 60 ? u.f : "13:00";
      return { ...g, ints: [...g.ints, { i: ini, f: hhmm(Math.min(23 * 60, mins(ini) + 60)) }] };
    });

  return (
    <AppLayout>
      <div className="flex flex-col gap-0">
        {/* HEADER */}
        <div className="pb-1">
          <div className="flex flex-row flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold leading-none tracking-tight text-foreground sm:text-2xl">{f.nome.trim() || "Novo profissional"}</h1>
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

        <div className="mt-3 max-w-[1040px] pb-12">
          {/* ---------------- PERFIL ---------------- */}
          {aba === "perfil" && (
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
              <section className="rounded-xl border border-border bg-card p-4">
                <div className="grid gap-4 sm:grid-cols-[80px_minmax(0,1fr)]">
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Alterar foto"
                      className="mt-[19px] flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted text-muted-foreground transition hover:border-muted-foreground"
                    >
                      {f.foto ? <img src={f.foto} alt="Foto do profissional" className="h-full w-full object-cover" /> : <Camera className="h-[22px] w-[22px]" />}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const a = e.target.files?.[0];
                        if (a) set("foto", URL.createObjectURL(a));
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-12 gap-3">
                    <Campo label="Nome *" className="col-span-12" erro={erroNome}>
                      <input
                        className={cn(campo, erroNome && "border-destructive focus:border-destructive focus:ring-destructive/30")}
                        value={f.nome}
                        onChange={(e) => {
                          set("nome", e.target.value);
                          setErroNome("");
                        }}
                      />
                    </Campo>
                    <Campo label="E-mail *" className="col-span-12 md:col-span-7">
                      <input type="email" className={campo} value={f.email} onChange={(e) => set("email", e.target.value)} />
                    </Campo>
                    <Campo label="Celular" className="col-span-12 md:col-span-5">
                      <input className={campo} value={f.celular} placeholder="(00) 00000-0000" onChange={(e) => set("celular", e.target.value)} />
                    </Campo>
                    <Campo label="Nível de acesso" className="col-span-12 md:col-span-4">
                      <select className={campo} value={f.nivel} onChange={(e) => set("nivel", e.target.value)}>
                        {niveis.map((n) => (
                          <option key={n}>{n}</option>
                        ))}
                      </select>
                    </Campo>
                    <Campo label="Aniversário" className="col-span-12 md:col-span-4">
                      <input type="date" className={campo} value={f.aniversario} onChange={(e) => set("aniversario", e.target.value)} />
                    </Campo>
                    <Campo label="Sexo" className="col-span-12 md:col-span-4">
                      <select className={campo} value={f.sexo} onChange={(e) => set("sexo", e.target.value)}>
                        <option value="">Selecione</option>
                        {sexos.map((n) => (
                          <option key={n}>{n}</option>
                        ))}
                      </select>
                    </Campo>
                  </div>
                </div>

                <p className={subtitulo}>Endereço</p>
                <div className="grid grid-cols-12 gap-3">
                  <Campo label="CEP" className="col-span-12 md:col-span-3" dica="Preenche rua, bairro e cidade.">
                    <input inputMode="numeric" placeholder="00000-000" className={campo} value={f.cep} onChange={(e) => set("cep", e.target.value)} />
                  </Campo>
                  <Campo label="Tipo" className="col-span-12 md:col-span-2">
                    <select className={campo} value={f.tipoLogradouro} onChange={(e) => set("tipoLogradouro", e.target.value)}>
                      {logradouros.map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </Campo>
                  <Campo label="Endereço" className="col-span-12 md:col-span-5">
                    <input className={campo} value={f.endereco} onChange={(e) => set("endereco", e.target.value)} />
                  </Campo>
                  <Campo label="Nº" className="col-span-12 md:col-span-2">
                    <input className={campo} value={f.numero} onChange={(e) => set("numero", e.target.value)} />
                  </Campo>
                  <Campo label="Complemento" className="col-span-12 md:col-span-4">
                    <input className={campo} value={f.complemento} onChange={(e) => set("complemento", e.target.value)} />
                  </Campo>
                  <Campo label="Bairro" className="col-span-12 md:col-span-3">
                    <input className={campo} value={f.bairro} onChange={(e) => set("bairro", e.target.value)} />
                  </Campo>
                  <Campo label="Cidade" className="col-span-12 md:col-span-3">
                    <input className={campo} value={f.cidade} onChange={(e) => set("cidade", e.target.value)} />
                  </Campo>
                  <Campo label="Estado" className="col-span-12 md:col-span-2">
                    <select className={campo} value={f.estado} onChange={(e) => set("estado", e.target.value)}>
                      {ufs.map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </Campo>
                </div>
              </section>

              <section className="rounded-xl border border-border bg-card p-4">
                <p className={subtitulo}>Parceria</p>
                <Opcao label="Profissional parceiro" ajuda="Parceiro tem CNPJ próprio e não é funcionário do salão." valor={f.parceiro} onChange={(v) => set("parceiro", v)} />
                {f.parceiro && (
                  <Campo label="CNPJ" className="mt-2">
                    <input className={campo} value={f.cnpj} placeholder="00.000.000/0000-00" onChange={(e) => set("cnpj", e.target.value)} />
                  </Campo>
                )}
              </section>
            </div>
          )}

          {/* ---------------- SERVIÇOS ---------------- */}
          {aba === "servicos" && (
            <section className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
                <Campo label="Adicionar serviço" className="w-full max-w-[420px]">
                  <Popover open={buscaAberta} onOpenChange={setBuscaAberta}>
                    <PopoverTrigger asChild>
                      <button type="button" className={cn(campo, "flex items-center justify-between gap-2 text-left text-muted-foreground/70")}>
                        Buscar serviço
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] min-w-[260px] p-0">
                      <Command filter={(value, search) => (semAcento(value).includes(semAcento(search)) ? 1 : 0)}>
                        <CommandInput placeholder="Buscar serviço" />
                        <CommandList>
                          <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                            {disponiveis.length === 0 ? "Todos os serviços já foram adicionados." : "Nenhum serviço encontrado."}
                          </CommandEmpty>
                          <CommandGroup>
                            {disponiveis.map((c) => (
                              <CommandItem key={c.id} value={c.nome} onSelect={() => adicionarServico(c.id)}>
                                <span className="flex-1 truncate">{c.nome}</span>
                                <span className="text-muted-foreground">
                                  {R(c.preco)} · {c.tempo} min
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </Campo>
                {disponiveis.length > 0 && (
                  <button
                    type="button"
                    className={cn(linkAcao, "h-10")}
                    onClick={() => set("servicos", [...f.servicos, ...disponiveis.map((c) => ({ id: c.id, preco: c.preco, tempo: c.tempo, comissao: "" }))])}
                  >
                    Adicionar todos os serviços
                  </button>
                )}
              </div>

              {f.servicos.length === 0 ? (
                <div className="mt-3 rounded-[10px] border border-dashed border-border p-5 text-center text-[13px] text-muted-foreground">
                  Nenhum serviço vinculado. Busque um serviço acima.
                </div>
              ) : (
                <>
                  <table className="mt-4 w-full table-fixed text-sm">
                    <colgroup>
                      <col />
                      <col className="w-[150px]" />
                      <col className="w-[130px]" />
                      <col className="w-[140px]" />
                      <col className="w-12" />
                    </colgroup>
                    <thead>
                      <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <th className="px-3 pb-2.5">Serviço</th>
                        <th className="px-3 pb-2.5">Preço</th>
                        <th className="px-3 pb-2.5">Tempo</th>
                        <th className="px-3 pb-2.5">Comissão</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {f.servicos.map((s) => (
                        <tr key={s.id} className="border-t border-border">
                          <td className="px-3 py-2.5">{catalogo.find((c) => c.id === s.id)?.nome}</td>
                          <td className="px-3 py-2.5">
                            <div className="relative w-full">
                              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">R$</span>
                              <input
                                aria-label="Preço"
                                inputMode="decimal"
                                defaultValue={virgula(s.preco)}
                                key={`p-${s.id}`}
                                onFocus={(e) => e.target.select()}
                                onBlur={(e) => {
                                  upServico(s.id, { preco: paraNumero(e.target.value) });
                                  e.target.value = virgula(paraNumero(e.target.value));
                                }}
                                className={cn(campo, "h-9 pl-9 text-[13px]")}
                              />
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="relative w-full">
                              <input
                                aria-label="Tempo em minutos"
                                type="number"
                                min={5}
                                step={5}
                                value={s.tempo}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => upServico(s.id, { tempo: Math.max(5, Number(e.target.value) || 5) })}
                                className={cn(campo, "h-9 pr-9 text-[13px]")}
                              />
                              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">min</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="relative w-full">
                              <input
                                aria-label="Comissão"
                                type="number"
                                min={0}
                                max={100}
                                placeholder="Padrão"
                                value={s.comissao}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => upServico(s.id, { comissao: e.target.value === "" ? "" : String(Math.min(100, Math.max(0, Number(e.target.value)))) })}
                                className={cn(campo, "h-9 pr-7 text-[13px]")}
                              />
                              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">%</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <button
                              type="button"
                              aria-label="Remover"
                              onClick={() => set("servicos", f.servicos.filter((x) => x.id !== s.id))}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {f.servicos.length} de {catalogo.length} serviços. Comissão vazia usa o padrão do salão.
                  </p>
                </>
              )}
            </section>
          )}

          {/* ---------------- EXPEDIENTE ---------------- */}
          {aba === "expediente" && (
            <section className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-start justify-end gap-3">
                <button type="button" disabled={livres.length === 0} onClick={() => abrirGrupo(-1)} className={cn(btnEscuro, "whitespace-nowrap disabled:opacity-40")}>
                  <Plus className="h-4 w-4" /> Adicionar horário
                </button>
              </div>
              {f.grupos.length === 0 ? (
                <div className="rounded-[10px] border border-dashed border-border p-5 text-center text-[13px] text-muted-foreground">
                  Nenhum horário. Todos os dias ficam de folga. Use “Adicionar horário”.
                </div>
              ) : (
                <div className="grid gap-2.5">
                  {f.grupos.map((g, idx) => (
                    <div
                      key={idx}
                      role="button"
                      tabIndex={0}
                      onClick={() => abrirGrupo(idx)}
                      onKeyDown={(e) => e.key === "Enter" && abrirGrupo(idx)}
                      className="flex cursor-pointer items-center justify-between gap-3.5 rounded-xl border border-border bg-card px-3.5 py-3 text-left transition-colors hover:bg-muted"
                    >
                      <div>
                        <div className="text-[15px] font-semibold">{nomeDias(g.dias)}</div>
                        <div className="mt-0.5 text-sm text-muted-foreground">{g.ints.map((x) => `${x.i} – ${x.f}`).join(" · ")}</div>
                        {g.ints.length > 1 && (
                          <div className="mt-0.5 text-xs font-medium text-info">
                            {g.ints.slice(1).map((x, k) => `Almoço ${g.ints[k].f} – ${x.i}`).join(" · ")}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap text-xs text-muted-foreground">{fmtHoras(horasDoDia(g.ints))} por dia</span>
                        <button
                          type="button"
                          aria-label="Excluir horário"
                          onClick={(e) => {
                            e.stopPropagation();
                            set("grupos", f.grupos.filter((_, i) => i !== idx));
                          }}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {livres.length > 0 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Folga: {livres.length === 1 ? livres[0] : `${livres.slice(0, -1).join(", ")} e ${livres[livres.length - 1]}`}.
                </p>
              )}
            </section>
          )}

          {/* ---------------- PERMISSÕES ---------------- */}
          {aba === "permissoes" && (
            <section className="rounded-xl border border-border bg-card p-4">
              <div className="mb-1 flex items-start justify-end gap-3">
                <div className="flex gap-3.5 whitespace-nowrap">
                  <button type="button" className={linkAcao} onClick={() => set("perm", Object.fromEntries(todasPerm.map((k) => [k, true])) as Record<PermKey, boolean>)}>
                    Liberar tudo
                  </button>
                  <button
                    type="button"
                    className="text-[13px] font-medium text-muted-foreground hover:underline"
                    onClick={() => set("perm", Object.fromEntries(todasPerm.map((k) => [k, false])) as Record<PermKey, boolean>)}
                  >
                    Bloquear tudo
                  </button>
                </div>
              </div>
              {gruposPerm.map((g) => (
                <div key={g.titulo}>
                  <p className={subtitulo}>{g.titulo}</p>
                  {g.itens.map(([k, nome, ajuda]) => (
                    <Opcao key={k} label={nome} ajuda={ajuda} valor={f.perm[k]} onChange={(v) => set("perm", { ...f.perm, [k]: v })} />
                  ))}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>

      {/* ---------------- HORÁRIO DE TRABALHO ---------------- */}
      <Dialog open={!!grupoEdit} onOpenChange={(o) => !o && setGrupoEdit(null)}>
        <DialogContent className="max-w-[520px] gap-0 p-0">
          {grupoEdit && (
            <>
              <DialogHeader className="border-b border-border px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div>
                    <DialogTitle className="text-base font-semibold">Horário de trabalho</DialogTitle>
                    <p className="mt-0.5 text-xs text-muted-foreground">Escolha os dias e os intervalos em que atende. O espaço entre dois intervalos é o almoço.</p>
                  </div>
                </div>
              </DialogHeader>
              <div className="grid gap-4 px-5 py-4">
                <div className="flex flex-wrap gap-1.5">
                  {dias.map((d, k) => {
                    const ocupado = diaOcupado(k);
                    const on = grupoEdit.dias[k];
                    return (
                      <button
                        key={d}
                        type="button"
                        aria-pressed={on}
                        aria-disabled={ocupado}
                        title={ocupado ? "Já tem outro horário" : undefined}
                        onClick={() => !ocupado && setGrupoEdit({ ...grupoEdit, dias: grupoEdit.dias.map((v, i) => (i === k ? !v : v)) })}
                        className={cn(
                          "h-9 w-11 rounded-full border text-xs font-semibold transition-colors",
                          on ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:bg-muted",
                          ocupado && "cursor-not-allowed line-through opacity-30 hover:bg-background",
                        )}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
                <div className="grid gap-2">
                  {grupoEdit.ints.map((x, n) => {
                    const ant = grupoEdit.ints[n - 1];
                    const gap = ant && ant.f && x.i && mins(x.i) > mins(ant.f) ? mins(x.i) - mins(ant.f) : 0;
                    return (
                      <div key={n} className="grid gap-2">
                        {gap > 0 && (
                          <div className="ml-10 flex items-center gap-2 rounded-lg bg-info/10 px-2.5 py-1.5 text-[13px] text-info">
                            Almoço das {ant.f} às {x.i} <b className="font-semibold">({duracao(gap)})</b>
                          </div>
                        )}
                        <div className="grid grid-cols-[32px_minmax(0,1fr)_20px_minmax(0,1fr)_36px] items-center gap-2">
                          <button
                            type="button"
                            aria-label="Excluir intervalo"
                            disabled={grupoEdit.ints.length < 2}
                            onClick={() => setGrupoEdit({ ...grupoEdit, ints: grupoEdit.ints.filter((_, i) => i !== n) })}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive disabled:opacity-30"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <input type="time" aria-label="De" className={cn(campo, "h-[38px] px-2")} value={x.i} onChange={(e) => upInt(n, "i", e.target.value)} />
                          <span className="text-center text-muted-foreground">→</span>
                          <input type="time" aria-label="Até" className={cn(campo, "h-[38px] px-2")} value={x.f} onChange={(e) => upInt(n, "f", e.target.value)} />
                          {n === grupoEdit.ints.length - 1 ? (
                            <button type="button" aria-label="Adicionar intervalo" onClick={adicionarInt} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted">
                              <Plus className="h-4 w-4" />
                            </button>
                          ) : (
                            <span />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {erroGrupo && <p className="text-xs text-destructive">{erroGrupo}</p>}
              </div>
              <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
                <button type="button" onClick={() => setGrupoEdit(null)} className="h-8 rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted">
                  Cancelar
                </button>
                <button type="button" onClick={salvarGrupo} className={btnEscuro}>
                  <Check className="h-4 w-4" /> Salvar horário
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
        title="Aula - Cadastro de profissional"
      />
    </AppLayout>
  );
}
