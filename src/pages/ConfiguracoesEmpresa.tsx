import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Clock, HelpCircle, Plus, Trash2, Upload } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/* ------------------------------------------------------------------ dados */

const horas24 = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`);
const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const profissionais = ["Cesar", "Lara", "Bruno", "Marcos"];

const ufs = [
  "Acre", "Alagoas", "Amazonas", "Amapá", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão",
  "Minas Gerais", "Mato Grosso do Sul", "Mato Grosso", "Pará", "Paraíba", "Pernambuco", "Piauí", "Paraná",
  "Rio de Janeiro", "Rio Grande do Norte", "Rondônia", "Roraima", "Rio Grande do Sul", "Santa Catarina", "Sergipe",
  "São Paulo", "Tocantins",
];
const logradouros = ["Rua", "Avenida", "Alameda", "Travessa", "Rodovia", "Chácara", "Colônia", "Condomínio", "Estância", "Estrada", "Fazenda", "Praça", "Sítio"];
const cidades = ["Curitiba", "Londrina", "Maringá", "Cascavel", "Ponta Grossa", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava", "Paranaguá"];
const tributacoes = [
  "Isento de ISS", "Imune", "Não incidência no município", "Não tributável", "Retido", "Tributável dentro do município",
  "Tributável fora do município", "Tributável dentro do município pelo tomador",
];
const exigibilidades = ["Exigível", "Não incidência", "Isenção", "Exportação", "Imunidade", "Suspenso por ação judicial", "Suspenso por ação administrativa"];
const incluso = [
  "Sistema completo Frizzar", "App Gestor", "App Profissional", "Agenda online", "Suporte ao cliente",
  "Até 6 profissionais na agenda", "Frizzar Academy",
];

type Folga = { p: string; i: string; f: string };

type Cfg = {
  nome: string; cnpj: string; completo: boolean; ini: string; fim: string; intervalo: string; fila: boolean;
  lembrete: string; aval: boolean; soServ: boolean;
  maq: boolean; maqProp: boolean; pgComanda: boolean; fechar: boolean; sinal: boolean; sinalPct: string; sinalMin: string; moeda: string;
  preco: boolean; prod: boolean; canc: boolean; atras: boolean; lim: boolean;
  antDias: string; antHoras: string; intervaloOn: string; bloq: string[]; folgas: Folga[];
  m1: string; m2: string; m3: string;
  meml: boolean; mcpf: boolean; mtel: boolean; mmult: boolean; mded: boolean;
  padrao: string; csv: string; cnae: string; catv: string; aliq: string; ttrib: string; exig: string; nbs: string; csn: string; ret: string;
  fin: string; cop: string; cst: string; cct: string; opes: boolean;
  tlog: string; elog: string; enum: string; ecomp: string; cep: string; ebai: string; euf: string; ecid: string;
  mnome: string; memail: string; maniv: string; msenha: string;
};

const inicial: Cfg = {
  nome: "FRIZZAR", cnpj: "30.166.385/0001-22", completo: true, ini: "08:00", fim: "22:00", intervalo: "15 min", fila: true,
  lembrete: "2 horas antes", aval: true, soServ: false,
  maq: false, maqProp: false, pgComanda: true, fechar: true, sinal: false, sinalPct: "30", sinalMin: "30", moeda: "1,00",
  preco: true, prod: false, canc: true, atras: true, lim: false,
  antDias: "", antHoras: "Indefinido", intervaloOn: "1 hora", bloq: [], folgas: [{ p: "Cesar", i: "2026-06-18", f: "2026-06-19" }],
  m1: "Olá @cliente! Lembrando do seu horário na @empresa: @servico com @profissional, hoje às @horario. Qualquer imprevisto, avise por aqui. Sua área do cliente: @areacliente",
  m2: "Oi @cliente, como foi seu @servico com @profissional na @empresa? Avalie em @avaliacao. Sua opinião ajuda muito!",
  m3: "Parabéns, @cliente! A equipe da @empresa deseja um dia incrível e muita alegria. Venha comemorar com a gente!",
  meml: false, mcpf: false, mtel: false, mmult: false, mded: false,
  padrao: "Municipal", csv: "", cnae: "", catv: "", aliq: "", ttrib: "Isento de ISS", exig: "Exigível", nbs: "", csn: "", ret: "Não informado",
  fin: "Normal", cop: "", cst: "", cct: "", opes: false,
  tlog: "Avenida", elog: "", enum: "", ecomp: "", cep: "", ebai: "", euf: "Paraná", ecid: "",
  mnome: "Lara", memail: "lara@frizzar.com.br", maniv: "", msenha: "",
};

const abas = [
  ["empresa", "Empresa"],
  ["pagamento", "Pagamento"],
  ["online", "Agendamento online"],
  ["msgs", "Mensagens WhatsApp"],
  ["fiscal", "Dados fiscais"],
  ["plano", "Meu plano"],
  ["meus", "Meus dados"],
] as const;
type AbaId = (typeof abas)[number][0];

const chaves: Record<AbaId, (keyof Cfg)[]> = {
  empresa: ["nome", "cnpj", "completo", "ini", "fim", "intervalo", "fila", "lembrete", "aval", "soServ"],
  pagamento: ["maq", "maqProp", "pgComanda", "fechar", "sinal", "sinalPct", "sinalMin", "moeda"],
  online: ["preco", "prod", "canc", "atras", "lim", "antDias", "antHoras", "intervaloOn", "bloq", "folgas"],
  msgs: ["m1", "m2", "m3"],
  fiscal: [
    "meml", "mcpf", "mtel", "mmult", "mded", "padrao", "csv", "cnae", "catv", "aliq", "ttrib", "exig", "nbs", "csn", "ret",
    "fin", "cop", "cst", "cct", "opes", "tlog", "elog", "enum", "ecomp", "cep", "ebai", "euf", "ecid",
  ],
  plano: [],
  meus: ["mnome", "memail", "maniv", "msenha"],
};

const amostra: Record<string, string> = {
  "@empresa": "Frizzar", "@cliente": "Maria", "@profissional": "Cesar", "@horario": "15:30", "@servico": "Corte",
  "@areacliente": "frizzar.com.br/cliente", "@avaliacao": "frizzar.com.br/avaliar",
};

const dataBR = (v: string) => (v ? v.split("-").reverse().join("/") : "");

/* ------------------------------------------------------------------ estilos */

const campo =
  "h-10 w-full rounded-lg border border-info/50 bg-card px-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:border-info/60 focus:ring-2 focus:ring-info/40";
const linkAcao = "inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-info hover:underline";
const btnEscuro =
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 text-sm font-semibold text-background";
const subtitulo = "mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-foreground first:mt-0";

function Secao({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      {children}
    </section>
  );
}

function Campo({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("grid min-w-0 content-start gap-0.5", className)}>
      <label className="text-[13px] font-semibold text-foreground">{label}</label>
      {children}
    </div>
  );
}

// Toggle azul, sem moldura, com um "?" que explica a opção
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

const Recuo = ({ children }: { children: React.ReactNode }) => <div className="ml-[46px]">{children}</div>;

/* ------------------------------------------------------------------ página */

export default function ConfiguracoesEmpresa() {
  const { toast } = useToast();
  const [aulaOpen, setAulaOpen] = useState(false);
  const [salvo, setSalvo] = useState<Cfg>(inicial);
  const [c, setC] = useState<Cfg>(inicial);
  const [aba, setAba] = useState<AbaId>(() => {
    const h = window.location.hash.slice(1);
    return (abas.find((a) => a[0] === h)?.[0] ?? "empresa") as AbaId;
  });
  const [horarioAberto, setHorarioAberto] = useState(false);
  const [rascunhoHorario, setRascunhoHorario] = useState({ ini: c.ini, fim: c.fim });
  const [ibs, setIbs] = useState(false);
  const [senha, setSenha] = useState(false);
  const [folga, setFolga] = useState<{ p: string; i: string; f: string } | null>(null);
  const [erroFolga, setErroFolga] = useState("");
  const refs = { m1: useRef<HTMLTextAreaElement>(null), m2: useRef<HTMLTextAreaElement>(null), m3: useRef<HTMLTextAreaElement>(null) };

  const set = <K extends keyof Cfg>(k: K, v: Cfg[K]) => setC((p) => ({ ...p, [k]: v }));
  const txt = (k: keyof Cfg) => ({ value: c[k] as string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => set(k, e.target.value as never) });

  useEffect(() => {
    if (horarioAberto) setRascunhoHorario({ ini: c.ini, fim: c.fim });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [horarioAberto]);

  const irPara = (id: AbaId) => {
    setAba(id);
    window.history.replaceState(null, "", `#${id}`);
  };
  const abaSuja = (id: AbaId) => chaves[id].some((k) => JSON.stringify(c[k]) !== JSON.stringify(salvo[k]));
  const sujo = useMemo(() => JSON.stringify(c) !== JSON.stringify(salvo), [c, salvo]);

  const salvar = () => {
    setSalvo(c);
    toast({ title: "Configurações salvas" });
  };

  const inserirMarca = (k: "m1" | "m2" | "m3", marca: string) => {
    const t = refs[k].current;
    const texto = c[k];
    const i = t?.selectionStart ?? texto.length;
    const j = t?.selectionEnd ?? i;
    const antes = texto.slice(0, i);
    const sep = i > 0 && !/\s$/.test(antes) ? " " : "";
    const novo = `${antes}${sep}${marca} ${texto.slice(j)}`;
    set(k, novo);
    requestAnimationFrame(() => {
      t?.focus();
      const pos = (antes + sep + marca + " ").length;
      t?.setSelectionRange(pos, pos);
    });
  };
  const previa = (t: string) => t.replace(/@\w+/g, (m) => amostra[m] ?? m);

  const salvarFolga = () => {
    if (!folga) return;
    if (!folga.i || !folga.f) return setErroFolga("Informe o início e o fim.");
    if (folga.f < folga.i) return setErroFolga("O fim não pode ser antes do início.");
    set("folgas", [...c.folgas, folga]);
    setFolga(null);
  };

  const mensagens = [
    { k: "m1" as const, titulo: "Lembrete de atendimento", marcas: ["@empresa", "@cliente", "@profissional", "@horario", "@servico", "@areacliente"] },
    { k: "m2" as const, titulo: "Avaliação do serviço", marcas: ["@avaliacao", "@empresa", "@cliente", "@profissional", "@horario", "@servico", "@areacliente"] },
    { k: "m3" as const, titulo: "Aniversário", marcas: ["@empresa", "@cliente"] },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col gap-0">
        {/* HEADER */}
        <div className="pb-1">
          <div className="flex flex-row flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold leading-none tracking-tight text-foreground sm:text-2xl">Configurações da empresa</h1>
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

        <div className="mt-3 flex max-w-[980px] flex-col gap-4 pb-12">
          {/* ---------------- EMPRESA ---------------- */}
          {aba === "empresa" && (
            <Secao>
              <div className="grid grid-cols-12 gap-3">
                <Campo label="Nome da empresa *" className="col-span-12 md:col-span-4">
                  <input className={campo} {...txt("nome")} />
                </Campo>
                <Campo label="CNPJ" className="col-span-12 md:col-span-3">
                  <input className={campo} {...txt("cnpj")} />
                </Campo>
                <Campo label="Logotipo" className="col-span-12 md:col-span-5">
                  <div className="flex h-10 items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-[7px] font-bold tracking-[0.08em] text-background">FRIZZAR.</div>
                    <label className={linkAcao}>
                      <Upload className="h-4 w-4" /> Trocar logotipo
                      <input type="file" accept="image/*" hidden />
                    </label>
                  </div>
                </Campo>
              </div>

              <p className={subtitulo}>Agenda</p>
              <div className="grid grid-cols-12 gap-3">
                <Campo label="Horário da agenda" className="col-span-12 md:col-span-4">
                  <Popover open={horarioAberto} onOpenChange={setHorarioAberto}>
                    <PopoverTrigger asChild>
                      <button type="button" className={cn(campo, "flex items-center justify-between gap-2 text-left")}>
                        <span>
                          {c.ini} às {c.fim}
                        </span>
                        <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-80 p-0">
                      <div className="grid grid-cols-2 gap-2.5 px-4 py-3">
                        {(["ini", "fim"] as const).map((k) => (
                          <label key={k} className="grid gap-0.5 text-[13px] font-semibold text-foreground">
                            {k === "ini" ? "Início" : "Fim"}
                            <select
                              value={rascunhoHorario[k]}
                              onChange={(e) => setRascunhoHorario((r) => ({ ...r, [k]: e.target.value }))}
                              className={cn(campo, "cursor-pointer font-normal")}
                            >
                              {horas24.map((h) => (
                                <option key={h}>{h}</option>
                              ))}
                            </select>
                          </label>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 border-t border-border p-3">
                        <button
                          type="button"
                          onClick={() => setRascunhoHorario({ ini: inicial.ini, fim: inicial.fim })}
                          className="flex-1 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition-colors hover:bg-muted"
                        >
                          Limpar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setC((p) => ({ ...p, ...rascunhoHorario }));
                            setHorarioAberto(false);
                          }}
                          className="flex-1 rounded-md bg-foreground px-3 py-2 text-xs font-semibold uppercase tracking-wide text-background transition-colors hover:bg-foreground/90"
                        >
                          Confirmar
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Campo>
                <Campo label="Intervalo dos horários" className="col-span-12 md:col-span-3">
                  <select className={campo} {...txt("intervalo")}>
                    {["05 min", "10 min", "15 min", "20 min", "30 min", "1 hora"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Campo>
              </div>
              <div className="mt-1.5">
                <Opcao label="Visualização completa" ajuda="Mostra todos os recursos do sistema. Desligado, exibe a versão básica, com menos opções na tela." valor={c.completo} onChange={(v) => set("completo", v)} />
                <Opcao label="Fila de espera" ajuda="Quando o horário está cheio, o cliente pode entrar na fila e é avisado se alguém cancelar." valor={c.fila} onChange={(v) => set("fila", v)} />
              </div>

              <p className={subtitulo}>Atendimento</p>
              <div className="grid grid-cols-12 gap-3">
                <Campo label="Lembrete antes do atendimento" className="col-span-12 md:col-span-4">
                  <select className={campo} {...txt("lembrete")}>
                    {["Não enviar", "2 horas antes", "24 horas antes"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Campo>
              </div>
              <div className="mt-1.5">
                <Opcao label="Avaliação após atendimento" ajuda="Ao fechar a comanda, o cliente recebe no WhatsApp um pedido para avaliar o atendimento." valor={c.aval} onChange={(v) => set("aval", v)} />
                <Opcao label="Só serviços do profissional" ajuda="Na agenda, cada profissional lista apenas os serviços cadastrados para ele." valor={c.soServ} onChange={(v) => set("soServ", v)} />
              </div>
            </Secao>
          )}

          {/* ---------------- PAGAMENTO ---------------- */}
          {aba === "pagamento" && (
            <Secao>
              <p className={subtitulo}>Maquineta</p>
              <Opcao label="Ratear custo da maquineta" ajuda="Divide o custo da maquineta entre quem atendeu na comanda." valor={c.maq} onChange={(v) => set("maq", v)} />
              {c.maq && (
                <Recuo>
                  <Opcao label="Ratear proporcionalmente" ajuda="O rateio segue a proporção do valor de cada profissional na comanda." valor={c.maqProp} onChange={(v) => set("maqProp", v)} />
                </Recuo>
              )}

              <p className={subtitulo}>Pagamento online</p>
              <Opcao label="Pagar a comanda no agendamento online" ajuda="O cliente pode pagar a comanda direto pelo site, ao agendar." valor={c.pgComanda} onChange={(v) => set("pgComanda", v)} />
              {c.pgComanda && (
                <Recuo>
                  <Opcao label="Fechar comanda ao receber pagamento online" ajuda="A comanda é fechada automaticamente quando o pagamento online é confirmado." valor={c.fechar} onChange={(v) => set("fechar", v)} />
                  <Opcao label="Confirmar só com pagamento de sinal" ajuda="O agendamento online só é confirmado depois que o cliente paga o sinal." valor={c.sinal} onChange={(v) => set("sinal", v)} />
                  {c.sinal && (
                    <div className="mt-2 grid grid-cols-12 gap-3">
                      <Campo label="Valor do sinal (%)" className="col-span-12 md:col-span-4">
                        <input type="number" min={0} max={100} className={campo} {...txt("sinalPct")} />
                      </Campo>
                      <Campo label="Expiração do link de pagamento (min)" className="col-span-12 md:col-span-6">
                        <input type="number" min={1} className={campo} {...txt("sinalMin")} />
                      </Campo>
                    </div>
                  )}
                </Recuo>
              )}

              <p className={subtitulo}>Moeda Frizzar</p>
              <div className="grid grid-cols-12 gap-3">
                <Campo label="1 moeda vale (R$)" className="col-span-12 md:col-span-3">
                  <input inputMode="decimal" className={campo} {...txt("moeda")} />
                </Campo>
              </div>
            </Secao>
          )}

          {/* ---------------- AGENDAMENTO ONLINE ---------------- */}
          {aba === "online" && (
            <Secao>
              <p className={subtitulo}>Regras</p>
              <Opcao label="Mostrar preços" ajuda="Exibe o valor de cada serviço no agendamento online." valor={c.preco} onChange={(v) => set("preco", v)} />
              <Opcao label="Incluir produtos no preço" ajuda="Soma ao preço final o valor dos produtos atrelados ao serviço." valor={c.prod} onChange={(v) => set("prod", v)} />
              <Opcao label="Cliente pode cancelar" ajuda="O cliente consegue cancelar o próprio agendamento pelo site." valor={c.canc} onChange={(v) => set("canc", v)} />
              <Opcao label="Bloquear assinantes atrasados" ajuda="Assinantes com mensalidade em atraso não conseguem agendar online." valor={c.atras} onChange={(v) => set("atras", v)} />
              <Opcao label="Limitar clientes com tag limite" ajuda="Clientes marcados com a tag “limite” têm um teto de agendamentos online." valor={c.lim} onChange={(v) => set("lim", v)} />

              <p className={subtitulo}>Antecedência e horários</p>
              <div className="grid grid-cols-12 gap-3">
                <Campo label="Dias de antecedência" className="col-span-12 md:col-span-2">
                  <input type="number" min={0} placeholder="Sem limite" className={campo} {...txt("antDias")} />
                </Campo>
                <Campo label="Horas de antecedência" className="col-span-12 md:col-span-3">
                  <select className={campo} {...txt("antHoras")}>
                    {["Indefinido", "1 hora", "2 horas", "3 horas", "4 horas", "5 horas"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Intervalo dos horários" className="col-span-12 md:col-span-3">
                  <select className={campo} {...txt("intervaloOn")}>
                    {["10 min", "15 min", "20 min", "30 min", "40 min", "1 hora"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Dias bloqueados" className="col-span-12 md:col-span-4">
                  <div className="flex h-10 items-center gap-1">
                    {diasSemana.map((d) => {
                      const on = c.bloq.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          aria-pressed={on}
                          onClick={() => set("bloq", on ? c.bloq.filter((x) => x !== d) : [...c.bloq, d])}
                          className={cn(
                            "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold transition-colors",
                            on ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:bg-muted",
                          )}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </Campo>
              </div>

              <div className="mb-1.5 mt-5 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Folgas programadas</p>
                <button type="button" className={btnEscuro} onClick={() => { setErroFolga(""); setFolga({ p: profissionais[0], i: "", f: "" }); }}>
                  <Plus className="h-4 w-4" /> Nova folga
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <th className="px-2 pb-1.5">Profissional</th>
                    <th className="px-2 pb-1.5">Início</th>
                    <th className="px-2 pb-1.5">Fim</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {c.folgas.map((f, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-2 py-1.5">
                        <span className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">{f.p[0]}</span>
                          {f.p}
                        </span>
                      </td>
                      <td className="px-2 py-1.5">{dataBR(f.i)}</td>
                      <td className="px-2 py-1.5">{dataBR(f.f)}</td>
                      <td className="px-2 py-1.5 text-right">
                        <button type="button" aria-label="Remover folga" onClick={() => set("folgas", c.folgas.filter((_, k) => k !== i))} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-destructive hover:bg-muted">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {c.folgas.length === 0 && <p className="mt-2 text-center text-xs text-muted-foreground">Nenhuma folga programada.</p>}
            </Secao>
          )}

          {/* ---------------- MENSAGENS ---------------- */}
          {aba === "msgs" && (
            <Secao>
              {mensagens.map(({ k, titulo, marcas }) => (
                <div key={k}>
                  <p className={subtitulo}>{titulo}</p>
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12 md:col-span-8">
                      <textarea
                        ref={refs[k]}
                        rows={3}
                        aria-label={`Mensagem de ${titulo}`}
                        value={c[k]}
                        onChange={(e) => set(k, e.target.value)}
                        className={cn(campo, "h-auto min-h-[84px] resize-y py-2.5 leading-relaxed")}
                      />
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">Inserir:</span>
                        {marcas.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => inserirMarca(k, m)}
                            className="inline-flex h-7 items-center rounded-[30px] border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <div className="min-h-[84px] whitespace-pre-wrap rounded-xl rounded-bl-[3px] border border-border bg-muted/50 px-3 py-2.5 text-[13px] leading-snug">
                        {previa(c[k])}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Secao>
          )}

          {/* ---------------- DADOS FISCAIS ---------------- */}
          {aba === "fiscal" && (
            <Secao>
              <p className={subtitulo}>Regras do município</p>
              <Opcao label="Município exige e-mail" ajuda="A nota só é emitida se o cliente tiver e-mail cadastrado." valor={c.meml} onChange={(v) => set("meml", v)} />
              <Opcao label="Município exige CPF" ajuda="A nota só é emitida se o cliente tiver CPF cadastrado." valor={c.mcpf} onChange={(v) => set("mcpf", v)} />
              <Opcao label="Município exige telefone" ajuda="A nota só é emitida se o cliente tiver telefone cadastrado." valor={c.mtel} onChange={(v) => set("mtel", v)} />
              <Opcao label="Permite vários serviços por nota" ajuda="Uma única nota pode listar todos os serviços da comanda." valor={c.mmult} onChange={(v) => set("mmult", v)} />
              <Opcao label="Permite informar deduções" ajuda="Permite abater valores (como materiais) do total tributável do serviço." valor={c.mded} onChange={(v) => set("mded", v)} />

              <p className={subtitulo}>Serviço fiscal padrão</p>
              <div className="grid grid-cols-12 gap-3">
                <Campo label="Padrão fiscal utilizado" className="col-span-12 md:col-span-3">
                  <select className={campo} {...txt("padrao")}>
                    {["Municipal", "Nacional"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Código do serviço" className="col-span-12 md:col-span-3"><input className={campo} {...txt("csv")} /></Campo>
                <Campo label="CNAE" className="col-span-12 md:col-span-3"><input className={campo} {...txt("cnae")} /></Campo>
                <Campo label="Código da atividade (tributação)" className="col-span-12 md:col-span-3"><input className={campo} {...txt("catv")} /></Campo>
                <Campo label="Alíquota do ISS (%)" className="col-span-12 md:col-span-2"><input inputMode="decimal" className={campo} {...txt("aliq")} /></Campo>
                <Campo label="Tipo de tributação" className="col-span-12 md:col-span-4">
                  <select className={campo} {...txt("ttrib")}>
                    {tributacoes.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Exigibilidade" className="col-span-12 md:col-span-3">
                  <select className={campo} {...txt("exig")}>
                    {exigibilidades.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Código NBS" className="col-span-12 md:col-span-3"><input className={campo} {...txt("nbs")} /></Campo>
                <Campo label="Código do serviço nacional" className="col-span-12 md:col-span-3"><input className={campo} {...txt("csn")} /></Campo>
                <Campo label="Responsável pela retenção" className="col-span-12 md:col-span-3">
                  <select className={campo} {...txt("ret")}>
                    {["Não informado", "Tomador", "Intermediário"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Campo>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Reforma tributária (IBS / CBS)</p>
                <button type="button" className={linkAcao} onClick={() => setIbs((v) => !v)}>
                  {ibs ? "Recolher" : "Mostrar campos"}
                </button>
              </div>
              {ibs && (
                <div className="mt-2">
                  <div className="grid grid-cols-12 gap-3">
                    <Campo label="Finalidade da NFS-e" className="col-span-12 md:col-span-3">
                      <select className={campo} {...txt("fin")}>
                        {["Normal", "Substituição", "Ajuste"].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </Campo>
                    <Campo label="Código da operação" className="col-span-12 md:col-span-3"><input className={campo} {...txt("cop")} /></Campo>
                    <Campo label="CST" className="col-span-12 md:col-span-3"><input className={campo} {...txt("cst")} /></Campo>
                    <Campo label="CCT" className="col-span-12 md:col-span-3"><input className={campo} {...txt("cct")} /></Campo>
                  </div>
                  <div className="mt-1.5">
                    <Opcao label="Operação pessoal" ajuda="Marque quando a operação for feita para uma pessoa física." valor={c.opes} onChange={(v) => set("opes", v)} />
                  </div>
                </div>
              )}

              <p className={subtitulo}>Endereço fiscal padrão</p>
              <div className="grid grid-cols-12 gap-3">
                <Campo label="Tipo" className="col-span-12 md:col-span-2">
                  <select className={campo} {...txt("tlog")}>
                    {logradouros.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Endereço" className="col-span-12 md:col-span-5"><input className={campo} {...txt("elog")} /></Campo>
                <Campo label="Nº" className="col-span-12 md:col-span-2"><input className={campo} {...txt("enum")} /></Campo>
                <Campo label="Complemento" className="col-span-12 md:col-span-3"><input className={campo} {...txt("ecomp")} /></Campo>
                <Campo label="CEP" className="col-span-12 md:col-span-2"><input inputMode="numeric" placeholder="00000-000" className={campo} {...txt("cep")} /></Campo>
                <Campo label="Bairro" className="col-span-12 md:col-span-4"><input className={campo} {...txt("ebai")} /></Campo>
                <Campo label="Estado" className="col-span-12 md:col-span-3">
                  <select className={campo} {...txt("euf")}>
                    {ufs.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Cidade" className="col-span-12 md:col-span-3">
                  <input list="cidades-fiscal" placeholder="Digite para buscar" className={campo} {...txt("ecid")} />
                  <datalist id="cidades-fiscal">
                    {cidades.map((o) => (
                      <option key={o} value={o} />
                    ))}
                  </datalist>
                </Campo>
              </div>
            </Secao>
          )}

          {/* ---------------- MEU PLANO ---------------- */}
          {aba === "plano" && (
            <Secao>
              <div className="grid items-start gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
                <div>
                  <b className="text-lg font-bold">Essencial</b>
                  <div className="mt-1">
                    <span className="text-[26px] font-bold">R$ 1.368,00</span>
                    <small className="text-[13px] text-muted-foreground"> / ano</small>
                  </div>
                  <small className="mt-0.5 block text-[13px] text-muted-foreground">equivale a R$ 114,00 por mês</small>
                </div>
                <ul className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  {incluso.map((x) => (
                    <li key={x} className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-info" /> {x}
                    </li>
                  ))}
                </ul>
              </div>
              <p className={subtitulo}>Mensalidades</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <th className="px-2 pb-1.5">Vencimento</th>
                    <th className="px-2 pb-1.5">Status</th>
                    <th className="px-2 pb-1.5">Pagamento</th>
                  </tr>
                </thead>
              </table>
              <p className="mt-2.5 border-t border-border pt-3 text-center text-xs text-muted-foreground">Sem mensalidades para listar.</p>
            </Secao>
          )}

          {/* ---------------- MEUS DADOS ---------------- */}
          {aba === "meus" && (
            <Secao>
              <div className="grid grid-cols-12 gap-3">
                <Campo label="Nome *" className="col-span-12 md:col-span-4"><input className={campo} {...txt("mnome")} /></Campo>
                <Campo label="E-mail *" className="col-span-12 md:col-span-5"><input type="email" className={campo} {...txt("memail")} /></Campo>
                <Campo label="Aniversário" className="col-span-12 md:col-span-3"><input type="date" className={campo} {...txt("maniv")} /></Campo>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  className={linkAcao}
                  onClick={() => {
                    if (senha) set("msenha", "");
                    setSenha((v) => !v);
                  }}
                >
                  {senha ? "Cancelar alteração de senha" : "Alterar senha"}
                </button>
              </div>
              {senha && (
                <div className="mt-2 grid grid-cols-12 gap-3">
                  <Campo label="Nova senha" className="col-span-12 md:col-span-4">
                    <input type="password" autoComplete="new-password" className={campo} {...txt("msenha")} />
                  </Campo>
                </div>
              )}
            </Secao>
          )}
        </div>
      </div>

      {/* ---------------- NOVA FOLGA ---------------- */}
      <Dialog open={!!folga} onOpenChange={(o) => !o && setFolga(null)}>
        <DialogContent className="max-w-[460px] gap-0 p-0">
          {folga && (
            <>
              <DialogHeader className="border-b border-border px-5 py-4">
                <DialogTitle className="text-base font-semibold">Nova folga</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 px-5 py-4">
                <Campo label="Profissional">
                  <select className={campo} value={folga.p} onChange={(e) => setFolga({ ...folga, p: e.target.value })}>
                    {profissionais.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </Campo>
                <div className="grid grid-cols-2 gap-3">
                  <Campo label="Início">
                    <input type="date" className={campo} value={folga.i} onChange={(e) => setFolga({ ...folga, i: e.target.value, f: folga.f || e.target.value })} />
                  </Campo>
                  <Campo label="Fim">
                    <input type="date" className={campo} value={folga.f} onChange={(e) => setFolga({ ...folga, f: e.target.value })} />
                  </Campo>
                </div>
                {erroFolga && <p className="text-xs text-destructive">{erroFolga}</p>}
              </div>
              <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
                <button type="button" onClick={() => setFolga(null)} className="h-8 rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted">
                  Cancelar
                </button>
                <button type="button" onClick={salvarFolga} className={btnEscuro}>
                  <Check className="h-4 w-4" /> Salvar folga
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
        title="Aula - Configurações da empresa"
      />
    </AppLayout>
  );
}
