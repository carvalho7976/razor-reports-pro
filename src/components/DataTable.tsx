import { useState, useMemo, ReactNode, useCallback, useRef, useEffect, KeyboardEvent } from "react";
import {
  Search, SlidersHorizontal, ChevronUp, ChevronDown,
  X, Pin, Eye, EyeOff, Calendar, Download, ListFilter,
  ChevronLeft, ChevronRight, ArrowUpDown, MoreHorizontal,
  FileSpreadsheet, FileText, Plus, ChevronDown as ChevronDownIcon,
  GripVertical, Info,
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format, startOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, subWeeks, startOfYear, endOfYear, subYears } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  pinned?: boolean;
  render?: (value: any, row: T, index: number) => ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

type DatePreset = "hoje" | "ontem" | "semana" | "semana_passada" | "mes" | "mes_passado" | "ano" | "ano_passado" | "personalizado" | null;

interface ActiveFilter {
  id: string;
  key: string;
  label: string;
  value: string;
}

export interface SelectionAction {
  label: string;
  icon?: ReactNode;
  description?: string;
  onClick: (selectedIndices: number[]) => void;
  variant?: "default" | "destructive";
}

export interface NovoMenuItem {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
}

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  title: string;
  actions?: ReactNode;
  totalRow?: Record<string, ReactNode>;
  emptyMessage?: string;
  tabs?: { label: string; value: string; count?: number }[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  showDateFilter?: boolean;
  summaryCards?: { label: string; value: string; icon?: ReactNode }[];
  pageSize?: number;
  selectable?: boolean;
  selectionActions?: SelectionAction[];
  novoMenuItems?: NovoMenuItem[];
}

