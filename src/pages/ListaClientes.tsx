import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, ActionsMenu, SelectionAction, TabDef, SummaryCard } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Trash2, Merge, PlayCircle, Tag, MessageCircle, Pencil, Coins, CreditCard } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type StatusCliente = "ativo" | "semi-ativo" | "inativo";

interface Cliente {
  cod: string;
  nome: string;
  telefone: string;
  aniversario: string;
  ultimaVisita: string;
  moedas: number;
  creditos: number;
  tags: string;
  status: StatusCliente;
}

const data: Cliente[] = [
  { cod: "745142", nome: "Abner Ferreira Chaves", telefone: "(61) 99450-9929", aniversario: "01/05/2017", ultimaVisita: "04/11/2025", moedas: 196, creditos: 0, tags: "bloquear123", status: "inativo" },
  { cod: "1037806", nome: "Ada Naama", telefone: "(67) 99162-990", aniversario: "", ultimaVisita: "17/02/2026", moedas: 25, creditos: 0, tags: "", status: "ativo" },
  { cod: "1037807", nome: "Adara Cerqueira", telefone: "6181627802", aniversario: "10/05/2025", ultimaVisita: "17/02/2026", moedas: 0, creditos: 0, tags: "", status: "ativo" },
  { cod: "1037808", nome: "Adelia Maria Sales", telefone: "12981134764", aniversario: "", ultimaVisita: "26/11/2025", moedas: 4, creditos: 0, tags: "", status: "inativo" },
  { cod: "1167159", nome: "Adelio Marçal", telefone: "(88) 90300-0166", aniversario: "", ultimaVisita: "05/11/2025", moedas: 4, creditos: 0, tags: "", status: "inativo" },
  { cod: "675732", nome: "Ademar Herminio", telefone: "(55) 55555-5555", aniversario: "", ultimaVisita: "01/10/2025", moedas: 397, creditos: 0, tags: "", status: "inativo" },
  { cod: "1069712", nome: "Adenilson", telefone: "(21) 99999-9999", aniversario: "20/01/1988", ultimaVisita: "12/08/2025", moedas: 0, creditos: 0, tags: "", status: "inativo" },
  { cod: "1204833", nome: "Adenilson", telefone: "(21) 99999-9999", aniversario: "20/03/1988", ultimaVisita: "11/12/2025", moedas: 4, creditos: 0, tags: "", status: "semi-ativo" },
  { cod: "1037809", nome: "Adhara Maria", telefone: "", aniversario: "", ultimaVisita: "10/02/2026", moedas: 24, creditos: 0, tags: "", status: "ativo" },
  { cod: "848084", nome: "Adriana", telefone: "(99) 99999-99999", aniversario: "22/03/1988", ultimaVisita: "24/06/2025", moedas: 97, creditos: 0, tags: "", status: "inativo" },
  { cod: "1037810", nome: "Adriana", telefone: "11993966288", aniversario: "", ultimaVisita: "", moedas: 0, creditos: 0, tags: "", status: "inativo" },
  { cod: "1037811", nome: "Adriana", telefone: "12982466363", aniversario: "", ultimaVisita: "", moedas: 0, creditos: 0, tags: "", status: "inativo" },
  { cod: "1037812", nome: "Adriana Bitencourt", telefone: "13997288558", aniversario: "", ultimaVisita: "", moedas: 0, creditos: 0, tags: "", status: "inativo" },
  { cod: "1037813", nome: "Adriana Cabello", telefone: "(19) 99239-3840", aniversario: "", ultimaVisita: "", moedas: 0, creditos: 0, tags: "", status: "inativo" },
  { cod: "1037814", nome: "Adriana Cherin", telefone: "11994527149", aniversario: "", ultimaVisita: "", moedas: 0, creditos: 0, tags: "", status: "inativo" },
];

