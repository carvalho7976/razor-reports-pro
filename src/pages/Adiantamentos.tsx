import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column } from "@/components/DataTable";
import { Plus, Download, X, XCircle } from "lucide-react";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Adiantamento {
  data: string;
  profissional: string;
  valor: number;
  status: string;
  observacao: string;
}

const data: Adiantamento[] = [
  { data: "03/02/2026", profissional: "Cesar", valor: 100, status: "Pendente", observacao: "Balm - Qtd: 1 - R$ 100.00 desconto" },
  { data: "10/02/2026", profissional: "Claudia", valor: 20, status: "Pago", observacao: "Vale transporte" },
  { data: "15/02/2026", profissional: "Lara", valor: 100, status: "Pendente", observacao: "Adiantamento salarial" },
  { data: "20/02/2026", profissional: "Ramon", valor: 150, status: "Pago", observacao: "Vale alimentação" },
  { data: "01/03/2026", profissional: "Fila de espera", valor: 60, status: "Pendente", observacao: "Produto desconto" },
];

const total = data.reduce((s, r) => s + r.valor, 0);

const columns: Column<Adiantamento>[] = [
  { key: "data", label: "Data" },
  { key: "profissional", label: "Profissional" },
  { key: "valor", label: "Valor", align: "right", render: (v) => R$(v) },
  {
    key: "status", label: "Status",
    render: (v) => (
      <span className="flex justify-center">
        {v === "Pago" ? (
          <span className="text-primary">✓</span>
        ) : (
          <XCircle className="h-4 w-4 text-destructive" />
        )}
      </span>
    ),
  },
  { key: "observacao", label: "Observação" },
  {
    key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
    render: () => (
      <div className="flex items-center gap-2 justify-center">
        <Download className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
        <X className="h-4 w-4 text-destructive cursor-pointer hover:text-destructive/80" />
      </div>
    ),
  },
];

export default function Adiantamentos() {
  return (
    <AppLayout>
      <DataTable
        title="Adiantamentos"
        data={data}
        columns={columns}
        totalRow={{ profissional: "Total:", valor: R$(total) }}
        actions={
          <div className="flex items-center gap-2">
            <button className="btn-action bg-primary text-primary-foreground"><Plus className="h-4 w-4" /> Novo Vale</button>
            <button className="btn-action bg-accent text-accent-foreground"><Plus className="h-4 w-4" /> Vender Produto</button>
          </div>
        }
      />
    </AppLayout>
  );
}
