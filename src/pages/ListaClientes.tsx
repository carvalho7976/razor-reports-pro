import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, ActionsMenu, SelectionAction } from "@/components/DataTable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageCircle, ChevronRight, Gift, RotateCcw, Bell, Users, Edit3, Trash2, Merge, PlayCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type StatusCliente = "ativo" | "semi-ativo" | "inativo";

interface Cliente {
  cod: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  aniversario: string;
  ultimaVisita: string;
  moedas: number;
  creditos: number;
  tags: string;
  status: StatusCliente;
}

const data: Cliente[] = [
  { cod: "745142", nome: "Abner Ferreira Chaves", cpf: "", email: "", telefone: "(61) 99450-9929", aniversario: "01/05/2017", ultimaVisita: "04/11/2025", moedas: 196, creditos: 0, tags: "bloquear123", status: "inativo" },
  { cod: "1037806", nome: "Ada Naama", cpf: "", email: "", telefone: "(67) 99162-990", aniversario: "", ultimaVisita: "17/02/2026", moedas: 25, creditos: 0, tags: "", status: "ativo" },
  { cod: "1037807", nome: "Adara Cerqueira", cpf: "", email: "", telefone: "6181627802", aniversario: "10/05/2025", ultimaVisita: "17/02/2026", moedas: 0, creditos: 0, tags: "", status: "ativo" },
  { cod: "1037808", nome: "Adelia Maria Sales", cpf: "", email: "", telefone: "12981134764", aniversario: "", ultimaVisita: "26/11/2025", moedas: 4, creditos: 0, tags: "", status: "inativo" },
  { cod: "1167159", nome: "Adelio Marçal", cpf: "", email: "", telefone: "(88) 90300-0166", aniversario: "", ultimaVisita: "05/11/2025", moedas: 4, creditos: 0, tags: "", status: "inativo" },
  { cod: "675732", nome: "Ademar Herminio", cpf: "", email: "claudiasuellenbdossantos@gmail.com", telefone: "(55) 55555-5555", aniversario: "", ultimaVisita: "01/10/2025", moedas: 397, creditos: 0, tags: "", status: "inativo" },
  { cod: "1069712", nome: "Adenilson", cpf: "", email: "", telefone: "(21) 99999-9999", aniversario: "20/01/1988", ultimaVisita: "12/08/2025", moedas: 0, creditos: 0, tags: "", status: "inativo" },
  { cod: "1204833", nome: "Adenilson", cpf: "", email: "", telefone: "(21) 99999-9999", aniversario: "20/03/1988", ultimaVisita: "11/12/2025", moedas: 4, creditos: 0, tags: "", status: "semi-ativo" },
  { cod: "1037809", nome: "Adhara Maria", cpf: "", email: "", telefone: "", aniversario: "", ultimaVisita: "10/02/2026", moedas: 24, creditos: 0, tags: "", status: "ativo" },
  { cod: "848084", nome: "Adriana", cpf: "", email: "", telefone: "(99) 99999-99999", aniversario: "22/03/1988", ultimaVisita: "24/06/2025", moedas: 97, creditos: 0, tags: "", status: "inativo" },
  { cod: "1037810", nome: "Adriana", cpf: "", email: "", telefone: "11993966288", aniversario: "", ultimaVisita: "", moedas: 0, creditos: 0, tags: "", status: "inativo" },
  { cod: "1037811", nome: "Adriana", cpf: "", email: "", telefone: "12982466363", aniversario: "", ultimaVisita: "", moedas: 0, creditos: 0, tags: "", status: "inativo" },
  { cod: "1037812", nome: "Adriana Bitencourt", cpf: "", email: "", telefone: "13997288558", aniversario: "", ultimaVisita: "", moedas: 0, creditos: 0, tags: "", status: "inativo" },
  { cod: "1037813", nome: "Adriana Cabello", cpf: "", email: "", telefone: "(19) 99239-3840", aniversario: "", ultimaVisita: "", moedas: 0, creditos: 0, tags: "", status: "inativo" },
  { cod: "1037814", nome: "Adriana Cherin", cpf: "", email: "", telefone: "11994527149", aniversario: "", ultimaVisita: "", moedas: 0, creditos: 0, tags: "", status: "inativo" },
];

