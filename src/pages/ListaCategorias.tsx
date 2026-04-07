import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SelectionAction, ActionsMenu } from "@/components/DataTable";
import { Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const PALETTE = [
  "#ff2f2f",
  "#ff6b35",
  "#f59e0b",
  "#84cc16",
  "#00c5b4",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#78716c",
  "#334155",
  "#000000",
];

function ColorCell({ color, onChange }: { color: string; onChange: (c: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="h-6 w-6 rounded-full border border-border shadow-sm hover:scale-110 transition-transform"
          style={{ backgroundColor: color }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="grid grid-cols-4 gap-2">
          {PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => {
                onChange(c);
                setOpen(false);
              }}
              className="h-7 w-7 rounded-full border border-border hover:scale-110 transition-transform"
              style={{ backgroundColor: c }}
            >
              {c === color && <span className="text-white text-xs">✓</span>}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface Categoria {
  id: number;
  nome: string;
  cor: string;
  qtdServicos: number;
  descricao: string;
}

const initialData: Categoria[] = [
  { id: 1, nome: "Cabelo", cor: "#3b82f6", qtdServicos: 5, descricao: "Cortes, escovas e penteados" },
  { id: 2, nome: "Barba", cor: "#78716c", qtdServicos: 3, descricao: "Barba e bigode" },
  { id: 3, nome: "Química", cor: "#a855f7", qtdServicos: 4, descricao: "Coloração, relaxamento, progressiva" },
  { id: 4, nome: "Tratamento", cor: "#00c5b4", qtdServicos: 3, descricao: "Hidratação, cauterização, reconstrução" },
  { id: 5, nome: "Unhas", cor: "#ec4899", qtdServicos: 2, descricao: "Manicure e pedicure" },
  { id: 6, nome: "Estética", cor: "#f59e0b", qtdServicos: 2, descricao: "Limpeza de pele, sobrancelha" },
];

export default function ListaCategorias() {
  const [allData, setAllData] = useState(initialData);
  const { toast } = useToast();

  const handleColorChange = (id: number, newColor: string) => {
    setAllData((prev) => prev.map((c) => (c.id === id ? { ...c, cor: newColor } : c)));
  };

  const bulkRemove = (indices: number[]) => {
    toast({ title: `${indices.length} categoria(s) removida(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    {
      label: "Remover",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: bulkRemove,
      variant: "destructive",
      description: "Remove as categorias selecionadas",
    },
  ];

  const columns: Column<Categoria>[] = [
    {
      key: "nome",
      label: "Nome",
      pinned: true,
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <ColorCell color={row.cor} onChange={(c) => handleColorChange(row.id, c)} />
          <span className="font-medium">{v}</span>
        </div>
      ),
    },
    { key: "qtdServicos", label: "Qtd Serviços", align: "center" },
    { key: "descricao", label: "Descrição" },
    {
      key: "acoes" as any,
      label: "Ações",
      sortable: false,
      filterable: false,
      align: "center",
      render: () => (
        <ActionsMenu
          items={[
            { label: "Editar", icon: <Pencil className="h-4 w-4" /> },
            { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, variant: "destructive" },
          ]}
        />
      ),
    },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Categorias"
        data={allData}
        columns={columns}
        selectable
        selectionActions={selectionActions}
        showDateFilter={true}
        novoMenuItems={[{ label: "Nova categoria" }]}
        pageSize={15}
        tableId="lista_categorias"
      />
    </AppLayout>
  );
}
