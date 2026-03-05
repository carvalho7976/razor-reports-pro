import { useState } from "react";
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

const allData: Conta[] = [
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
      <span className={v === "Pago" ? "text-primary font-medium" : "text-warning font-medium"}>{v}</span>
    ),
  },
  { key: "dataPagamento", label: "Data Pagamento" },
];

export default function ContasPagar() {
  const [tab, setTab] = useState("pendentes");

  const data = allData.filter((d) =>
    tab === "todas" ? true : tab === "pendentes" ? d.status === "Pendente" : d.status === "Pago"
  );
  const total = data.reduce((s, r) => s + r.valor, 0);

  return (
    <AppLayout>
      <DataTable
        title="Contas à Pagar"
        data={data}
        columns={columns}
        totalRow={{ conta: "Total:", valor: R$(total) }}
        tabs={[
          { label: "Todas", value: "todas", count: allData.length },
          { label: "Pendentes", value: "pendentes", count: allData.filter(d => d.status === "Pendente").length },
          { label: "Pagas", value: "pagas", count: allData.filter(d => d.status === "Pago").length },
        ]}
        activeTab={tab}
        onTabChange={setTab}
        actions={
          <button className="btn-action bg-primary text-primary-foreground">
            <Plus className="h-4 w-4" /> Nova conta
          </button>
        }
      />
    </AppLayout>
  );
}