const messageTemplates: { key: string; label: string; icon: React.ReactNode; getText: (nome: string) => string }[] = [
  {
    key: "aniversario", label: "Aniversário", icon: <Gift className="h-4 w-4" />,
    getText: (nome) => `🎂 Feliz aniversário, ${nome}! A equipe Frizzar deseja um dia incrível pra você. Venha comemorar com a gente — temos uma surpresa especial esperando por você! 🎉`,
  },
  {
    key: "retorno", label: "Retorno", icon: <RotateCcw className="h-4 w-4" />,
    getText: (nome) => `Olá ${nome}! Faz um tempinho que não te vemos por aqui. 😊 Que tal agendar um horário? Estamos com novidades que você vai adorar! Agende já pelo nosso app ou responda essa mensagem.`,
  },
  {
    key: "lembrete", label: "Lembrete", icon: <Bell className="h-4 w-4" />,
    getText: (nome) => `Oi ${nome}, tudo bem? Passando pra lembrar do seu agendamento conosco. Qualquer dúvida ou necessidade de reagendar, é só nos avisar. Até breve! ✂️`,
  },
  {
    key: "indicacao", label: "Pedido de indicação", icon: <Users className="h-4 w-4" />,
    getText: (nome) => `Oi ${nome}! Que bom ter você como cliente. 💈 Se tiver um amigo que curtisse conhecer nosso trabalho, indique pra gente! Vocês dois ganham condições especiais. É só compartilhar essa mensagem! 🤝`,
  },
];

function WhatsAppCell({ telefone, nome }: { telefone: string; nome: string }) {
  const [open, setOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const firstName = nome.split(" ")[0];

  if (!telefone) return <span className="text-muted-foreground text-xs">—</span>;

  const cleanNumber = telefone.replace(/\D/g, "");

  const sendWhatsApp = (text: string) => {
    const url = `https://wa.me/55${cleanNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setOpen(false);
    setCustomOpen(false);
    setCustomText("");
  };

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setCustomOpen(false); setCustomText(""); } }}>
      <PopoverTrigger asChild>
        <button className="p-1 rounded hover:bg-accent transition-colors" title="Enviar mensagem WhatsApp">
          <MessageCircle className="h-4 w-4 text-success" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="start">
        <p className="text-xs font-medium text-muted-foreground px-2 pb-1.5 truncate">Enviar para {nome}</p>
        {!customOpen ? (
          <div className="flex flex-col gap-0.5">
            {messageTemplates.map((tpl) => (
              <button
                key={tpl.key}
                onClick={() => sendWhatsApp(tpl.getText(firstName))}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors text-left w-full"
              >
                {tpl.icon}
                {tpl.label}
                <ChevronRight className="h-3 w-3 ml-auto text-muted-foreground" />
              </button>
            ))}
            <button
              onClick={() => setCustomOpen(true)}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors text-left w-full"
            >
              <Edit3 className="h-4 w-4" />
              Outro (personalizada)
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-1">
            <Textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="min-h-[80px] text-sm"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setCustomOpen(false)}>Voltar</Button>
              <Button size="sm" disabled={!customText.trim()} onClick={() => sendWhatsApp(customText)}>
                <MessageCircle className="h-3.5 w-3.5 mr-1" /> Enviar
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function StatusBadge({ status }: { status: StatusCliente }) {
  const config: Record<StatusCliente, { label: string; className: string }> = {
    ativo: { label: "Ativo", className: "bg-success text-success-foreground" },
    "semi-ativo": { label: "Semi-ativo", className: "bg-warning text-warning-foreground" },
    inativo: { label: "Inativo", className: "bg-destructive text-destructive-foreground" },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${c.className}`}>
      {c.label}
    </span>
  );
}