/* ── Novo Button (Notion-style) ── */
export function NovoButton({ items }: { items: NovoMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (items.length === 0) return null;

  // Single item: no dropdown
  if (items.length === 1) {
    return (
      <button onClick={items[0].onClick} className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[hsl(var(--novo-btn))] text-[hsl(var(--novo-btn-foreground))] text-sm font-medium hover:bg-[hsl(var(--novo-btn)/0.85)] transition-colors shadow-sm">
        <Plus className="h-4 w-4" />
        Novo
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[hsl(var(--novo-btn))] text-[hsl(var(--novo-btn-foreground))] text-sm font-medium hover:bg-[hsl(var(--novo-btn)/0.85)] transition-colors shadow-sm"
      >
        <Plus className="h-4 w-4" />
        Novo
        <ChevronDown className="h-3.5 w-3.5 ml-0.5 opacity-70" />
      </button>
      {open && (
        <div className="dropdown-panel right-0 top-full mt-2 min-w-[180px]">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { item.onClick?.(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Compact Date Range Picker ── */
function DateRangePicker({
  datePreset, onSelect, dateRange, onRangeChange,
}: {
  datePreset: DatePreset;
  onSelect: (p: DatePreset) => void;
  dateRange: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
}) {
  const [open, setOpen] = useState(false);

  const presets: { key: DatePreset; label: string }[] = [
    { key: "hoje", label: "Hoje" },
    { key: "ontem", label: "Ontem" },
    { key: "semana", label: "Esta semana" },
    { key: "semana_passada", label: "Sem. passada" },
    { key: "mes", label: "Este mês" },
    { key: "mes_passado", label: "Mês passado" },
    { key: "ano", label: "Este ano" },
    { key: "ano_passado", label: "Ano passado" },
  ];

  const handlePreset = (key: DatePreset) => {
    const today = new Date();
    let from: Date = today, to: Date = today;
    switch (key) {
      case "hoje": from = to = startOfDay(today); break;
      case "ontem": from = to = subDays(startOfDay(today), 1); break;
      case "semana": from = startOfWeek(today, { locale: ptBR }); to = endOfWeek(today, { locale: ptBR }); break;
      case "semana_passada": { const pw = subWeeks(today, 1); from = startOfWeek(pw, { locale: ptBR }); to = endOfWeek(pw, { locale: ptBR }); break; }
      case "mes": from = startOfMonth(today); to = endOfMonth(today); break;
      case "mes_passado": { const pm = subMonths(today, 1); from = startOfMonth(pm); to = endOfMonth(pm); break; }
      case "ano": from = startOfYear(today); to = endOfYear(today); break;
      case "ano_passado": { const py = subYears(today, 1); from = startOfYear(py); to = endOfYear(py); break; }
    }
    onRangeChange({ from, to });
    onSelect(key);
  };

  const displayLabel = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, "dd/MM/yy")} – ${format(dateRange.to, "dd/MM/yy")}`;
    }
    return "Período";
  }, [dateRange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={cn("toolbar-btn gap-1.5 text-xs", datePreset && "toolbar-btn-active")}>
          <Calendar className="h-3.5 w-3.5" />
          <span>{displayLabel}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
        <div className="flex flex-col sm:flex-row">
          <div className="border-b sm:border-b-0 sm:border-r border-border py-2 px-1.5 sm:pl-0 sm:pr-1.5 sm:min-w-[120px]">
            <div className="flex sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible">
              {presets.map((p) => (
                <button
                  key={p.key}
                  onClick={() => handlePreset(p.key)}
                  className={cn(
                    "whitespace-nowrap text-left px-2.5 py-1.5 text-xs rounded-md transition-colors shrink-0",
                    datePreset === p.key
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-2">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                onRangeChange(range);
                if (range?.from && range?.to) onSelect("personalizado");
              }}
              numberOfMonths={typeof window !== "undefined" && window.innerWidth < 640 ? 1 : 2}
              locale={ptBR}
              className="pointer-events-auto"
            />
          </div>
        </div>
        {datePreset && (
          <div className="border-t border-border px-3 py-2 flex justify-end">
            <button
              onClick={() => { onSelect(null); onRangeChange(undefined); setOpen(false); }}
              className="text-xs text-destructive hover:underline font-medium"
            >
              Limpar
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

/* ── Filter Dropdown ── */
function FilterDropdown<T>({
  columns, columnFilterInputs, setColumnFilterInputs, columnFilters, setColumnFilters, open, setOpen,
}: {
  columns: Column<T>[];
  columnFilterInputs: Record<string, string>;
  setColumnFilterInputs: (fn: (prev: Record<string, string>) => Record<string, string>) => void;
  columnFilters: Record<string, string[]>;
  setColumnFilters: (fn: (prev: Record<string, string[]>) => Record<string, string[]>) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const filterableCols = columns.filter((c) => c.filterable !== false);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setOpen]);

  const handleKeyDown = (key: string, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = columnFilterInputs[key]?.trim();
      if (!val) return;
      setColumnFilters((prev) => {
        const existing = prev[key] || [];
        if (existing.includes(val)) return prev;
        return { ...prev, [key]: [...existing, val] };
      });
      setColumnFilterInputs((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const removeChip = (key: string, value: string) => {
    setColumnFilters((prev) => {
      const arr = (prev[key] || []).filter((v) => v !== value);
      const next = { ...prev };
      if (arr.length === 0) delete next[key];
      else next[key] = arr;
      return next;
    });
  };

  if (!open) return null;

  return (
    <div ref={ref} className="dropdown-panel left-0 top-full mt-2 min-w-[280px] max-h-[400px] overflow-y-auto">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 pb-2">Filtrar por coluna</p>
      <div className="space-y-2.5">
        {filterableCols.map((col) => (
          <div key={col.key} className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground px-1">{col.label}</label>
            <input
              type="text"
              placeholder="Digite e pressione Enter"
              value={columnFilterInputs[col.key] || ""}
              onChange={(e) => setColumnFilterInputs((prev) => ({ ...prev, [col.key]: e.target.value }))}
              onKeyDown={(e) => handleKeyDown(col.key, e)}
              className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary/50 placeholder:text-muted-foreground/40 transition-all"
            />
            {(columnFilters[col.key] || []).length > 0 && (
              <div className="flex flex-wrap gap-1 pt-0.5">
                {columnFilters[col.key].map((v, i) => (
                  <span key={i} className="filter-chip !py-0.5 !px-2 !text-[10px]">
                    {v}
                    <button onClick={() => removeChip(col.key, v)} className="hover:text-destructive">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Column Manager (with drag & drop reorder) ── */
function ColumnManager<T>({
  initialColumns, hiddenColumns, pinnedColumns, toggleColumn, togglePin,
  columnOrder, onReorder,
}: {
  initialColumns: Column<T>[]; hiddenColumns: Set<string>; pinnedColumns: Set<string>;
  toggleColumn: (key: string) => void; togglePin: (key: string) => void;
  columnOrder: string[]; onReorder: (newOrder: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const orderedColumns = useMemo(() => {
    const map = new Map(initialColumns.map((c) => [c.key, c]));
    return columnOrder.map((k) => map.get(k)!).filter(Boolean);
  }, [initialColumns, columnOrder]);

  const handleDragStart = (idx: number) => { setDragIdx(idx); };
  const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setOverIdx(idx); };
  const handleDragEnd = () => {
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      const newOrder = [...columnOrder];
      const [moved] = newOrder.splice(dragIdx, 1);
      newOrder.splice(overIdx, 0, moved);
      onReorder(newOrder);
    }
    setDragIdx(null);
    setOverIdx(null);
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="toolbar-btn" title="Colunas">
        <SlidersHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="dropdown-panel right-0 top-full mt-2 min-w-[240px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Colunas</p>
            <span className="text-[10px] text-muted-foreground">{initialColumns.length - hiddenColumns.size}/{initialColumns.length}</span>
          </div>
          <div className="space-y-0.5 max-h-[320px] overflow-y-auto">
            {orderedColumns.map((col, idx) => {
              const visible = !hiddenColumns.has(col.key);
              const pinned = pinnedColumns.has(col.key);
              const isDragging = dragIdx === idx;
              const isOver = overIdx === idx;
              return (
                <div
                  key={col.key}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "flex items-center gap-1.5 px-1.5 py-1.5 rounded-lg group transition-colors cursor-grab active:cursor-grabbing select-none",
                    visible ? "hover:bg-muted" : "opacity-50 hover:bg-muted/50",
                    isDragging && "opacity-40",
                    isOver && !isDragging && "border-t-2 border-primary"
                  )}
                >
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 group-hover:text-muted-foreground" />
                  <span className="flex-1 text-sm truncate">{col.label}</span>
                  <button onClick={() => togglePin(col.key)} className={cn("p-1 rounded-md transition-colors", pinned ? "text-primary" : "text-muted-foreground/40 hover:text-foreground opacity-0 group-hover:opacity-100")} title={pinned ? "Desafixar" : "Fixar"}>
                    <Pin className="h-3 w-3" />
                  </button>
                  <button onClick={() => toggleColumn(col.key)} className={cn("p-1 rounded-md transition-colors", visible ? "text-foreground" : "text-muted-foreground/40 hover:text-foreground")} title={visible ? "Ocultar" : "Mostrar"}>
                    {visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Export Menu ── */
function ExportMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="toolbar-btn">
        <Download className="h-4 w-4" />
      </button>
      {open && (
        <div className="dropdown-panel right-0 top-full mt-2 min-w-[150px]">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors">
            <FileSpreadsheet className="h-4 w-4 text-success" /> Excel
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors">
            <FileText className="h-4 w-4 text-destructive" /> PDF
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors">
            <Download className="h-4 w-4 text-muted-foreground" /> CSV
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Actions Menu (3-dot) ── */
export function ActionsMenu({ items }: { items: { label: string; icon?: ReactNode; onClick?: () => void; variant?: "default" | "destructive" }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button onClick={() => setOpen(!open)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="dropdown-panel right-0 top-full mt-1 min-w-[160px]">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { item.onClick?.(); setOpen(false); }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors",
                item.variant === "destructive" && "text-destructive hover:bg-destructive/10"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Sort Dropdown (cumulative) ── */
interface SortEntry { key: string; dir: "asc" | "desc" }

function SortDropdown<T>({
  columns, sortEntries, onToggleSort, onClear,
}: {
  columns: Column<T>[]; sortEntries: SortEntry[];
  onToggleSort: (key: string) => void; onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const sortableCols = columns.filter((c) => c.sortable !== false);
  const sortMap = new Map(sortEntries.map((s) => [s.key, s.dir]));

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className={cn("toolbar-btn", sortEntries.length > 0 && "toolbar-btn-active")}>
        <ArrowUpDown className="h-4 w-4" />
        <span className="hidden sm:inline text-xs">
          {sortEntries.length > 0 ? `Ordenação (${sortEntries.length})` : "Ordenar"}
        </span>
      </button>
      {open && (
        <div className="dropdown-panel left-0 top-full mt-2 min-w-[220px]">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 pb-2">Clique para adicionar/alternar</p>
          {sortableCols.map((col) => {
            const dir = sortMap.get(col.key);
            const idx = sortEntries.findIndex((s) => s.key === col.key);
            return (
              <button
                key={col.key}
                onClick={() => onToggleSort(col.key)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors",
                  dir && "text-primary font-medium"
                )}
              >
                <span className="flex items-center gap-2">
                  {dir && (
                    <span className="h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                      {idx + 1}
                    </span>
                  )}
                  {col.label}
                </span>
                {dir && (
                  <span className="text-xs text-primary">
                    {dir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </span>
                )}
              </button>
            );
          })}
          {sortEntries.length > 0 && (
            <>
              <div className="h-px bg-border my-1" />
              <button
                onClick={() => { onClear(); setOpen(false); }}
                className="w-full px-3 py-2 text-sm text-destructive rounded-lg hover:bg-muted transition-colors text-left"
              >
                Limpar ordenação
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main DataTable ── */
export function DataTable<T extends Record<string, any>>({
  data, columns: initialColumns, title, actions, totalRow,
  emptyMessage = "Nenhum registro encontrado",
  tabs, activeTab, onTabChange, showDateFilter = true,
  summaryCards, pageSize = 20,
  selectable = false, selectionActions = [], novoMenuItems,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortEntries, setSortEntries] = useState<SortEntry[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [columnFilterInputs, setColumnFilterInputs] = useState<Record<string, string>>({});
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [pinnedColumns, setPinnedColumns] = useState<Set<string>>(() => {
    const set = new Set<string>();
    initialColumns.forEach((c) => c.pinned && set.add(c.key));
    return set;
  });
  const [datePreset, setDatePreset] = useState<DatePreset>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [page, setPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [columnOrder, setColumnOrder] = useState<string[]>(() => initialColumns.map((c) => c.key));

  const columns = useMemo(() => {
    const orderMap = new Map(columnOrder.map((k, i) => [k, i]));
    return initialColumns
      .filter((c) => !hiddenColumns.has(c.key))
      .sort((a, b) => {
        const pinDiff = (pinnedColumns.has(a.key) ? 0 : 1) - (pinnedColumns.has(b.key) ? 0 : 1);
        if (pinDiff !== 0) return pinDiff;
        return (orderMap.get(a.key) ?? 999) - (orderMap.get(b.key) ?? 999);
      });
  }, [initialColumns, hiddenColumns, pinnedColumns, columnOrder]);

  const activeFilters = useMemo<ActiveFilter[]>(() => {
    const filters: ActiveFilter[] = [];
    if (search) filters.push({ id: "__search", key: "__search", label: "Pesquisa", value: search });
    if (datePreset) {
      const labels: Record<string, string> = {
        hoje: "Hoje", ontem: "Ontem", semana: "Esta Semana",
        semana_passada: "Sem. Passada", mes: "Este Mês",
        mes_passado: "Mês Passado", ano: "Este Ano", ano_passado: "Ano Passado", personalizado: "Personalizado",
      };
      filters.push({ id: "__date", key: "__date", label: "Período", value: labels[datePreset] });
    }
    Object.entries(columnFilters).forEach(([key, values]) => {
      values.forEach((value, idx) => {
        const col = initialColumns.find((c) => c.key === key);
        filters.push({ id: `${key}_${idx}`, key, label: col?.label || key, value });
      });
    });
    sortEntries.forEach((s, idx) => {
      const col = initialColumns.find((c) => c.key === s.key);
      filters.push({ id: `__sort_${idx}`, key: "__sort", label: "Ordenar", value: `${col?.label || s.key} ${s.dir === "asc" ? "A-Z" : "Z-A"}` });
    });
    return filters;
  }, [search, datePreset, columnFilters, sortEntries, initialColumns]);

  const removeFilter = useCallback((id: string, key: string, value: string) => {
    if (key === "__search") setSearch("");
    else if (key === "__date") { setDatePreset(null); setDateRange(undefined); }
    else if (key === "__sort") {
      const sortLabel = value.replace(/ A-Z$| Z-A$/, "");
      setSortEntries((prev) => prev.filter((s) => {
        const col = initialColumns.find((c) => c.key === s.key);
        return (col?.label || s.key) !== sortLabel;
      }));
    }
    else {
      setColumnFilters((prev) => {
        const arr = (prev[key] || []).filter((v) => v !== value);
        const next = { ...prev };
        if (arr.length === 0) delete next[key];
        else next[key] = arr;
        return next;
      });
    }
  }, [initialColumns]);

  const handleToggleSort = useCallback((key: string) => {
    setSortEntries((prev) => {
      const idx = prev.findIndex((s) => s.key === key);
      if (idx === -1) return [...prev, { key, dir: "asc" }];
      if (prev[idx].dir === "asc") return prev.map((s, i) => i === idx ? { ...s, dir: "desc" as const } : s);
      return prev.filter((_, i) => i !== idx);
    });
  }, []);
  const clearSort = useCallback(() => setSortEntries([]), []);

  const filteredData = useMemo(() => {
    let result = [...data];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => String(row[col.key] ?? "").toLowerCase().includes(s))
      );
    }
    const allFilterEntries = Object.entries(columnFilters).filter(([, values]) => values.length > 0);
    if (allFilterEntries.length > 0) {
      result = result.filter((row) =>
        allFilterEntries.some(([key, values]) =>
          values.some((v) => String(row[key] ?? "").toLowerCase().includes(v.toLowerCase()))
        )
      );
    }
    if (sortEntries.length > 0) {
      result.sort((a, b) => {
        for (const { key, dir } of sortEntries) {
          const aVal = a[key], bVal = b[key];
          if (aVal == null && bVal == null) continue;
          if (aVal == null) return 1;
          if (bVal == null) return -1;
          const cmp = typeof aVal === "number" ? aVal - (bVal as number) : String(aVal).localeCompare(String(bVal));
          if (cmp !== 0) return dir === "asc" ? cmp : -cmp;
        }
        return 0;
      });
    }
    return result;
  }, [data, search, columnFilters, sortEntries, columns]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pagedData = filteredData.slice(page * pageSize, (page + 1) * pageSize);

  // Selection helpers
  const pagedIds = pagedData.map((_, i) => page * pageSize + i);
  const allPageSelected = selectable && pagedIds.length > 0 && pagedIds.every((id) => selectedRows.has(id));
  const somePageSelected = selectable && pagedIds.some((id) => selectedRows.has(id));

  const toggleSelectAll = () => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (allPageSelected) { pagedIds.forEach((id) => next.delete(id)); }
      else { pagedIds.forEach((id) => next.add(id)); }
      return next;
    });
  };
  const toggleSelectRow = (idx: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const togglePin = (key: string) => {
    setPinnedColumns((prev) => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });
  };
  const toggleColumn = (key: string) => {
    setHiddenColumns((prev) => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });
  };

  const activeFilterCount = Object.values(columnFilters).flat().length;

  return (
    <div className="space-y-3 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{title}</h1>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:flex-wrap">
        <div className="relative flex-1 min-w-0 sm:min-w-[180px] sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="toolbar-input pl-9 pr-3 py-2 w-full"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {showDateFilter && (
            <>
              <div className="h-5 w-px bg-border hidden sm:block" />
              <DateRangePicker datePreset={datePreset} onSelect={(p) => { setDatePreset(p); setPage(0); }} dateRange={dateRange} onRangeChange={setDateRange} />
            </>
          )}

          <ColumnManager initialColumns={initialColumns} hiddenColumns={hiddenColumns} pinnedColumns={pinnedColumns} toggleColumn={toggleColumn} togglePin={togglePin} columnOrder={columnOrder} onReorder={setColumnOrder} />

          <div className="relative">
            <button onClick={() => setShowFilters(!showFilters)} className={cn("toolbar-btn", showFilters && "toolbar-btn-active")}>
              <ListFilter className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Filtro</span>
              {activeFilterCount > 0 && (
                <span className="h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <FilterDropdown
              columns={initialColumns}
              columnFilterInputs={columnFilterInputs}
              setColumnFilterInputs={setColumnFilterInputs}
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
              open={showFilters}
              setOpen={setShowFilters}
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ExportMenu />
            <div className="h-5 w-px bg-border" />
            {novoMenuItems && <NovoButton items={novoMenuItems} />}
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {activeFilters.map((f) => (
            <span key={f.id} className="filter-chip">
              <span className="font-semibold">{f.label}:</span> {f.value}
              <button onClick={() => removeFilter(f.id, f.key, f.value)} className="ml-0.5 p-0.5 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            onClick={() => { setSearch(""); setDatePreset(null); setDateRange(undefined); setColumnFilters({}); setSortEntries([]); }}
            className="text-xs text-destructive hover:underline font-medium ml-1"
          >
            Limpar
          </button>
        </div>
      )}

      {/* Summary Cards */}
      {summaryCards && (
        <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3 sm:flex-wrap">
          {summaryCards.map((card, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-card rounded-xl border border-border shadow-sm">
              {card.icon && <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">{card.icon}</div>}
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{card.label}</p>
                <p className="text-xs sm:text-sm font-bold text-foreground truncate">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      {tabs && (
        <div className="border-b border-border">
          <div className="flex gap-0 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onTabChange?.(tab.value)}
                className={cn(
                  "relative px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-medium transition-colors -mb-px border-b-2 whitespace-nowrap",
                  activeTab === tab.value
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                )}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={cn(
                    "ml-1.5 sm:ml-2 text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full",
                    activeTab === tab.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selection Action Bar */}
      {selectable && selectedRows.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary/5 border border-primary/20 rounded-xl">
          <span className="text-xs sm:text-sm font-medium text-foreground">{selectedRows.size} selecionado{selectedRows.size > 1 ? "s" : ""}</span>
          <div className="h-4 w-px bg-border" />
          {selectionActions.map((action, i) => (
            <button
              key={i}
              onClick={() => { action.onClick(Array.from(selectedRows)); setSelectedRows(new Set()); }}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors",
                action.variant === "destructive"
                  ? "text-destructive hover:bg-destructive/10"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {action.icon}
              <span className="hidden sm:inline">{action.label}</span>
            </button>
          ))}
          <button onClick={() => setSelectedRows(new Set())} className="ml-auto text-xs text-muted-foreground hover:text-foreground">
            Limpar
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-table-header text-table-header-foreground sticky top-0 z-20">
                {selectable && (
                  <th className="w-10 px-3 py-3.5 border-b border-table-border">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      ref={(el) => { if (el) el.indeterminate = somePageSelected && !allPageSelected; }}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col) => {
                  const sortable = col.sortable !== false;
                  const sortIdx = sortEntries.findIndex((s) => s.key === col.key);
                  const sortDir = sortIdx !== -1 ? sortEntries[sortIdx].dir : null;
                  return (
                    <th
                      key={col.key}
                      onClick={sortable ? () => handleToggleSort(col.key) : undefined}
                      className={cn(
                        "px-5 py-3.5 text-left text-xs font-semibold whitespace-nowrap border-b border-table-border",
                        sortable && "cursor-pointer select-none hover:bg-table-header/80 transition-colors",
                        pinnedColumns.has(col.key) && "sticky left-0 z-10 bg-table-header",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center"
                      )}
                      style={col.width ? { width: col.width } : undefined}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {col.label}
                        {sortable && (
                          <span className={cn("inline-flex items-center text-table-header-foreground", !sortDir && "opacity-50")}>
                            {sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : sortDir === "desc" ? <ChevronDown className="h-3.5 w-3.5" /> : <ArrowUpDown className="h-3 w-3" />}
                          </span>
                        )}
                        {sortIdx !== -1 && sortEntries.length > 1 && (
                          <span className="h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                            {sortIdx + 1}
                          </span>
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {pagedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-5 py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-muted-foreground/20" />
                      <p className="text-sm">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pagedData.map((row, i) => {
                  const globalIdx = page * pageSize + i;
                  const isSelected = selectedRows.has(globalIdx);
                  return (
                    <tr key={i} className={cn("border-b border-border/50 hover:bg-muted/30 transition-colors", isSelected && "bg-primary/5")}>
                      {selectable && (
                        <td className="w-10 px-3 py-3.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(globalIdx)}
                            className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn(
                            "px-5 py-3.5 whitespace-nowrap text-sm text-foreground",
                            pinnedColumns.has(col.key) && "sticky left-0 z-10 bg-card",
                            col.align === "right" && "text-right font-mono",
                            col.align === "center" && "text-center"
                          )}
                        >
                          {col.render ? col.render(row[col.key], row, i) : (row[col.key] ?? "—")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}

              {totalRow && (
                <tr className="bg-muted/40 font-semibold border-t border-border">
                  {selectable && <td className="w-10 px-3 py-3.5" />}
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-5 py-3.5 whitespace-nowrap text-sm", pinnedColumns.has(col.key) && "sticky left-0 z-10 bg-muted/60", col.align === "right" && "text-right font-mono", col.align === "center" && "text-center")}>
                      {totalRow[col.key] ?? ""}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-3 sm:px-5 py-3 border-t border-border">
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filteredData.length)} de {filteredData.length}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 5) }, (_, i) => {
                const maxVisible = typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 5;
                const pageNum = totalPages <= maxVisible ? i : Math.max(0, Math.min(page - Math.floor(maxVisible / 2), totalPages - maxVisible)) + i;
                return (
                  <button key={pageNum} onClick={() => setPage(pageNum)} className={cn("h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-xs font-medium transition-all", page === pageNum ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
                    {pageNum + 1}
                  </button>
                );
              })}
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page === totalPages - 1} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Record count */}
      <p className="text-xs text-muted-foreground">{filteredData.length} registro{filteredData.length !== 1 ? "s" : ""}</p>
    </div>
  );
}
