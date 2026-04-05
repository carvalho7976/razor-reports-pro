import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, ActionsMenu, SelectionAction } from "@/components/DataTable";
import { Lock, Pencil, Trash2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Profissional {
  id: number;
  nome: string;
  email: string;
  celular: string;
  aniversario: string;
  funcao: string;
}

const initialData: Profissional[] = [
  { id: 1, nome: "Cesar", email: "gerente@frizzar.com.br", celular: "", aniversario: "", funcao: "Gerente" },
  { id: 2, nome: "Claudia", email: "rogerio_carvalho15@hotmail.com", celular: "", aniversario: "", funcao: "Profissional" },
  { id: 3, nome: "Fila de espera", email: "fila@gmail.com", celular: "", aniversario: "", funcao: "Recepção" },
  { id: 4, nome: "Henrique", email: "henrique@henrique.com", celular: "", aniversario: "", funcao: "Recepção" },
  { id: 5, nome: "Lara", email: "frizzar@gmail.com", celular: "", aniversario: "29/07/1988", funcao: "Frizzar" },
  { id: 6, nome: "Marcia Silva", email: "marcia123@mail.com", celular: "", aniversario: "", funcao: "Assistente" },
  { id: 7, nome: "Matheus", email: "douglasneres06@gmail.com", celular: "", aniversario: "", funcao: "Profissional" },
  { id: 8, nome: "Ramon", email: "asodji@gmail.com", celular: "(41) 99898-9898", aniversario: "10/05/1988", funcao: "Caixa" },
  { id: 9, nome: "Vini", email: "vi@gmail.com", celular: "", aniversario: "", funcao: "Auxiliar" },
];

export default function ListaProfissionais() {
  const [allData, setAllData] = useState(initialData);
  const { toast } = useToast();

  const bulkRemove = (indices: number[]) => {
    const ids = indices.map((i) => allData[i]?.id).filter(Boolean);
    setAllData((prev) => prev.filter((d) => !ids.includes(d.id)));
    toast({ title: `${ids.length} profissional(is) removido(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Remover", icon: <Trash2 className="h-4 w-4" />, onClick: bulkRemove, variant: "destructive", description: "Remove permanentemente os profissionais selecionados" },
  ];

  const columns: Column<Profissional>[] = [
    {
      key: "foto" as any, label: "Foto", sortable: false, filterable: false, align: "center", width: "60px",
      render: () => (
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mx-auto">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      ),
    },
    { key: "nome", label: "Nome", pinned: true },
    { key: "email", label: "Email" },
    { key: "celular", label: "Celular" },
    { key: "aniversario", label: "Aniversário" },
    {
      key: "funcao", label: "Função",
      render: (v) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-foreground">
          {v}
        </span>
      ),
    },
    {
      key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
      render: () => (
        <ActionsMenu items={[
          { label: "Alterar senha", icon: <Lock className="h-4 w-4" /> },
          { label: "Editar", icon: <Pencil className="h-4 w-4" /> },
          { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, variant: "destructive" },
        ]} />
      ),
    },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Profissionais"
        data={allData}
        columns={columns}
        showDateFilter={false}
        selectable
        selectionActions={selectionActions}
        novoMenuItems={[{ label: "Novo profissional" }]}
        pageSize={15}
      />
    </AppLayout>
  );
}
