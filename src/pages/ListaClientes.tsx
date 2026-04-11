import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, ActionsMenu, SelectionAction, TabDef, SummaryCard } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Trash2, Merge, Tag, MessageCircle, Pencil, Coins, CreditCard, X, Plus, Check } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DeleteModal } from "@/components/FormModal";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type StatusCliente = "ativo" | "semi-ativo" | "inativo";
type SexoCliente = "M" | "F" | "";
type ModalTab = "basicos" | "endereco";

interface Cliente {
  cod: string;
  nome: string;
  cpf: string;
  telefone: string;
  telefonePais: string;
  email: string;
  celular: string;
  celularPais: string;
  aniversario: string;
  sexo: SexoCliente;
  tags: string;
  tipoLogradouro: string;
  endereco: string;
  numero: string;
  complemento: string;
  cep: string;
  bairro: string;
  estado: string;
  cidade: string;
  ultimaVisita: string;
  moedas: number;
  creditos: number;
  status: StatusCliente;
}

const statusOptions = [
  { value: "ativo", label: "Ativo" },
  { value: "semi-ativo", label: "Semi-ativo" },
  { value: "inativo", label: "Inativo" },
];

const paisOptions = [
  { value: "Brasil", label: "Brasil" },
  { value: "Argentina", label: "Argentina" },
  { value: "Paraguai", label: "Paraguai" },
];

const tipoLogradouroOptions = [
  { value: "", label: "Selecione" },
  { value: "Rua", label: "Rua" },
  { value: "Avenida", label: "Avenida" },
  { value: "Travessa", label: "Travessa" },
  { value: "Alameda", label: "Alameda" },
];

const estadoOptions = [
  { value: "", label: "Selecione" },
  { value: "PR", label: "Paraná" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "MG", label: "Minas Gerais" },
];

const cidadeOptionsMap: Record<string, { value: string; label: string }[]> = {
  "": [{ value: "", label: "Selecione" }],
  PR: [
    { value: "", label: "Selecione" },
    { value: "Curitiba", label: "Curitiba" },
    { value: "Londrina", label: "Londrina" },
    { value: "Maringá", label: "Maringá" },
  ],
  SC: [
    { value: "", label: "Selecione" },
    { value: "Florianópolis", label: "Florianópolis" },
    { value: "Blumenau", label: "Blumenau" },
    { value: "Joinville", label: "Joinville" },
  ],
  SP: [
    { value: "", label: "Selecione" },
    { value: "São Paulo", label: "São Paulo" },
    { value: "Campinas", label: "Campinas" },
    { value: "Santos", label: "Santos" },
  ],
  RJ: [
    { value: "", label: "Selecione" },
    { value: "Rio de Janeiro", label: "Rio de Janeiro" },
    { value: "Niterói", label: "Niterói" },
  ],
  MG: [
    { value: "", label: "Selecione" },
    { value: "Belo Horizonte", label: "Belo Horizonte" },
    { value: "Juiz de Fora", label: "Juiz de Fora" },
  ],
};

