import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, ActionsMenu, TabDef } from "@/components/DataTable";
import { Switch } from "@/components/ui/switch";
import { Trash2, Pencil, Ban, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { createPortal } from "react-dom";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";


type StatusFormaPagamento = "Ativo" | "Desativado";
type DestinoFormaPagamento = "CAIXA" | "CONTA" | "NENHUM";
type DiasReceber = "Imediato" | "1 Dia" | "2 Dias" | "15 Dias" | "30 Dias";

type BandeiraMaquina =
  | "sumup"
  | "elo"
  | "rede"
  | "stone"
  | "cielo"
  | "getnet"
  | "pagseguro"
  | "mercado_pago"
  | "nenhum";

type NomeFormaPagamento = "debito" | "credito" | "permuta";

interface FormaPagamento {
  id: number;
  nome: NomeFormaPagamento;
  tipo: BandeiraMaquina;
  taxa: number;
  destino: DestinoFormaPagamento;
  tempoParaCair: DiasReceber;
  status: StatusFormaPagamento;
  logo: BandeiraMaquina;
}

const initialData: FormaPagamento[] = [
  {
    id: 1,
    nome: "debito",
    tipo: "nenhum",
    taxa: 0,
    destino: "CONTA",
    tempoParaCair: "Imediato",
    status: "Ativo",
    logo: "nenhum",
  },
  {
    id: 2,
    nome: "credito",
    tipo: "sumup",
    taxa: 3.5,
    destino: "CONTA",
    tempoParaCair: "30 Dias",
    status: "Ativo",
    logo: "sumup",
  },
  {
    id: 3,
    nome: "debito",
    tipo: "rede",
    taxa: 1.99,
    destino: "CAIXA",
    tempoParaCair: "1 Dia",
    status: "Ativo",
    logo: "rede",
  },
  {
    id: 4,
    nome: "permuta",
    tipo: "nenhum",
    taxa: 0,
    destino: "NENHUM",
    tempoParaCair: "Imediato",
    status: "Desativado",
    logo: "nenhum",
  },
];

const nomeOptions: { value: NomeFormaPagamento; label: string }[] = [
  { value: "debito", label: "Débito" },
  { value: "credito", label: "Crédito" },
  { value: "permuta", label: "Permuta" },
];

const bandeiraOptions: { value: BandeiraMaquina; label: string }[] = [
  { value: "sumup", label: "SumUp" },
  { value: "elo", label: "Elo" },
  { value: "rede", label: "Rede" },
  { value: "stone", label: "Stone" },
  { value: "cielo", label: "Cielo" },
  { value: "getnet", label: "Getnet" },
  { value: "pagseguro", label: "PagSeguro" },
  { value: "mercado_pago", label: "Mercado Pago" },
  { value: "nenhum", label: "Nenhum" },
];

const destinoOptions: { value: DestinoFormaPagamento; label: string }[] = [
  { value: "CAIXA", label: "Caixa" },
  { value: "CONTA", label: "Conta" },
  { value: "NENHUM", label: "Nenhum (Permuta)" },
];

const diasReceberOptions: { value: DiasReceber; label: string }[] = [
  { value: "Imediato", label: "Imediato" },
  { value: "1 Dia", label: "1 Dia" },
  { value: "2 Dias", label: "2 Dias" },
  { value: "15 Dias", label: "15 Dias" },
  { value: "30 Dias", label: "30 Dias" },
];

const getNomeLabel = (value: NomeFormaPagamento) => nomeOptions.find((item) => item.value === value)?.label || value;

const getBandeiraLabel = (value: BandeiraMaquina) =>
  bandeiraOptions.find((item) => item.value === value)?.label || "Nenhum";

const getDestinoLabel = (value: DestinoFormaPagamento) =>
  destinoOptions.find((item) => item.value === value)?.label || value;

type ModalState =
  | { type: "new" }
  | { type: "edit"; item: FormaPagamento }
  | { type: "delete"; item: FormaPagamento }
  | null;

type DropdownOption = {
  value: string;
  label: string;
};

type EditableField = "nome" | "tipo" | "taxa" | "destino" | "tempoParaCair";

type EditingCell = {
  id: number;
  field: EditableField;
} | null;

const createEmptyForm = (): FormaPagamento => ({
  id: 0,
  nome: "debito",
  tipo: "nenhum",
  taxa: 0,
  destino: "CAIXA",
  tempoParaCair: "Imediato",
  status: "Ativo",
  logo: "nenhum",
});

function FakeLogo({ label, dark = true }: { label: string; dark?: boolean }) {
  return (
    <div
      className={[
        "flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold",
        dark ? "bg-neutral-900 text-white" : "bg-white/10 text-white",
      ].join(" ")}
    >
      {label?.[0] || "?"}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  return (
    <div className="min-h-[12px] pt-1">{message && <p className="text-xs font-medium text-red-500">{message}</p>}</div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="grid gap-1">
      <label className="text-sm font-semibold text-neutral-900">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          "h-11 w-full rounded-lg border px-3.5 text-sm outline-none transition-all bg-white",
          error
            ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
            : "border-neutral-200 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-200",
        ].join(" ")}
      />
      <FieldError message={error} />
    </div>
  );
}

