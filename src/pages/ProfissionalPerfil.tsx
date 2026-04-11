import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { TextField, Dropdown, FormRow } from "@/components/FormModal";
import { useToast } from "@/hooks/use-toast";
import { Camera, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
  { value: "AC", label: "AC" }, { value: "AL", label: "AL" }, { value: "AP", label: "AP" },
  { value: "AM", label: "AM" }, { value: "BA", label: "BA" }, { value: "CE", label: "CE" },
  { value: "DF", label: "DF" }, { value: "ES", label: "ES" }, { value: "GO", label: "GO" },
  { value: "MA", label: "MA" }, { value: "MT", label: "MT" }, { value: "MS", label: "MS" },
  { value: "MG", label: "MG" }, { value: "PA", label: "PA" }, { value: "PB", label: "PB" },
  { value: "PR", label: "PR" }, { value: "PE", label: "PE" }, { value: "PI", label: "PI" },
  { value: "RJ", label: "RJ" }, { value: "RN", label: "RN" }, { value: "RS", label: "RS" },
  { value: "RO", label: "RO" }, { value: "RR", label: "RR" }, { value: "SC", label: "SC" },
  { value: "SP", label: "SP" }, { value: "SE", label: "SE" }, { value: "TO", label: "TO" },
];

const coverGradients = [
  "bg-gradient-to-r from-[hsl(207,85%,50%)] to-[hsl(207,85%,35%)]",
  "bg-gradient-to-r from-[hsl(145,55%,42%)] to-[hsl(145,55%,30%)]",
  "bg-gradient-to-r from-[hsl(0,78%,55%)] to-[hsl(0,78%,40%)]",
  "bg-gradient-to-r from-[hsl(270,60%,55%)] to-[hsl(270,60%,40%)]",
];

interface ProfissionalForm {
  nome: string;
  email: string;
  celular: string;
  senha: string;
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
}

const emptyForm = (): ProfissionalForm => ({
  nome: "", email: "", celular: "", senha: "", nivelAcesso: "Profissional",
  aniversario: "", sexo: "", tipoLogradouro: "", endereco: "", numero: "",
  complemento: "", cep: "", bairro: "", estado: "", cidade: "",
  parceiro: false, cnpj: "",
  permitirAgendamentoOnline: true, notificarEmail: false,
  ocultarDados: false, naoAparecerAgenda: false,
});

const tabs = [
  { id: "basicos", label: "Dados Básicos" },
  { id: "configuracoes", label: "Configurações" },
  { id: "pessoais", label: "Dados pessoais" },
  { id: "parceiro", label: "Profissional Parceiro" },
];

