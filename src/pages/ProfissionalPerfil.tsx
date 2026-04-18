import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Clock3, Plus, Scissors, Search, Settings2, Trash2, UserRound } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Dropdown, TextField } from "@/components/FormModal";
import { useToast } from "@/hooks/use-toast";

type TabId = "basicos" | "configuracoes" | "pessoais" | "parceiro";

interface PerfilForm {
  nome: string;
  email: string;
  celular: string;
  funcao: string;
  aniversario: string;
  apelido: string;
  sexo: string;
  estado: string;
  cidade: string;
  parceiro: boolean;
  cnpj: string;
}

interface ServicoDisponivel {
  id: number;
  nome: string;
  preco: string;
  tempo: string;
  comissao: string;
}

interface ExpedienteItem {
  dia: string;
  ativo: boolean;
  inicio: string;
  fim: string;
}

const tabItems: Array<{ id: TabId; label: string }> = [
  { id: "basicos", label: "Dados Básicos" },
  { id: "configuracoes", label: "Configurações" },
  { id: "pessoais", label: "Dados Pessoais" },
  { id: "parceiro", label: "Profissional Parceiro" },
];

const funcaoOptions = [
  { value: "Gerente", label: "Gerente" },
  { value: "Profissional", label: "Profissional" },
  { value: "Recepção", label: "Recepção" },
  { value: "Caixa", label: "Caixa" },
  { value: "Auxiliar", label: "Auxiliar" },
  { value: "Assistente", label: "Assistente" },
];

const sexoOptions = [
  { value: "Feminino", label: "Feminino" },
  { value: "Masculino", label: "Masculino" },
  { value: "Outro", label: "Outro" },
];

const estadoOptions = [
  { value: "PR", label: "Paraná" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "RJ", label: "Rio de Janeiro" },
];

const servicosBase: ServicoDisponivel[] = [
  { id: 1, nome: "Corte masculino", preco: "R$ 60,00", tempo: "00:45", comissao: "40%" },
  { id: 2, nome: "Barba completa", preco: "R$ 35,00", tempo: "00:30", comissao: "35%" },
  { id: 3, nome: "Corte + barba", preco: "R$ 90,00", tempo: "01:10", comissao: "45%" },
  { id: 4, nome: "Hidratação", preco: "R$ 55,00", tempo: "00:40", comissao: "30%" },
  { id: 5, nome: "Pigmentação", preco: "R$ 70,00", tempo: "00:50", comissao: "35%" },
];

const expedienteInicial: ExpedienteItem[] = [
  { dia: "Segunda-feira", ativo: true, inicio: "09:00", fim: "19:00" },
  { dia: "Terça-feira", ativo: true, inicio: "09:00", fim: "19:00" },
  { dia: "Quarta-feira", ativo: true, inicio: "09:00", fim: "19:00" },
  { dia: "Quinta-feira", ativo: true, inicio: "09:00", fim: "19:00" },
  { dia: "Sexta-feira", ativo: true, inicio: "09:00", fim: "20:00" },
  { dia: "Sábado", ativo: true, inicio: "08:00", fim: "17:00" },
  { dia: "Domingo", ativo: false, inicio: "", fim: "" },
];

function buildInitialForm(searchParams: URLSearchParams): PerfilForm {
  return {
    nome: searchParams.get("nome") ?? "",
    email: searchParams.get("email") ?? "",
    celular: searchParams.get("celular") ?? "",
    funcao: searchParams.get("funcao") ?? "Profissional",
    aniversario: "",
    apelido: "",
    sexo: "",
    estado: "PR",
    cidade: "Curitiba",
    parceiro: false,
    cnpj: "",
  };
}