const data: Cliente[] = [
  {
    cod: "745142",
    nome: "Abner Ferreira Chaves",
    cpf: "",
    telefone: "(61) 99450-9929",
    telefonePais: "Brasil",
    email: "",
    celular: "(61) 99450-9929",
    celularPais: "Brasil",
    aniversario: "01/05/2017",
    sexo: "M",
    tags: "bloquear123",
    tipoLogradouro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "04/11/2025",
    moedas: 196,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1037806",
    nome: "Ada Naama",
    cpf: "",
    telefone: "(67) 99162-990",
    telefonePais: "Brasil",
    email: "",
    celular: "",
    celularPais: "Brasil",
    aniversario: "",
    sexo: "F",
    tags: "",
    tipoLogradouro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "17/02/2026",
    moedas: 25,
    creditos: 0,
    status: "ativo",
  },
  {
    cod: "1037807",
    nome: "Adara Cerqueira",
    cpf: "",
    telefone: "6181627802",
    telefonePais: "Brasil",
    email: "",
    celular: "",
    celularPais: "Brasil",
    aniversario: "10/05/2025",
    sexo: "F",
    tags: "",
    tipoLogradouro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "17/02/2026",
    moedas: 0,
    creditos: 0,
    status: "ativo",
  },
  {
    cod: "1037808",
    nome: "Adelia Maria Sales",
    cpf: "",
    telefone: "12981134764",
    telefonePais: "Brasil",
    email: "",
    celular: "",
    celularPais: "Brasil",
    aniversario: "",
    sexo: "F",
    tags: "",
    tipoLogradouro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "26/11/2025",
    moedas: 4,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1167159",
    nome: "Adelio Marçal",
    cpf: "",
    telefone: "(88) 90300-0166",
    telefonePais: "Brasil",
    email: "",
    celular: "",
    celularPais: "Brasil",
    aniversario: "",
    sexo: "M",
    tags: "",
    tipoLogradouro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "05/11/2025",
    moedas: 4,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "675732",
    nome: "Ademar Herminio",
    cpf: "",
    telefone: "(55) 55555-5555",
    telefonePais: "Brasil",
    email: "",
    celular: "",
    celularPais: "Brasil",
    aniversario: "",
    sexo: "M",
    tags: "",
    tipoLogradouro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "01/10/2025",
    moedas: 397,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1069712",
    nome: "Adenilson",
    cpf: "",
    telefone: "(21) 99999-9999",
    telefonePais: "Brasil",
    email: "",
    celular: "",
    celularPais: "Brasil",
    aniversario: "20/01/1988",
    sexo: "M",
    tags: "",
    tipoLogradouro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "12/08/2025",
    moedas: 0,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1204833",
    nome: "Adenilson",
    cpf: "",
    telefone: "(21) 99999-9999",
    telefonePais: "Brasil",
    email: "",
    celular: "",
    celularPais: "Brasil",
    aniversario: "20/03/1988",
    sexo: "M",
    tags: "",
    tipoLogradouro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "11/12/2025",
    moedas: 4,
    creditos: 0,
    status: "semi-ativo",
  },
  {
    cod: "1037809",
    nome: "Adhara Maria",
    cpf: "",
    telefone: "",
    telefonePais: "Brasil",
    email: "",
    celular: "",
    celularPais: "Brasil",
    aniversario: "",
    sexo: "F",
    tags: "",
    tipoLogradouro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "10/02/2026",
    moedas: 24,
    creditos: 0,
    status: "ativo",
  },
  {
    cod: "848084",
    nome: "Adriana",
    cpf: "",
    telefone: "(99) 99999-99999",
    telefonePais: "Brasil",
    email: "",
    celular: "",
    celularPais: "Brasil",
    aniversario: "22/03/1988",
    sexo: "F",
    tags: "",
    tipoLogradouro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "24/06/2025",
    moedas: 97,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1037810",
    nome: "Adriana",
    cpf: "",
    telefone: "11993966288",
    telefonePais: "Brasil",
    email: "",
    celular: "",
    celularPais: "Brasil",
    aniversario: "",
    sexo: "F",
    tags: "",
    tipoLogradouro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "",
    moedas: 0,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1037811",
    nome: "Adriana",
    cpf: "",
    telefone: "12982466363",
    telefonePais: "Brasil",
    email: "",
    celular: "",
    celularPais: "Brasil",
    aniversario: "",
    sexo: "F",
    tags: "",
    tipoLogradouro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "",
    moedas: 0,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1037812",
    nome: "Adriana Bitencourt",
    cpf: "",
    telefone: "13997288558",
    telefonePais: "Brasil",
    email: "",
    celular: "",
    celularPais: "Brasil",
    aniversario: "",
    sexo: "F",
    tags: "",
    tipoLogradouro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "",
    moedas: 0,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1037813",
    nome: "Adriana Cabello",
    cpf: "",
    telefone: "(19) 99239-3840",
    telefonePais: "Brasil",
    email: "",
    celular: "",
    celularPais: "Brasil",
    aniversario: "",
    sexo: "F",
    tags: "",
    tipoLogradouro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "",
    moedas: 0,
    creditos: 0,
    status: "inativo",
  },
  {
    cod: "1037814",
    nome: "Adriana Cherin",
    cpf: "",
    telefone: "11994527149",
    telefonePais: "Brasil",
    email: "",
    celular: "",
    celularPais: "Brasil",
    aniversario: "",
    sexo: "F",
    tags: "",
    tipoLogradouro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    bairro: "",
    estado: "",
    cidade: "",
    ultimaVisita: "",
    moedas: 0,
    creditos: 0,
    status: "inativo",
  },
];

