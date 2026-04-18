import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { TextField, Dropdown, FormRow, FormModal } from "@/components/FormModal";
import { useToast } from "@/hooks/use-toast";
import { Camera, Plus, Trash2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface ServicoDisponivel {
  id: number;
  nome: string;
  preco: string;
  tempo: string;
}

interface ServicoAdicionado extends ServicoDisponivel {
  comissao: string;
}

const servicosDisponiveis: ServicoDisponivel[] = [
  { id: 1, nome: "Corte Masculino", preco: "R$ 45,00", tempo: "30 min" },
  { id: 2, nome: "Corte Feminino", preco: "R$ 65,00", tempo: "45 min" },
  { id: 3, nome: "Barba", preco: "R$ 30,00", tempo: "20 min" },
  { id: 4, nome: "Hidratação", preco: "R$ 80,00", tempo: "60 min" },
  { id: 5, nome: "Coloração", preco: "R$ 120,00", tempo: "90 min" },
  { id: 6, nome: "Escova Progressiva", preco: "R$ 200,00", tempo: "120 min" },
  { id: 7, nome: "Manicure", preco: "R$ 35,00", tempo: "40 min" },
  { id: 8, nome: "Pedicure", preco: "R$ 40,00", tempo: "50 min" },
];

const diasSemana = [
  { key: "seg", label: "Seg" },
  { key: "ter", label: "Ter" },
  { key: "qua", label: "Qua" },
  { key: "qui", label: "Qui" },
  { key: "sex", label: "Sex" },
  { key: "sab", label: "Sáb" },
  { key: "dom", label: "Dom" },
] as const;

interface DiaExpediente {
  ativo: boolean;
  trabalhoInicio: string;
  trabalhoFim: string;
  almocoInicio: string;
  almocoFim: string;
}

const defaultDia = (ativo = true): DiaExpediente => ({
  ativo,
  trabalhoInicio: "08:00",
  trabalhoFim: "18:00",
  almocoInicio: "12:00",
  almocoFim: "13:00",
});

type ExpedienteState = Record<string, DiaExpediente>;

const defaultExpediente = (): ExpedienteState =>
  Object.fromEntries(diasSemana.map((d) => [d.key, defaultDia(d.key !== "dom")]));

const nivelAcessoOptions = [
  { value: "Gerente", label: "Gerente" },
  { value: "Profissional", label: "Profissional" },
  { value: "Recepção", label: "Recepção" },
  { value: "Caixa", label: "Caixa" },
  { value: "Auxiliar", label: "Auxiliar" },
  { value: "Assistente", label: "Assistente" },
];

const sexoOptions = [
  { value: "", label: "Selecione..." },
  { value: "Masculino", label: "Masculino" },
  { value: "Feminino", label: "Feminino" },
  { value: "Outro", label: "Outro" },
];

const tipoLogradouroOptions = [
  { value: "", label: "Selecione..." },
  { value: "Rua", label: "Rua" },
  { value: "Avenida", label: "Avenida" },
  { value: "Travessa", label: "Travessa" },
  { value: "Alameda", label: "Alameda" },
  { value: "Praça", label: "Praça" },
];

const estadoOptions = [
  { value: "", label: "Selecione..." },
  { value: "AC", label: "AC" },
  { value: "AL", label: "AL" },
  { value: "AP", label: "AP" },
  { value: "AM", label: "AM" },
  { value: "BA", label: "BA" },
  { value: "CE", label: "CE" },
  { value: "DF", label: "DF" },
  { value: "ES", label: "ES" },
  { value: "GO", label: "GO" },
  { value: "MA", label: "MA" },
  { value: "MT", label: "MT" },
  { value: "MS", label: "MS" },
  { value: "MG", label: "MG" },
  { value: "PA", label: "PA" },
  { value: "PB", label: "PB" },
  { value: "PR", label: "PR" },
  { value: "PE", label: "PE" },
  { value: "PI", label: "PI" },
  { value: "RJ", label: "RJ" },
  { value: "RN", label: "RN" },
  { value: "RS", label: "RS" },
  { value: "RO", label: "RO" },
  { value: "RR", label: "RR" },
  { value: "SC", label: "SC" },
  { value: "SP", label: "SP" },
  { value: "SE", label: "SE" },
  { value: "TO", label: "TO" },
];

interface ProfissionalForm {
  nome: string;
  email: string;
  celular: string;
  nivelAcesso: string;
  aniversario: string;
  sexo: string;
  tipoLogradouro: string;
  endereco: string;
  numero: string;
  complemento: string;
  cep: string;
  bairro: string;
  estado: string;
  cidade: string;
  parceiro: boolean;
  cnpj: string;
  permitirAgendamentoOnline: boolean;
  notificarEmail: boolean;
  ocultarDados: boolean;
  naoAparecerAgenda: boolean;
  fotoPreview: string;
}

const emptyForm = (): ProfissionalForm => ({
  nome: "",
  email: "",
  celular: "",
  nivelAcesso: "Profissional",
  aniversario: "",
  sexo: "",
  tipoLogradouro: "",
  endereco: "",
  numero: "",
  complemento: "",
  cep: "",
  bairro: "",
  estado: "",
  cidade: "",
  parceiro: false,
  cnpj: "",
  permitirAgendamentoOnline: true,
  notificarEmail: false,
  ocultarDados: false,
  naoAparecerAgenda: false,
  fotoPreview: "",
});

const tabs = [
  { id: "basicos", label: "Dados Básicos" },
  { id: "pessoais", label: "Dados pessoais" },
];

function SectionBlock({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <div className="mb-3">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}

export default function ProfissionalPerfil() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const profNome = searchParams.get("nome");
  const profEmail = searchParams.get("email") || "";
  const profCelular = searchParams.get("celular") || "";
  const profFuncao = searchParams.get("funcao") || "Profissional";

  const [form, setForm] = useState<ProfissionalForm>(() => ({
    ...emptyForm(),
    nome: profNome || "",
    email: profEmail,
    celular: profCelular,
    nivelAcesso: profFuncao,
  }));

  const [activeTab, setActiveTab] = useState("basicos");
  const [expedienteOpen, setExpedienteOpen] = useState(false);
  const [expediente, setExpediente] = useState<ExpedienteState>(defaultExpediente);
  const [servicosOpen, setServicosOpen] = useState(false);
  const [servicoBusca, setServicoBusca] = useState("");
  const [servicosAdicionados, setServicosAdicionados] = useState<ServicoAdicionado[]>([]);
  const [servicosSelecionados, setServicosSelecionados] = useState<number[]>([]);
  const [servicosDropdownOpen, setServicosDropdownOpen] = useState(false);
  const [servicosPendentes, setServicosPendentes] = useState<number[]>([]);
  const servicosDropdownRef = useRef<HTMLDivElement | null>(null);

  const updateDia = (key: string, field: keyof DiaExpediente, value: string | boolean) =>
    setExpediente((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));

  const servicosDispFiltrados = servicosDisponiveis
    .filter((s) => !servicosAdicionados.some((a) => a.id === s.id))
    .filter((s) => s.nome.toLowerCase().includes(servicoBusca.toLowerCase()));

  const toggleServicoPendente = (id: number) => {
    setServicosPendentes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleAdicionarSelecionados = () => {
    const novos = servicosDisponiveis
      .filter((s) => servicosPendentes.includes(s.id) && !servicosAdicionados.some((a) => a.id === s.id))
      .map((s) => ({ ...s, comissao: "" }));

    setServicosAdicionados((prev) => [...prev, ...novos]);
    setServicosPendentes([]);
    setServicosDropdownOpen(false);
    setServicoBusca("");
  };

  const handleAdicionarTodos = () => {
    const novos = servicosDisponiveis
      .filter((s) => !servicosAdicionados.some((a) => a.id === s.id))
      .map((s) => ({ ...s, comissao: "" }));

    setServicosAdicionados((prev) => [...prev, ...novos]);
    setServicosPendentes([]);
    setServicosDropdownOpen(false);
    setServicoBusca("");
  };

  const handleRemoverServicos = () => {
    setServicosAdicionados((prev) => prev.filter((s) => !servicosSelecionados.includes(s.id)));
    setServicosSelecionados([]);
  };

  const updateServico = (id: number, field: keyof ServicoAdicionado, value: string) =>
    setServicosAdicionados((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  const toggleServicoSelecionado = (id: number) => {
    setServicosSelecionados((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleTodosServicos = () => {
    if (servicosSelecionados.length === servicosAdicionados.length) {
      setServicosSelecionados([]);
    } else {
      setServicosSelecionados(servicosAdicionados.map((s) => s.id));
    }
  };

  const update = (field: keyof ProfissionalForm, value: string | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (value !== "" && value !== false) {
        toast({ title: "Alteração salva automaticamente" });
      }

      return next;
    });
  };

  const handleFotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    update("fotoPreview", previewUrl);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-0">
        {/* HEADER */}
        <div className="mx-6 mt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-5">
              <button
                type="button"
                onClick={handleFotoClick}
                className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-border bg-muted shadow-sm transition hover:border-muted-foreground"
                aria-label="Alterar foto"
              >
                {form.fotoPreview ? (
                  <img src={form.fotoPreview} alt="Foto do profissional" className="h-full w-full object-cover" />
                ) : (
                  <Camera className="h-6 w-6 text-muted-foreground" />
                )}

                <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-[10px] font-medium text-white">
                  Alterar
                </div>
              </button>

              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />

              <div className="pt-1">
                <h1 className="text-xl font-bold text-foreground">{form.nome || "Novo profissional"}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
                  <span>{form.nivelAcesso}</span>
                  {form.email && <span>{form.email}</span>}
                  {form.celular && <span>{form.celular}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mx-6 mt-4 border-b border-border">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative pb-2.5 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:rounded-full after:bg-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="mx-6 mt-5 pb-10">
          {activeTab === "basicos" && (
            <div className="grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              {/* Coluna principal */}
              <div className="grid gap-5">
                <SectionBlock title="Dados básicos" description="Informações principais do profissional.">
                  <div className="grid max-w-3xl gap-4">
                    <div className="max-w-xl">
                      <TextField label="Nome *" value={form.nome} onChange={(v) => update("nome", v)} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <TextField label="Email *" value={form.email} onChange={(v) => update("email", v)} />
                      <TextField
                        label="Celular"
                        value={form.celular}
                        onChange={(v) => update("celular", v)}
                        placeholder="(00) 00000-0000"
                      />
                    </div>

                    <div className="max-w-sm">
                      <Dropdown
                        label="Nível de acesso"
                        value={form.nivelAcesso}
                        setValue={(v) => update("nivelAcesso", v)}
                        options={nivelAcessoOptions}
                      />
                    </div>
                  </div>
                </SectionBlock>
              </div>

              {/* Coluna lateral */}
              <div className="grid gap-5 self-start">
                <SectionBlock
                  title="Permissões"
                  description="Controle o comportamento do profissional dentro do sistema."
                >
                  <div className="grid gap-3">
                    {[
                      {
                        field: "permitirAgendamentoOnline" as const,
                        label: "Permitir agendamento online",
                      },
                      {
                        field: "notificarEmail" as const,
                        label: "Notificar via email novo agendamento",
                      },
                      {
                        field: "ocultarDados" as const,
                        label: "Ocultar dados cadastrais do cliente",
                      },
                      {
                        field: "naoAparecerAgenda" as const,
                        label: "Não aparecer na agenda interna",
                      },
                    ].map((item) => (
                      <label key={item.field} className="flex cursor-pointer select-none items-center gap-3">
                        <Checkbox
                          checked={form[item.field] as boolean}
                          onCheckedChange={(v) => update(item.field, !!v)}
                          className="h-4 w-4 rounded-md border border-zinc-400 bg-background shadow-sm hover:bg-muted data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white transition-all duration-300"
                        />
                        <span className="text-sm text-foreground">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </SectionBlock>

                <SectionBlock title="Ações" description="Configurações complementares do profissional.">
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setServicosOpen(true)}
                      className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-foreground/90 active:scale-[0.98]"
                    >
                      Configurar serviços
                    </button>
                    <button
                      onClick={() => setExpedienteOpen(true)}
                      className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-foreground/90 active:scale-[0.98]"
                    >
                      Configurar expediente
                    </button>
                  </div>
                </SectionBlock>
              </div>
            </div>
          )}

          {activeTab === "pessoais" && (
            <div className="grid max-w-5xl gap-5">
              <SectionBlock title="Informações pessoais" description="Dados complementares do profissional.">
                <div className="grid gap-4">
                  <FormRow cols={3}>
                    <TextField
                      label="Aniversário"
                      value={form.aniversario}
                      onChange={(v) => update("aniversario", v)}
                      placeholder="DD/MM/AAAA"
                    />
                    <Dropdown
                      label="Sexo"
                      value={form.sexo}
                      setValue={(v) => update("sexo", v)}
                      options={sexoOptions}
                    />
                    <Dropdown
                      label="Tipo logradouro"
                      value={form.tipoLogradouro}
                      setValue={(v) => update("tipoLogradouro", v)}
                      options={tipoLogradouroOptions}
                    />
                  </FormRow>
                </div>
              </SectionBlock>

              <SectionBlock title="Endereço" description="Localização e dados de endereço.">
                <div className="grid gap-4">
                  <FormRow cols={3}>
                    <TextField label="Endereço" value={form.endereco} onChange={(v) => update("endereco", v)} />
                    <TextField label="Nº" value={form.numero} onChange={(v) => update("numero", v)} />
                    <TextField
                      label="Complemento"
                      value={form.complemento}
                      onChange={(v) => update("complemento", v)}
                    />
                  </FormRow>

                  <FormRow cols={3}>
                    <TextField
                      label="CEP"
                      value={form.cep}
                      onChange={(v) => update("cep", v)}
                      placeholder="00000-000"
                    />
                    <TextField label="Bairro" value={form.bairro} onChange={(v) => update("bairro", v)} />
                    <Dropdown
                      label="Estado"
                      value={form.estado}
                      setValue={(v) => update("estado", v)}
                      options={estadoOptions}
                    />
                  </FormRow>

                  <FormRow cols={3}>
                    <TextField label="Cidade" value={form.cidade} onChange={(v) => update("cidade", v)} />
                    <div />
                    <div />
                  </FormRow>
                </div>
              </SectionBlock>

              <SectionBlock
                title="Parceria"
                description="Configuração para profissionais parceiros."
                className="max-w-xl"
              >
                <div className="grid gap-4">
                  <label className="flex cursor-pointer select-none items-center gap-3">
                    <Checkbox
                      checked={form.parceiro}
                      onCheckedChange={(v) => update("parceiro", !!v)}
                      className="h-4 w-4 rounded-md border border-zinc-400 bg-background shadow-sm hover:bg-muted data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white transition-all duration-300"
                    />
                    <span className="text-sm font-medium text-foreground">Profissional parceiro</span>
                  </label>

                  <TextField
                    label="CNPJ"
                    value={form.cnpj}
                    onChange={(v) => update("cnpj", v)}
                    placeholder="00.000.000/0000-00"
                    disabled={!form.parceiro}
                  />
                </div>
              </SectionBlock>
            </div>
          )}
        </div>
      </div>

      {/* Modal Expediente */}
      <Dialog open={expedienteOpen} onOpenChange={setExpedienteOpen}>
        <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-foreground">Expediente de trabalho</h2>
          </div>

          <div className="max-h-[60vh] divide-y divide-border overflow-y-auto">
            {diasSemana.map((dia) => {
              const d = expediente[dia.key];
              return (
                <div key={dia.key} className="px-5 py-3">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="w-10 text-sm font-semibold text-foreground">{dia.label}</span>
                    <Switch checked={d.ativo} onCheckedChange={(v) => updateDia(dia.key, "ativo", v)} />
                  </div>

                  {d.ativo && (
                    <div className="ml-[52px] flex flex-wrap gap-x-8 gap-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="shrink-0 text-xs font-medium text-muted-foreground">Trabalho:</span>
                        <input
                          type="time"
                          value={d.trabalhoInicio}
                          onChange={(e) => updateDia(dia.key, "trabalhoInicio", e.target.value)}
                          className="h-8 w-[100px] rounded-md border border-border bg-background px-2 text-sm text-foreground"
                        />
                        <span className="text-xs text-muted-foreground">às</span>
                        <input
                          type="time"
                          value={d.trabalhoFim}
                          onChange={(e) => updateDia(dia.key, "trabalhoFim", e.target.value)}
                          className="h-8 w-[100px] rounded-md border border-border bg-background px-2 text-sm text-foreground"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="shrink-0 text-xs font-medium text-muted-foreground">Almoço:</span>
                        <input
                          type="time"
                          value={d.almocoInicio}
                          onChange={(e) => updateDia(dia.key, "almocoInicio", e.target.value)}
                          className="h-8 w-[100px] rounded-md border border-border bg-background px-2 text-sm text-foreground"
                        />
                        <span className="text-xs text-muted-foreground">às</span>
                        <input
                          type="time"
                          value={d.almocoFim}
                          onChange={(e) => updateDia(dia.key, "almocoFim", e.target.value)}
                          className="h-8 w-[100px] rounded-md border border-border bg-background px-2 text-sm text-foreground"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
            <button
              onClick={() => setExpedienteOpen(false)}
              className="inline-flex h-9 items-center rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              Salvar
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Serviços */}
      <Dialog
        open={servicosOpen}
        onOpenChange={(open) => {
          setServicosOpen(open);
          if (!open) {
            setServicoBusca("");
            setServicosDropdownOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-3xl border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <FormModal
            title="Configurar serviços"
            subtitle="Adicione os serviços que o profissional realiza."
            onClose={() => {
              setServicosOpen(false);
              setServicoBusca("");
              setServicosDropdownOpen(false);
            }}
            size="lg"
            footer={
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setServicosOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/90 active:scale-[0.98]"
                >
                  Fechar
                </button>
              </div>
            }
          >
            <div className="mb-3 flex items-end gap-3">
              <div className="relative flex-1" ref={servicosDropdownRef}>
                <label className="text-[13px] font-semibold text-foreground">Selecione os serviços</label>
                <button
                  type="button"
                  onClick={() => setServicosDropdownOpen((p) => !p)}
                  className="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-card px-3 text-sm text-foreground transition-all hover:border-muted-foreground"
                >
                  <span className="text-muted-foreground">Buscar serviço...</span>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </button>

                {servicosDropdownOpen && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card shadow-xl">
                    <div className="border-b border-border p-2">
                      <input
                        placeholder="Buscar..."
                        value={servicoBusca}
                        onChange={(e) => setServicoBusca(e.target.value)}
                        className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-foreground"
                        autoFocus
                      />
                    </div>

                    <div className="max-h-48 overflow-auto">
                      <button
                        type="button"
                        onClick={handleAdicionarTodos}
                        className="flex w-full items-center gap-3 border-b border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
                      >
                        Selecionar todos
                      </button>

                      {servicosDispFiltrados.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleServicoPendente(s.id)}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-muted"
                        >
                          <Checkbox
                            checked={servicosPendentes.includes(s.id)}
                            className="pointer-events-none h-4 w-4 rounded-md border border-zinc-400 bg-background shadow-sm data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                          />
                          <span>{s.nome}</span>
                        </button>
                      ))}

                      {servicosDispFiltrados.length === 0 && (
                        <p className="px-4 py-3 text-center text-sm text-muted-foreground">Nenhum serviço encontrado</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleAdicionarSelecionados}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-foreground bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-muted active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                Adicionar{servicosPendentes.length > 0 ? ` (${servicosPendentes.length})` : ""}
              </button>
            </div>

            <p className="mb-2 text-center text-[13px] font-semibold text-muted-foreground">Serviços Adicionados</p>

            <div className="overflow-hidden rounded-lg border border-border">
              <div className="max-h-[40vh] overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[hsl(0_0%_20%)] text-white">
                      <th className="w-10 px-3 py-2 text-left">
                        <Checkbox
                          checked={
                            servicosAdicionados.length > 0 && servicosSelecionados.length === servicosAdicionados.length
                          }
                          onCheckedChange={toggleTodosServicos}
                          className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-[hsl(0_0%_20%)]"
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
                        <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                          Nenhum registro encontrado
                        </td>
                      </tr>
                    ) : (
                      servicosAdicionados.map((s) => (
                        <tr key={s.id} className="border-t border-border transition-colors hover:bg-muted/50">
                          <td className="px-3 py-2">
                            <Checkbox
                              checked={servicosSelecionados.includes(s.id)}
                              onCheckedChange={() => toggleServicoSelecionado(s.id)}
                            />
                          </td>
                          <td className="px-3 py-2 text-foreground">{s.nome}</td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={s.preco}
                              onChange={(e) => updateServico(s.id, "preco", e.target.value)}
                              className="h-8 w-24 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={s.tempo}
                              onChange={(e) => updateServico(s.id, "tempo", e.target.value)}
                              className="h-8 w-24 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={s.comissao}
                              onChange={(e) => updateServico(s.id, "comissao", e.target.value)}
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
            </div>

            {servicosSelecionados.length > 0 && (
              <div className="mt-3 flex items-center justify-center">
                <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-lg">
                  <span className="text-sm text-muted-foreground">{servicosSelecionados.length} selecionado(s)</span>
                  <button
                    onClick={handleRemoverServicos}
                    className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remover
                  </button>
                </div>
              </div>
            )}
          </FormModal>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
