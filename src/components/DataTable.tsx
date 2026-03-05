import { useState, useMemo, ReactNode, useCallback, useRef, useEffect } from "react";
import {
  Search, SlidersHorizontal, ChevronUp, ChevronDown,
  X, Pin, Eye, EyeOff, Calendar, Download, ListFilter,
  GripVertical, ChevronLeft, ChevronRight, ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, subWeeks, startOfYear, subYears, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

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

type DatePreset = "hoje" | "ontem" | "semana" | "semana_passada" | "mes" | "mes_passado" | "ano" | "personalizado" | null;

interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  title: string;
  actions?: ReactNode;
  totalRow?: Record<string, ReactNode>;
  emptyMessage?: string;
  tabs?: { label: string; value: string }[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  showDateFilter?: boolean;
  summaryCards?: { label: string; value: string; icon?: ReactNode }[];
  pageSize?: number;
}

function DatePresetPicker({
  datePreset,
  onSelect,
}: {
  datePreset: DatePreset;
  onSelect: (p: DatePreset) => void;
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

  const presets: { key: DatePreset; label: string }[] = [
    { key: "hoje", label: "Hoje" },
    { key: "ontem", label: "Ontem" },
    { key: "semana", label: "Esta semana" },
    { key: "semana_passada", label: "Semana passada" },
    { key: "mes", label: "Este mês" },
    { key: "mes_passado", label: "Mês passado" },
    { key: "ano", label: "Este ano" },
  ];

  const activeLabel = presets.find((p) => p.key === datePreset)?.label || "Período";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "toolbar-btn gap-2",
          datePreset && "toolbar-btn-active"
        )}
      >
        <Calendar className="h-4 w-4" />
        <span>{activeLabel}</span>
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>

      {open && (
        <div className="dropdown-panel left-0 top-full mt-2 min-w-[180px]">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-2">
            Período
          </p>
          <div className="space-y-0.5">
            {presets.map((p) => (
              <button
                key={p.key}
                onClick={() => { onSelect(datePreset === p.key ? null : p.key); setOpen(false); }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                  datePreset === p.key
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ColumnManager<T>({
  initialColumns,
  hiddenColumns,
  pinnedColumns,
  toggleColumn,
  togglePin,
}: {
  initialColumns: Column<T>[];
  hiddenColumns: Set<string>;
  pinnedColumns: Set<string>;
  toggleColumn: (key: string) => void;
  togglePin: (key: string) => void;
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
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="toolbar-btn"
        title="Gerenciar colunas"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span className="hidden sm:inline">Colunas</span>
      </button>

      {open && (
        <div className="dropdown-panel right-0 top-full mt-2 min-w-[260px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Colunas
            </p>
            <span className="text-[10px] text-muted-foreground">
              {initialColumns.length - hiddenColumns.size}/{initialColumns.length} visíveis
            </span>
          </div>

          <div className="space-y-0.5 max-h-[320px] overflow-y-auto">
            {initialColumns.map((col, i) => {
              const visible = !hiddenColumns.has(col.key);
              const pinned = pinnedColumns.has(col.key);

              return (
                <div
                  key={col.key}
                  className={cn(
                    "flex items-center gap-2 px-2 py-2 rounded-lg group transition-colors",
                    visible ? "hover:bg-muted" : "opacity-50 hover:bg-muted/50"
                  )}
                >
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />

                  <span className="text-xs text-muted-foreground w-4 text-center shrink-0">
                    {i + 1}
                  </span>

                  <span className="flex-1 text-sm truncate">{col.label}</span>

                  <button
                    onClick={() => togglePin(col.key)}
                    className={cn(
                      "p-1 rounded-md transition-colors",
                      pinned
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground/40 hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100"
                    )}
                    title={pinned ? "Desafixar" : "Fixar"}
                  >
                    <Pin className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => toggleColumn(col.key)}
                    className={cn(
                      "p-1 rounded-md transition-colors",
                      visible
                        ? "text-primary"
                        : "text-muted-foreground/40 hover:text-foreground"
                    )}
                    title={visible ? "Ocultar" : "Mostrar"}
                  >
                    {visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
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

export function DataTable<T extends Record<string, any>>({
  data,
  columns: initialColumns,
  title,
  actions,
  totalRow,
  emptyMessage = "Nenhum registro encontrado",
  tabs,
  activeTab,
  onTabChange,
  showDateFilter = true,
  summaryCards,
  pageSize = 20,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [pinnedColumns, setPinnedColumns] = useState<Set<string>>(() => {
    const set = new Set<string>();
    initialColumns.forEach((c) => c.pinned && set.add(c.key));
    return set;
  });
  const [datePreset, setDatePreset] = useState<DatePreset>(null);
  const [page, setPage] = useState(0);

  const columns = useMemo(() => {
    return initialColumns
      .filter((c) => !hiddenColumns.has(c.key))
      .sort((a, b) => {
        const aP = pinnedColumns.has(a.key) ? 0 : 1;
        const bP = pinnedColumns.has(b.key) ? 0 : 1;
        return aP - bP;
      });
  }, [initialColumns, hiddenColumns, pinnedColumns]);

  const activeFilters = useMemo<ActiveFilter[]>(() => {
    const filters: ActiveFilter[] = [];
    if (search) filters.push({ key: "__search", label: "Pesquisa", value: search });
    if (datePreset) {
      const labels: Record<string, string> = {
        hoje: "Hoje", ontem: "Ontem", semana: "Esta Semana",
        semana_passada: "Sem. Passada", mes: "Este Mês",
        mes_passado: "Mês Passado", ano: "Este Ano", personalizado: "Personalizado",
      };
      filters.push({ key: "__date", label: "Período", value: labels[datePreset] });
    }
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        const col = initialColumns.find((c) => c.key === key);
        filters.push({ key, label: col?.label || key, value });
      }
    });
    return filters;
  }, [search, datePreset, columnFilters, initialColumns]);

  const removeFilter = useCallback((key: string) => {
    if (key === "__search") setSearch("");
    else if (key === "__date") setDatePreset(null);
    else setColumnFilters((prev) => ({ ...prev, [key]: "" }));
  }, []);

  const filteredData = useMemo(() => {
    let result = [...data];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => String(row[col.key] ?? "").toLowerCase().includes(s))
      );
    }
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        const v = value.toLowerCase();
        result = result.filter((row) => String(row[key] ?? "").toLowerCase().includes(v));
      }
    });
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        const cmp = typeof aVal === "number" ? aVal - (bVal as number) : String(aVal).localeCompare(String(bVal));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return result;
  }, [data, search, columnFilters, sortKey, sortDir, columns]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pagedData = filteredData.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const togglePin = (key: string) => {
    setPinnedColumns((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
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
    <div className="space-y-5">
      {/* Header: Title + Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
            {filteredData.length > 0 && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {filteredData.length} registro{filteredData.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {actions}
          </div>
        </div>

        {/* Tabs */}
        {tabs && (
          <div className="flex gap-1 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onTabChange?.(tab.value)}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px",
                  activeTab === tab.value
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {summaryCards && (
        <div className="flex gap-3 flex-wrap">
          {summaryCards.map((card, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              {card.icon && (
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {card.icon}
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-sm font-bold text-foreground">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Pesquisar por nome, ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="toolbar-input pl-9 pr-3 py-2.5"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Date Preset */}
        {showDateFilter && (
          <DatePresetPicker datePreset={datePreset} onSelect={(p) => { setDatePreset(p); setPage(0); }} />
        )}

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn("toolbar-btn", showFilters && "toolbar-btn-active")}
        >
          <ListFilter className="h-4 w-4" />
          <span className="hidden sm:inline">Filtro</span>
        </button>

        {/* Column Manager */}
        <ColumnManager
          initialColumns={initialColumns}
          hiddenColumns={hiddenColumns}
          pinnedColumns={pinnedColumns}
          toggleColumn={toggleColumn}
          togglePin={togglePin}
        />

        {/* Sort indicator */}
        {sortKey && (
          <button
            onClick={() => { setSortKey(null); setSortDir("asc"); }}
            className="toolbar-btn text-primary border-primary/20 bg-primary/5"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span className="text-xs">
              {initialColumns.find(c => c.key === sortKey)?.label}
              {sortDir === "asc" ? " ↑" : " ↓"}
            </span>
            <X className="h-3 w-3 opacity-60" />
          </button>
        )}

        {/* Export */}
        <button className="toolbar-btn ml-auto">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Exportar</span>
        </button>
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {activeFilters.map((f) => (
            <span key={f.key} className="filter-chip">
              <span className="font-semibold">{f.label}:</span> {f.value}
              <button
                onClick={() => removeFilter(f.key)}
                className="ml-0.5 p-0.5 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            onClick={() => { setSearch(""); setDatePreset(null); setColumnFilters({}); }}
            className="text-xs text-destructive hover:underline font-medium"
          >
            Limpar todos
          </button>
        </div>
      )}

      {/* Table */}
      <div className="table-container overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap border-b border-border",
                    pinnedColumns.has(col.key) && "bg-muted/80 sticky left-0 z-10",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center"
                  )}
                  style={col.width ? { width: col.width } : undefined}
                >
                  <button
                    onClick={() => col.sortable !== false ? handleSort(col.key) : undefined}
                    className={cn(
                      "inline-flex items-center gap-1.5 group",
                      col.sortable !== false && "cursor-pointer hover:text-foreground transition-colors"
                    )}
                  >
                    <span>{col.label}</span>
                    {col.sortable !== false && (
                      <span className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">
                        {sortKey === col.key ? (
                          sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5 text-primary" /> : <ChevronDown className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>

            {/* Column Filter Row */}
            {showFilters && (
              <tr className="bg-muted/30">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-2 border-b border-border",
                      pinnedColumns.has(col.key) && "sticky left-0 z-10 bg-muted/50"
                    )}
                  >
                    {col.filterable !== false ? (
                      <input
                        type="text"
                        placeholder={`Filtrar ${col.label.toLowerCase()}...`}
                        value={columnFilters[col.key] || ""}
                        onChange={(e) => {
                          setColumnFilters((prev) => ({ ...prev, [col.key]: e.target.value }));
                          setPage(0);
                        }}
                        className="toolbar-input px-2.5 py-1.5 text-xs"
                      />
                    ) : null}
                  </th>
                ))}
              </tr>
            )}
          </thead>

          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground/30" />
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              pagedData.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-border/60 hover:bg-muted/40 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3.5 whitespace-nowrap text-sm",
                        pinnedColumns.has(col.key) && "sticky left-0 z-10 bg-card",
                        col.align === "right" && "text-right font-mono",
                        col.align === "center" && "text-center"
                      )}
                    >
                      {col.render ? col.render(row[col.key], row, i) : (row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}

            {/* Total Row */}
            {totalRow && (
              <tr className="bg-muted/60 font-semibold border-t-2 border-primary/20">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3.5 whitespace-nowrap text-sm",
                      pinnedColumns.has(col.key) && "sticky left-0 z-10 bg-muted/80",
                      col.align === "right" && "text-right font-mono",
                      col.align === "center" && "text-center"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            Mostrando {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filteredData.length)} de {filteredData.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="toolbar-btn px-2 py-1.5 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cn(
                  "h-8 w-8 rounded-lg text-xs font-medium transition-all",
                  page === i
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="toolbar-btn px-2 py-1.5 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
