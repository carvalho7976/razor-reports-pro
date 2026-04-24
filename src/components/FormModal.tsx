import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-0.5 text-xs font-medium text-destructive">{message}</p>;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  type?: "text" | "number" | "date";
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-0.5">
      <label className="text-[13px] font-semibold text-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        className={cn(
          "h-10 w-full rounded-lg border px-3 text-sm outline-none transition-all bg-card text-foreground",
          disabled && "cursor-default opacity-100",
          error
            ? "border-destructive/50 focus:border-destructive focus:ring-4 focus:ring-destructive/10"
            : "border-border focus:border-foreground focus:ring-4 focus:ring-muted",
        )}
      />
      <FieldError message={error} />
    </div>
  );
}

export interface DropdownOption {
  value: string;
  label: string;
}

export function Dropdown({
  label,
  value,
  setValue,
  options,
  searchable = false,
  error,
  openDirection = "auto",
  placeholder = "Selecione...",
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: DropdownOption[];
  searchable?: boolean;
  error?: string;
  openDirection?: "auto" | "up" | "down";
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openUpward, setOpenUpward] = useState(openDirection === "up");
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    if (!open || !buttonRef.current) return;
    if (openDirection === "up") { setOpenUpward(true); return; }
    if (openDirection === "down") { setOpenUpward(false); return; }
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const estimated = Math.min(280, filtered.length * 44 + 16);
    setOpenUpward(spaceBelow < estimated && spaceAbove > spaceBelow);
  }, [open, filtered.length, searchable, openDirection]);

  if (searchable) {
    return (
      <div className="relative grid gap-0.5" ref={wrapperRef}>
        <label className="text-[13px] font-semibold text-foreground">{label}</label>
        <div
          ref={(el) => { (buttonRef as any).current = el; }}
          onClick={() => { setOpen(true); inputRef.current?.focus(); }}
          className={cn(
            "flex h-10 w-full cursor-text items-center justify-between gap-2 rounded-lg border bg-card px-3 text-sm text-foreground transition-all",
            error ? "border-destructive/50" : "border-border",
            open ? "border-foreground ring-4 ring-muted" : "hover:border-muted-foreground",
          )}
        >
          <input
            ref={inputRef}
            value={open ? search : (selected?.label ?? "")}
            onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
            onFocus={() => { setSearch(""); setOpen(true); }}
            placeholder={selected ? "" : placeholder}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <svg
            className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <FieldError message={error} />
        {open && (
          <div
            className={cn(
              "absolute left-0 z-50 w-full overflow-hidden rounded-lg border border-border bg-card shadow-xl",
              openUpward ? "bottom-full mb-2" : "top-full mt-2",
            )}
          >
            <div className="max-h-60 overflow-auto">
              {filtered.length === 0 && (
                <div className="px-4 py-3 text-sm text-muted-foreground">Nenhum resultado.</div>
              )}
              {filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setValue(option.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition",
                    option.value === value ? "bg-foreground text-background" : "hover:bg-muted",
                  )}
                >
                  <span className="truncate text-left">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative grid gap-0.5" ref={wrapperRef}>
      <label className="text-[13px] font-semibold text-foreground">{label}</label>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border bg-card px-3 text-sm text-foreground transition-all",
          error ? "border-destructive/50 focus:ring-destructive/10" : "border-border focus:ring-muted",
          "hover:border-muted-foreground focus:border-foreground",
        )}
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <svg
          className="h-4 w-4 text-muted-foreground"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <FieldError message={error} />
      {open && (
        <div
          className={cn(
            "absolute left-0 z-50 w-full overflow-hidden rounded-lg border border-border bg-card shadow-xl",
            openUpward ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
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
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-sm transition",
                  option.value === value ? "bg-foreground text-background" : "hover:bg-muted",
                )}
              >
                <span className="truncate">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function MultiDropdown({
  label,
  values,
  setValues,
  options,
  searchable = true,
  placeholder = "Selecione...",
  error,
  openDirection = "auto",
}: {
  label: string;
  values: string[];
  setValues: (values: string[]) => void;
  options: DropdownOption[];
  searchable?: boolean;
  placeholder?: string;
  error?: string;
  openDirection?: "auto" | "up" | "down";
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openUpward, setOpenUpward] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selected = options.filter((o) => values.includes(o.value));

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

  useEffect(() => {
    if (!open || !containerRef.current) return;
    if (openDirection === "up") { setOpenUpward(true); return; }
    if (openDirection === "down") { setOpenUpward(false); return; }
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const estimated = Math.min(280, filtered.length * 40 + 16);
    setOpenUpward(spaceBelow < estimated && spaceAbove > spaceBelow);
  }, [open, filtered.length, openDirection]);

  const toggle = (val: string) => {
    if (values.includes(val)) {
      setValues(values.filter((v) => v !== val));
    } else {
      setValues([...values, val]);
    }
    setSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative grid gap-0.5" ref={wrapperRef}>
      <label className="text-[13px] font-semibold text-foreground">{label}</label>
      <div
        ref={containerRef}
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
        className={cn(
          "flex min-h-10 w-full cursor-text items-center justify-between gap-2 rounded-lg border bg-card px-2 py-1 text-sm text-foreground transition-all",
          error ? "border-destructive/50" : "border-border",
          open ? "border-foreground ring-4 ring-muted" : "hover:border-muted-foreground",
        )}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1">
          {selected.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 rounded-md bg-foreground px-2 py-0.5 text-xs font-medium text-background"
            >
              {opt.label}
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(opt.value);
                }}
                className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full hover:bg-background/20"
              >
                ✕
              </span>
            </span>
          ))}
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !search && selected.length > 0) {
                toggle(selected[selected.length - 1].value);
              }
            }}
            placeholder={selected.length === 0 ? placeholder : ""}
            className="min-w-[80px] flex-1 bg-transparent px-1 py-0.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <svg
          className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <FieldError message={error} />
      {open && (
        <div
          className={cn(
            "absolute left-0 z-50 w-full overflow-hidden rounded-lg border border-border bg-card shadow-xl",
            openUpward ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          <div className="max-h-60 overflow-auto">
            {filtered.length === 0 && (
              <div className="px-4 py-3 text-sm text-muted-foreground">Nenhum resultado.</div>
            )}
            {filtered.map((option) => {
              const checked = values.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggle(option.value)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition",
                    "hover:bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                      checked ? "border-foreground bg-foreground text-background" : "border-border bg-card",
                    )}
                  >
                    {checked && (
                      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 10l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="truncate text-left">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function FormModal({
  title,
  subtitle,
  children,
  footer,
  onClose,
  size = "md",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer: ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  return (
    <div
      className={cn(
        "w-full overflow-visible rounded-2xl bg-card shadow-2xl",
        size === "sm" && "max-w-md",
        size === "md" && "max-w-xl",
        size === "lg" && "max-w-4xl",
        size === "xl" && "max-w-5xl",
      )}
    >
      <div className="relative rounded-t-2xl border-b border-border bg-gradient-to-b from-muted/50 to-card px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="grid gap-3 px-6 pt-5 pb-6">{children}</div>
      <div className="border-t border-border px-6 py-3">{footer}</div>
    </div>
  );
}

export function FormRow({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 }) {
  return <div className={`grid gap-3 ${cols === 3 ? "grid-cols-3" : "grid-cols-2"}`}>{children}</div>;
}

export function DeleteModal({
  title,
  message,
  onConfirm,
  onClose,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="w-full max-w-xl overflow-visible rounded-2xl bg-card shadow-2xl">
      <div className="relative rounded-t-2xl border-b border-border bg-gradient-to-b from-muted/50 to-card px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Essa ação não poderá ser desfeita.</p>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="grid gap-1 px-6 pt-5 pb-6">
        <p className="text-sm text-foreground/80">{message}</p>
      </div>
      <div className="border-t border-border px-6 py-3">
        <div className="flex">
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "inline-flex h-11 w-full items-center justify-center rounded-lg px-6 text-sm font-semibold text-destructive-foreground transition-colors active:scale-[0.98]",
              "bg-destructive hover:bg-destructive/90",
            )}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export function PasswordModal({
  nome,
  onConfirm,
  onClose,
}: {
  nome: string;
  onConfirm: (senha: string) => void;
  onClose: () => void;
}) {
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const errors = {
    senha: !senha ? "Informe a nova senha." : senha.length < 4 ? "Mínimo de 4 caracteres." : "",
    confirmar: confirmar !== senha ? "As senhas não conferem." : "",
  };

  const handleSave = () => {
    setShowErrors(true);
    if (errors.senha || errors.confirmar) return;
    onConfirm(senha);
  };

  return (
    <FormModal
      title="Alterar senha"
      subtitle={`Definir nova senha para ${nome}`}
      onClose={onClose}
      footer={
        <div className="flex">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/90 active:scale-[0.98]"
          >
            Salvar
          </button>
        </div>
      }
    >
      <TextField label="Nova senha" value={senha} onChange={setSenha} error={showErrors ? errors.senha : ""} />
      <TextField
        label="Confirmar senha"
        value={confirmar}
        onChange={setConfirmar}
        error={showErrors ? errors.confirmar : ""}
      />
    </FormModal>
  );
}

export function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/90 active:scale-[0.98]"
      >
        Salvar
      </button>
    </div>
  );
}

export function DatePickerField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);

  const dateValue = useMemo(() => {
    if (!value) return undefined;
    try {
      return new Date(value + "T12:00:00");
    } catch {
      return undefined;
    }
  }, [value]);

  return (
    <div className="grid gap-0.5">
      <label className="text-[13px] font-semibold text-foreground">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-lg border bg-card px-3 text-sm transition-all",
              error
                ? "border-destructive/50 focus:ring-destructive/10"
                : "border-border focus:ring-muted",
              value ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <span>{dateValue ? format(dateValue, "dd/MM/yyyy") : "Selecione a data"}</span>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" sideOffset={4} style={{ zIndex: 9999 }}>
          <CalendarComponent
            mode="single"
            selected={dateValue}
            onSelect={(date) => {
              if (date) {
                onChange(format(date, "yyyy-MM-dd"));
              }
              setOpen(false);
            }}
            locale={ptBR}
            className="pointer-events-auto p-2"
          />
          <div className="border-t border-border px-3 py-1.5 flex justify-between">
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); }}
              className="text-xs text-destructive hover:underline font-medium"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={() => { onChange(format(new Date(), "yyyy-MM-dd")); setOpen(false); }}
              className="text-xs text-foreground hover:underline font-medium"
            >
              Hoje
            </button>
          </div>
        </PopoverContent>
      </Popover>
      <FieldError message={error} />
    </div>
  );
}
