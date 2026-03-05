import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column } from "@/components/DataTable";
import { Plus, Minus, Download } from "lucide-react";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Conta {
  conta: string;
  descricao: string;
  vencimento: string;
  valor: number;
  status: string;
  dataPagamento: string;
}

const data: Conta[] = [
  { conta: "Aluguel", descricao: "Aluguel do salão", vencimento: "10/03/2026", valor: 3500, status: "Pendente", dataPagamento: "" },
  { conta: "Energia", descricao: "Conta de luz", vencimento: "15/03/2026", valor: 890, status: "Pendente", dataPagamento: "" },
  { conta: "Água", descricao: "Conta de água", vencimento: "12/03/2026", valor: 280, status: "Pago", dataPagamento: "12/03/2026" },
  { conta: "Internet", descricao: "Internet fibra", vencimento: "20/03/2026", valor: 199.9, status: "Pendente", dataPagamento: "" },
  { conta: "Fornecedor", descricao: "Produtos de barba", vencimento: "05/03/2026", valor: 1250, status: "Pago", dataPagamento: "04/03/2026" },
  { conta: "Manutenção", descricao: "Reparo cadeira", vencimento: "25/03/2026", valor: 450, status: "Pendente", dataPagamento: "" },
];

const columns: Column<Conta>[] = [
  { key: "conta", label: "Conta", pinned: true },
  { key: "descricao", label: "Descrição" },
  { key: "vencimento", label: "Vencimento" },
  { key: "valor", label: "Valor", align: "right", render: (v) => R$(v) },
  {
    key: "status", label: "Status",
    render: (v) => (
      <span className={v === "Pago" ? "text-primary font-medium" : "text-warning font-medium"}>
        {v}
      </span>
    ),
  },
  { key: "dataPagamento", label: "Data Pagamento" },
];

const total = data.reduce((s, r) => s + r.valor, 0);

export default function ContasPagar() {
  return (
    <AppLayout>
      <DataTable
        title="Contas à Pagar"
        data={data}
        columns={columns}
        totalRow={{ conta: "Total:", valor: R$(total) }}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button className="btn-action bg-primary text-primary-foreground"><Plus className="h-4 w-4" /> Adicionar</button>
            <button className="btn-action bg-destructive text-destructive-foreground"><Minus className="h-4 w-4" /> Remover</button>
            <button className="btn-action bg-secondary text-secondary-foreground"><Download className="h-4 w-4" /> Pagar</button>
          </div>
        }
      />
    </AppLayout>
  );
}
