import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column } from "@/components/DataTable";
import { CreditCard, Download } from "lucide-react";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Comanda {
  dataFechamento: string;
  usuarioFechamento: string;
  cliente: string;
  formaPagamento: string;
  valorPago: number;
}

const data: Comanda[] = [
  { dataFechamento: "04/03/2026 11:27", usuarioFechamento: "Lara", cliente: "Everton", formaPagamento: "[Débito R$ 215.0]", valorPago: 215 },
  { dataFechamento: "04/03/2026 11:33", usuarioFechamento: "Lara", cliente: "César", formaPagamento: "[Débito R$ 100.0]", valorPago: 100 },
  { dataFechamento: "04/03/2026 11:41", usuarioFechamento: "Lara", cliente: "Frizzar Demonstração", formaPagamento: "[Débito R$ 66.55]", valorPago: 66.55 },
  { dataFechamento: "04/03/2026 11:34", usuarioFechamento: "Lara", cliente: "CAIO CESAR DE SOUZA FERNANDES", formaPagamento: "[Débito R$ 75.0]", valorPago: 75 },
  { dataFechamento: "04/03/2026 17:47", usuarioFechamento: "Lara", cliente: "César", formaPagamento: "[Débito R$ 15.0]", valorPago: 15 },
  { dataFechamento: "04/03/2026 17:35", usuarioFechamento: "Lara", cliente: "Marlon", formaPagamento: "[Débito R$ 150.0]", valorPago: 150 },
  { dataFechamento: "04/03/2026 14:37", usuarioFechamento: "Lara", cliente: "CAIO CESAR DE SOUZA FERNANDES", formaPagamento: "[Débito R$ 45.0]", valorPago: 45 },
];

const total = data.reduce((s, r) => s + r.valorPago, 0);

const columns: Column<Comanda>[] = [
  { key: "dataFechamento", label: "Data Fechamento", pinned: true },
  { key: "usuarioFechamento", label: "Usuário Fechamento" },
  { key: "cliente", label: "Cliente" },
  { key: "formaPagamento", label: "Forma de pagamento" },
  { key: "valorPago", label: "Valor Pago", align: "right", render: (v) => R$(v) },
  { key: "comprovante" as any, label: "Comprovante", sortable: false, filterable: false, render: () => <Download className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" /> },
];

export default function MovimentacaoComandas() {
  return (
    <AppLayout>
      <DataTable
        title="Movimentação de Comandas"
        data={data}
        columns={columns}
        totalRow={{ cliente: "Total:", valorPago: R$(total) }}
        summaryCards={[
          { label: "Débito", value: R$(total), icon: <CreditCard className="h-4 w-4 text-muted-foreground" /> },
        ]}
      />
    </AppLayout>
  );
}
