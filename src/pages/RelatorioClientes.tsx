import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column } from "@/components/DataTable";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Cliente {
  cliente: string;
  qtdServicos: number;
  qtdProdutos: number;
  valorGasto: number;
  ticketMedio: number;
}

const data: Cliente[] = [
  { cliente: "CAIO CESAR DE SOUZA FERNANDES", qtdServicos: 9, qtdProdutos: 0, valorGasto: 380, ticketMedio: 126.67 },
  { cliente: "César", qtdServicos: 6, qtdProdutos: 0, valorGasto: 310, ticketMedio: 77.5 },
  { cliente: "Everton", qtdServicos: 3, qtdProdutos: 0, valorGasto: 215, ticketMedio: 215 },
  { cliente: "Gean", qtdServicos: 2, qtdProdutos: 0, valorGasto: 65, ticketMedio: 65 },
  { cliente: "Luis Alberto Santos", qtdServicos: 2, qtdProdutos: 2, valorGasto: 137, ticketMedio: 137 },
  { cliente: "Marlon", qtdServicos: 2, qtdProdutos: 0, valorGasto: 150, ticketMedio: 150 },
  { cliente: "Frizzar Demonstração", qtdServicos: 1, qtdProdutos: 2, valorGasto: 66.55, ticketMedio: 66.55 },
];

const columns: Column<Cliente>[] = [
  { key: "cliente", label: "Cliente", pinned: true },
  { key: "qtdServicos", label: "Qtd Serviços", align: "center" },
  { key: "qtdProdutos", label: "Qtd Produtos", align: "center" },
  { key: "valorGasto", label: "Valor Gasto", align: "right", render: (v) => R$(v) },
  { key: "ticketMedio", label: "Ticket Médio", align: "right", render: (v) => R$(v) },
];

export default function RelatorioClientes() {
  return (
    <AppLayout>
      <DataTable
        title="Relatório de Clientes"
        data={data}
        columns={columns}
        summaryCards={[{ label: "Total", value: `${data.length} clientes atendidos` }]}
      />
    </AppLayout>
  );
}
