import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { TextField, Dropdown, FormRow } from "@/components/FormModal";
import { useToast } from "@/hooks/use-toast";
import { Camera, Save, X, Plus, Minus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  Object.fromEntries(
    diasSemana.map((d) => [d.key, defaultDia(d.key !== "dom")])
  );

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

export default function ProfissionalPerfil() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const profNome = searchParams.get("nome");
  const profEmail = searchParams.get("email") || "";
  const profCelular = searchParams.get("celular") || "";
  const profFuncao = searchParams.get("funcao") || "Profissional";
  const isNew = !profNome;

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
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [servicosAdicionados, setServicosAdicionados] = useState<ServicoAdicionado[]>([]);
  const [servicosSelecionados, setServicosSelecionados] = useState<number[]>([]);

  const updateDia = (key: string, field: keyof DiaExpediente, value: string | boolean) =>
    setExpediente((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));

  const handleAdicionarServico = () => {
    const id = Number(servicoSelecionado);
    const servico = servicosDisponiveis.find((s) => s.id === id);
    if (!servico || servicosAdicionados.some((s) => s.id === id)) return;
    setServicosAdicionados((prev) => [...prev, { ...servico, comissao: "" }]);
    setServicoSelecionado("");
  };

  const handleRemoverServicos = () => {
    setServicosAdicionados((prev) => prev.filter((s) => !servicosSelecionados.includes(s.id)));
    setServicosSelecionados([]);
  };

  const toggleServicoSelecionado = (id: number) => {
    setServicosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleTodosServicos = () => {
    if (servicosSelecionados.length === servicosAdicionados.length) {
      setServicosSelecionados([]);
    } else {
      setServicosSelecionados(servicosAdicionados.map((s) => s.id));
    }
  };

  const update = (field: keyof ProfissionalForm, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!form.nome || !form.email) {
      toast({ title: "Preencha os campos obrigatórios (Nome e Email)", variant: "destructive" });
      return;
    }

    toast({
      title: isNew ? "Profissional cadastrado com sucesso" : "Profissional atualizado com sucesso",
    });

    navigate("/funcionarioPesquisa");
  };

  const handleCancel = () => navigate("/funcionarioPesquisa");

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
        {/* HEADER SIMPLES */}
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

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[hsl(var(--success))] px-5 text-sm font-semibold text-[hsl(var(--success-foreground))] transition hover:opacity-90 active:scale-[0.98]"
              >
                <Save className="h-4 w-4" />
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-destructive px-5 text-sm font-semibold text-destructive-foreground transition hover:opacity-90 active:scale-[0.98]"
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
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

        {/* TAB CONTENT */}
        <div className="mx-6 mt-5 pb-10">
          {/* ──── Dados Básicos ──── */}
          {activeTab === "basicos" && (
            <div className="grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
              {/* Coluna 1: dados básicos em coluna única */}
              <div className="grid gap-4">
                <div className="max-w-xl">
                  <TextField label="Nome *" value={form.nome} onChange={(v) => update("nome", v)} />
                </div>

                <div className="max-w-xl">
                  <TextField label="Email *" value={form.email} onChange={(v) => update("email", v)} />
                </div>

                <div className="max-w-xl">
                  <TextField
                    label="Celular"
                    value={form.celular}
                    onChange={(v) => update("celular", v)}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="max-w-xl">
                  <Dropdown
                    label="Nível de acesso"
                    value={form.nivelAcesso}
                    setValue={(v) => update("nivelAcesso", v)}
                    options={nivelAcessoOptions}
                  />
                </div>
              </div>

              {/* Coluna 2: configurações */}
              <div className="grid gap-8">
                <div>
                  <h2 className="mb-4 text-base font-semibold text-foreground">Permissões</h2>
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
                        <input
                          type="checkbox"
                          checked={form[item.field] as boolean}
                          onChange={(e) => update(item.field, e.target.checked)}
                          className="h-4 w-4 rounded border-border text-foreground accent-foreground"
                        />
                        <span className="text-sm text-foreground">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="mb-4 text-base font-semibold text-foreground">Ações</h2>
                  <div className="flex flex-wrap gap-3">
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
                </div>
              </div>
            </div>
          )}

          {/* ──── Dados Pessoais ──── */}
          {activeTab === "pessoais" && (
            <div className="grid gap-4 max-w-5xl">
              <FormRow cols={3}>
                <TextField
                  label="Aniversário"
                  value={form.aniversario}
                  onChange={(v) => update("aniversario", v)}
                  placeholder="DD/MM/AAAA"
                />
                <Dropdown label="Sexo" value={form.sexo} setValue={(v) => update("sexo", v)} options={sexoOptions} />
                <Dropdown
                  label="Tipo logradouro"
                  value={form.tipoLogradouro}
                  setValue={(v) => update("tipoLogradouro", v)}
                  options={tipoLogradouroOptions}
                />
              </FormRow>

              <FormRow cols={3}>
                <TextField label="Endereço" value={form.endereco} onChange={(v) => update("endereco", v)} />
                <TextField label="Nº" value={form.numero} onChange={(v) => update("numero", v)} />
                <TextField label="Complemento" value={form.complemento} onChange={(v) => update("complemento", v)} />
              </FormRow>

              <FormRow cols={3}>
                <TextField label="CEP" value={form.cep} onChange={(v) => update("cep", v)} placeholder="00000-000" />
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

              <div className="mt-4 grid gap-4 max-w-xl">
                <label className="flex cursor-pointer select-none items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.parceiro}
                    onChange={(e) => update("parceiro", e.target.checked)}
                    className="h-4 w-4 rounded border-border text-foreground accent-foreground"
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
            </div>
          )}
        </div>
      </div>

      {/* Modal Expediente */}
      <Dialog open={expedienteOpen} onOpenChange={setExpedienteOpen}>
        <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">Expediente de trabalho</h2>
          </div>

          <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
            {diasSemana.map((dia) => {
              const d = expediente[dia.key];
              return (
                <div key={dia.key} className="px-5 py-3">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="w-10 text-sm font-semibold text-foreground">{dia.label}</span>
                    <Switch
                      checked={d.ativo}
                      onCheckedChange={(v) => updateDia(dia.key, "ativo", v)}
                    />
                  </div>

                  {d.ativo && (
                    <div className="ml-[52px] grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-16">Trabalho:</span>
                        <input
                          type="time"
                          value={d.trabalhoInicio}
                          onChange={(e) => updateDia(dia.key, "trabalhoInicio", e.target.value)}
                          className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                        />
                        <span className="text-muted-foreground">às</span>
                        <input
                          type="time"
                          value={d.trabalhoFim}
                          onChange={(e) => updateDia(dia.key, "trabalhoFim", e.target.value)}
                          className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-16">Almoço:</span>
                        <input
                          type="time"
                          value={d.almocoInicio}
                          onChange={(e) => updateDia(dia.key, "almocoInicio", e.target.value)}
                          className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                        />
                        <span className="text-muted-foreground">às</span>
                        <input
                          type="time"
                          value={d.almocoFim}
                          onChange={(e) => updateDia(dia.key, "almocoFim", e.target.value)}
                          className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 px-5 py-3 border-t border-border">
            <button
              onClick={() => setExpedienteOpen(false)}
              className="inline-flex h-9 items-center rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              Fechar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