function Dropdown({
  label,
  value,
  setValue,
  options,
  searchable = false,
  withLogo = false,
  error,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: DropdownOption[];
  searchable?: boolean;
  withLogo?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    if (!searchable) return options;
    return options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));
  }, [options, search, searchable]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative grid gap-1" ref={wrapperRef}>
      <label className="text-sm font-semibold text-neutral-900">{label}</label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={[
          "flex h-11 w-full items-center justify-between rounded-lg border bg-white px-3.5 text-sm transition-all",
          error ? "border-red-300 focus:ring-red-100" : "border-neutral-200 focus:ring-neutral-200",
          "hover:border-neutral-400 focus:border-neutral-900",
        ].join(" ")}
      >
        <div className="flex min-w-0 items-center gap-3">
          {withLogo && <FakeLogo label={selected?.label || "?"} />}
          <span className="truncate">{selected?.label}</span>
        </div>
        <svg className="h-4 w-4 text-neutral-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <FieldError message={error} />

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl">
          {searchable && (
            <div className="border-b p-3">
              <input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-900"
              />
            </div>
          )}

          <div className="max-h-60 overflow-auto">
            {filtered.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setValue(option.value);
                  setOpen(false);
                  setSearch("");
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition ${
                  option.value === value ? "bg-neutral-900 text-white" : "hover:bg-neutral-100"
                }`}
              >
                {withLogo && <FakeLogo label={option.label} dark={option.value !== value} />}
                <span className="truncate">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FormModal({
  title,
  subtitle,
  children,
  footer,
  onClose,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="w-full max-w-xl overflow-visible rounded-2xl bg-white shadow-2xl">
      <div className="relative rounded-t-2xl border-b border-neutral-200 bg-gradient-to-b from-neutral-50 to-white px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
            {subtitle && <p className="mt-0.5 text-sm text-neutral-500">{subtitle}</p>}
          </div>

          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="grid gap-2 px-6 pt-6 pb-8">{children}</div>

      <div className="border-t px-6 py-4">{footer}</div>
    </div>
  );
}

function FormRow({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 }) {
  return <div className={`grid gap-1.5 ${cols === 3 ? "grid-cols-3" : "grid-cols-2"}`}>{children}</div>;
}

function InlineTextInput({
  value,
  onChange,
  onSave,
  onCancel,
}: {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  const saveLockRef = useRef(false);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  const commit = () => {
    if (saveLockRef.current) return;
    saveLockRef.current = true;
    onSave();
    setTimeout(() => {
      saveLockRef.current = false;
    }, 0);
  };

  return (
    <input
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") onCancel();
      }}
      className="h-9 w-full rounded-md border border-neutral-300 bg-white px-2.5 text-sm outline-none focus:border-neutral-900"
    />
  );
}

function InlineSelect({
  value,
  onChange,
  onSave,
  onCancel,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  options: DropdownOption[];
}) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const saveLockRef = useRef(false);

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    function updatePosition() {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();

      setMenuStyle({
        position: "fixed",
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }

    if (open) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
    }

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        if (open) {
          setOpen(false);
          commitSave();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const commitSave = () => {
    if (saveLockRef.current) return;
    saveLockRef.current = true;
    onSave();
    setTimeout(() => {
      saveLockRef.current = false;
    }, 0);
  };

  return (
    <div ref={wrapperRef} className="relative min-w-[140px]">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (open) {
              setOpen(false);
              commitSave();
            } else {
              setOpen(true);
            }
          }

          if (e.key === "Escape") {
            setOpen(false);
            onCancel();
          }
        }}
        className="flex h-9 w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none transition-colors hover:border-neutral-400 focus:border-neutral-900"
      >
        <span className="truncate">{selected?.label}</span>

        <svg
          className={cn("h-4 w-4 text-neutral-400 transition-transform", open && "rotate-180")}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open &&
        createPortal(
          <div
            style={menuStyle}
            className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.14)]"
          >
            <div className="py-1">
              {options.map((option) => {
                const active = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      setTimeout(() => {
                        commitSave();
                      }, 0);
                    }}
                    className={cn(
                      "flex w-full items-center px-3 py-2 text-left text-sm transition-colors",
                      active ? "bg-neutral-900 text-white" : "text-neutral-800 hover:bg-neutral-100",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default function ListaFormasPagamento() {
  const [aulaOpen, setAulaOpen] = useState(false);
  const [allData, setAllData] = useState<FormaPagamento[]>(initialData);
  const [tab, setTab] = useState("todos");
  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<FormaPagamento | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [editingCell, setEditingCell] = useState<EditingCell>(null);
  const [draftValue, setDraftValue] = useState("");
  const { toast } = useToast();

  const data = useMemo(() => {
    if (tab === "todos") return allData;
    if (tab === "ativos") return allData.filter((d) => d.status === "Ativo");
    return allData.filter((d) => d.status === "Desativado");
  }, [tab, allData]);

  const errors = {
    nome: !form?.nome ? "Informe o nome da forma de pagamento." : "",
    taxa: form === null || Number.isNaN(Number(form.taxa)) ? "Informe uma taxa válida." : "",
  };

  const openNewModal = () => {
    setForm(createEmptyForm());
    setShowErrors(false);
    setModal({ type: "new" });
  };

  const openEditModal = (item: FormaPagamento) => {
    setForm({ ...item });
    setShowErrors(false);
    setModal({ type: "edit", item });
  };

  const openDeleteModal = (item: FormaPagamento) => {
    setModal({ type: "delete", item });
  };

  const closeModal = () => {
    setModal(null);
    setForm(null);
    setShowErrors(false);
  };

  const handleStatusChange = (id: number, checked: boolean) => {
    setAllData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: checked ? "Ativo" : "Desativado" } : item)),
    );

    toast({
      title: checked ? "Forma ativada" : "Forma desativada",
    });
  };

  const handleBandeiraChange = (value: BandeiraMaquina) => {
    if (!form) return;

    setForm({
      ...form,
      tipo: value,
      logo: value,
    });
  };

  const handleSave = () => {
    if (!form) return;

    setShowErrors(true);

    if (!form.nome) return;
    if (Number.isNaN(Number(form.taxa))) return;

    if (modal?.type === "new") {
      const nextId = allData.length ? Math.max(...allData.map((item) => item.id)) + 1 : 1;

      setAllData((prev) => [
        {
          ...form,
          id: nextId,
        },
        ...prev,
      ]);

      toast({ title: "Forma de pagamento cadastrada" });
      closeModal();
      return;
    }

    if (modal?.type === "edit") {
      setAllData((prev) => prev.map((item) => (item.id === form.id ? form : item)));
      toast({ title: "Forma de pagamento atualizada" });
      closeModal();
    }
  };

  const handleConfirmDelete = () => {
    if (!modal || modal.type !== "delete") return;

    setAllData((prev) => prev.filter((item) => item.id !== modal.item.id));
    toast({ title: "Forma de pagamento removida", variant: "destructive" });
    closeModal();
  };

  const bulkRemove = (indices: number[]) => {
    const ids = indices.map((i) => data[i]?.id).filter(Boolean);
    setAllData((prev) => prev.filter((d) => !ids.includes(d.id)));
    toast({ title: `${ids.length} forma(s) removida(s)`, variant: "destructive" });
  };

  const bulkDesativar = (indices: number[]) => {
    const ids = indices.map((i) => data[i]?.id).filter(Boolean);
    setAllData((prev) => prev.map((d) => (ids.includes(d.id) ? { ...d, status: "Desativado" } : d)));
    toast({ title: `${ids.length} forma(s) desativada(s)` });
  };

  const bulkAtivar = (indices: number[]) => {
    const ids = indices.map((i) => data[i]?.id).filter(Boolean);
    setAllData((prev) => prev.map((d) => (ids.includes(d.id) ? { ...d, status: "Ativo" } : d)));
    toast({ title: `${ids.length} forma(s) ativada(s)` });
  };

  const startEditing = (row: FormaPagamento, field: EditableField) => {
    setEditingCell({ id: row.id, field });
    setDraftValue(String(row[field] ?? ""));
  };

  const cancelEditing = () => {
    setEditingCell(null);
    setDraftValue("");
  };

  const saveEditing = () => {
    if (!editingCell) return;

    setAllData((prev) =>
      prev.map((item) => {
        if (item.id !== editingCell.id) return item;

        const updated = { ...item };

        if (editingCell.field === "taxa") {
          const parsed = Number(String(draftValue).replace(",", "."));
          if (Number.isNaN(parsed)) return item;
          updated.taxa = parsed;
        }

        if (editingCell.field === "nome") {
          updated.nome = draftValue as NomeFormaPagamento;
        }

        if (editingCell.field === "tipo") {
          updated.tipo = draftValue as BandeiraMaquina;
          updated.logo = draftValue as BandeiraMaquina;
        }

        if (editingCell.field === "destino") {
          updated.destino = draftValue as DestinoFormaPagamento;
        }

        if (editingCell.field === "tempoParaCair") {
          updated.tempoParaCair = draftValue as DiasReceber;
        }

        return updated;
      }),
    );

    setEditingCell(null);
    setDraftValue("");
    toast({ title: "Campo atualizado" });
  };

  const isEditing = (rowId: number, field: EditableField) => editingCell?.id === rowId && editingCell?.field === field;

  const selectionActions: SelectionAction[] = [
    {
      label: "Ativar",
      icon: <CheckCircle2 className="h-4 w-4" />,
      onClick: bulkAtivar,
      description: "Ativa as formas de pagamento selecionadas",
    },
    {
      label: "Desativar",
      icon: <Ban className="h-4 w-4" />,
      onClick: bulkDesativar,
      variant: "destructive",
      description: "Desativa as formas de pagamento selecionadas",
    },
    {
      label: "Remover",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: bulkRemove,
      variant: "destructive",
      description: "Remove as formas de pagamento selecionadas",
    },
  ];

  const columns: Column<FormaPagamento>[] = [
    {
      key: "nome",
      label: "Nome",
      pinned: true,
      render: (v, row) =>
        isEditing(row.id, "nome") ? (
          <InlineSelect
            value={draftValue}
            onChange={setDraftValue}
            onSave={saveEditing}
            onCancel={cancelEditing}
            options={nomeOptions}
          />
        ) : (
          <button
            type="button"
            onClick={() => startEditing(row, "nome")}
            className="text-left font-medium hover:underline"
          >
            {getNomeLabel(v as NomeFormaPagamento)}
          </button>
        ),
    },
    {
      key: "tipo",
      label: "Bandeira",
      render: (_v, row) =>
        isEditing(row.id, "tipo") ? (
          <InlineSelect
            value={draftValue}
            onChange={setDraftValue}
            onSave={saveEditing}
            onCancel={cancelEditing}
            options={bandeiraOptions}
          />
        ) : (
          <button
            type="button"
            onClick={() => startEditing(row, "tipo")}
            className="flex items-center gap-2 text-left hover:opacity-80"
          >
            <div
              className={cn("flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-white", {
                "bg-blue-600": row.tipo === "sumup",
                "bg-yellow-500": row.tipo === "elo",
                "bg-red-500": row.tipo === "rede",
                "bg-green-600": row.tipo === "stone",
                "bg-sky-500": row.tipo === "cielo",
                "bg-neutral-400": row.tipo === "nenhum",
                "bg-emerald-600": row.tipo === "getnet",
                "bg-violet-600": row.tipo === "pagseguro",
                "bg-cyan-700": row.tipo === "mercado_pago",
              })}
            >
              {getBandeiraLabel(row.tipo)?.[0]}
            </div>

            <span>{getBandeiraLabel(row.tipo)}</span>
          </button>
        ),
    },
    {
      key: "taxa",
      label: "Taxa",
      align: "center",
      render: (v, row) =>
        isEditing(row.id, "taxa") ? (
          <InlineTextInput value={draftValue} onChange={setDraftValue} onSave={saveEditing} onCancel={cancelEditing} />
        ) : (
          <button type="button" onClick={() => startEditing(row, "taxa")} className="hover:underline">
            {Number(v).toFixed(2)}%
          </button>
        ),
    },
    {
      key: "destino",
      label: "Destino",
      align: "center",
      render: (v, row) =>
        isEditing(row.id, "destino") ? (
          <InlineSelect
            value={draftValue}
            onChange={setDraftValue}
            onSave={saveEditing}
            onCancel={cancelEditing}
            options={destinoOptions}
          />
        ) : (
          <button type="button" onClick={() => startEditing(row, "destino")} className="hover:underline">
            {getDestinoLabel(v as DestinoFormaPagamento)}
          </button>
        ),
    },
    {
      key: "tempoParaCair",
      label: "Dias para Receber",
      align: "center",
      render: (v, row) =>
        isEditing(row.id, "tempoParaCair") ? (
          <InlineSelect
            value={draftValue}
            onChange={setDraftValue}
            onSave={saveEditing}
            onCancel={cancelEditing}
            options={diasReceberOptions}
          />
        ) : (
          <button type="button" onClick={() => startEditing(row, "tempoParaCair")} className="hover:underline">
            {v}
          </button>
        ),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (v, row) => (
        <div className="flex justify-center">
          <Switch
            checked={v === "Ativo"}
            onCheckedChange={(checked) => handleStatusChange(row.id, checked)}
            className="scale-90 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
          />
        </div>
      ),
    },
    {
      key: "acoes" as any,
      label: "Ações",
      sortable: false,
      filterable: false,
      align: "center",
      render: (_v, row) => (
        <ActionsMenu
          items={[
            {
              label: "Editar",
              icon: <Pencil className="h-4 w-4" />,
              onClick: () => openEditModal(row),
            },
            {
              label: "Excluir",
              icon: <Trash2 className="h-4 w-4" />,
              variant: "destructive",
              onClick: () => openDeleteModal(row),
            },
          ]}
        />
      ),
    },
  ];

  const tabs: TabDef[] = [
    { label: "Todos", value: "todos", count: allData.length, color: "neutral" },
    {
      label: "Ativos",
      value: "ativos",
      count: allData.filter((d) => d.status === "Ativo").length,
      color: "success",
    },
    {
      label: "Desativados",
      value: "desativados",
      count: allData.filter((d) => d.status === "Desativado").length,
      color: "destructive",
    },
  ];

  return (
    <AppLayout>
      <DataTable
        titleIcon={<AulaButton onClick={() => setAulaOpen(true)} />}
        title="Formas de Pagamento"
        data={data}
        columns={columns}
        selectable
        selectionActions={selectionActions}
        showDateFilter={true}
        novoMenuItems={[
          {
            label: "Nova forma de pagamento",
            onClick: openNewModal,
          },
        ]}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        pageSize={15}
        tableId="lista_formas_pagamento"
      />

      <Dialog open={modal?.type === "new" || modal?.type === "edit"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          {form && (
            <FormModal
              title={modal?.type === "new" ? "Nova forma de pagamento" : "Editar forma de pagamento"}
              subtitleIcon={<AulaButton onClick={() => setAulaOpen(true)} />}
        title="Escolha e configure uma forma de pagamento."
              onClose={closeModal}
              footer={
                <div className="flex">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-neutral-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 active:scale-[0.98]"
                  >
                    Salvar
                  </button>
                </div>
              }
            >
              <Dropdown
                label="Nome"
                value={form.nome}
                setValue={(value) =>
                  setForm({
                    ...form,
                    nome: value as NomeFormaPagamento,
                  })
                }
                options={nomeOptions}
                error={showErrors ? errors.nome : ""}
              />

              <Dropdown
                label="Bandeira"
                value={form.tipo}
                setValue={(value) => handleBandeiraChange(value as BandeiraMaquina)}
                options={bandeiraOptions}
                searchable
                withLogo
              />

              <FormRow cols={3}>
                <TextField
                  label="Taxa"
                  value={Number.isNaN(form.taxa) ? "" : String(form.taxa)}
                  onChange={(value) => {
                    const raw = value.replace(",", ".");
                    setForm({
                      ...form,
                      taxa: raw === "" ? Number.NaN : Number(raw),
                    });
                  }}
                  placeholder="0,00"
                  error={showErrors ? errors.taxa : ""}
                />

                <Dropdown
                  label="Destino"
                  value={form.destino}
                  setValue={(value) =>
                    setForm({
                      ...form,
                      destino: value as DestinoFormaPagamento,
                    })
                  }
                  options={destinoOptions}
                />

                <Dropdown
                  label="Dias para Receber"
                  value={form.tempoParaCair}
                  setValue={(value) =>
                    setForm({
                      ...form,
                      tempoParaCair: value as DiasReceber,
                    })
                  }
                  options={diasReceberOptions}
                />
              </FormRow>
            </FormModal>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={modal?.type === "delete"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <div className="flex min-h-screen items-center justify-center p-5">
            <div className="w-full max-w-xl overflow-visible rounded-2xl bg-white shadow-2xl">
              <div className="relative rounded-t-2xl border-b border-neutral-200 bg-gradient-to-b from-neutral-50 to-white px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-semibold text-neutral-900">Excluir forma de pagamento</h1>
                    <p className="mt-0.5 text-sm text-neutral-500">Essa ação não poderá ser desfeita.</p>
                  </div>

                  <button
                    type="button"
                    aria-label="Fechar"
                    onClick={closeModal}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="grid gap-2 px-6 pt-6 pb-8">
                <p className="text-sm text-neutral-700">
                  {modal?.type === "delete" ? `Deseja excluir "${getNomeLabel(modal.item.nome)}"?` : ""}
                </p>
              </div>

              <div className="border-t px-6 py-4">
                <div className="flex">
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className={cn(
                      "inline-flex h-11 w-full items-center justify-center rounded-lg px-6 text-sm font-semibold text-white transition-colors active:scale-[0.98]",
                      "bg-destructive hover:bg-destructive/90",
                    )}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <YouTubeModal open={aulaOpen} onOpenChange={setAulaOpen} />
    </AppLayout>
  );
}