function SectionBlock({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

export default function ProfissionalPerfil() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>("basicos");
  const [form, setForm] = useState<PerfilForm>(() => buildInitialForm(searchParams));
  const [servicosOpen, setServicosOpen] = useState(false);
  const [expedienteOpen, setExpedienteOpen] = useState(false);
  const [servicoBusca, setServicoBusca] = useState("");
  const [servicosPendentes, setServicosPendentes] = useState<number[]>([]);
  const [servicosAdicionados, setServicosAdicionados] = useState<ServicoDisponivel[]>(servicosBase.slice(0, 2));
  const [servicosSelecionados, setServicosSelecionados] = useState<number[]>([]);
  const [expediente, setExpediente] = useState<ExpedienteItem[]>(expedienteInicial);
  const { toast } = useToast();
  const firstSaveRef = useRef(true);

  useEffect(() => {
    setForm(buildInitialForm(searchParams));
  }, [searchParams]);

  useEffect(() => {
    if (firstSaveRef.current) {
      firstSaveRef.current = false;
      return;
    }

    const timeout = window.setTimeout(() => {
      toast({ title: "Alterações salvas automaticamente" });
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [form, toast]);

  const servicosDispFiltrados = useMemo(() => {
    const idsAdicionados = new Set(servicosAdicionados.map((item) => item.id));

    return servicosBase.filter((servico) => {
      if (idsAdicionados.has(servico.id)) return false;
      return servico.nome.toLowerCase().includes(servicoBusca.toLowerCase());
    });
  }, [servicoBusca, servicosAdicionados]);

  const updateForm = <K extends keyof PerfilForm>(field: K, value: PerfilForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleServicoPendente = (id: number) => {
    setServicosPendentes((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const handleAdicionarTodos = () => {
    setServicosPendentes(servicosDispFiltrados.map((servico) => servico.id));
  };

  const handleAdicionarSelecionados = () => {
    if (servicosPendentes.length === 0) return;

    const novos = servicosBase.filter((servico) => servicosPendentes.includes(servico.id));
    setServicosAdicionados((current) => [...current, ...novos]);
    setServicosPendentes([]);
    setServicoBusca("");
  };

  const toggleServicoSelecionado = (id: number) => {
    setServicosSelecionados((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const toggleTodosServicos = () => {
    setServicosSelecionados((current) =>
      current.length === servicosAdicionados.length ? [] : servicosAdicionados.map((servico) => servico.id),
    );
  };

  const updateServico = (id: number, field: keyof Pick<ServicoDisponivel, "preco" | "tempo" | "comissao">, value: string) => {
    setServicosAdicionados((current) =>
      current.map((servico) => (servico.id === id ? { ...servico, [field]: value } : servico)),
    );
  };

  const handleRemoverServicos = () => {
    setServicosAdicionados((current) => current.filter((servico) => !servicosSelecionados.includes(servico.id)));
    setServicosSelecionados([]);
  };

  const updateExpediente = (dia: string, field: keyof ExpedienteItem, value: string | boolean) => {
    setExpediente((current) =>
      current.map((item) => (item.dia === dia ? { ...item, [field]: value } : item)),
    );
  };

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <section className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="bg-gradient-to-r from-primary/15 via-background to-accent/20 px-4 py-6 sm:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-background text-primary shadow-sm">
                  <UserRound className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">{form.nome || "Novo profissional"}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Cadastro com salvamento automático e configurações individuais.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                  {form.funcao}
                </span>
                <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                  {form.email || "Sem email informado"}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border px-4 sm:px-6">
            <div className="flex flex-wrap gap-2 py-3">
              {tabItems.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={active
                      ? "rounded-full border border-primary bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                      : "rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {activeTab === "basicos" && (
          <SectionBlock title="Dados principais" description="Campos essenciais do cadastro do profissional.">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Nome" value={form.nome} onChange={(value) => updateForm("nome", value)} />
              <Dropdown label="Função" value={form.funcao} setValue={(value) => updateForm("funcao", value)} options={funcaoOptions} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Email" value={form.email} onChange={(value) => updateForm("email", value)} />
              <TextField label="Celular" value={form.celular} onChange={(value) => updateForm("celular", value)} placeholder="(00) 00000-0000" />
            </div>
          </SectionBlock>
        )}

        {activeTab === "configuracoes" && (
          <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <SectionBlock title="Permissões" description="Ative rapidamente os acessos operacionais deste profissional.">
              <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground">
                <Checkbox checked />
                <span>Acessar agenda e comandas</span>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground">
                <Checkbox checked={form.funcao === "Gerente"} />
                <span>Visualizar relatórios financeiros</span>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground">
                <Checkbox checked />
                <span>Receber notificações internas</span>
              </label>
            </SectionBlock>

            <SectionBlock title="Ações" description="Configure serviços e expediente sem sair da página.">
              <button
                type="button"
                onClick={() => setServicosOpen(true)}
                className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-4 text-left transition hover:bg-muted"
              >
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Scissors className="h-4 w-4" />
                    Configurar serviços
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Ajuste preço, tempo e comissão por serviço.</p>
                </div>
                <Settings2 className="h-4 w-4 text-muted-foreground" />
              </button>

              <button
                type="button"
                onClick={() => setExpedienteOpen(true)}
                className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-4 text-left transition hover:bg-muted"
              >
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Clock3 className="h-4 w-4" />
                    Configurar expediente
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Defina dias ativos e horários de atendimento.</p>
                </div>
                <Settings2 className="h-4 w-4 text-muted-foreground" />
              </button>
            </SectionBlock>
          </div>
        )}

        {activeTab === "pessoais" && (
          <SectionBlock title="Dados pessoais" description="Informações complementares do profissional.">
            <div className="grid gap-4 md:grid-cols-3">
              <TextField label="Apelido" value={form.apelido} onChange={(value) => updateForm("apelido", value)} />
              <TextField label="Aniversário" value={form.aniversario} onChange={(value) => updateForm("aniversario", value)} placeholder="DD/MM/AAAA" />
              <Dropdown label="Sexo" value={form.sexo} setValue={(value) => updateForm("sexo", value)} options={sexoOptions} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Dropdown label="Estado" value={form.estado} setValue={(value) => updateForm("estado", value)} options={estadoOptions} />
              <TextField label="Cidade" value={form.cidade} onChange={(value) => updateForm("cidade", value)} />
            </div>
          </SectionBlock>
        )}

        {activeTab === "parceiro" && (
          <SectionBlock title="Profissional parceiro" description="Ative quando o profissional atuar como parceiro externo.">
            <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground">
              <Checkbox
                checked={form.parceiro}
                onCheckedChange={(checked) => updateForm("parceiro", checked === true)}
              />
              <span>Este profissional é parceiro</span>
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="CNPJ"
                value={form.cnpj}
                onChange={(value) => updateForm("cnpj", value)}
                disabled={!form.parceiro}
                placeholder="00.000.000/0000-00"
              />
              <TextField label="Email financeiro" value={form.email} onChange={(value) => updateForm("email", value)} />
            </div>
          </SectionBlock>
        )}
      </div>

      <Dialog
        open={servicosOpen}
        onOpenChange={(open) => {
          setServicosOpen(open);
          if (!open) {
            setServicoBusca("");
            setServicosPendentes([]);
          }
        }}
      >
        <DialogContent className="w-[calc(100vw-24px)] max-w-5xl gap-0 overflow-hidden rounded-2xl p-0 [&>button]:hidden">
          <div className="border-b border-border px-4 py-4 sm:px-5">
            <h2 className="text-base font-semibold text-foreground">Serviços vinculados</h2>
            <p className="mt-1 text-sm text-muted-foreground">Adicione os serviços do profissional e ajuste preço, tempo e comissão.</p>
          </div>

          <div className="max-h-[75vh] overflow-y-auto p-4 sm:p-5">
            <div className="grid gap-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Adicionar serviços</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Pesquise e selecione os serviços que deseja vincular.</p>
                </div>

                <div className="grid gap-3">
                  <div>
                    <label className="mb-1 block text-[13px] font-semibold text-foreground">Buscar serviço</label>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={servicoBusca}
                        onChange={(event) => setServicoBusca(event.target.value)}
                        placeholder="Digite o nome do serviço..."
                        className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-foreground"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-background">
                    <div className="max-h-56 overflow-y-auto">
                      {servicosDispFiltrados.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-muted-foreground">Nenhum serviço encontrado</div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={handleAdicionarTodos}
                            className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left text-sm font-semibold text-foreground transition hover:bg-muted"
                          >
                            Selecionar todos
                          </button>

                          {servicosDispFiltrados.map((servico) => (
                            <button
                              key={servico.id}
                              type="button"
                              onClick={() => toggleServicoPendente(servico.id)}
                              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-muted"
                            >
                              <Checkbox checked={servicosPendentes.includes(servico.id)} className="pointer-events-none" />
                              <span className="truncate">{servico.nome}</span>
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={handleAdicionarSelecionados}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-foreground bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-muted"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar{servicosPendentes.length > 0 ? ` (${servicosPendentes.length})` : ""}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Serviços adicionados</h3>
                    <p className="mt-1 text-xs text-muted-foreground">Edite os valores diretamente.</p>
                  </div>

                  {servicosAdicionados.length > 0 && (
                    <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {servicosAdicionados.length} item(ns)
                    </span>
                  )}
                </div>

                <div className="grid gap-3 md:hidden">
                  {servicosAdicionados.length === 0 ? (
                    <div className="rounded-lg border border-border px-4 py-8 text-center text-sm text-muted-foreground">Nenhum registro encontrado</div>
                  ) : (
                    servicosAdicionados.map((servico) => (
                      <div key={servico.id} className="rounded-lg border border-border p-3">
                        <div className="mb-3 flex items-start gap-3">
                          <Checkbox checked={servicosSelecionados.includes(servico.id)} onCheckedChange={() => toggleServicoSelecionado(servico.id)} />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-foreground">{servico.nome}</div>
                          </div>
                        </div>

                        <div className="grid gap-3">
                          <div className="grid gap-1">
                            <span className="text-xs font-medium text-muted-foreground">Preço</span>
                            <input
                              type="text"
                              value={servico.preco}
                              onChange={(event) => updateServico(servico.id, "preco", event.target.value)}
                              className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                            />
                          </div>

                          <div className="grid gap-1">
                            <span className="text-xs font-medium text-muted-foreground">Tempo</span>
                            <input
                              type="text"
                              value={servico.tempo}
                              onChange={(event) => updateServico(servico.id, "tempo", event.target.value)}
                              className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                            />
                          </div>

                          <div className="grid gap-1">
                            <span className="text-xs font-medium text-muted-foreground">Comissão</span>
                            <input
                              type="text"
                              value={servico.comissao}
                              onChange={(event) => updateServico(servico.id, "comissao", event.target.value)}
                              placeholder="Ex: 50%"
                              className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 z-10 bg-muted">
                      <tr className="text-foreground">
                        <th className="w-10 px-3 py-2 text-left">
                          <Checkbox
                            checked={servicosAdicionados.length > 0 && servicosSelecionados.length === servicosAdicionados.length}
                            onCheckedChange={toggleTodosServicos}
                          />
                        </th>
                        <th className="px-3 py-2 text-left text-[13px] font-semibold">Nome</th>
                        <th className="px-3 py-2 text-left text-[13px] font-semibold">Preço</th>
                        <th className="px-3 py-2 text-left text-[13px] font-semibold">Tempo</th>
                        <th className="px-3 py-2 text-left text-[13px] font-semibold">Comissão</th>
                      </tr>
                    </thead>

                    <tbody>
                      {servicosAdicionados.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">Nenhum registro encontrado</td>
                        </tr>
                      ) : (
                        servicosAdicionados.map((servico) => (
                          <tr key={servico.id} className="border-t border-border transition-colors hover:bg-muted/50">
                            <td className="px-3 py-2">
                              <Checkbox checked={servicosSelecionados.includes(servico.id)} onCheckedChange={() => toggleServicoSelecionado(servico.id)} />
                            </td>
                            <td className="px-3 py-2 text-foreground">{servico.nome}</td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={servico.preco}
                                onChange={(event) => updateServico(servico.id, "preco", event.target.value)}
                                className="h-8 w-24 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={servico.tempo}
                                onChange={(event) => updateServico(servico.id, "tempo", event.target.value)}
                                className="h-8 w-24 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={servico.comissao}
                                onChange={(event) => updateServico(servico.id, "comissao", event.target.value)}
                                placeholder="Ex: 50%"
                                className="h-8 w-24 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {servicosSelecionados.length > 0 && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="inline-flex items-center gap-3 rounded-full border border-border bg-background px-4 py-2 shadow-sm">
                      <span className="text-sm text-muted-foreground">{servicosSelecionados.length} selecionado(s)</span>
                      <button
                        type="button"
                        onClick={handleRemoverServicos}
                        className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remover
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border px-4 py-4 sm:flex-row sm:justify-end sm:px-5">
            <button
              type="button"
              onClick={() => setServicosOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => setServicosOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              Salvar
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={expedienteOpen} onOpenChange={setExpedienteOpen}>
        <DialogContent className="w-[calc(100vw-24px)] max-w-3xl gap-0 overflow-hidden rounded-2xl p-0 [&>button]:hidden">
          <div className="border-b border-border px-4 py-4 sm:px-5">
            <h2 className="text-base font-semibold text-foreground">Expediente do profissional</h2>
            <p className="mt-1 text-sm text-muted-foreground">Ative os dias da semana e ajuste o horário de trabalho.</p>
          </div>

          <div className="grid gap-3 p-4 sm:p-5">
            {expediente.map((item) => (
              <div key={item.dia} className="grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-[1.2fr_120px_120px] md:items-center">
                <label className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <Checkbox checked={item.ativo} onCheckedChange={(checked) => updateExpediente(item.dia, "ativo", checked === true)} />
                  <span>{item.dia}</span>
                </label>
                <input
                  type="time"
                  value={item.inicio}
                  disabled={!item.ativo}
                  onChange={(event) => updateExpediente(item.dia, "inicio", event.target.value)}
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                />
                <input
                  type="time"
                  value={item.fim}
                  disabled={!item.ativo}
                  onChange={(event) => updateExpediente(item.dia, "fim", event.target.value)}
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end border-t border-border px-4 py-4 sm:px-5">
            <button
              type="button"
              onClick={() => setExpedienteOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              Concluir
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