const columns: Column<Cliente>[] = [
  {
    key: "whatsapp", label: "Zap", sortable: false, filterable: false, align: "center", width: "50px",
    render: (_, row) => <WhatsAppCell telefone={row.telefone} nome={row.nome} />,
  },
  { key: "cod", label: "Cod", width: "90px" },
  { key: "nome", label: "Nome", pinned: true },
  { key: "cpf", label: "CPF" },
  { key: "email", label: "Email" },
  { key: "telefone", label: "Telefone" },
  { key: "aniversario", label: "Aniversário" },
  { key: "ultimaVisita", label: "Última Visita" },
  { key: "moedas", label: "Moedas", align: "center" },
  { key: "creditos", label: "Créditos", align: "center", render: (v) => v.toFixed(1) },
  { key: "tags", label: "Tags" },
  {
    key: "status", label: "Status",
    render: (v) => <StatusBadge status={v} />,
  },
  {
    key: "acoes" as any, label: "Ações", sortable: false, filterable: false, align: "center",
    render: () => (
      <ActionsMenu items={[
        { label: "Editar" },
        { label: "Excluir", variant: "destructive" },
      ]} />
    ),
  },
];

export default function ListaClientes() {
  const [activeTab, setActiveTab] = useState("todos");
  const [allData, setAllData] = useState(data);
  const { toast } = useToast();

  const filteredData = useMemo(() => {
    if (activeTab === "todos") return allData;
    return allData.filter((c) => c.status === activeTab);
  }, [activeTab, allData]);

  const totalClientes = allData.length;
  const ativos = allData.filter((c) => c.status === "ativo").length;
  const semiAtivos = allData.filter((c) => c.status === "semi-ativo").length;
  const inativos = allData.filter((c) => c.status === "inativo").length;

  const bulkRemove = (indices: number[]) => {
    const cods = indices.map((i) => filteredData[i]?.cod).filter(Boolean);
    setAllData((prev) => prev.filter((c) => !cods.includes(c.cod)));
    toast({ title: `${cods.length} cliente(s) removido(s)`, variant: "destructive" });
  };

  const bulkMerge = (indices: number[]) => {
    toast({ title: `Mesclar ${indices.length} clientes`, description: "Funcionalidade em desenvolvimento" });
  };

  const bulkMessage = (indices: number[]) => {
    const clients = indices.map((i) => filteredData[i]).filter(Boolean).filter((c) => c.telefone);
    if (clients.length === 0) {
      toast({ title: "Nenhum cliente com telefone", variant: "destructive" });
      return;
    }
    toast({ title: `Enviar mensagem para ${clients.length} cliente(s)`, description: "Funcionalidade em desenvolvimento" });
  };

  const selectionActions: SelectionAction[] = [
    { label: "Remover", icon: <Trash2 className="h-4 w-4" />, onClick: bulkRemove, variant: "destructive", description: "Remove permanentemente os clientes selecionados da lista" },
    { label: "Mesclar", icon: <Merge className="h-4 w-4" />, onClick: bulkMerge, description: "Unifica cadastros duplicados em um único registro" },
    { label: "Mensagem", icon: <MessageCircle className="h-4 w-4" />, onClick: bulkMessage, description: "Envia mensagem via WhatsApp para os clientes selecionados" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Lista de Clientes"
        data={filteredData}
        columns={columns}
        showDateFilter={false}
        selectable
        selectionActions={selectionActions}
        pageSize={15}
        novoMenuItems={[{ label: "Novo cliente" }]}
        tabs={[
          { label: "Todos", value: "todos", count: totalClientes },
          { label: "Ativos", value: "ativo", count: ativos },
          { label: "Semi-ativos", value: "semi-ativo", count: semiAtivos },
          { label: "Inativos", value: "inativo", count: inativos },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </AppLayout>
  );
}
