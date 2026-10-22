import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Clock, ExternalLink, MapPin, Upload } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const;

// De 05:00 a 23:30, de 30 em 30 minutos
const horas = Array.from({ length: 38 }, (_, i) => {
  const min = 5 * 60 + i * 30;
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${min % 60 === 0 ? "00" : "30"}`;
});

// Planos desta conta (exemplo; o sistema real traz só os planos do próprio salão)
const planosDaConta = ["Clube do Corte", "Corte + Barba", "Plano Especial"];

type Perfil = {
  nome: string;
  endereco: string;
  dias: string[];
  abre: string;
  fecha: string;
  video: string;
  termos: string;
  destaque: string;
  descricao: string;
};

const perfilInicial: Perfil = {
  nome: "Frizzar",
  endereco: "Ubaldino do Amaral, 1756, Centro",
  dias: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  abre: "09:00",
  fecha: "18:00",
  video: "https://youtu.be/iJxtycU2_Xg",
  termos: "",
  destaque: "Plano Especial",
  descricao:
    "Clube Frizzar - Nosso objetivo é deixar você sempre alinhado e com o visual em dia, com cortes e barba ilimitados todo mês.",
};

const ehLink = (v: string) => /^https?:\/\/\S+\.\S+/.test(v);

// "Seg a Sáb", "Ter, Qui e Sáb" ou "Todos os dias"
const resumoDias = (ds: string[]) => {
  const ix = ds.map((d) => dias.indexOf(d as (typeof dias)[number])).sort((a, b) => a - b);
  if (ix.length === 0) return "Nenhum dia";
  if (ix.length === 7) return "Todos os dias";
  const seguidos = ix.every((v, i) => i === 0 || v === ix[i - 1] + 1);
  if (seguidos && ix.length > 2) return `${dias[ix[0]]} a ${dias[ix[ix.length - 1]]}`;
  const nomes = ix.map((i) => dias[i]);
  return nomes.length === 1 ? nomes[0] : `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`;
};

const campo =
  "h-10 w-full rounded-lg border border-info/50 bg-card px-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:border-info/60 focus:ring-2 focus:ring-info/40";

function Secao({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="rounded-xl border border-border bg-card p-4">
      <h2 className="mb-3 text-base font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Campo({
  label,
  className,
  erro,
  children,
}: {
  label: string;
  className?: string;
  erro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid min-w-0 content-start gap-0.5", className)}>
      <label className="text-[13px] font-semibold text-foreground">{label}</label>
      {children}
      {erro && <p className="text-xs text-destructive">{erro}</p>}
    </div>
  );
}

export default function PaginaPlanos() {
  const { toast } = useToast();
  const [aulaOpen, setAulaOpen] = useState(false);
  const [salvo, setSalvo] = useState<Perfil>(perfilInicial);
  const [perfil, setPerfil] = useState<Perfil>(perfilInicial);
  const [logo, setLogo] = useState<string | null>(null);
  const [capa, setCapa] = useState<string | null>(null);
  const [logoSalvo, setLogoSalvo] = useState<string | null>(null);
  const [capaSalva, setCapaSalva] = useState<string | null>(null);

  // Painel do horário: edita um rascunho e só vale ao confirmar
  const [horarioAberto, setHorarioAberto] = useState(false);
  const [rascunho, setRascunho] = useState({ dias: perfil.dias, abre: perfil.abre, fecha: perfil.fecha });
  const [destaqueAberto, setDestaqueAberto] = useState(false);

  const set = <K extends keyof Perfil>(k: K, v: Perfil[K]) => setPerfil((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (horarioAberto) setRascunho({ dias: perfil.dias, abre: perfil.abre, fecha: perfil.fecha });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [horarioAberto]);

  const sujo = useMemo(
    () => JSON.stringify(perfil) !== JSON.stringify(salvo) || logo !== logoSalvo || capa !== capaSalva,
    [perfil, salvo, logo, capa, logoSalvo, capaSalva],
  );

  const erroVideo = perfil.video && !ehLink(perfil.video) ? "Use o link completo, começando com https://" : "";
  const erroTermos = perfil.termos && !ehLink(perfil.termos) ? "Use o link completo, começando com https://" : "";

  const horarioTexto = `${resumoDias(perfil.dias)} · ${perfil.abre} às ${perfil.fecha}`;

  const salvar = () => {
    if (erroVideo || erroTermos) {
      toast({ title: "Corrija os links destacados", variant: "destructive" });
      return;
    }
    setSalvo(perfil);
    setLogoSalvo(logo);
    setCapaSalva(capa);
    toast({ title: "Página de planos salva" });
  };

  const trocarImagem = (arquivo: File | undefined, destino: "logo" | "capa") => {
    if (!arquivo) return;
    const url = URL.createObjectURL(arquivo);
    destino === "logo" ? setLogo(url) : setCapa(url);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-0">
        {/* HEADER (fixo ao rolar) */}
        <div className="sticky top-0 z-20 -mt-3 bg-background pb-3 pt-3 sm:-mt-5 sm:pt-5">
          <div className="flex flex-row flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold leading-none tracking-tight text-foreground sm:text-2xl">
                Página de planos
              </h1>
              <AulaButton onOpen={() => setAulaOpen(true)} />
            </div>
            <span aria-hidden="true" className="inline-block h-6 w-px bg-border" />
            <button
              type="button"
              onClick={salvar}
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg bg-foreground px-4 text-sm font-semibold text-background"
            >
              Salvar alterações
            </button>
            {sujo && <span className="text-xs text-muted-foreground">Alterações não salvas</span>}
          </div>
        </div>

        <div className="mt-1 grid grid-cols-1 gap-4 pb-12 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex flex-col gap-4">
            <Secao id="imagens" title="Imagens">
              <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-foreground text-[11px] font-bold tracking-[0.08em] text-background">
                    {logo ? <img src={logo} alt="Logo" className="h-full w-full object-cover" /> : "FRIZZAR."}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold">Logo</p>
                    <p className="mb-1.5 mt-0.5 text-xs text-muted-foreground">600 × 600 px</p>
                    <label className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-info hover:underline">
                      <Upload className="h-4 w-4" /> Trocar
                      <input type="file" accept="image/*" hidden onChange={(e) => trocarImagem(e.target.files?.[0], "logo")} />
                    </label>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="mb-1.5 flex items-baseline justify-between gap-2">
                    <p className="text-[13px] font-semibold">
                      Capa <span className="font-normal text-muted-foreground">· 1600 × 600 px</span>
                    </p>
                    <label className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-info hover:underline">
                      <Upload className="h-4 w-4" /> Enviar capa
                      <input type="file" accept="image/*" hidden onChange={(e) => trocarImagem(e.target.files?.[0], "capa")} />
                    </label>
                  </div>
                  <div className="flex h-24 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/40 text-[13px] text-muted-foreground">
                    {capa ? <img src={capa} alt="Capa" className="h-full w-full object-cover" /> : "Nenhuma capa enviada"}
                  </div>
                </div>
              </div>
            </Secao>

            <Secao id="perfil" title="Perfil">
              <div className="grid grid-cols-12 gap-3">
                <Campo label="Nome" className="col-span-12 md:col-span-4">
                  <input className={campo} value={perfil.nome} onChange={(e) => set("nome", e.target.value)} />
                </Campo>
                <Campo label="Endereço" className="col-span-12 md:col-span-8">
                  <input className={campo} value={perfil.endereco} onChange={(e) => set("endereco", e.target.value)} />
                </Campo>

                <Campo label="Horário de funcionamento" className="col-span-12 md:col-span-4">
                  <Popover open={horarioAberto} onOpenChange={setHorarioAberto}>
                    <PopoverTrigger asChild>
                      <button type="button" className={cn(campo, "flex items-center justify-between gap-2 text-left")}>
                        <span className="truncate">{horarioTexto}</span>
                        <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-80 p-0">
                      <div className="px-4 py-3">
                        <p className="mb-2.5 text-center text-sm font-semibold text-foreground">Dias de funcionamento</p>
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          {dias.map((d) => {
                            const ativo = rascunho.dias.includes(d);
                            return (
                              <button
                                key={d}
                                type="button"
                                aria-pressed={ativo}
                                onClick={() =>
                                  setRascunho((r) => ({
                                    ...r,
                                    dias: (ativo ? r.dias.filter((x) => x !== d) : [...r.dias, d]).sort(
                                      (a, b) => dias.indexOf(a as (typeof dias)[number]) - dias.indexOf(b as (typeof dias)[number]),
                                    ),
                                  }))
                                }
                                className={cn(
                                  "flex h-9 w-9 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors",
                                  ativo
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-border bg-background text-muted-foreground hover:bg-muted",
                                )}
                              >
                                {d}
                              </button>
                            );
                          })}
                        </div>
                        {rascunho.dias.length === 0 && (
                          <p className="mt-2 text-center text-xs text-destructive">Escolha ao menos um dia</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2.5 border-t border-border px-4 py-3">
                        {(["abre", "fecha"] as const).map((k) => (
                          <label key={k} className="grid gap-0.5 text-[13px] font-semibold text-foreground">
                            {k === "abre" ? "Abre às" : "Fecha às"}
                            <select
                              value={rascunho[k]}
                              onChange={(e) => setRascunho((r) => ({ ...r, [k]: e.target.value }))}
                              className={cn(campo, "cursor-pointer font-normal")}
                            >
                              {horas.map((h) => (
                                <option key={h}>{h}</option>
                              ))}
                            </select>
                          </label>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 border-t border-border p-3">
                        <button
                          type="button"
                          onClick={() => setRascunho({ dias: perfilInicial.dias, abre: perfilInicial.abre, fecha: perfilInicial.fecha })}
                          className="flex-1 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition-colors hover:bg-muted"
                        >
                          Limpar
                        </button>
                        <button
                          type="button"
                          disabled={rascunho.dias.length === 0}
                          onClick={() => {
                            setPerfil((p) => ({ ...p, ...rascunho }));
                            setHorarioAberto(false);
                          }}
                          className="flex-1 rounded-md bg-foreground px-3 py-2 text-xs font-semibold uppercase tracking-wide text-background transition-colors hover:bg-foreground/90 disabled:opacity-40"
                        >
                          Confirmar
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Campo>
                <Campo label="Vídeo de apresentação" className="col-span-12 md:col-span-4" erro={erroVideo}>
                  <input
                    className={cn(campo, erroVideo && "border-destructive focus:border-destructive focus:ring-destructive/30")}
                    value={perfil.video}
                    placeholder="Link do YouTube"
                    onChange={(e) => set("video", e.target.value)}
                  />
                </Campo>
                <Campo label="Termos e regras do clube" className="col-span-12 md:col-span-4" erro={erroTermos}>
                  <input
                    className={cn(campo, erroTermos && "border-destructive focus:border-destructive focus:ring-destructive/30")}
                    value={perfil.termos}
                    placeholder="https://"
                    onChange={(e) => set("termos", e.target.value)}
                  />
                </Campo>

                <Campo label="Plano em destaque" className="col-span-12 md:col-span-4">
                  <Popover open={destaqueAberto} onOpenChange={setDestaqueAberto}>
                    <PopoverTrigger asChild>
                      <button type="button" className={cn(campo, "flex items-center justify-between gap-2 text-left")}>
                        <span className={cn("truncate", !perfil.destaque && "text-muted-foreground")}>
                          {perfil.destaque || "Nenhum"}
                        </span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar plano" />
                        <CommandList>
                          <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                            Nenhum plano encontrado.
                          </CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value="nenhum"
                              onSelect={() => {
                                set("destaque", "");
                                setDestaqueAberto(false);
                              }}
                              className="text-muted-foreground"
                            >
                              Nenhum
                              {!perfil.destaque && <Check className="ml-auto h-4 w-4 text-info" />}
                            </CommandItem>
                            {planosDaConta.map((p) => (
                              <CommandItem
                                key={p}
                                value={p}
                                onSelect={() => {
                                  set("destaque", p);
                                  setDestaqueAberto(false);
                                }}
                              >
                                {p}
                                {perfil.destaque === p && <Check className="ml-auto h-4 w-4 text-info" />}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </Campo>
                <Campo label="Conheça nossos planos" className="col-span-12 md:col-span-8">
                  <div className="relative">
                    <textarea
                      rows={2}
                      maxLength={500}
                      value={perfil.descricao}
                      onChange={(e) => set("descricao", e.target.value)}
                      className={cn(campo, "h-auto min-h-[88px] resize-y py-2.5 leading-relaxed")}
                    />
                    <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-muted-foreground">
                      {perfil.descricao.length}/500
                    </span>
                  </div>
                </Campo>
              </div>
            </Secao>
          </div>

          {/* PRÉVIA DA PÁGINA PÚBLICA */}
          <aside>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:sticky lg:top-[76px]">
              <p className="px-4 pt-3 text-xs text-muted-foreground">Prévia da página</p>
              <div className="mt-2.5 h-20 overflow-hidden bg-muted/50">
                {capa && <img src={capa} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="-mt-[26px] ml-4 flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-xl border-[3px] border-card bg-foreground text-[9px] font-bold tracking-[0.06em] text-background">
                {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : "FRIZZAR."}
              </div>
              <div className="px-4 pb-4 pt-1.5">
                <p className="text-base font-bold text-foreground">{perfil.nome || "Nome do negócio"}</p>
                <p className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="mt-px h-3.5 w-3.5 shrink-0" /> {perfil.endereco || "Endereço"}
                </p>
                <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Clock className="mt-px h-3.5 w-3.5 shrink-0" /> {horarioTexto}
                </p>
                {perfil.destaque && (
                  <span className="mt-2.5 inline-block rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                    ★ {perfil.destaque}
                  </span>
                )}
                <p className="mt-2.5 line-clamp-4 text-[13px] text-foreground">{perfil.descricao}</p>
                <button
                  type="button"
                  onClick={() => toast({ title: "Abrindo a página pública" })}
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-info hover:underline"
                >
                  <ExternalLink className="h-4 w-4" /> Visualizar página
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Página de planos"
      />
    </AppLayout>
  );
}
