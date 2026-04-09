import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, TabDef, SummaryCard } from "@/components/DataTable";
import { User, CreditCard, Hash, Trash2 } from "lucide-react";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FormModal, TextField, Dropdown, SaveButton } from "@/components/FormModal";
import { useToast } from "@/hooks/use-toast";

const formatBRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Produto {
  nome: string;
  valor: number;
  quantidade: number;
}

interface CompraResumida {
  id: number;
  data: string;
  funcionario: string;
  valor: number;
  desconto: number;
  total: number;
  debitoTipo?: string;
  produtos: Produto[];
}

interface ItemCompraForm {
  id: number;
  produto: string;
  valor: string;
  quantidade: string;
}

const produtosOptions = [
  { value: "CREME DE BARBEAR", label: "CREME DE BARBEAR" },
  { value: "GEL FIXADOR", label: "GEL FIXADOR" },
  { value: "POMADA MODELADORA", label: "POMADA MODELADORA" },
  { value: "SHAMPOO ANTICASPA", label: "SHAMPOO ANTICASPA" },
  { value: "ÓLEO DE BARBA", label: "ÓLEO DE BARBA" },
  { value: "CONDICIONADOR", label: "CONDICIONADOR" },
];

const debitoOptions = [
  { value: "caixa", label: "Retirar do Caixa" },
  { value: "conta", label: "Retirar da Conta" },
  { value: "parcelar", label: "Parcelar" },
];

const initialData: CompraResumida[] = [
  {
    id: 1,
    data: "04/04/2026",
    funcionario: "Lara",
    valor: 85,
    desconto: 31,
    total: 54,
    debitoTipo: "caixa",
    produtos: [
      { nome: "GEL FIXADOR", valor: 23, quantidade: 1 },
      { nome: "color dicolor 10.89 - dicolore", valor: 31, quantidade: 2 },
    ],
  },
  {
    id: 2,
    data: "01/04/2026",
    funcionario: "Carlos",
    valor: 120,
    desconto: 10,
    total: 110,
    debitoTipo: "conta",
    produtos: [
      { nome: "Pomada Modeladora", valor: 40, quantidade: 2 },
      { nome: "Shampoo Anticaspa", valor: 20, quantidade: 2 },
    ],
  },
  {
    id: 3,
    data: "28/03/2026",
    funcionario: "Ana",
    valor: 95,
    desconto: 5,
    total: 90,
    debitoTipo: "parcelar",
    produtos: [
      { nome: "Óleo de Barba", valor: 45, quantidade: 1 },
      { nome: "Condicionador", valor: 25, quantidade: 2 },
    ],
  },
];

function toNumberBR(value: string) {
  if (!value) return 0;
  return Number(value.replace(/\./g, "").replace(",", ".")) || 0;
}

