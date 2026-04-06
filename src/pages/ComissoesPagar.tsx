import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, SummaryCard, TabDef } from "@/components/DataTable";
import { User, CheckCircle, Printer, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Comissao {
  id: number;
  profissional: string;
  totalComissoes: number;
  totalAdiantamentos: number;
  totalPagar: number;
  status: string;
}

const initialData: Comissao[] = [
  { id: 1, profissional: "Cesar", totalComissoes: 4956.2, totalAdiantamentos: 300, totalPagar: 4656.2, status: "Em aberto" },
  { id: 2, profissional: "Claudia", totalComissoes: 3737.97, totalAdiantamentos: 20, totalPagar: 3717.97, status: "Em aberto" },
  { id: 3, profissional: "Fila de espera", totalComissoes: 14.63, totalAdiantamentos: 60, totalPagar: -45.37, status: "Pago" },
  { id: 4, profissional: "Henrique", totalComissoes: 0, totalAdiantamentos: 0, totalPagar: 0, status: "Pago" },
  { id: 5, profissional: "Lara", totalComissoes: 40.47, totalAdiantamentos: 100, totalPagar: -59.53, status: "Pago" },
  { id: 6, profissional: "Marcia Silva", totalComissoes: 4615, totalAdiantamentos: 0, totalPagar: 4615, status: "Em aberto" },
  { id: 7, profissional: "Matheus", totalComissoes: 3472.07, totalAdiantamentos: 0, totalPagar: 3472.07, status: "Em aberto" },
  { id: 8, profissional: "Ramon", totalComissoes: 18, totalAdiantamentos: 150, totalPagar: -132, status: "Pago" },
  { id: 9, profissional: "Vini", totalComissoes: 135, totalAdiantamentos: 0, totalPagar: 135, status: "Em aberto" },
];

export default function ComissoesPagar() {
  const [tab, setTab] = useState("em_aberto");
  const [allData, setAllData] = useState(initialData);
  const { toast } = useToast();

  const data = useMemo(() =>
    allData.filter((d) =>
      tab === "em_aberto" ? d.status === "Em aberto" : d.status === "Pago"
    ), [tab, allData]);

  const totalEmAberto = allData.filter(d => d.status === "Em aberto").reduce((s, r) => s + r.totalPagar, 0);
  const totalPagas = allData.filter(d => d.status === "Pago").reduce((s, r) => s + r.totalComissoes, 0);
  const totalAdiantamentos = allData.reduce((s, r) => s + r.totalAdiantamentos, 0);

  const bulkPagar = (indices: number[]) => {
    const ids = indices.map((i) => data[i]?.id).filter(Boolean);
    setAllData((prev) => prev.map((d) => ids.includes(d.id) ? { ...d, status: "Pago" } : d));
    toast({ title: `${ids.length} comissão(ões) marcada(s) como paga(s)` });
  };
  const bulkPrint = (indices: number[]) => { toast({ title: `Imprimir relatório de ${indices.length} funcionário(s)`, description: "Funcionalidade em desenvolvimento" }); };

  const selectionActions: SelectionAction[] = [
    { label: "Pagar", icon: <CheckCircle className="h-4 w-4" />, onClick: bulkPagar, description: "Marca as comissões selecionadas como pagas" },
    { label: "Imprimir Funcionário", icon: <Printer className="h-4 w-4" />, onClick: bulkPrint, description: "Imprime o relatório de comissões dos funcionários selecionados" },
  ];

  const summaryCards: SummaryCard[] = [
    { label: "Em aberto", value: R$(totalEmAberto), icon: <CreditCard className="h-4 w-4" />, color: "blue" },
    { label: "Pagas", value: R$(totalPagas), icon: <CreditCard className="h-4 w-4" />, color: "blue" },
    { label: "Adiantamentos", value: R$(totalAdiantamentos), icon: <CreditCard className="h-4 w-4" />, color: "blue" },
  ];

  const columns: Column<Comissao>[] = [
    {
      key: "profissional", label: "Profissional", pinned: true,
      render: (v) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <a href="/funcionarioPesquisa" className="hover:underline font-medium">{v}</a>
        </div>
      ),
    },
    { key: "totalComissoes", label: "Total em comissões", align: "right", render: (v) => R$(v) },
    { key: "totalAdiantamentos", label: "Total em adiantamentos", align: "right", render: (v) => R$(v) },
    {
      key: "totalPagar", label: "Total a Pagar", align: "right",
      render: (v) => <span className="font-medium" style={{ color: v < 0 ? "#ff2f2f" : "#00c5b4" }}>{R$(v)}</span>,
    },
  ];

  const total = data.reduce((s, r) => s + r.totalPagar, 0);

  const tabs: TabDef[] = [
    { label: "Em aberto", value: "em_aberto", count: allData.filter(d => d.status === "Em aberto").length, color: "destructive" },
    { label: "Pagas", value: "pagas", count: allData.filter(d => d.status === "Pago").length, color: "success" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Comissões"
        data={data}
        columns={columns}
        totalRow={{ profissional: "Total:", totalPagar: R$(total) }}
        summaryCards={summaryCards}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        selectable
        selectionActions={selectionActions}
        pageSize={15}
        showDateFilter={true}
        tableId="comissoes_pagar"
      />
    </AppLayout>
  );
}