import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column } from "@/components/DataTable";
import { Download, Eye } from "lucide-react";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Comissao {
  profissional: string;
  totalComissoes: number;
  totalAdiantamentos: number;
  totalPagar: number;
}

const data: Comissao[] = [
  { profissional: "Cesar", totalComissoes: 4956.2, totalAdiantamentos: 300, totalPagar: 4656.2 },
  { profissional: "Claudia", totalComissoes: 3737.97, totalAdiantamentos: 20, totalPagar: 3717.97 },
  { profissional: "Fila de espera", totalComissoes: 14.63, totalAdiantamentos: 60, totalPagar: -45.37 },
  { profissional: "Henrique", totalComissoes: 0, totalAdiantamentos: 0, totalPagar: 0 },
  { profissional: "Lara", totalComissoes: 40.47, totalAdiantamentos: 100, totalPagar: -59.53 },
  { profissional: "Marcia Silva", totalComissoes: 4615, totalAdiantamentos: 0, totalPagar: 4615 },
  { profissional: "Matheus", totalComissoes: 3472.07, totalAdiantamentos: 0, totalPagar: 3472.07 },
  { profissional: "Ramon", totalComissoes: 18, totalAdiantamentos: 150, totalPagar: -132 },
  { profissional: "Vini", totalComissoes: 135, totalAdiantamentos: 0, totalPagar: 135 },
];

const total = data.reduce((s, r) => s + r.totalPagar, 0);

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
  return (
    <AppLayout>
      <DataTable
        title="Comissões à Pagar"
        data={data}
        columns={columns}
        totalRow={{ profissional: "", totalPagar: R$(total) }}
        actions={
          <div className="flex items-center gap-2">
            <button className="btn-action bg-secondary text-secondary-foreground"><Download className="h-4 w-4" /> Pagar</button>
            <button className="btn-action bg-accent text-accent-foreground"><Eye className="h-4 w-4" /> Ver Cards</button>
          </div>
        }
      />
    </AppLayout>
  );
}
