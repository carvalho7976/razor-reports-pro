import { useState, useMemo, ReactNode, useCallback } from "react";
import {
  Search, Filter, SlidersHorizontal, ChevronUp, ChevronDown,
  X, Pin, Eye, EyeOff, Calendar, MoreVertical, Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

type DatePreset = "hoje" | "semana" | "mes" | "personalizado" | null;

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
  const [showColumnMenu, setShowColumnMenu] = useState(false);
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
      const labels: Record<string, string> = { hoje: "Hoje", semana: "Esta Semana", mes: "Este Mês", personalizado: "Personalizado" };
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
    <div className="space-y-4">
      {/* Title + Tabs */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions}
        </div>

        {tabs && (
          <div className="flex gap-1 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onTabChange?.(tab.value)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                  activeTab === tab.value
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
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
            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border shadow-sm">
              {card.icon}
              <span className="text-sm text-muted-foreground">{card.label}:</span>
              <span className="text-sm font-bold text-foreground">{card.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {showDateFilter && (
          <div className="flex items-center gap-1 bg-card rounded-md border border-border p-0.5">
            {(["hoje", "semana", "mes", "personalizado"] as DatePreset[]).map((preset) => (
              <button
                key={preset}
                onClick={() => setDatePreset(datePreset === preset ? null : preset)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded transition-colors",
                  datePreset === preset
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {{ hoje: "Hoje", semana: "Semana", mes: "Mês", personalizado: "Personalizado" }[preset!]}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "btn-action border text-sm py-2",
            showFilters
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:bg-muted"
          )}
        >
          <Filter className="h-4 w-4" />
          Filtros
        </button>

        <div className="relative">
          <button
            onClick={() => setShowColumnMenu(!showColumnMenu)}
            className="btn-action bg-card text-foreground border border-border hover:bg-muted text-sm py-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Colunas
          </button>
          {showColumnMenu && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-lg p-2 min-w-[200px] animate-slide-in">
              {initialColumns.map((col) => (
                <div key={col.key} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded hover:bg-muted">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!hiddenColumns.has(col.key)}
                      onChange={() => toggleColumn(col.key)}
                      className="rounded"
                    />
                    {col.label}
                  </label>
                  <button
                    onClick={() => togglePin(col.key)}
                    className={cn("p-1 rounded", pinnedColumns.has(col.key) ? "text-primary" : "text-muted-foreground hover:text-foreground")}
                    title={pinnedColumns.has(col.key) ? "Desafixar" : "Fixar"}
                  >
                    <Pin className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn-action bg-card text-foreground border border-border hover:bg-muted text-sm py-2">
          <Download className="h-4 w-4" />
          Exportar
        </button>
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Filtros:</span>
          {activeFilters.map((f) => (
            <span key={f.key} className="filter-chip">
              <span className="font-semibold">{f.label}:</span> {f.value}
              <button onClick={() => removeFilter(f.key)} className="ml-0.5 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            onClick={() => { setSearch(""); setDatePreset(null); setColumnFilters({}); }}
            className="text-xs text-destructive hover:underline"
          >
            Limpar todos
          </button>
        </div>
      )}

      {/* Pagination info */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Total: {filteredData.length} registro{filteredData.length !== 1 ? "s" : ""}
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={cn(
                    "h-7 w-7 rounded text-xs font-medium",
                    page === i ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="table-container overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-table-header">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap border-b border-table-border",
                    pinnedColumns.has(col.key) && "bg-table-header sticky left-0 z-10",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center"
                  )}
                  style={col.width ? { width: col.width } : undefined}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    {col.sortable !== false && (
                      <button onClick={() => handleSort(col.key)} className="text-muted-foreground hover:text-foreground">
                        {sortKey === col.key ? (
                          sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 opacity-30" />
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>

            {/* Filter row */}
            {showFilters && (
              <tr className="bg-table-header/50">
                {columns.map((col) => (
                  <th key={col.key} className={cn("px-4 py-1.5 border-b border-table-border", pinnedColumns.has(col.key) && "sticky left-0 z-10 bg-table-header")}>
                    {col.filterable !== false ? (
                      <input
                        type="text"
                        placeholder="Pesquisar..."
                        value={columnFilters[col.key] || ""}
                        onChange={(e) => {
                          setColumnFilters((prev) => ({ ...prev, [col.key]: e.target.value }));
                          setPage(0);
                        }}
                        className="w-full px-2 py-1 text-xs bg-card border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring font-normal"
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
                <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pagedData.map((row, i) => (
                <tr key={i} className="border-b border-table-border hover:bg-table-row-hover transition-colors">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3 whitespace-nowrap",
                        pinnedColumns.has(col.key) && "sticky left-0 z-10 bg-card",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center"
                      )}
                    >
                      {col.render ? col.render(row[col.key], row, i) : (row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}

            {/* Total row */}
            {totalRow && (
              <tr className="bg-table-header font-semibold border-t-2 border-table-border">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3 whitespace-nowrap",
                      pinnedColumns.has(col.key) && "sticky left-0 z-10 bg-table-header",
                      col.align === "right" && "text-right",
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
    </div>
  );
}
