import { useState, useMemo, ReactNode, useCallback, useRef, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  X,
  Pin,
  Eye,
  EyeOff,
  Calendar,
  Download,
  ArrowUpDown,
  MoreHorizontal,
  FileSpreadsheet,
  FileText,
  Plus,
  ChevronDown as ChevronDownIcon,
  GripVertical,
  Info,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  format,
  startOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  subWeeks,
  startOfYear,
  endOfYear,
  subYears,
  parse,
  isWithinInterval,
} from "date-fns";
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
  sortValue?: (row: T) => number | string;
  width?: string;
  align?: "left" | "center" | "right";
  editable?: boolean;
  editType?: "text" | "number" | "currency";
  cardWidth?: "compact" | "wide";
}

type DatePreset =
  | "hoje"
  | "ontem"
  | "semana"
  | "semana_passada"
  | "mes"
  | "mes_passado"
  | "ano"
  | "ano_passado"
  | "personalizado"
  | null;

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

export interface SummaryCard {
  label: string;
  value: string;
  icon?: ReactNode;
  type?: "monetary" | "quantity";
  sentiment?: "positive" | "negative" | "neutral";
  filterValue?: string;
  onFilter?: (value: string) => void;
  size?: "compact" | "wide";
  color?: "blue" | "green" | "red";
}

export interface TabDef {
  label: string;
  value: string;
  count?: number;
  color?: "neutral" | "success" | "info" | "warning" | "destructive";
}

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  title: string;
  titleIcon?: ReactNode;
  actions?: ReactNode;
  totalRow?: Record<string, ReactNode>;
  emptyMessage?: string;
  tabs?: TabDef[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  tabFilterFn?: (row: T, tabValue: string) => boolean;
  showDateFilter?: boolean;
  summaryCards?: SummaryCard[] | ((filteredData: T[]) => SummaryCard[]);
  pageSize?: number;
  selectable?: boolean;
  selectionActions?: SelectionAction[];
  novoMenuItems?: NovoMenuItem[];
  onCellEdit?: (rowIndex: number, key: string, value: any) => void;
  tableId?: string;
  dateField?: string;
  slotBetweenCardsAndTabs?: ReactNode;
}

