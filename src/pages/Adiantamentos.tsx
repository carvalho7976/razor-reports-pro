import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column } from "@/components/DataTable";
import { Plus, XCircle } from "lucide-react";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Adiantamento {
  data: string;
  profissional: string;
  valor: number;
  status: string;
  observacao: string;
}

const allData: Adiantamento[] = [
  { data: "03/02/2026", profissional: "Cesar", valor: 100, status: "Pendente", observacao: "Balm - Qtd: 1 - R$ 100.00 desconto" },
  { data: "10/02/2026", profissional: "Claudia", valor: 20, status: "Pago", observacao: "Vale transporte" },
  { data: "15/02/2026", profissional: "Lara", valor: 100, status: "Pendente", observacao: "Adiantamento salarial" },
  { data: "20/02/2026", profissional: "Ramon", valor: 150, status: "Pago", observacao: "Vale alimentação" },
  { data: "01/03/2026", profissional: "Fila de espera", valor: 60, status: "Pendente", observacao: "Produto desconto" },
];

const columns: Column<Adiantamento>[] = [
  { key: "data", label: "Data" },
  { key: "profissional", label: "Profissional" },
  { key: "valor", label: "Valor", align: "right", render: (v) => R$(v) },
  {
    key: "status", label: "Status",
    render: (v) => (
      <span className={v === "Pago" ? "text-primary font-medium" : "text-warning font-medium"}>{v}</span>
    ),
  },
  { key: "observacao", label: "Observação" },
];

export default function Adiantamentos() {
  const [tab, setTab] = useState("todos");

  const data = allData.filter((d) =>
    tab === "todos" ? true : tab === "pendentes" ? d.status === "Pendente" : d.status === "Pago"
  );
  const total = data.reduce((s, r) => s + r.valor, 0);

  return (
    <AppLayout>
      <DataTable
        title="Adiantamentos"
        data={data}
        columns={columns}
        totalRow={{ profissional: "Total:", valor: R$(total) }}
        tabs={[
          { label: "Todos", value: "todos", count: allData.length },
          { label: "Pendentes", value: "pendentes", count: allData.filter(d => d.status === "Pendente").length },
          { label: "Pagos", value: "pagos", count: allData.filter(d => d.status === "Pago").length },
        ]}
        activeTab={tab}
        onTabChange={setTab}
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
