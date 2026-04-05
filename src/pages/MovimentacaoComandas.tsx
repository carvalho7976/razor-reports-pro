import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, SummaryCard } from "@/components/DataTable";
import { CreditCard, FileText, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Comanda {
  dataFechamento: string;
  usuarioFechamento: string;
  cliente: string;
  formaPagamento: string;
  valorPago: number;
  taxas: number;
  tipo: string;
}

const allData: Comanda[] = [
  { dataFechamento: "04/03/2026 11:27", usuarioFechamento: "Lara", cliente: "Everton", formaPagamento: "[Débito R$ 215.0]", valorPago: 215, taxas: 4.30, tipo: "Entrada" },
  { dataFechamento: "04/03/2026 11:33", usuarioFechamento: "Lara", cliente: "César", formaPagamento: "[Débito R$ 100.0]", valorPago: 100, taxas: 2.00, tipo: "Entrada" },
  { dataFechamento: "04/03/2026 11:41", usuarioFechamento: "Lara", cliente: "Frizzar Demonstração", formaPagamento: "[Débito R$ 66.55]", valorPago: 66.55, taxas: 1.33, tipo: "Entrada" },
  { dataFechamento: "04/03/2026 11:34", usuarioFechamento: "Lara", cliente: "CAIO CESAR DE SOUZA FERNANDES", formaPagamento: "[Débito R$ 75.0]", valorPago: 75, taxas: 1.50, tipo: "Entrada" },
  { dataFechamento: "04/03/2026 17:47", usuarioFechamento: "Lara", cliente: "César", formaPagamento: "[Débito R$ 15.0]", valorPago: 15, taxas: 0.30, tipo: "Entrada" },
  { dataFechamento: "04/03/2026 17:35", usuarioFechamento: "Lara", cliente: "Marlon", formaPagamento: "[Débito R$ 150.0]", valorPago: 150, taxas: 3.00, tipo: "Entrada" },
  { dataFechamento: "04/03/2026 14:37", usuarioFechamento: "Lara", cliente: "CAIO CESAR DE SOUZA FERNANDES", formaPagamento: "[Débito R$ 45.0]", valorPago: 45, taxas: 0.90, tipo: "Entrada" },
  { dataFechamento: "04/03/2026 10:15", usuarioFechamento: "Lara", cliente: "Fornecedor XYZ", formaPagamento: "[PIX R$ 320.0]", valorPago: 320, taxas: 0, tipo: "Saída" },
  { dataFechamento: "04/03/2026 09:00", usuarioFechamento: "Cesar", cliente: "Material limpeza", formaPagamento: "[Dinheiro R$ 85.0]", valorPago: 85, taxas: 0, tipo: "Saída" },
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
  const { toast } = useToast();

  const data = allData;

  const totalBruto = allData.filter(d => d.tipo === "Entrada").reduce((s, r) => s + r.valorPago, 0);
  const totalTaxas = allData.reduce((s, r) => s + r.taxas, 0);
  const totalLiquido = totalBruto - totalTaxas;
  const total = allData.reduce((s, r) => s + r.valorPago, 0);

  const bulkNotaFiscal = (indices: number[]) => {
    toast({ title: `Gerar nota fiscal para ${indices.length} comanda(s)`, description: "Funcionalidade em desenvolvimento" });
  };

  const bulkComprovante = (indices: number[]) => {
    toast({ title: `Gerar comprovante para ${indices.length} comanda(s)`, description: "Funcionalidade em desenvolvimento" });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Nota fiscal", icon: <FileText className="h-4 w-4" />, onClick: bulkNotaFiscal, description: "Gera nota fiscal das comandas selecionadas" },
    { label: "Comprovante", icon: <Receipt className="h-4 w-4" />, onClick: bulkComprovante, description: "Gera comprovante das comandas selecionadas" },
  ];

  const summaryCards: SummaryCard[] = [
    { label: "Bruto", value: R$(totalBruto), icon: <CreditCard className="h-4 w-4" /> },
    { label: "Líquido", value: R$(totalLiquido), icon: <CreditCard className="h-4 w-4" /> },
    { label: "Taxas", value: R$(totalTaxas), icon: <CreditCard className="h-4 w-4" /> },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Movimentação de Comandas"
        data={data}
        columns={columns}
        totalRow={{ cliente: "Total:", valorPago: R$(total) }}
        summaryCards={summaryCards}
        selectable
        selectionActions={selectionActions}
        pageSize={15}
      />
    </AppLayout>
  );
}
