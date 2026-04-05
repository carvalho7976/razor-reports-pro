import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Exclusao {
  id: number;
  codigo: string;
  cliente: string;
  celular: string;
  excluidoPor: string;
  data: string;
}

const initialData: Exclusao[] = [
  { id: 1, codigo: "1240168", cliente: "Douglas Neres", celular: "(41) 99123-4567", excluidoPor: "Lara", data: "03/02/2026 15:50" },
  { id: 2, codigo: "222668", cliente: "Douglas Novo", celular: "(41) 98765-4321", excluidoPor: "Lara", data: "04/02/2026 15:06" },
  { id: 3, codigo: "1255170", cliente: "Douglas NS", celular: "(41) 99876-5432", excluidoPor: "Lara", data: "24/02/2026 10:55" },
  { id: 4, codigo: "965307", cliente: "Automação pausada! Foi identificado um diálogo humano...", celular: "", excluidoPor: "Lara", data: "03/03/2026 14:12" },
];

export default function ExclusaoClientes() {
  const [allData, setAllData] = useState(initialData);
  const { toast } = useToast();

  const bulkRecover = (indices: number[]) => {
    const ids = indices.map((i) => allData[i]?.id).filter(Boolean);
    setAllData((prev) => prev.filter((d) => !ids.includes(d.id)));
    toast({ title: `${ids.length} cliente(s) recuperado(s)` });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Recuperar", icon: <RotateCcw className="h-4 w-4" />, onClick: bulkRecover, description: "Restaura os clientes selecionados para a lista ativa" },
  ];

  const columns: Column<Exclusao>[] = [
    { key: "codigo", label: "Código" },
    {
      key: "cliente", label: "Cliente", pinned: true,
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <WhatsAppButton telefone={row.celular} nome={row.cliente} />
          <a href="/clientePesquisa" className="hover:underline font-medium">{v}</a>
        </div>
      ),
    },
    { key: "excluidoPor", label: "Excluído por" },
    { key: "data", label: "Data" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Exclusão de Clientes"
        data={allData}
        columns={columns}
        showDateFilter={true}
        selectable
        selectionActions={selectionActions}
        pageSize={15}
        tableId="exclusao_clientes"
      />
    </AppLayout>
  );
}