/* ── Novo Button (Notion-style) ── */
export function NovoButton({ items }: { items: NovoMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (items.length === 0) return null;

  if (items.length === 1) {
    return (
      <button
        onClick={items[0].onClick}
        className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[hsl(var(--novo-btn))] text-[hsl(var(--novo-btn-foreground))] text-sm font-medium hover:bg-[hsl(var(--novo-btn)/0.85)] transition-colors shadow-sm"
      >
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
        <ChevronDownIcon className="h-3.5 w-3.5 ml-0.5 opacity-70" />
      </button>
      {open && (
        <div className="dropdown-panel right-0 top-full mt-2 min-w-[180px]">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                item.onClick?.();
                setOpen(false);
              }}
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
  datePreset,
  onSelect,
  dateRange,
  onRangeChange,
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
    { key: "semana_passada", label: "Semana anterior" },
    { key: "mes", label: "Este mês" },
    { key: "mes_passado", label: "Mês anterior" },
    { key: "ano", label: "Este ano" },
    { key: "ano_passado", label: "Ano anterior" },
  ];

  const handlePreset = (key: DatePreset) => {
    const today = new Date();
    let from: Date = today,
      to: Date = today;

    switch (key) {
      case "hoje":
        from = to = startOfDay(today);
        break;
      case "ontem":
        from = to = subDays(startOfDay(today), 1);
        break;
      case "semana":
        from = startOfWeek(today, { locale: ptBR });
        to = endOfWeek(today, { locale: ptBR });
        break;
      case "semana_passada": {
        const pw = subWeeks(today, 1);
        from = startOfWeek(pw, { locale: ptBR });
        to = endOfWeek(pw, { locale: ptBR });
        break;
      }
      case "mes":
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
      case "mes_passado": {
        const pm = subMonths(today, 1);
        from = startOfMonth(pm);
        to = endOfMonth(pm);
        break;
      }
      case "ano":
        from = startOfYear(today);
        to = endOfYear(today);
        break;
      case "ano_passado": {
        const py = subYears(today, 1);
        from = startOfYear(py);
        to = endOfYear(py);
        break;
      }
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
                    datePreset === p.key ? "bg-[#e5e5e5] text-black font-medium" : "text-foreground hover:bg-muted",
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
              onClick={() => {
                onSelect(null);
                onRangeChange(undefined);
                setOpen(false);
              }}
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

/* ── Search with Autocomplete Filter ── */
function SearchWithFilter<T>({
  columns,
  data,
  search,
  setSearch,
  columnFilters,
  setColumnFilters,
  onPageReset,
}: {
  columns: Column<T>[];
  data: T[];
  search: string;
  setSearch: (v: string) => void;
  columnFilters: Record<string, string[]>;
  setColumnFilters: (fn: (prev: Record<string, string[]>) => Record<string, string[]>) => void;
  onPageReset: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const filterableCols = columns.filter((c) => c.filterable !== false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const suggestions = useMemo(() => {
    if (!search || search.length < 1) return [];
    const s = search.toLowerCase();
    const results: { col: Column<T>; value: string }[] = [];
    const seen = new Set<string>();

    for (const col of filterableCols) {
      (data as Record<string, any>[]).forEach((row) => {
        const val = String(row[col.key] ?? "").trim();
        if (!val) return;
        const uniqueKey = `${col.key}::${val}`;
        if (seen.has(uniqueKey)) return;
        if (val.toLowerCase().includes(s)) {
          seen.add(uniqueKey);
          results.push({ col, value: val });
        }
      });
    }

    return results.slice(0, 30);
  }, [search, data, filterableCols]);

  const grouped = useMemo(() => {
    const map = new Map<string, { col: Column<T>; values: string[] }>();
    for (const s of suggestions) {
      if (!map.has(s.col.key)) map.set(s.col.key, { col: s.col, values: [] });
      map.get(s.col.key)!.values.push(s.value);
    }
    return Array.from(map.values());
  }, [suggestions]);

  const addFilter = (colKey: string, value: string) => {
    setColumnFilters((prev) => {
      const existing = prev[colKey] || [];
      if (existing.includes(value)) return prev;
      return { ...prev, [colKey]: [...existing, value] };
    });
    setSearch("");
    onPageReset();
    inputRef.current?.focus();
  };

  const showDropdown = focused && search.length >= 1 && grouped.length > 0;
  const activeFilterCount = Object.values(columnFilters).flat().length;

  return (
    <div className="relative flex-1 min-w-0 sm:min-w-[180px] sm:max-w-sm" ref={ref}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Pesquisar e filtrar..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onPageReset();
        }}
        onFocus={() => setFocused(true)}
        className="toolbar-input pl-9 pr-8 py-2 w-full border-info/50 focus:ring-info/40 focus:border-info/60"
      />
      {(search || activeFilterCount > 0) && (
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {activeFilterCount > 0 && (
            <span className="h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full bg-info text-info-foreground text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
          {search && (
            <button onClick={() => setSearch("")} className="p-0.5 rounded text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
      {showDropdown && (
        <div className="dropdown-panel left-0 top-full mt-1.5 w-full min-w-[280px] max-h-[320px] overflow-y-auto z-50">
          {grouped.map(({ col, values }) => (
            <div key={col.key}>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-2 pb-1">
                {col.label}
              </p>
              {values.slice(0, 8).map((val) => {
                const isSelected = (columnFilters[col.key] || []).includes(val);
                return (
                  <button
                    key={val}
                    onClick={() => addFilter(col.key, val)}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors truncate",
                      isSelected ? "bg-info/10 text-info font-medium" : "hover:bg-muted",
                    )}
                  >
                    {isSelected && <span className="mr-1.5">✓</span>}
                    {val}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Column Manager ── */
function ColumnManager<T>({
  initialColumns,
  hiddenColumns,
  pinnedColumns,
  toggleColumn,
  togglePin,
  columnOrder,
  onReorder,
  onReset,
}: {
  initialColumns: Column<T>[];
  hiddenColumns: Set<string>;
  pinnedColumns: Set<string>;
  toggleColumn: (key: string) => void;
  togglePin: (key: string) => void;
  columnOrder: string[];
  onReorder: (newOrder: string[]) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const orderedColumns = useMemo(() => {
    const map = new Map(initialColumns.map((c) => [c.key, c]));
    return columnOrder.map((k) => map.get(k)!).filter(Boolean);
  }, [initialColumns, columnOrder]);

  const handleDragStart = (idx: number) => setDragIdx(idx);

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setOverIdx(idx);
  };

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
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">
                {initialColumns.length - hiddenColumns.size}/{initialColumns.length}
              </span>
              <button
                onClick={onReset}
                className="text-[10px] text-destructive hover:underline font-medium"
                title="Resetar para padrão"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>
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
                    isOver && !isDragging && "border-t-2 border-primary",
                  )}
                >
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 group-hover:text-muted-foreground" />
                  <span className="flex-1 text-sm truncate">{col.label || col.key}</span>
                  <button
                    onClick={() => togglePin(col.key)}
                    className={cn(
                      "p-1 rounded-md transition-colors",
                      pinned
                        ? "text-primary"
                        : "text-muted-foreground/40 hover:text-foreground opacity-0 group-hover:opacity-100",
                    )}
                    title={pinned ? "Desafixar" : "Fixar"}
                  >
                    <Pin className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => toggleColumn(col.key)}
                    className={cn(
                      "p-1 rounded-md transition-colors",
                      visible ? "text-foreground" : "text-muted-foreground/40 hover:text-foreground",
                    )}
                    title={visible ? "Ocultar" : "Mostrar"}
                  >
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
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
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

/* ── Actions Menu ── */
export function ActionsMenu({
  items,
}: {
  items: { label: string; icon?: ReactNode; onClick?: () => void; variant?: "default" | "destructive" }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="dropdown-panel right-0 top-full mt-1 min-w-[160px]">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                item.onClick?.();
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors",
                item.variant === "destructive" && "text-destructive hover:bg-destructive/10",
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

/* ── Sort Dropdown ── */
interface SortEntry {
  key: string;
  dir: "asc" | "desc";
}

function SortDropdown<T>({
  columns,
  sortEntries,
  onToggleSort,
  onClear,
}: {
  columns: Column<T>[];
  sortEntries: SortEntry[];
  onToggleSort: (key: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const sortableCols = columns.filter((c) => c.sortable !== false);
  const sortMap = new Map(sortEntries.map((s) => [s.key, s.dir]));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn("toolbar-btn", sortEntries.length > 0 && "toolbar-btn-active")}
      >
        <ArrowUpDown className="h-4 w-4" />
        <span className="hidden sm:inline text-xs">
          {sortEntries.length > 0 ? `Ordenação (${sortEntries.length})` : "Ordenar"}
        </span>
      </button>
      {open && (
        <div className="dropdown-panel left-0 top-full mt-2 min-w-[220px]">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 pb-2">
            Clique para adicionar/alternar
          </p>
          {sortableCols.map((col) => {
            const dir = sortMap.get(col.key);
            const idx = sortEntries.findIndex((s) => s.key === col.key);
            return (
              <button
                key={col.key}
                onClick={() => onToggleSort(col.key)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors",
                  dir && "text-primary font-medium",
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
                onClick={() => {
                  onClear();
                  setOpen(false);
                }}
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

/* ── Parse date helper ── */
function parseDateBR(dateStr: string): Date | null {
  if (!dateStr) return null;
  const clean = dateStr.trim();
  const formats = ["dd/MM/yyyy HH:mm", "dd/MM/yyyy"];

  for (const fmt of formats) {
    try {
      const d = parse(clean, fmt, new Date());
      if (!isNaN(d.getTime())) return d;
    } catch {
      //
    }
  }
  return null;
}

/* ── Tab color mapping ── */
const tabColorMap: Record<string, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-success/20 text-success",
  info: "bg-info/20 text-info",
  warning: "bg-warning/20 text-warning",
  destructive: "bg-destructive/20 text-destructive",
};

const tabColorMapActive: Record<string, string> = {
  neutral: "bg-foreground text-background",
  success: "bg-success text-success-foreground",
  info: "bg-info text-info-foreground",
  warning: "bg-warning text-warning-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};

const tabBorderColor: Record<string, string> = {
  neutral: "border-foreground",
  success: "border-[hsl(var(--success))]",
  info: "border-[hsl(var(--info))]",
  warning: "border-[hsl(var(--warning))]",
  destructive: "border-[hsl(var(--destructive))]",
};

/* ── Pagination ── */
interface TablePaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

function TablePagination({
  page,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 15, 20, 30],
}: TablePaginationProps) {
  const currentPage = page + 1;
  const safeTotalPages = Math.max(1, totalPages);

  const getVisiblePages = (): (number | string)[] => {
    if (safeTotalPages <= 7) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", safeTotalPages];
    }

    if (currentPage >= safeTotalPages - 3) {
      return [1, "...", safeTotalPages - 4, safeTotalPages - 3, safeTotalPages - 2, safeTotalPages - 1, safeTotalPages];
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", safeTotalPages];
  };

  const pages = getVisiblePages();
  const start = totalItems === 0 ? 0 : page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-border bg-card px-4 py-3 sm:px-5 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(0, page - 1))}
          disabled={page === 0}
          className="inline-flex h-9 items-center justify-center rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Anterior
        </button>

        {pages.map((pageItem, index) =>
          pageItem === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-9 min-w-9 items-center justify-center px-1 text-sm font-medium text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <button
              key={pageItem}
              type="button"
              onClick={() => onPageChange(Number(pageItem) - 1)}
              className={cn(
                "inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-sm font-semibold transition-colors",
                currentPage === pageItem
                  ? "border border-primary bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {pageItem}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(safeTotalPages - 1, page + 1))}
          disabled={page >= safeTotalPages - 1}
          className="inline-flex h-9 items-center justify-center rounded-xl px-3 text-sm font-medium text-primary transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          Próxima
          <ChevronRight className="ml-1 h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {start}–{end} de {totalItems}
        </span>

        <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className="h-9 w-[110px] rounded-xl border border-border bg-background text-sm font-medium shadow-sm">
            <SelectValue />
          </SelectTrigger>

          <SelectContent align="end">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} / pág
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

/* ── Main DataTable ── */
export function DataTable<T extends Record<string, any>>({
  data,
  columns: initialColumns,
  title,
  titleIcon,
  actions,
  totalRow,
  emptyMessage = "Nenhum registro encontrado",
  tabs,
  activeTab,
  onTabChange,
  tabFilterFn,
  showDateFilter = true,
  summaryCards,
  pageSize = 20,
  selectable = false,
  selectionActions = [],
  novoMenuItems,
  onCellEdit,
  tableId,
  dateField,
  slotBetweenCardsAndTabs,
}: DataTableProps<T>) {
  const storageKey = tableId || title.replace(/\s+/g, "_").toLowerCase();

  const [search, setSearch] = useState("");
  const [sortEntries, setSortEntries] = useState<SortEntry[]>([]);
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [internalPageSize, setInternalPageSize] = useState(pageSize);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const [pinnedColumns, setPinnedColumns] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`col_pins_${storageKey}`);
      if (saved) return new Set(JSON.parse(saved) as string[]);
    } catch {
      //
    }
    const set = new Set<string>();
    initialColumns.forEach((c) => c.pinned && set.add(c.key));
    return set;
  });

  const [datePreset, setDatePreset] = useState<DatePreset>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    setInternalPageSize(pageSize);
  }, [pageSize]);

  const defaultOrder = useMemo(() => initialColumns.map((c) => c.key), [initialColumns]);

  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`col_order_${storageKey}`);
      if (saved) {
        const parsed = JSON.parse(saved) as string[];
        const validKeys = new Set(initialColumns.map((c) => c.key));
        const filtered = parsed.filter((k) => validKeys.has(k));
        initialColumns.forEach((c) => {
          if (!filtered.includes(c.key)) filtered.push(c.key);
        });
        return filtered;
      }
    } catch {
      //
    }
    return initialColumns.map((c) => c.key);
  });

  const saveColumnOrder = useCallback(
    (newOrder: string[]) => {
      setColumnOrder(newOrder);
      try {
        localStorage.setItem(`col_order_${storageKey}`, JSON.stringify(newOrder));
      } catch {
        //
      }
    },
    [storageKey],
  );

  const resetColumnOrder = useCallback(() => {
    setColumnOrder(defaultOrder);

    try {
      localStorage.removeItem(`col_order_${storageKey}`);
    } catch {
      //
    }

    const defaultPins = new Set<string>();
    initialColumns.forEach((c) => c.pinned && defaultPins.add(c.key));
    setPinnedColumns(defaultPins);

    try {
      localStorage.removeItem(`col_pins_${storageKey}`);
    } catch {
      //
    }
  }, [defaultOrder, storageKey, initialColumns]);

  const autoDateField = useMemo(() => {
    if (dateField) return dateField;

    const dateKeys = [
      "data",
      "dataFechamento",
      "dataCancelamento",
      "dataExclusao",
      "dataVenda",
      "vencimento",
      "ultimaVisita",
      "aniversario",
      "abertura",
    ];

    for (const key of dateKeys) {
      if (initialColumns.some((c) => c.key === key)) return key;
    }

    return null;
  }, [dateField, initialColumns]);

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
        hoje: "Hoje",
        ontem: "Ontem",
        semana: "Esta Semana",
        semana_passada: "Sem. Anterior",
        mes: "Este Mês",
        mes_passado: "Mês Anterior",
        ano: "Este Ano",
        ano_passado: "Ano Anterior",
        personalizado: "Personalizado",
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
      filters.push({
        id: `__sort_${idx}`,
        key: "__sort",
        label: "Ordenar",
        value: `${col?.label || s.key} ${s.dir === "asc" ? "A-Z" : "Z-A"}`,
      });
    });

    return filters;
  }, [search, datePreset, columnFilters, sortEntries, initialColumns]);

  const removeFilter = useCallback(
    (_id: string, key: string, value: string) => {
      if (key === "__search") {
        setSearch("");
      } else if (key === "__date") {
        setDatePreset(null);
        setDateRange(undefined);
      } else if (key === "__sort") {
        const sortLabel = value.replace(/ A-Z$| Z-A$/, "");
        setSortEntries((prev) =>
          prev.filter((s) => {
            const col = initialColumns.find((c) => c.key === s.key);
            return (col?.label || s.key) !== sortLabel;
          }),
        );
      } else {
        setColumnFilters((prev) => {
          const arr = (prev[key] || []).filter((v) => v !== value);
          const next = { ...prev };
          if (arr.length === 0) delete next[key];
          else next[key] = arr;
          return next;
        });
      }
    },
    [initialColumns],
  );

  const handleToggleSort = useCallback((key: string) => {
    setSortEntries((prev) => {
      const idx = prev.findIndex((s) => s.key === key);
      if (idx === -1) return [...prev, { key, dir: "asc" }];
      if (prev[idx].dir === "asc") {
        return prev.map((s, i) => (i === idx ? { ...s, dir: "desc" as const } : s));
      }
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  const baseFilteredData = useMemo(() => {
    let result = [...data];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) =>
          String(row[col.key] ?? "")
            .toLowerCase()
            .includes(s),
        ),
      );
    }

    const allFilterEntries = Object.entries(columnFilters).filter(([, values]) => values.length > 0);

    if (allFilterEntries.length > 0) {
      result = result.filter((row) =>
        allFilterEntries.some(([key, values]) =>
          values.some((v) =>
            String(row[key] ?? "")
              .toLowerCase()
              .includes(v.toLowerCase()),
          ),
        ),
      );
    }

    if (dateRange?.from && dateRange?.to && autoDateField) {
      result = result.filter((row) => {
        const dateStr = String(row[autoDateField] ?? "");
        const d = parseDateBR(dateStr);
        if (!d) return true;
        return isWithinInterval(d, {
          start: startOfDay(dateRange.from!),
          end: startOfDay(dateRange.to!),
        });
      });
    }

    return result;
  }, [data, search, columnFilters, columns, dateRange, autoDateField]);

  const dynamicTabCounts = useMemo(() => {
    if (!tabFilterFn || !tabs) return null;

    const counts: Record<string, number> = {};
    for (const tab of tabs) {
      counts[tab.value] = baseFilteredData.filter((row) => tabFilterFn(row, tab.value)).length;
    }
    return counts;
  }, [tabFilterFn, tabs, baseFilteredData]);

  const filteredData = useMemo(() => {
    let result =
      tabFilterFn && activeTab ? baseFilteredData.filter((row) => tabFilterFn(row, activeTab)) : [...baseFilteredData];

    if (sortEntries.length > 0) {
      result = [...result];
      result.sort((a, b) => {
        for (const { key, dir } of sortEntries) {
          const col = columns.find((c) => c.key === key);
          const aVal = col?.sortValue ? col.sortValue(a) : a[key];
          const bVal = col?.sortValue ? col.sortValue(b) : b[key];

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
  }, [baseFilteredData, tabFilterFn, activeTab, sortEntries, columns]);

  useEffect(() => {
    setPage(0);
  }, [search, columnFilters, dateRange, datePreset, activeTab, internalPageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / internalPageSize));

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

  const pagedData = filteredData.slice(page * internalPageSize, (page + 1) * internalPageSize);

  const filteredIds = filteredData.map((_, i) => i);
  const pagedIds = pagedData.map((_, i) => page * internalPageSize + i);

  const allPageSelected = selectable && pagedIds.length > 0 && pagedIds.every((id) => selectedRows.has(id));
  const somePageSelected = selectable && pagedIds.some((id) => selectedRows.has(id));

  const allFilteredSelected = selectable && filteredIds.length > 0 && filteredIds.every((id) => selectedRows.has(id));

  const selectCurrentPage = () => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      pagedIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const selectAllResults = () => {
    setSelectedRows(new Set(filteredIds));
  };

  const clearSelection = () => {
    setSelectedRows(new Set());
  };

  const toggleSelectAll = () => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        pagedIds.forEach((id) => next.delete(id));
      } else {
        pagedIds.forEach((id) => next.add(id));
      }
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
    setPinnedColumns((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);

      try {
        localStorage.setItem(`col_pins_${storageKey}`, JSON.stringify(Array.from(next)));
      } catch {
        //
      }

      return next;
    });
  };

  const toggleColumn = (key: string) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-3 sm:space-y-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{title}</h1>
          {titleIcon}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:flex-wrap">
        <SearchWithFilter
          columns={initialColumns}
          data={data}
          search={search}
          setSearch={setSearch}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          onPageReset={() => setPage(0)}
        />

        <div className="flex items-center gap-2 flex-wrap">
          {showDateFilter && (
            <>
              <div className="h-5 w-px bg-border hidden sm:block" />
              <DateRangePicker
                datePreset={datePreset}
                onSelect={(p) => {
                  setDatePreset(p);
                  setPage(0);
                }}
                dateRange={dateRange}
                onRangeChange={setDateRange}
              />
            </>
          )}

          <ColumnManager
            initialColumns={initialColumns}
            hiddenColumns={hiddenColumns}
            pinnedColumns={pinnedColumns}
            toggleColumn={toggleColumn}
            togglePin={togglePin}
            columnOrder={columnOrder}
            onReorder={saveColumnOrder}
            onReset={resetColumnOrder}
          />

          <div className="ml-auto flex items-center gap-2">
            <ExportMenu />
            <div className="h-5 w-px bg-border" />
            {novoMenuItems && <NovoButton items={novoMenuItems} />}
          </div>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {activeFilters.map((f) => (
            <span key={f.id} className="filter-chip">
              <span className="font-semibold">{f.label}:</span> {f.value}
              <button
                onClick={() => removeFilter(f.id, f.key, f.value)}
                className="ml-0.5 p-0.5 rounded-full hover:bg-[#d4d4d4] hover:text-black transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            onClick={() => {
              setSearch("");
              setDatePreset(null);
              setDateRange(undefined);
              setColumnFilters({});
              setSortEntries([]);
              setPage(0);
            }}
            className="text-xs text-red-500 hover:text-red-600 font-medium ml-1"
          >
            Limpar
          </button>
        </div>
      )}

      {summaryCards &&
        (() => {
          const resolvedCards = typeof summaryCards === "function" ? summaryCards(filteredData) : summaryCards;
          return (
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {resolvedCards.map((card, i) => {
                const isMonetary = card.type === "monetary";
                const isQuantity = card.type === "quantity";

                const sentimentColor =
                  card.sentiment === "positive"
                    ? "text-info"
                    : card.sentiment === "negative"
                      ? "text-destructive"
                      : "text-foreground";

                const sentimentEmoji =
                  card.sentiment === "positive" ? "🔵" : card.sentiment === "negative" ? "🔴" : "⚫";

                const isClickable = card.onFilter && card.filterValue;
                const isWide = isMonetary || card.size === "wide";
                const widthClass = isWide ? "min-w-[180px]" : "min-w-[120px]";

                const clickProps = isClickable
                  ? {
                      onClick: () => card.onFilter!(card.filterValue!),
                      role: "button" as const,
                      className: cn(
                        "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-card rounded-xl border border-border shadow-sm transition-colors",
                        "cursor-pointer hover:border-primary/30 hover:shadow-md",
                        widthClass,
                      ),
                    }
                  : {
                      className: cn(
                        "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-card rounded-xl border border-border shadow-sm",
                        widthClass,
                      ),
                    };

                if (isQuantity) {
                  return (
                    <div key={i} {...clickProps}>
                      {card.icon && (
                        <div
                          className={cn(
                            "h-8 w-8 sm:h-9 sm:w-9 rounded-lg flex items-center justify-center shrink-0",
                            card.color === "green"
                              ? "bg-emerald-100 text-emerald-600"
                              : card.color === "red"
                                ? "bg-red-100 text-red-500"
                                : card.color === "blue"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-primary/10 text-primary",
                          )}
                        >
                          {card.icon}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{card.label}</p>
                        <p className="text-xs sm:text-sm font-bold text-foreground whitespace-nowrap">{card.value}</p>
                      </div>
                    </div>
                  );
                }

                if (isMonetary) {
                  return (
                    <div key={i} {...clickProps}>
                      <span className="text-base sm:text-lg">{sentimentEmoji}</span>
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{card.label}</p>
                        <p className={cn("text-sm sm:text-base font-bold tabular-nums", sentimentColor)}>
                          {card.value}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={i} {...clickProps}>
                    {card.icon && (
                      <div
                        className={cn(
                          "h-8 w-8 sm:h-9 sm:w-9 rounded-lg flex items-center justify-center shrink-0",
                          card.color === "green"
                            ? "bg-emerald-100 text-emerald-600"
                            : card.color === "red"
                              ? "bg-red-100 text-red-500"
                              : card.color === "blue"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-primary/10 text-primary",
                        )}
                      >
                        {card.icon}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{card.label}</p>
                      <p className="text-xs sm:text-sm font-bold text-foreground whitespace-nowrap">{card.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

      {slotBetweenCardsAndTabs}

      {tabs && (
        <div className="border-b border-border">
          <div className="flex gap-0 flex-wrap">
            {tabs.map((tabDef) => {
              const color = tabDef.color || "neutral";
              const isActive = activeTab === tabDef.value;
              const count = dynamicTabCounts ? dynamicTabCounts[tabDef.value] : tabDef.count;

              return (
                <button
                  key={tabDef.value}
                  onClick={() => {
                    setSelectedRows(new Set());
                    setPage(0);
                    onTabChange?.(tabDef.value);
                  }}
                  className={cn(
                    "relative px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-medium transition-colors -mb-px border-b-2 whitespace-nowrap",
                    isActive
                      ? cn(tabBorderColor[color], "text-foreground")
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30",
                  )}
                >
                  {tabDef.label}
                  {count !== undefined && (
                    <span
                      className={cn(
                        "ml-1.5 sm:ml-2 text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full",
                        isActive ? tabColorMapActive[color] : tabColorMap[color],
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectable && selectedRows.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-info/5 border border-info/20 rounded-xl">
          <span className="text-xs sm:text-sm font-medium text-foreground">
            {selectedRows.size} selecionado{selectedRows.size > 1 ? "s" : ""}
          </span>

          <div className="h-4 w-px bg-border" />

          {!allPageSelected && pagedIds.length > 0 && (
            <button
              onClick={selectCurrentPage}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              Selecionar página atual
            </button>
          )}

          {!allFilteredSelected && filteredData.length > 0 && (
            <button
              onClick={selectAllResults}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-info hover:bg-info/10 transition-colors"
            >
              Selecionar todos os resultados
            </button>
          )}

          {selectionActions.map((action, i) => (
            <div key={i} className="inline-flex items-center gap-0.5">
              <button
                onClick={() => {
                  action.onClick(Array.from(selectedRows));
                  clearSelection();
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors",
                  action.variant === "destructive"
                    ? "text-destructive hover:bg-destructive/10"
                    : "text-success hover:bg-success/10",
                )}
              >
                {action.icon}
                <span className="hidden sm:inline">{action.label}</span>
              </button>
              {action.description && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-0.5 text-muted-foreground hover:text-foreground transition-colors">
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[200px] text-xs">
                    {action.description}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          ))}

          <button onClick={clearSelection} className="ml-auto text-xs text-muted-foreground hover:text-foreground">
            Limpar
          </button>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto max-h-[65vh] overflow-y-auto min-w-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-table-header text-table-header-foreground sticky top-0 z-20">
                {selectable && (
                  <th className="w-10 px-3 py-3.5 border-b border-table-border">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = somePageSelected && !allPageSelected;
                      }}
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
                        col.align === "center" && "text-center",
                      )}
                      style={col.width ? { width: col.width } : undefined}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {col.label}
                        {sortable && col.label && (
                          <span
                            className={cn(
                              "inline-flex items-center text-table-header-foreground",
                              !sortDir && "opacity-50",
                            )}
                          >
                            {sortDir === "asc" ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : sortDir === "desc" ? (
                              <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowUpDown className="h-3 w-3" />
                            )}
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
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="px-5 py-16 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-muted-foreground/20" />
                      <p className="text-sm">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pagedData.map((row, i) => {
                  const globalIdx = filteredData.findIndex((item) => item === row);
                  const isSelected = selectedRows.has(globalIdx);

                  return (
                    <tr
                      key={i}
                      className={cn(
                        "border-b border-border/50 hover:bg-muted/30 transition-colors",
                        isSelected && "bg-primary/5",
                      )}
                    >
                      {selectable && (
                        <td className="w-10 px-3 py-3.5">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelectRow(globalIdx)}
                            className="h-4 w-4 rounded-md border border-border bg-background hover:bg-muted data-[state=checked]:bg-blue-600
data-[state=checked]:border-blue-600 transition-all"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn(
                            "px-5 py-3.5 whitespace-nowrap text-sm text-foreground",
                            pinnedColumns.has(col.key) && "sticky left-0 z-10 bg-card",
                            col.align === "right" && "text-right",
                            col.align === "center" && "text-center",
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
                    <td
                      key={col.key}
                      className={cn(
                        "px-5 py-3.5 whitespace-nowrap text-sm",
                        pinnedColumns.has(col.key) && "sticky left-0 z-10 bg-muted/60",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center",
                      )}
                    >
                      {totalRow[col.key] ?? ""}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length > 0 && (
          <TablePagination
            page={page}
            totalPages={totalPages}
            pageSize={internalPageSize}
            totalItems={filteredData.length}
            onPageChange={setPage}
            onPageSizeChange={setInternalPageSize}
          />
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {filteredData.length} registro{filteredData.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
