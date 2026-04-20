import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { TextField, Dropdown, DatePickerField } from "@/components/FormModal";
import { useToast } from "@/hooks/use-toast";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const planoOptions = [
  { value: "", label: "Selecione..." },
  { value: "Plano Mensal", label: "Plano Mensal - R$ 89,90" },
  { value: "Plano Trimestral", label: "Plano Trimestral - R$ 239,90" },
  { value: "Plano Semestral", label: "Plano Semestral - R$ 449,90" },
  { value: "Plano Anual", label: "Plano Anual - R$ 849,90" },
];

const formaPagamentoOptions = [
  { value: "", label: "Selecione..." },
  { value: "Cartão de Crédito", label: "Cartão de Crédito" },
  { value: "Pix", label: "Pix" },
  { value: "Boleto", label: "Boleto" },
  { value: "Dinheiro", label: "Dinheiro" },
];

const periodicidadeOptions = [
  { value: "Mensal", label: "Mensal" },
  { value: "Trimestral", label: "Trimestral" },
  { value: "Semestral", label: "Semestral" },
  { value: "Anual", label: "Anual" },
];

const statusOptions = [
  { value: "Ativo", label: "Ativo" },
  { value: "Pausado", label: "Pausado" },
  { value: "Cancelado", label: "Cancelado" },
];

interface AssinaturaForm {
  cliente: string;
  email: string;
  celular: string;
  plano: string;
  periodicidade: string;
  valor: string;
  formaPagamento: string;
  diaVencimento: string;
  inicio: string;
  vencimento: string;
  status: string;
  observacoes: string;
  renovacaoAutomatica: boolean;
  notificarEmail: boolean;
  notificarWhatsapp: boolean;
  cobrancaAutomatica: boolean;
}

const emptyForm = (): AssinaturaForm => ({
  cliente: "",
  email: "",
  celular: "",
  plano: "",
  periodicidade: "Mensal",
  valor: "",
  formaPagamento: "",
  diaVencimento: "",
  inicio: "",
  vencimento: "",
  status: "Ativo",
  observacoes: "",
  renovacaoAutomatica: true,
  notificarEmail: true,
  notificarWhatsapp: false,
  cobrancaAutomatica: false,
});

const tabs = [
  { id: "dados", label: "Dados da Assinatura" },
  { id: "cobranca", label: "Cobrança" },
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

export default function AssinaturaCadastro() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const clienteParam = searchParams.get("cliente") || "";
  const planoParam = searchParams.get("plano") || "";

  const [form, setForm] = useState<AssinaturaForm>(() => ({
    ...emptyForm(),
    cliente: clienteParam,
    plano: planoParam,
  }));

  const [activeTab, setActiveTab] = useState("dados");

  const update = (field: keyof AssinaturaForm, value: string | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (value !== "" && value !== false) {
        toast({ title: "Alteração salva automaticamente" });
      }
      return next;
    });
  };

  const statusBadge = useMemo(() => {
    const map: Record<string, string> = {
      Ativo: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
      Pausado: "bg-amber-500/10 text-amber-600 border-amber-500/30",
      Cancelado: "bg-destructive/10 text-destructive border-destructive/30",
    };
    return map[form.status] || map.Ativo;
  }, [form.status]);

  return (
    <AppLayout>
      <div className="flex flex-col gap-0">
        <div className="mx-6 mt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-5">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-border bg-muted shadow-sm">
                <CreditCard className="h-7 w-7 text-muted-foreground" />
              </div>

              <div className="pt-1">
                <h1 className="text-xl font-bold text-foreground">
                  {form.cliente || "Nova assinatura"}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
                  <span>{form.plano || "Plano não definido"}</span>
                  {form.periodicidade && <span>{form.periodicidade}</span>}
                  {form.valor && <span>R$ {form.valor}</span>}
                </div>
                <div className="mt-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      statusBadge,
                    )}
                  >
                    {form.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

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

        <div className="mx-6 mt-5 pb-10">
          {activeTab === "dados" && (
            <div className="grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="grid gap-5">
                <SectionBlock title="Cliente" description="Identifique o assinante.">
                  <div className="grid gap-4">
                    <div className="max-w-xl">
                      <TextField
                        label="Cliente *"
                        value={form.cliente}
                        onChange={(v) => update("cliente", v)}
                        placeholder="Nome do cliente"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <TextField
                        label="Email"
                        value={form.email}
                        onChange={(v) => update("email", v)}
                        placeholder="email@exemplo.com"
                      />
                      <TextField
                        label="Celular"
                        value={form.celular}
                        onChange={(v) => update("celular", v)}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                </SectionBlock>

                <SectionBlock title="Plano" description="Escolha o plano e periodicidade da assinatura.">
                  <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Dropdown
                        label="Plano *"
                        value={form.plano}
                        setValue={(v) => update("plano", v)}
                        options={planoOptions}
                      />
                      <Dropdown
                        label="Periodicidade"
                        value={form.periodicidade}
                        setValue={(v) => update("periodicidade", v)}
                        options={periodicidadeOptions}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <TextField
                        label="Valor (R$) *"
                        value={form.valor}
                        onChange={(v) => update("valor", v)}
                        placeholder="0,00"
                      />
                      <DatePickerField
                        label="Início *"
                        value={form.inicio}
                        onChange={(v) => update("inicio", v)}
                      />
                      <DatePickerField
                        label="Próximo vencimento"
                        value={form.vencimento}
                        onChange={(v) => update("vencimento", v)}
                      />
                    </div>
                    <div className="max-w-sm">
                      <Dropdown
                        label="Status"
                        value={form.status}
                        setValue={(v) => update("status", v)}
                        options={statusOptions}
                      />
                    </div>
                  </div>
                </SectionBlock>
              </div>

              <div className="grid gap-5 self-start">
                <SectionBlock
                  title="Notificações"
                  description="Avisos automáticos enviados ao cliente."
                >
                  <div className="grid gap-3">
                    {[
                      { field: "notificarEmail" as const, label: "Notificar via email" },
                      { field: "notificarWhatsapp" as const, label: "Notificar via WhatsApp" },
                      { field: "renovacaoAutomatica" as const, label: "Renovação automática" },
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

                <SectionBlock title="Observações" description="Anotações internas sobre a assinatura.">
                  <textarea
                    value={form.observacoes}
                    onChange={(e) => update("observacoes", e.target.value)}
                    rows={5}
                    placeholder="Adicione observações..."
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-foreground focus:ring-4 focus:ring-muted resize-none"
                  />
                </SectionBlock>
              </div>
            </div>
          )}

          {activeTab === "cobranca" && (
            <div className="grid max-w-5xl gap-5">
              <SectionBlock title="Forma de cobrança" description="Configure como o cliente pagará a assinatura.">
                <div className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Dropdown
                      label="Forma de pagamento *"
                      value={form.formaPagamento}
                      setValue={(v) => update("formaPagamento", v)}
                      options={formaPagamentoOptions}
                    />
                    <TextField
                      label="Dia de vencimento"
                      value={form.diaVencimento}
                      onChange={(v) => update("diaVencimento", v)}
                      placeholder="Ex.: 10"
                    />
                  </div>
                </div>
              </SectionBlock>

              <SectionBlock
                title="Automação"
                description="Defina o comportamento de cobrança recorrente."
              >
                <div className="grid gap-3">
                  {[
                    {
                      field: "cobrancaAutomatica" as const,
                      label: "Cobrança automática a cada vencimento",
                    },
                    {
                      field: "renovacaoAutomatica" as const,
                      label: "Renovar automaticamente ao final do ciclo",
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
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}