type ModalState =
  | { type: "new" }
  | { type: "edit"; item: Cliente }
  | { type: "delete"; item: Cliente }
  | { type: "moedas"; item: Cliente }
  | { type: "credito"; item: Cliente }
  | null;

const emptyForm = (): Cliente => ({
  cod: "",
  nome: "",
  cpf: "",
  telefone: "",
  telefonePais: "Brasil",
  email: "",
  celular: "",
  celularPais: "Brasil",
  aniversario: "",
  sexo: "",
  tags: "",
  tipoLogradouro: "",
  endereco: "",
  numero: "",
  complemento: "",
  cep: "",
  bairro: "",
  estado: "",
  cidade: "",
  ultimaVisita: "",
  moedas: 0,
  creditos: 0,
  status: "ativo",
});

function BaseInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required ? " *" : ""}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition ${
          error ? "border-destructive" : "border-border"
        } focus:ring-2 focus:ring-primary/20`}
      />
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </div>
  );
}

function BaseSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
      >
        {options.map((option) => (
          <option key={`${label}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function PhoneField({
  label,
  country,
  value,
  onCountryChange,
  onValueChange,
}: {
  label: string;
  country: string;
  value: string;
  onCountryChange: (value: string) => void;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="grid grid-cols-[132px_1fr] gap-2">
        <select
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
        >
          {paisOptions.map((option) => (
            <option key={`${label}-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <input
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
}

function ModalCliente({
  open,
  mode,
  form,
  setForm,
  modalTab,
  setModalTab,
  tagInput,
  setTagInput,
  tagsList,
  setTagsList,
  onClose,
  onSave,
  showErrors,
}: {
  open: boolean;
  mode: "new" | "edit";
  form: Cliente | null;
  setForm: React.Dispatch<React.SetStateAction<Cliente | null>>;
  modalTab: ModalTab;
  setModalTab: React.Dispatch<React.SetStateAction<ModalTab>>;
  tagInput: string;
  setTagInput: React.Dispatch<React.SetStateAction<string>>;
  tagsList: string[];
  setTagsList: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
  onSave: () => void;
  showErrors: boolean;
}) {
  if (!form) return null;

  const errors = {
    nome: !form.nome.trim() ? "Informe o nome." : "",
    sexo: !form.sexo ? "Selecione o sexo." : "",
  };

  const handleAddTag = () => {
    const normalized = tagInput.trim();
    if (!normalized) return;
    const exists = tagsList.some((tag) => tag.toLowerCase() === normalized.toLowerCase());
    if (exists) return;
    const next = [...tagsList, normalized];
    setTagsList(next);
    setForm((prev) => (prev ? { ...prev, tags: next.join(", ") } : prev));
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const next = tagsList.filter((tag) => tag !== tagToRemove);
    setTagsList(next);
    setForm((prev) => (prev ? { ...prev, tags: next.join(", ") } : prev));
  };

  const cidadeOptions = cidadeOptionsMap[form.estado] ?? [{ value: "", label: "Selecione" }];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-[720px] border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
        <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <div className="flex items-start justify-between border-b border-border px-6 pb-4 pt-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {mode === "new" ? "Novo cliente" : "Editar cliente"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Preencha os dados do cliente.</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 pt-4">
            <div className="mb-5 flex gap-6 border-b border-border">
              <button
                type="button"
                onClick={() => setModalTab("basicos")}
                className={`border-b-2 pb-3 text-base font-medium transition ${
                  modalTab === "basicos"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Dados Básicos
              </button>

              <button
                type="button"
                onClick={() => setModalTab("endereco")}
                className={`border-b-2 pb-3 text-base font-medium transition ${
                  modalTab === "endereco"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Endereço
              </button>
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto px-6 pb-6">
            {modalTab === "basicos" && (
              <div className="space-y-4">
                <BaseInput
                  label="Nome"
                  required
                  value={form.nome}
                  onChange={(v) => setForm((prev) => (prev ? { ...prev, nome: v } : prev))}
                  error={showErrors ? errors.nome : ""}
                />

                <BaseInput
                  label="CPF"
                  value={form.cpf}
                  onChange={(v) => setForm((prev) => (prev ? { ...prev, cpf: v } : prev))}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <PhoneField
                    label="Telefone"
                    country={form.telefonePais}
                    value={form.telefone}
                    onCountryChange={(v) => setForm((prev) => (prev ? { ...prev, telefonePais: v } : prev))}
                    onValueChange={(v) => setForm((prev) => (prev ? { ...prev, telefone: v } : prev))}
                  />

                  <BaseInput
                    label="Email"
                    value={form.email}
                    onChange={(v) => setForm((prev) => (prev ? { ...prev, email: v } : prev))}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <PhoneField
                    label="Celular"
                    country={form.celularPais}
                    value={form.celular}
                    onCountryChange={(v) => setForm((prev) => (prev ? { ...prev, celularPais: v } : prev))}
                    onValueChange={(v) => setForm((prev) => (prev ? { ...prev, celular: v } : prev))}
                  />

                  <BaseInput
                    label="Aniversário"
                    value={form.aniversario}
                    placeholder="DD/MM/AAAA"
                    onChange={(v) => setForm((prev) => (prev ? { ...prev, aniversario: v } : prev))}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Sexo <span className="text-foreground">*</span>
                  </label>
                  <div className="flex items-center gap-6 pt-1">
                    <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="sexo"
                        checked={form.sexo === "M"}
                        onChange={() => setForm((prev) => (prev ? { ...prev, sexo: "M" } : prev))}
                      />
                      M
                    </label>

                    <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="sexo"
                        checked={form.sexo === "F"}
                        onChange={() => setForm((prev) => (prev ? { ...prev, sexo: "F" } : prev))}
                      />
                      F
                    </label>
                  </div>
                  {showErrors && errors.sexo ? <span className="text-xs text-destructive">{errors.sexo}</span> : null}
                </div>

                <div className="pt-2">
                  <label className="mb-2 block text-sm font-semibold text-foreground">Tags</label>

                  <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_auto]">
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Tag..."
                      className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
                    />

                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-700 px-4 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar
                    </button>
                  </div>

                  <div className="mt-3 min-h-[44px] rounded-xl border border-border bg-background px-3 py-2">
                    {tagsList.length === 0 ? (
                      <span className="text-sm text-muted-foreground">Nenhuma tag adicionada.</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {tagsList.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition hover:bg-background hover:text-destructive"
                              aria-label={`Remover tag ${tag}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {modalTab === "endereco" && (
              <div className="space-y-4">
                <BaseSelect
                  label="Tipo logradouro"
                  value={form.tipoLogradouro}
                  onChange={(v) => setForm((prev) => (prev ? { ...prev, tipoLogradouro: v } : prev))}
                  options={tipoLogradouroOptions}
                />

                <BaseInput
                  label="Endereço"
                  value={form.endereco}
                  onChange={(v) => setForm((prev) => (prev ? { ...prev, endereco: v } : prev))}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-[140px_1fr]">
                  <BaseInput
                    label="Nº"
                    value={form.numero}
                    onChange={(v) => setForm((prev) => (prev ? { ...prev, numero: v } : prev))}
                  />

                  <BaseInput
                    label="Complemento"
                    value={form.complemento}
                    onChange={(v) => setForm((prev) => (prev ? { ...prev, complemento: v } : prev))}
                  />
                </div>

                <BaseInput
                  label="CEP"
                  value={form.cep}
                  onChange={(v) => setForm((prev) => (prev ? { ...prev, cep: v } : prev))}
                />

                <BaseInput
                  label="Bairro"
                  value={form.bairro}
                  onChange={(v) => setForm((prev) => (prev ? { ...prev, bairro: v } : prev))}
                />

                <BaseSelect
                  label="Estado"
                  value={form.estado}
                  onChange={(v) =>
                    setForm((prev) =>
                      prev
                        ? {
                            ...prev,
                            estado: v,
                            cidade: "",
                          }
                        : prev,
                    )
                  }
                  options={estadoOptions}
                />

                <BaseSelect
                  label="Cidade"
                  value={form.cidade}
                  onChange={(v) => setForm((prev) => (prev ? { ...prev, cidade: v } : prev))}
                  options={cidadeOptions}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 border-t border-border px-6 py-4">
            <button
              type="button"
              onClick={onSave}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Check className="h-4 w-4" />
              Salvar
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-700 px-6 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SimpleActionModal({
  open,
  title,
  subtitle,
  value,
  setValue,
  placeholder,
  onSave,
  onClose,
}: {
  open: boolean;
  title: string;
  subtitle: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-[520px] border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
        <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <div className="flex items-start justify-between border-b border-border px-6 pb-4 pt-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-5">
            <BaseInput label={title} value={value} onChange={setValue} placeholder={placeholder} />
          </div>

          <div className="flex items-center justify-center gap-3 border-t border-border px-6 py-4">
            <button
              type="button"
              onClick={onSave}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Check className="h-4 w-4" />
              Salvar
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-700 px-6 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ListaClientes() {
  const [aulaOpen, setAulaOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");
  const [allData, setAllData] = useState(data);
  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<Cliente | null>(null);
  const [modalTab, setModalTab] = useState<ModalTab>("basicos");
  const [showErrors, setShowErrors] = useState(false);
  const [moedasQtd, setMoedasQtd] = useState("");
  const [creditoValor, setCreditoValor] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tagsList, setTagsList] = useState<string[]>([]);
  const { toast } = useToast();

  const filteredData = useMemo(() => {
    if (activeTab === "todos") return allData;
    return allData.filter((c) => c.status === activeTab);
  }, [activeTab, allData]);

  const openNew = () => {
    setForm(emptyForm());
    setModalTab("basicos");
    setShowErrors(false);
    setTagInput("");
    setTagsList([]);
    setModal({ type: "new" });
  };

  const openEdit = (item: Cliente) => {
    setForm({ ...item });
    setModalTab("basicos");
    setShowErrors(false);
    setTagInput("");
    setTagsList(
      item.tags
        ? item.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    );
    setModal({ type: "edit", item });
  };

  const openDelete = (item: Cliente) => setModal({ type: "delete", item });

  const openMoedas = (item: Cliente) => {
    setMoedasQtd("");
    setModal({ type: "moedas", item });
  };

  const openCredito = (item: Cliente) => {
    setCreditoValor("");
    setModal({ type: "credito", item });
  };

  const closeModal = () => {
    setModal(null);
    setForm(null);
    setModalTab("basicos");
    setShowErrors(false);
    setMoedasQtd("");
    setCreditoValor("");
    setTagInput("");
    setTagsList([]);
  };

  const handleSave = () => {
    if (!form) return;

    const nomeError = !form.nome.trim();
    const sexoError = !form.sexo;
    setShowErrors(true);

    if (nomeError || sexoError) {
      return;
    }

    const payload = { ...form, tags: tagsList.join(", ") };

    if (modal?.type === "new") {
      const nextCod = String(Math.max(...allData.map((d) => Number(d.cod) || 0), 0) + 1);
      setAllData((prev) => [{ ...payload, cod: nextCod }, ...prev]);
      toast({ title: "Cliente cadastrado" });
    } else if (modal?.type === "edit") {
      setAllData((prev) => prev.map((d) => (d.cod === payload.cod ? payload : d)));
      toast({ title: "Cliente atualizado" });
    }

    closeModal();
  };

  const handleDelete = () => {
    if (modal?.type !== "delete") return;
    setAllData((prev) => prev.filter((d) => d.cod !== modal.item.cod));
    toast({ title: "Cliente removido", variant: "destructive" });
    closeModal();
  };

  const handleMoedas = () => {
    if (modal?.type !== "moedas") return;
    const qtd = Number(moedasQtd) || 0;
    setAllData((prev) => prev.map((d) => (d.cod === modal.item.cod ? { ...d, moedas: d.moedas + qtd } : d)));
    toast({ title: `${qtd} moeda(s) adicionada(s) para ${modal.item.nome}` });
    closeModal();
  };

  const handleCredito = () => {
    if (modal?.type !== "credito") return;
    const val = Number(creditoValor.replace(",", ".")) || 0;
    setAllData((prev) => prev.map((d) => (d.cod === modal.item.cod ? { ...d, creditos: d.creditos + val } : d)));
    toast({ title: `Crédito de ${R$(val)} adicionado para ${modal.item.nome}` });
    closeModal();
  };

  const totalClientes = allData.length;
  const ativos = allData.filter((c) => c.status === "ativo").length;
  const semiAtivos = allData.filter((c) => c.status === "semi-ativo").length;
  const inativos = allData.filter((c) => c.status === "inativo").length;
  const totalMoedas = allData.reduce((s, c) => s + c.moedas, 0);
  const totalCreditos = allData.reduce((s, c) => s + c.creditos, 0);

  const bulkRemove = (indices: number[]) => {
    const cods = indices.map((i) => filteredData[i]?.cod).filter(Boolean);
    setAllData((prev) => prev.filter((d) => !cods.includes(d.cod)));
    toast({ title: `${cods.length} cliente(s) removido(s)`, variant: "destructive" });
  };

  const bulkMerge = (indices: number[]) =>
    toast({ title: `Mesclar ${indices.length} clientes`, description: "Funcionalidade em desenvolvimento" });

  const bulkMessage = (indices: number[]) =>
    toast({
      title: `Enviar mensagem para ${indices.length} cliente(s)`,
      description: "Funcionalidade em desenvolvimento",
    });

  const bulkTag = (indices: number[]) =>
    toast({ title: `Adicionar tag a ${indices.length} cliente(s)`, description: "Funcionalidade em desenvolvimento" });

  const selectionActions: SelectionAction[] = [
    {
      label: "Mesclar",
      icon: <Merge className="h-4 w-4" />,
      onClick: bulkMerge,
      description: "Unifica cadastros duplicados em um único registro",
    },
    {
      label: "Remover",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: bulkRemove,
      variant: "destructive",
      description: "Remove permanentemente os clientes selecionados da lista",
    },
    {
      label: "Mensagem",
      icon: <MessageCircle className="h-4 w-4" />,
      onClick: bulkMessage,
      description: "Envia mensagem via WhatsApp para os clientes selecionados",
    },
    {
      label: "Tag",
      icon: <Tag className="h-4 w-4" />,
      onClick: bulkTag,
      description: "Adiciona uma tag aos clientes selecionados",
    },
  ];

  const summaryCards: SummaryCard[] = [
    {
      label: "Moedas Distribuídas",
      value: String(totalMoedas),
      type: "quantity",
      icon: <Coins className="h-4 w-4" />,
      size: "compact",
      color: "blue",
    },
    {
      label: "Créditos em Aberto",
      value: R$(totalCreditos),
      icon: <CreditCard className="h-4 w-4" />,
      size: "wide",
      color: "blue",
    },
  ];

  const columns: Column<Cliente>[] = [
    { key: "cod", label: "ID", width: "90px" },
    {
      key: "nome",
      label: "Nome",
      pinned: true,
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <WhatsAppButton telefone={row.telefone} nome={row.nome} />
          <a href="/clientePesquisa" className="hover:underline font-medium">
            {v}
          </a>
        </div>
      ),
    },
    { key: "aniversario", label: "Aniversário" },
    { key: "ultimaVisita", label: "Última Visita" },
    { key: "moedas", label: "Moedas", align: "center" },
    { key: "creditos", label: "Créditos", align: "center", render: (v) => v.toFixed(1) },
    { key: "tags", label: "Tags" },
    {
      key: "status",
      label: "Status",
      render: (v: StatusCliente) => {
        const config: Record<StatusCliente, { label: string; color: string }> = {
          ativo: { label: "Ativo", color: "#00c5b4" },
          "semi-ativo": { label: "Semi-ativo", color: "#f59e0b" },
          inativo: { label: "Inativo", color: "#ff2f2f" },
        };
        const c = config[v];
        return (
          <span className="font-medium" style={{ color: c.color }}>
            {c.label}
          </span>
        );
      },
    },
    {
      key: "acoes" as any,
      label: "Ações",
      sortable: false,
      filterable: false,
      align: "center",
      render: (_, row) => (
        <ActionsMenu
          items={[
            { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: () => openEdit(row) },
            { label: "Moedas", icon: <Coins className="h-4 w-4" />, onClick: () => openMoedas(row) },
            { label: "Crédito", icon: <CreditCard className="h-4 w-4" />, onClick: () => openCredito(row) },
            {
              label: "Excluir",
              icon: <Trash2 className="h-4 w-4" />,
              variant: "destructive",
              onClick: () => openDelete(row),
            },
          ]}
        />
      ),
    },
  ];

  const tabs: TabDef[] = [
    { label: "Todos", value: "todos", count: totalClientes, color: "neutral" },
    { label: "Ativos", value: "ativo", count: ativos, color: "success" },
    { label: "Semi-ativos", value: "semi-ativo", count: semiAtivos, color: "warning" },
    { label: "Inativos", value: "inativo", count: inativos, color: "destructive" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Lista de Clientes"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />}
        data={filteredData}
        columns={columns}
        summaryCards={summaryCards}
        showDateFilter={true}
        selectable
        selectionActions={selectionActions}
        pageSize={15}
        novoMenuItems={[{ label: "Novo cliente", onClick: openNew }]}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tableId="lista_clientes"
      />

      <ModalCliente
        open={modal?.type === "new" || modal?.type === "edit"}
        mode={modal?.type === "edit" ? "edit" : "new"}
        form={form}
        setForm={setForm}
        modalTab={modalTab}
        setModalTab={setModalTab}
        tagInput={tagInput}
        setTagInput={setTagInput}
        tagsList={tagsList}
        setTagsList={setTagsList}
        onClose={closeModal}
        onSave={handleSave}
        showErrors={showErrors}
      />

      <Dialog open={modal?.type === "delete"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <DeleteModal
            title="Excluir cliente"
            message={modal?.type === "delete" ? `Deseja excluir "${modal.item.nome}"?` : ""}
            onConfirm={handleDelete}
            onClose={closeModal}
          />
        </DialogContent>
      </Dialog>

      <SimpleActionModal
        open={modal?.type === "moedas"}
        title="Adicionar moedas"
        subtitle={modal?.type === "moedas" ? `Para ${modal.item.nome}` : ""}
        value={moedasQtd}
        setValue={setMoedasQtd}
        placeholder="0"
        onSave={handleMoedas}
        onClose={closeModal}
      />

      <SimpleActionModal
        open={modal?.type === "credito"}
        title="Adicionar crédito"
        subtitle={modal?.type === "credito" ? `Para ${modal.item.nome}` : ""}
        value={creditoValor}
        setValue={setCreditoValor}
        placeholder="0,00"
        onSave={handleCredito}
        onClose={closeModal}
      />

      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Lista de Clientes"
      />
    </AppLayout>
  );
}
