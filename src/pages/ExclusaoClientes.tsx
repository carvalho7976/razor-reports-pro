import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column } from "@/components/DataTable";

interface Exclusao {
  codigoCliente: string;
  cliente: string;
  usuarioExclusao: string;
  dataExclusao: string;
}

const data: Exclusao[] = [
  { codigoCliente: "1240168", cliente: "Douglas Neres", usuarioExclusao: "Lara", dataExclusao: "03/02/2026 15:50" },
  { codigoCliente: "222668", cliente: "Douglas Novo", usuarioExclusao: "Lara", dataExclusao: "04/02/2026 15:06" },
  { codigoCliente: "1255170", cliente: "Douglas NS", usuarioExclusao: "Lara", dataExclusao: "24/02/2026 10:55" },
  { codigoCliente: "965307", cliente: "Automação pausada! Foi identificado um diálogo humano...", usuarioExclusao: "Lara", dataExclusao: "03/03/2026 14:12" },
];

const columns: Column<Exclusao>[] = [
  { key: "codigoCliente", label: "Código cliente" },
  { key: "cliente", label: "Cliente" },
  { key: "usuarioExclusao", label: "Usuário Exclusão" },
  { key: "dataExclusao", label: "Data Exclusão" },
];

export default function ExclusaoClientes() {
  return (
    <AppLayout>
      <DataTable title="Relatório exclusão de clientes" data={data} columns={columns} />
    </AppLayout>
  );
}
