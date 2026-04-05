import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction } from "@/components/DataTable";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Exclusao {
  id: number;
  codigo: string;
  cliente: string;
  excluidoPor: string;
  data: string;
}

const initialData: Exclusao[] = [
  { id: 1, codigo: "1240168", cliente: "Douglas Neres", excluidoPor: "Lara", data: "03/02/2026 15:50" },
  { id: 2, codigo: "222668", cliente: "Douglas Novo", excluidoPor: "Lara", data: "04/02/2026 15:06" },
  { id: 3, codigo: "1255170", cliente: "Douglas NS", excluidoPor: "Lara", data: "24/02/2026 10:55" },
  { id: 4, codigo: "965307", cliente: "Automação pausada! Foi identificado um diálogo humano...", excluidoPor: "Lara", data: "03/03/2026 14:12" },
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
    { key: "cliente", label: "Cliente", pinned: true },
    { key: "excluidoPor", label: "Excluído por" },
    { key: "data", label: "Data" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Exclusão de Clientes"
        data={allData}
        columns={columns}
        showDateFilter={false}
        selectable
        selectionActions={selectionActions}
        pageSize={15}
      />
    </AppLayout>
  );
}
