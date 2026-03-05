import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column } from "@/components/DataTable";
import { Download } from "lucide-react";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Comissao {
  profissional: string;
  totalComissoes: number;
  totalAdiantamentos: number;
  totalPagar: number;
  status: string;
}

const allData: Comissao[] = [
  { profissional: "Cesar", totalComissoes: 4956.2, totalAdiantamentos: 300, totalPagar: 4656.2, status: "A Pagar" },
  { profissional: "Claudia", totalComissoes: 3737.97, totalAdiantamentos: 20, totalPagar: 3717.97, status: "A Pagar" },
  { profissional: "Fila de espera", totalComissoes: 14.63, totalAdiantamentos: 60, totalPagar: -45.37, status: "Pago" },
  { profissional: "Henrique", totalComissoes: 0, totalAdiantamentos: 0, totalPagar: 0, status: "Pago" },
  { profissional: "Lara", totalComissoes: 40.47, totalAdiantamentos: 100, totalPagar: -59.53, status: "Pago" },
  { profissional: "Marcia Silva", totalComissoes: 4615, totalAdiantamentos: 0, totalPagar: 4615, status: "A Pagar" },
  { profissional: "Matheus", totalComissoes: 3472.07, totalAdiantamentos: 0, totalPagar: 3472.07, status: "A Pagar" },
  { profissional: "Ramon", totalComissoes: 18, totalAdiantamentos: 150, totalPagar: -132, status: "Pago" },
  { profissional: "Vini", totalComissoes: 135, totalAdiantamentos: 0, totalPagar: 135, status: "A Pagar" },
];

const columns: Column<Comissao>[] = [
  { key: "profissional", label: "Profissional", pinned: true },
  { key: "totalComissoes", label: "Total em comissões", align: "right", render: (v) => R$(v) },
  { key: "totalAdiantamentos", label: "Total em adiantamentos", align: "right", render: (v) => R$(v) },
  {
    key: "totalPagar", label: "Total a Pagar", align: "right",
    render: (v) => <span className={v < 0 ? "text-destructive font-medium" : "text-primary font-medium"}>{R$(v)}</span>,
  },
  {
    key: "impressaoGerente" as any, label: "Impressão gerente", sortable: false, filterable: false, align: "center",
    render: () => <Download className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground mx-auto" />,
  },
  {
    key: "impressaoFunc" as any, label: "Impressão funcionário", sortable: false, filterable: false, align: "center",
    render: () => <Download className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground mx-auto" />,
  },
];

export default function ComissoesPagar() {
  const [tab, setTab] = useState("a_pagar");

  const data = allData.filter((d) =>
    tab === "todas" ? true : tab === "a_pagar" ? d.status === "A Pagar" : d.status === "Pago"
  );
  const total = data.reduce((s, r) => s + r.totalPagar, 0);

  return (
    <AppLayout>
      <DataTable
        title="Comissões"
        data={data}
        columns={columns}
        totalRow={{ profissional: "", totalPagar: R$(total) }}
        tabs={[
          { label: "Todas", value: "todas", count: allData.length },
          { label: "A Pagar", value: "a_pagar", count: allData.filter(d => d.status === "A Pagar").length },
          { label: "Pagas", value: "pagas", count: allData.filter(d => d.status === "Pago").length },
        ]}
        activeTab={tab}
        onTabChange={setTab}
      />
    </AppLayout>
  );
}