export default function ProfissionalPerfil() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

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
  const [coverIdx, setCoverIdx] = useState(0);
  const [showCoverPicker, setShowCoverPicker] = useState(false);

  const update = (field: keyof ProfissionalForm, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!form.nome || !form.email) {
      toast({ title: "Preencha os campos obrigatórios (Nome e Email)", variant: "destructive" });
      return;
    }
    toast({ title: isNew ? "Profissional cadastrado com sucesso" : "Profissional atualizado com sucesso" });
    navigate("/funcionarioPesquisa");
  };

  const handleCancel = () => navigate("/funcionarioPesquisa");

  return (
    <AppLayout>
      <div className="flex flex-col gap-0">
        {/* HEADER / COVER */}
        <div className="relative">
          <div
            className={cn("h-32 w-full cursor-pointer transition-all", coverGradients[coverIdx])}
            onClick={() => setShowCoverPicker(prev => !prev)}
          />
          {showCoverPicker && (
            <div className="absolute top-2 right-2 z-10 flex gap-2 rounded-lg bg-card p-2 shadow-lg border border-border">
              {coverGradients.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCoverIdx(i); setShowCoverPicker(false); }}
                  className={cn(
                    "h-8 w-8 rounded-md transition-all", coverGradients[i],
                    i === coverIdx && "ring-2 ring-foreground ring-offset-2"
                  )}
                />
              ))}
            </div>
          )}

          {/* Profile card overlapping cover */}
          <div className="relative mx-6 -mt-10 flex items-end gap-5">
            <div className="relative h-20 w-20 shrink-0 rounded-xl bg-muted border-4 border-card flex items-center justify-center overflow-hidden shadow-md">
              <Camera className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex flex-1 items-center justify-between pb-2">
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {form.nome || "Novo profissional"}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-0.5 text-sm text-muted-foreground">
                  <span>{form.nivelAcesso}</span>
                  {form.email && <span>{form.email}</span>}
                  {form.celular && <span>{form.celular}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[hsl(var(--success))] px-5 h-10 text-sm font-semibold text-[hsl(var(--success-foreground))] transition hover:opacity-90 active:scale-[0.98]"
                >
                  <Save className="h-4 w-4" />
                  Salvar
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-destructive px-5 h-10 text-sm font-semibold text-destructive-foreground transition hover:opacity-90 active:scale-[0.98]"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mx-6 mt-4 border-b border-border">
          <div className="flex gap-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-2.5 text-sm font-medium transition-colors relative",
                  activeTab === tab.id
                    ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-foreground after:rounded-full"
                    : "text-muted-foreground hover:text-foreground"
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
            <div className="grid gap-4 max-w-4xl">
              <FormRow cols={3}>
                <TextField label="Nome *" value={form.nome} onChange={v => update("nome", v)} />
                <TextField label="Email *" value={form.email} onChange={v => update("email", v)} />
                <TextField label="Celular" value={form.celular} onChange={v => update("celular", v)} placeholder="(00) 00000-0000" />
              </FormRow>
              <FormRow cols={3}>
                <TextField label="Senha" value={form.senha} onChange={v => update("senha", v)} />
                <Dropdown label="Nível de acesso" value={form.nivelAcesso} setValue={v => update("nivelAcesso", v)} options={nivelAcessoOptions} />
                <div className="grid gap-0.5">
                  <label className="text-[13px] font-semibold text-foreground">Foto</label>
                  <label className="flex h-10 cursor-pointer items-center rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition hover:border-muted-foreground">
                    <span>Escolher arquivo</span>
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
              </FormRow>
            </div>
          )}

          {/* ──── Configurações ──── */}
          {activeTab === "configuracoes" && (
            <div className="grid gap-8 max-w-4xl">
              {/* Permissões */}
              <div>
                <h2 className="text-base font-semibold text-foreground mb-4">Permissões</h2>
                <div className="grid gap-3">
                  {([
                    { field: "permitirAgendamentoOnline" as const, label: "Permitir agendamento online" },
                    { field: "notificarEmail" as const, label: "Notificar via email novo agendamento" },
                    { field: "ocultarDados" as const, label: "Ocultar dados cadastrais do cliente" },
                    { field: "naoAparecerAgenda" as const, label: "Não aparecer na agenda interna" },
                  ]).map(item => (
                    <label key={item.field} className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form[item.field] as boolean}
                        onChange={e => update(item.field, e.target.checked)}
                        className="h-4 w-4 rounded border-border text-foreground accent-foreground"
                      />
                      <span className="text-sm text-foreground">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ações */}
              <div>
                <h2 className="text-base font-semibold text-foreground mb-4">Ações</h2>
                <div className="flex gap-3">
                  <button className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-foreground/90 active:scale-[0.98]">
                    Configurar serviços
                  </button>
                  <button className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-foreground/90 active:scale-[0.98]">
                    Configurar expediente
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ──── Dados Pessoais ──── */}
          {activeTab === "pessoais" && (
            <div className="grid gap-4 max-w-4xl">
              <FormRow cols={3}>
                <TextField label="Aniversário" value={form.aniversario} onChange={v => update("aniversario", v)} placeholder="DD/MM/AAAA" />
                <Dropdown label="Sexo" value={form.sexo} setValue={v => update("sexo", v)} options={sexoOptions} />
                <Dropdown label="Tipo logradouro" value={form.tipoLogradouro} setValue={v => update("tipoLogradouro", v)} options={tipoLogradouroOptions} />
              </FormRow>
              <FormRow cols={3}>
                <TextField label="Endereço" value={form.endereco} onChange={v => update("endereco", v)} />
                <TextField label="Nº" value={form.numero} onChange={v => update("numero", v)} />
                <TextField label="Complemento" value={form.complemento} onChange={v => update("complemento", v)} />
              </FormRow>
              <FormRow cols={3}>
                <TextField label="CEP" value={form.cep} onChange={v => update("cep", v)} placeholder="00000-000" />
                <TextField label="Bairro" value={form.bairro} onChange={v => update("bairro", v)} />
                <Dropdown label="Estado" value={form.estado} setValue={v => update("estado", v)} options={estadoOptions} />
              </FormRow>
              <FormRow cols={3}>
                <TextField label="Cidade" value={form.cidade} onChange={v => update("cidade", v)} />
                <div />
                <div />
              </FormRow>
            </div>
          )}

          {/* ──── Profissional Parceiro ──── */}
          {activeTab === "parceiro" && (
            <div className="grid gap-4 max-w-4xl">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.parceiro}
                  onChange={e => update("parceiro", e.target.checked)}
                  className="h-4 w-4 rounded border-border text-foreground accent-foreground"
                />
                <span className="text-sm font-medium text-foreground">Profissional parceiro</span>
              </label>
              <div className="max-w-xs">
                <TextField
                  label="CNPJ"
                  value={form.cnpj}
                  onChange={v => update("cnpj", v)}
                  placeholder="00.000.000/0000-00"
                  disabled={!form.parceiro}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
