import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, SummaryCard } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CreditCard, FileText, Receipt, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";


const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Comanda {
  dataFechamento: string;
  usuarioFechamento: string;
  cliente: string;
  celular: string;
  formaPagamento: string;
  valorPago: number;
  taxas: number;
  tipo: string;
}

const allData: Comanda[] = [
  {
    dataFechamento: "04/03/2026 11:27",
    usuarioFechamento: "Lara",
    cliente: "Everton",
    celular: "(41) 99876-5432",
    formaPagamento: "[Débito R$ 215.0]",
    valorPago: 215,
    taxas: 4.3,
    tipo: "Entrada",
  },
  {
    dataFechamento: "04/03/2026 11:33",
    usuarioFechamento: "Lara",
    cliente: "César",
    celular: "(41) 98765-4321",
    formaPagamento: "[Débito R$ 100.0]",
    valorPago: 100,
    taxas: 2.0,
    tipo: "Entrada",
  },
  {
    dataFechamento: "04/03/2026 11:41",
    usuarioFechamento: "Lara",
    cliente: "Frizzar Demonstração",
    celular: "(41) 99111-2233",
    formaPagamento: "[Débito R$ 66.55]",
    valorPago: 66.55,
    taxas: 1.33,
    tipo: "Entrada",
  },
  {
    dataFechamento: "04/03/2026 11:34",
    usuarioFechamento: "Lara",
    cliente: "CAIO CESAR DE SOUZA FERNANDES",
    celular: "(41) 99123-4567",
    formaPagamento: "[Débito R$ 75.0]",
    valorPago: 75,
    taxas: 1.5,
    tipo: "Entrada",
  },
  {
    dataFechamento: "04/03/2026 17:47",
    usuarioFechamento: "Lara",
    cliente: "César",
    celular: "(41) 98765-4321",
    formaPagamento: "[Débito R$ 15.0]",
    valorPago: 15,
    taxas: 0.3,
    tipo: "Entrada",
  },
  {
    dataFechamento: "04/03/2026 17:35",
    usuarioFechamento: "Lara",
    cliente: "Marlon",
    celular: "",
    formaPagamento: "[Débito R$ 150.0]",
    valorPago: 150,
    taxas: 3.0,
    tipo: "Entrada",
  },
  {
    dataFechamento: "04/03/2026 14:37",
    usuarioFechamento: "Lara",
    cliente: "CAIO CESAR DE SOUZA FERNANDES",
    celular: "(41) 99123-4567",
    formaPagamento: "[Débito R$ 45.0]",
    valorPago: 45,
    taxas: 0.9,
    tipo: "Entrada",
  },
  {
    dataFechamento: "04/03/2026 10:15",
    usuarioFechamento: "Lara",
    cliente: "Fornecedor XYZ",
    celular: "",
    formaPagamento: "[PIX R$ 320.0]",
    valorPago: 320,
    taxas: 0,
    tipo: "Saída",
  },
  {
    dataFechamento: "04/03/2026 09:00",
    usuarioFechamento: "Cesar",
    cliente: "Material limpeza",
    celular: "",
    formaPagamento: "[Dinheiro R$ 85.0]",
    valorPago: 85,
    taxas: 0,
    tipo: "Saída",
  },
];

const columns: Column<Comanda>[] = [
  { key: "dataFechamento", label: "Data de Fechamento", pinned: true },
  { key: "usuarioFechamento", label: "Usuário Responsável" },
  {
    key: "cliente",
    label: "Cliente",
    render: (v, row) => (
      <div className="flex items-center gap-1.5">
        <WhatsAppButton telefone={row.celular} nome={row.cliente} />
        <a href="/clientePesquisa" className="hover:underline font-medium">
          {v}
        </a>
      </div>
    ),
  },
  { key: "formaPagamento", label: "Forma de Pagamento" },
  { key: "valorPago", label: "Valor Pago", align: "right", render: (v) => R$(v) },
];

export default function MovimentacaoComandas() {
  const [aulaOpen, setAulaOpen] = useState(false);
  const { toast } = useToast();

  const totalBruto = allData.filter((d) => d.tipo === "Entrada").reduce((s, r) => s + r.valorPago, 0);
  const totalTaxas = allData.reduce((s, r) => s + r.taxas, 0);
  const totalLiquido = totalBruto - totalTaxas;
  const total = allData.reduce((s, r) => s + r.valorPago, 0);

  const bulkNotaFiscal = (indices: number[]) => {
    toast({
      title: `Gerar nota fiscal para ${indices.length} comanda(s)`,
      description: "Funcionalidade em desenvolvimento",
    });
  };
  const bulkComprovante = (indices: number[]) => {
    toast({
      title: `Gerar comprovante para ${indices.length} comanda(s)`,
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const selectionActions: SelectionAction[] = [
    {
      label: "Nota fiscal",
      icon: <FileText className="h-4 w-4" />,
      onClick: bulkNotaFiscal,
      description: "Gera nota fiscal das comandas selecionadas",
    },
    {
      label: "Comprovante",
      icon: <Receipt className="h-4 w-4" />,
      onClick: bulkComprovante,
      description: "Gera comprovante das comandas selecionadas",
    },
  ];

  const totalComandas = allData.length;

  const summaryCards: SummaryCard[] = [
    {
      label: "Total de Comandas",
      value: String(totalComandas),
      type: "quantity",
      icon: <Hash className="h-4 w-4" />,
      size: "compact",
      color: "blue",
    },
    { label: "Valor Bruto", value: R$(totalBruto), icon: <CreditCard className="h-4 w-4" />, color: "green" },
    { label: "Valor Líquido", value: R$(totalLiquido), icon: <CreditCard className="h-4 w-4" />, color: "green" },
    { label: "Taxas", value: R$(totalTaxas), icon: <CreditCard className="h-4 w-4" />, color: "red" },
  ];

  return (
    <AppLayout>
      <DataTable
        titleIcon={<AulaButton onClick={() => setAulaOpen(true)} />}
        title="Movimentação de Comandas"
        data={allData}
        columns={columns}
        totalRow={{ cliente: "Total:", valorPago: R$(total) }}
        summaryCards={summaryCards}
        selectable
        selectionActions={selectionActions}
        pageSize={15}
        showDateFilter={true}
        tableId="movimentacao_comandas"
        dateField="dataFechamento"
      />
      <YouTubeModal open={aulaOpen} onOpenChange={setAulaOpen} />
    </AppLayout>
  );
}