export default function ListaClientes() {
  const [activeTab, setActiveTab] = useState("todos");
  const [allData] = useState(data);
  const { toast } = useToast();

  const filteredData = useMemo(() => {
    if (activeTab === "todos") return allData;
    return allData.filter((c) => c.status === activeTab);
  }, [activeTab, allData]);

  const totalClientes = allData.length;
  const ativos = allData.filter((c) => c.status === "ativo").length;
  const semiAtivos = allData.filter((c) => c.status === "semi-ativo").length;
  const inativos = allData.filter((c) => c.status === "inativo").length;

  const totalMoedas = allData.reduce((s, c) => s + c.moedas, 0);
  const totalCreditos = allData.reduce((s, c) => s + c.creditos, 0);

  const bulkRemove = (indices: number[]) => { toast({ title: `${indices.length} cliente(s) removido(s)`, variant: "destructive" }); };
  const bulkMerge = (indices: number[]) => { toast({ title: `Mesclar ${indices.length} clientes`, description: "Funcionalidade em desenvolvimento" }); };
  const bulkMessage = (indices: number[]) => { toast({ title: `Enviar mensagem para ${indices.length} cliente(s)`, description: "Funcionalidade em desenvolvimento" }); };
  const bulkTag = (indices: number[]) => { toast({ title: `Adicionar tag a ${indices.length} cliente(s)`, description: "Funcionalidade em desenvolvimento" }); };

  const selectionActions: SelectionAction[] = [
    { label: "Mesclar", icon: <Merge className="h-4 w-4" />, onClick: bulkMerge, description: "Unifica cadastros duplicados em um único registro" },
    { label: "Remover", icon: <Trash2 className="h-4 w-4" />, onClick: bulkRemove, variant: "destructive", description: "Remove permanentemente os clientes selecionados da lista" },
    { label: "Mensagem", icon: <MessageCircle className="h-4 w-4" />, onClick: bulkMessage, description: "Envia mensagem via WhatsApp para os clientes selecionados" },
    { label: "Tag", icon: <Tag className="h-4 w-4" />, onClick: bulkTag, description: "Adiciona uma tag aos clientes selecionados" },
  ];

  const summaryCards: SummaryCard[] = [
    { label: "Moedas Distribuídas", value: String(totalMoedas), type: "quantity", icon: <Coins className="h-4 w-4" />, size: "compact" },
    { label: "Créditos em Aberto", value: R$(totalCreditos), icon: <CreditCard className="h-4 w-4" />, size: "wide" },
  ];

  const columns: Column<Cliente>[] = [
    { key: "cod", label: "Cod", width: "90px" },
    {
      key: "nome", label: "Nome", pinned: true,
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <WhatsAppButton telefone={row.telefone} nome={row.nome} />
          <a href="/clientePesquisa" className="hover:underline font-medium">{v}</a>
        </div>
      ),
    },
    { key: "aniversario", label: "Aniversário" },
    { key: "ultimaVisita", label: "Última Visita" },
    { key: "moedas", label: "Moedas", align: "center" },
    { key: "creditos", label: "Créditos", align: "center", render: (v) => v.toFixed(1) },
    { key: "tags", label: "Tags" },
    {
      key: "status", label: "Status",
      render: (v: StatusCliente) => {
        const config: Record<StatusCliente, { label: string; color: string }> = {
          ativo: { label: "Ativo", color: "#00c5b4" },
          "semi-ativo": { label: "Semi-ativo", color: "#f59e0b" },
          inativo: { label: "Inativo", color: "#ff2f2f" },
        };
        const c = config[v];
        return <span className="font-medium" style={{ color: c.color }}>{c.label}</span>;
      },
    },
    {
      key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
      render: () => (
        <ActionsMenu items={[
          { label: "Editar", icon: <Pencil className="h-4 w-4" /> },
          { label: "Moedas", icon: <Coins className="h-4 w-4" /> },
          { label: "Crédito", icon: <CreditCard className="h-4 w-4" /> },
          { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, variant: "destructive" },
        ]} />
      ),
    },
  ];

  const tabs: TabDef[] = [
    { label: "Todos", value: "todos", count: totalClientes, color: "neutral" },
    { label: "Ativos", value: "ativo", count: ativos, color: "success" },
    { label: "Semi-ativos", value: "semi-ativo", count: semiAtivos, color: "warning" },
    { label: "Inativos", value: "inativo", count: inativos, color: "destructive" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Lista de Clientes"
        titleIcon={
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors" title="Assistir aula">
            <PlayCircle className="h-4 w-4" />
            Aula
          </button>
        }
        data={filteredData}
        columns={columns}
        summaryCards={summaryCards}
        showDateFilter={true}
        selectable
        selectionActions={selectionActions}
        pageSize={15}
        novoMenuItems={[{ label: "Novo cliente" }]}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tableId="lista_clientes"
      />
    </AppLayout>
  );
}
