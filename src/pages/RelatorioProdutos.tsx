import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, SummaryCard, TabDef } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { User, Users, CreditCard, Hash, Wine, Star, Tag } from "lucide-react";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface ProdutoResumido {
  id: number;
  nome: string;
  categoria: string;
  quantidade: number;
  valor: number;
  qtdVendaExtra: number;
  vendaExtra: number;
  desconto: number;
  data: string;
}
interface ProdutoDetalhado {
  id: number;
  produto: string;
  cliente: string;
  celular: string;
  profissional: string;
  valor: number;
  vendaExtra: number;
  desconto: number;
  data: string;
}

const resumidoData: ProdutoResumido[] = [
  {
    id: 1,
    nome: "Pomada Modeladora",
    categoria: "Finalizadores",
    quantidade: 30,
    valor: 1200,
    qtdVendaExtra: 5,
    vendaExtra: 200,
    desconto: 50,
    data: "05/04/2026",
  },
  {
    id: 2,
    nome: "Shampoo Anticaspa",
    categoria: "Shampoos",
    quantidade: 25,
    valor: 875,
    qtdVendaExtra: 3,
    vendaExtra: 100,
    desconto: 30,
    data: "05/04/2026",
  },
  {
    id: 3,
    nome: "Óleo de Barba",
    categoria: "Barba",
    quantidade: 18,
    valor: 720,
    qtdVendaExtra: 4,
    vendaExtra: 150,
    desconto: 40,
    data: "05/04/2026",
  },
  {
    id: 4,
    nome: "Condicionador",
    categoria: "Condicionadores",
    quantidade: 20,
    valor: 600,
    qtdVendaExtra: 2,
    vendaExtra: 80,
    desconto: 20,
    data: "05/04/2026",
  },
  {
    id: 5,
    nome: "Cera Capilar",
    categoria: "Finalizadores",
    quantidade: 15,
    valor: 525,
    qtdVendaExtra: 1,
    vendaExtra: 60,
    desconto: 25,
    data: "05/04/2026",
  },
  {
    id: 6,
    nome: "Tônico Capilar",
    categoria: "Tratamento",
    quantidade: 12,
    valor: 480,
    qtdVendaExtra: 0,
    vendaExtra: 0,
    desconto: 15,
    data: "05/04/2026",
  },
];

const detalhadoData: ProdutoDetalhado[] = [
  {
    id: 1,
    produto: "Pomada Modeladora",
    cliente: "João Silva",
    celular: "(41) 99123-4567",
    profissional: "Carlos",
    valor: 40,
    vendaExtra: 10,
    desconto: 0,
    data: "05/04/2026",
  },
  {
    id: 2,
    produto: "Shampoo Anticaspa",
    cliente: "Maria Santos",
    celular: "(41) 98765-4321",
    profissional: "Ana",
    valor: 35,
    vendaExtra: 5,
    desconto: 0,
    data: "05/04/2026",
  },
  {
    id: 3,
    produto: "Óleo de Barba",
    cliente: "Pedro Oliveira",
    celular: "(41) 99876-5432",
    profissional: "Carlos",
    valor: 40,
    vendaExtra: 10,
    desconto: 5,
    data: "04/04/2026",
  },
  {
    id: 4,
    produto: "Condicionador",
    cliente: "Ana Costa",
    celular: "(41) 99654-3210",
    profissional: "Fernanda",
    valor: 30,
    vendaExtra: 0,
    desconto: 0,
    data: "04/04/2026",
  },
  {
    id: 5,
    produto: "Cera Capilar",
    cliente: "Carla Dias",
    celular: "",
    profissional: "Ana",
    valor: 35,
    vendaExtra: 0,
    desconto: 5,
    data: "03/04/2026",
  },
];

export default function RelatorioProdutos() {
  const [aulaOpen, setAulaOpen] = useState(false);
  const [tab, setTab] = useState("resumido");

  const totalQtd =
    resumidoData.reduce((s, r) => s + r.quantidade, 0) + resumidoData.reduce((s, r) => s + r.qtdVendaExtra, 0);
  const totalValor = resumidoData.reduce((s, r) => s + r.valor, 0) + resumidoData.reduce((s, r) => s + r.vendaExtra, 0);
  const avulsoQtd = resumidoData.reduce((s, r) => s + r.quantidade, 0);
  const avulsoValor = resumidoData.reduce((s, r) => s + r.valor, 0);
  const assinanteQtd = resumidoData.reduce((s, r) => s + r.qtdVendaExtra, 0);
  const assinanteValor = resumidoData.reduce((s, r) => s + r.vendaExtra, 0);

  const summaryCards: SummaryCard[] = [
    {
      label: "Total Avulsos e Assinantes",
      value: `${totalQtd} · ${R$(totalValor)}`,
      icon: <Wine className="h-4 w-4" />,
      size: "wide",
      color: "green",
    },
    {
      label: "Vendas para Avulsos",
      value: `${avulsoQtd} · ${R$(avulsoValor)}`,
      icon: <Users className="h-4 w-4" />,
      size: "wide",
      color: "green",
    },
    {
      label: "Vendas para Assinantes",
      value: `${assinanteQtd} · ${R$(assinanteValor)}`,
      icon: <Star className="h-4 w-4" />,
      size: "wide",
      color: "green",
    },
    {
      label: "Total de Desconto",
      value: R$(resumidoData.reduce((s, r) => s + r.desconto, 0)),
      icon: <Tag className="h-4 w-4" />,
      size: "wide",
      color: "red",
    },
  ];

  const columnsResumido: Column<ProdutoResumido>[] = [
    { key: "nome", label: "Produto", pinned: true },
    { key: "categoria", label: "Categoria" },
    { key: "quantidade", label: "Avulsos Atendidos", align: "center" },
    { key: "valor", label: "Vendas para Avulsos", align: "right", render: (v) => R$(v) },
    { key: "qtdVendaExtra", label: "Assinantes Atendidos", align: "center" },
    { key: "vendaExtra", label: "Vendas para Assinantes", align: "right", render: (v) => R$(v) },
    { key: "desconto", label: "Total de Desconto", align: "right", render: (v) => R$(v) },
    { key: "data", label: "Data" },
  ];

  const columnsDetalhado: Column<ProdutoDetalhado>[] = [
    { key: "produto", label: "Produto", pinned: true },
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
    {
      key: "profissional",
      label: "Profissional",
      render: (v) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <a href="/funcionarioPesquisa" className="hover:underline font-medium">
            {v}
          </a>
        </div>
      ),
    },
    { key: "valor", label: "Vendas para Avulsos", align: "right", render: (v) => R$(v) },
    { key: "vendaExtra", label: "Vendas para Assinantes", align: "right", render: (v) => R$(v) },
    { key: "desconto", label: "Total de Desconto", align: "right", render: (v) => R$(v) },
    { key: "data", label: "Data" },
  ];

  const tabs: TabDef[] = [
    { label: "Resumido", value: "resumido", color: "neutral" },
    { label: "Detalhado", value: "detalhado", color: "info" },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Relatório de Produtos"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />}
        data={tab === "resumido" ? (resumidoData as any[]) : (detalhadoData as any[])}
        columns={tab === "resumido" ? (columnsResumido as any) : (columnsDetalhado as any)}
        summaryCards={summaryCards}
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        pageSize={15}
        showDateFilter={true}
        tableId="relatorio_produtos"
      />
      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Relatório de Produtos"
      />
    </AppLayout>
  );
}
