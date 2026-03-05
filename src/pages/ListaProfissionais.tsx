import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column } from "@/components/DataTable";
import { Plus, Lock, Pencil, X } from "lucide-react";

interface Profissional {
  nome: string;
  email: string;
  celular: string;
  aniversario: string;
  funcao: string;
}

const data: Profissional[] = [
  { nome: "Cesar", email: "gerente@frizzar.com.br", celular: "", aniversario: "", funcao: "Gerente" },
  { nome: "Claudia", email: "rogerio_carvalho15@hotmail.com", celular: "", aniversario: "", funcao: "Profissional" },
  { nome: "Fila de espera", email: "fila@gmail.com", celular: "", aniversario: "", funcao: "Recepção" },
  { nome: "Henrique", email: "henrique@henrique.com", celular: "", aniversario: "", funcao: "Recepção" },
  { nome: "Lara", email: "frizzar@gmail.com", celular: "", aniversario: "29/07/1988", funcao: "Frizzar" },
  { nome: "Marcia Silva", email: "marcia123@mail.com", celular: "", aniversario: "", funcao: "Assistente" },
  { nome: "Matheus", email: "douglasneres06@gmail.com", celular: "", aniversario: "", funcao: "Profissional" },
  { nome: "Ramon", email: "asodji@gmail.com", celular: "(41) 99898-9898", aniversario: "10/05/1988", funcao: "Caixa" },
  { nome: "Vini", email: "vi@gmail.com", celular: "", aniversario: "", funcao: "Auxiliar" },
];

const columns: Column<Profissional>[] = [
  { key: "nome", label: "Nome", pinned: true },
  { key: "email", label: "Email" },
  { key: "celular", label: "Celular" },
  { key: "aniversario", label: "Aniversário" },
  { key: "funcao", label: "Função" },
  {
    key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
    render: () => (
      <div className="flex items-center gap-2 justify-center">
        <button className="text-muted-foreground hover:text-foreground"><Lock className="h-4 w-4" /></button>
        <button className="text-accent hover:text-accent/80"><Pencil className="h-4 w-4" /></button>
        <button className="text-destructive hover:text-destructive/80"><X className="h-4 w-4" /></button>
      </div>
    ),
  },
];

export default function ListaProfissionais() {
  return (
    <AppLayout>
      <DataTable
        title="Lista de Profissionais"
        data={data}
        columns={columns}
        showDateFilter={false}
        actions={
          <button className="btn-action bg-primary text-primary-foreground">
            <Plus className="h-4 w-4" /> Adicionar
          </button>
        }
      />
    </AppLayout>
  );
}