export default function HistoricoCompras() {
  const { toast } = useToast();

  const [aulaOpen, setAulaOpen] = useState(false);
  const [tab, setTab] = useState<"resumido" | "detalhado">("resumido");
  const [compras, setCompras] = useState<CompraResumida[]>(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [detalhadoDataFiltro, setDetalhadoDataFiltro] = useState<string | null>(null);

  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [valorItem, setValorItem] = useState("");
  const [quantidadeItem, setQuantidadeItem] = useState("1");
  const [desconto, setDesconto] = useState("0,00");
  const [debitoTipo, setDebitoTipo] = useState("caixa");
  const [itensCompra, setItensCompra] = useState<ItemCompraForm[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  const resetForm = () => {
    setProdutoSelecionado("");
    setValorItem("");
    setQuantidadeItem("1");
    setDesconto("0,00");
    setDebitoTipo("caixa");
    setItensCompra([]);
    setShowErrors(false);
  };

  const openNew = () => {
    resetForm();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const totalProdutos = compras.reduce(
    (sumCompras, compra) =>
      sumCompras + compra.produtos.reduce((sumProdutos, produto) => sumProdutos + produto.quantidade, 0),
    0,
  );

  const totalCompras = compras.reduce((sum, compra) => sum + compra.total, 0);

  const summaryCards: SummaryCard[] = [
    {
      label: "Produtos Comprados",
      value: String(totalProdutos),
      type: "quantity",
      icon: <Hash className="h-4 w-4" />,
      size: "compact",
      color: "blue",
    },
    {
      label: "Total em Compras",
      value: formatBRL(totalCompras),
      icon: <CreditCard className="h-4 w-4" />,
      size: "wide",
      color: "blue",
    },
  ];

  const abrirDetalhadoPorData = (data: string) => {
    setDetalhadoDataFiltro(data);
    setTab("detalhado");
  };

  const columnsResumido: Column<any>[] = [
    {
      key: "data",
      label: "Data",
      pinned: true,
      render: (v: string) => (
        <button
          type="button"
          onClick={() => abrirDetalhadoPorData(v)}
          className="font-medium text-primary hover:underline"
        >
          {v}
        </button>
      ),
    },
    {
      key: "funcionario",
      label: "Usuário Responsável",
      render: (v: string) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <a href="/funcionarioPesquisa" className="font-medium hover:underline">
            {v}
          </a>
        </div>
      ),
    },
    { key: "valor", label: "Valor", align: "right", render: (v: number) => formatBRL(v) },
    { key: "desconto", label: "Desconto", align: "right", render: (v: number) => formatBRL(v) },
    {
      key: "total",
      label: "Total",
      align: "right",
      render: (v: number) => <span className="font-medium text-emerald-600">{formatBRL(v)}</span>,
    },
  ];

  const detalhadoDataBase = useMemo(() => {
    const rows: any[] = [];

    compras.forEach((compra) => {
      compra.produtos.forEach((produto, index) => {
        rows.push({
          id: compra.id * 1000 + index,
          compraId: compra.id,
          data: compra.data,
          produto: produto.nome,
          quantidade: produto.quantidade,
          valor: produto.valor,
          total: Number(produto.valor || 0) * Number(produto.quantidade || 0),
        });
      });
    });

    return rows;
  }, [compras]);

  const detalhadoData = useMemo(() => {
    if (!detalhadoDataFiltro) return detalhadoDataBase;
    return detalhadoDataBase.filter((item) => item.data === detalhadoDataFiltro);
  }, [detalhadoDataBase, detalhadoDataFiltro]);

  const columnsDetalhado: Column<any>[] = [
    { key: "data", label: "Data", pinned: true },
    { key: "produto", label: "Produto" },
    { key: "quantidade", label: "Quantidade", align: "center" },
    {
      key: "valor",
      label: "Valor Unitário",
      align: "right",
      render: (v: number) => formatBRL(v),
    },
    {
      key: "total",
      label: "Total",
      align: "right",
      render: (v: number) => <span className="font-medium text-emerald-600">{formatBRL(v)}</span>,
    },
  ];

  const tabs: TabDef[] = [
    { label: "Resumido", value: "resumido", color: "neutral" },
    { label: "Detalhado", value: "detalhado", color: "info" },
  ];

  const itemPreviewTotal = useMemo(() => {
    const valor = toNumberBR(valorItem);
    const quantidade = Number(quantidadeItem) || 0;
    return valor * quantidade;
  }, [valorItem, quantidadeItem]);

  const subtotalCompra = useMemo(() => {
    return itensCompra.reduce((acc, item) => {
      const valor = toNumberBR(item.valor);
      const quantidade = Number(item.quantidade) || 0;
      return acc + valor * quantidade;
    }, 0);
  }, [itensCompra]);

  const descontoCompra = useMemo(() => toNumberBR(desconto), [desconto]);

  const totalCompra = useMemo(() => {
    const total = subtotalCompra - descontoCompra;
    return total < 0 ? 0 : total;
  }, [subtotalCompra, descontoCompra]);

  const errors = {
    itensCompra: itensCompra.length === 0 ? "Adicione pelo menos um produto." : "",
  };

  const handleAdicionarItem = () => {
    const valor = toNumberBR(valorItem);
    const quantidade = Number(quantidadeItem) || 0;

    if (!produtoSelecionado || valor <= 0 || quantidade <= 0) {
      toast({
        title: "Preencha o item corretamente",
        description: "Selecione o produto, informe valor e quantidade válidos.",
        variant: "destructive",
      });
      return;
    }

    setItensCompra((prev) => [
      ...prev,
      {
        id: Date.now(),
        produto: produtoSelecionado,
        valor: valorItem,
        quantidade: quantidadeItem,
      },
    ]);

    setProdutoSelecionado("");
    setValorItem("");
    setQuantidadeItem("1");
  };

  const handleRemoverItem = (id: number) => {
    setItensCompra((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSalvarCompra = () => {
    setShowErrors(true);

    if (errors.itensCompra) return;

    const novaCompra: CompraResumida = {
      id: Math.max(0, ...compras.map((item) => item.id)) + 1,
      data: new Date().toLocaleDateString("pt-BR"),
      funcionario: "Lara",
      valor: subtotalCompra,
      desconto: descontoCompra,
      total: totalCompra,
      debitoTipo,
      produtos: itensCompra.map((item) => ({
        nome: item.produto,
        valor: toNumberBR(item.valor),
        quantidade: Number(item.quantidade) || 0,
      })),
    };

    setCompras((prev) => [novaCompra, ...prev]);
    closeModal();

    toast({
      title: "Compra registrada",
      description: "A entrada de produtos foi salva com sucesso.",
    });
  };

  return (
    <AppLayout>
      <DataTable
        title="Histórico de Compras"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />}
        data={tab === "resumido" ? compras : detalhadoData}
        columns={tab === "resumido" ? columnsResumido : columnsDetalhado}
        summaryCards={summaryCards}
        tabs={tabs}
        activeTab={tab}
        onTabChange={(value) => {
          setTab(value as "resumido" | "detalhado");
          if (value === "resumido") setDetalhadoDataFiltro(null);
        }}
        pageSize={15}
        showDateFilter={true}
        tableId="historico_compras"
        novoMenuItems={[{ label: "Nova compra", onClick: openNew }]}
      />

      <Dialog open={modalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <FormModal
            title="Entrada de Produtos"
            subtitle="Cadastre uma nova compra de produto no estoque."
            onClose={closeModal}
            footer={<SaveButton onClick={handleSalvarCompra} />}
            size="xl"
          >
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Dropdown
                    label="Produto"
                    value={produtoSelecionado}
                    setValue={setProdutoSelecionado}
                    options={produtosOptions}
                  />
                  <TextField label="Custo do item" value={valorItem} onChange={setValorItem} placeholder="0,00" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <TextField
                    label="Quantidade"
                    value={quantidadeItem}
                    onChange={setQuantidadeItem}
                    type="number"
                    placeholder="1"
                  />
                  <TextField label="Custo total" value={formatBRL(itemPreviewTotal)} onChange={() => {}} disabled />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAdicionarItem}
                    className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  <table className="w-full border-collapse">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Produto</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Valor</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Quantidade</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Total</th>
                        <th className="w-14 px-2 py-3 text-center text-sm font-semibold text-foreground" />
                      </tr>
                    </thead>
                    <tbody>
                      {itensCompra.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                            Nenhum produto adicionado.
                          </td>
                        </tr>
                      ) : (
                        itensCompra.map((item) => {
                          const valor = toNumberBR(item.valor);
                          const quantidade = Number(item.quantidade) || 0;
                          const total = valor * quantidade;

                          return (
                            <tr key={item.id} className="border-t border-border bg-card">
                              <td className="px-4 py-3 text-sm text-foreground">{item.produto}</td>
                              <td className="px-4 py-3 text-right text-sm text-foreground">{formatBRL(valor)}</td>
                              <td className="px-4 py-3 text-center text-sm text-foreground">{quantidade}</td>
                              <td className="px-4 py-3 text-right text-sm font-medium text-emerald-600">
                                {formatBRL(total)}
                              </td>
                              <td className="px-2 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoverItem(item.id)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-destructive transition hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <TextField label="Desconto" value={desconto} onChange={setDesconto} placeholder="0,00" />
                  <Dropdown label="Débito" value={debitoTipo} setValue={setDebitoTipo} options={debitoOptions} />
                </div>

                <div className="rounded-lg border border-border bg-card px-4 py-4 text-right">
                  <div className="text-sm text-muted-foreground">
                    Total: <span className="font-medium text-foreground">{formatBRL(subtotalCompra)}</span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Desconto: <span className="font-medium text-foreground">{formatBRL(descontoCompra)}</span>
                  </div>
                  <div className="mt-2 text-base font-semibold text-foreground">
                    Total c/ desconto: <span className="text-emerald-600">{formatBRL(totalCompra)}</span>
                  </div>
                </div>

                {showErrors && errors.itensCompra ? (
                  <p className="text-sm text-destructive">{errors.itensCompra}</p>
                ) : null}
              </div>
            </div>
          </FormModal>
        </DialogContent>
      </Dialog>

      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Histórico de Compras"
      />
    </AppLayout>
  );
}
