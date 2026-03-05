import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column } from "@/components/DataTable";
import { CreditCard } from "lucide-react";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Comanda {
  dataFechamento: string;
  usuarioFechamento: string;
  cliente: string;
  formaPagamento: string;
  valorPago: number;
  tipo: string;
}

const allData: Comanda[] = [
  { dataFechamento: "04/03/2026 11:27", usuarioFechamento: "Lara", cliente: "Everton", formaPagamento: "[Débito R$ 215.0]", valorPago: 215, tipo: "Entrada" },
  { dataFechamento: "04/03/2026 11:33", usuarioFechamento: "Lara", cliente: "César", formaPagamento: "[Débito R$ 100.0]", valorPago: 100, tipo: "Entrada" },
  { dataFechamento: "04/03/2026 11:41", usuarioFechamento: "Lara", cliente: "Frizzar Demonstração", formaPagamento: "[Débito R$ 66.55]", valorPago: 66.55, tipo: "Entrada" },
  { dataFechamento: "04/03/2026 11:34", usuarioFechamento: "Lara", cliente: "CAIO CESAR DE SOUZA FERNANDES", formaPagamento: "[Débito R$ 75.0]", valorPago: 75, tipo: "Entrada" },
  { dataFechamento: "04/03/2026 17:47", usuarioFechamento: "Lara", cliente: "César", formaPagamento: "[Débito R$ 15.0]", valorPago: 15, tipo: "Entrada" },
  { dataFechamento: "04/03/2026 17:35", usuarioFechamento: "Lara", cliente: "Marlon", formaPagamento: "[Débito R$ 150.0]", valorPago: 150, tipo: "Entrada" },
  { dataFechamento: "04/03/2026 14:37", usuarioFechamento: "Lara", cliente: "CAIO CESAR DE SOUZA FERNANDES", formaPagamento: "[Débito R$ 45.0]", valorPago: 45, tipo: "Entrada" },
  { dataFechamento: "04/03/2026 10:15", usuarioFechamento: "Lara", cliente: "Fornecedor XYZ", formaPagamento: "[PIX R$ 320.0]", valorPago: 320, tipo: "Saída" },
  { dataFechamento: "04/03/2026 09:00", usuarioFechamento: "Cesar", cliente: "Material limpeza", formaPagamento: "[Dinheiro R$ 85.0]", valorPago: 85, tipo: "Saída" },
];

const columns: Column<Comanda>[] = [
  { key: "dataFechamento", label: "Data Fechamento", pinned: true },
  { key: "usuarioFechamento", label: "Usuário" },
  { key: "cliente", label: "Cliente" },
  { key: "formaPagamento", label: "Forma de pagamento" },
  { key: "valorPago", label: "Valor Pago", align: "right", render: (v) => R$(v) },
];

export default function MovimentacaoComandas() {
  const [tab, setTab] = useState("todas");

  const data = allData.filter((d) =>
    tab === "todas" ? true : tab === "entradas" ? d.tipo === "Entrada" : d.tipo === "Saída"
  );
  const total = data.reduce((s, r) => s + r.valorPago, 0);

  return (
    <AppLayout>
      <DataTable
        title="Movimentação de Comandas"
        data={data}
        columns={columns}
        totalRow={{ cliente: "Total:", valorPago: R$(total) }}
        tabs={[
          { label: "Todas", value: "todas", count: allData.length },
          { label: "Entradas", value: "entradas", count: allData.filter(d => d.tipo === "Entrada").length },
          { label: "Saídas", value: "saidas", count: allData.filter(d => d.tipo === "Saída").length },
        ]}
        activeTab={tab}
        onTabChange={setTab}
        summaryCards={[
          { label: "Entradas", value: R$(allData.filter(d => d.tipo === "Entrada").reduce((s, r) => s + r.valorPago, 0)), icon: <CreditCard className="h-4 w-4" /> },
          { label: "Saídas", value: R$(allData.filter(d => d.tipo === "Saída").reduce((s, r) => s + r.valorPago, 0)), icon: <CreditCard className="h-4 w-4" /> },
        ]}
      />
    </AppLayout>
  );
}
