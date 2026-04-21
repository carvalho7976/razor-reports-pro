// AssinaturaCadastro.tsx

import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { TextField, Dropdown } from "@/components/FormModal";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, CalendarDays, Users, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface ServicoOpt {
  id: number;
  nome: string;
}
interface ProdutoOpt {
  id: number;
  nome: string;
}
interface ProfissionalOpt {
  id: number;
  nome: string;
  iniciais: string;
}

const servicosDisponiveis: ServicoOpt[] = [
  { id: 1, nome: "Barba + Sobrancelha" },
  { id: 5, nome: "Corte Masculino" },
];

const produtosDisponiveis: ProdutoOpt[] = [{ id: 1, nome: "Pomada" }];

const profissionaisDisponiveis: ProfissionalOpt[] = [{ id: 1, nome: "Cesar", iniciais: "CC" }];

const recorrenciaOptions = [{ value: "MENSAL", label: "Mensal" }];

const formaPagamentoOptions = [{ value: "CARTAO_CREDITO", label: "Cartão de crédito" }];

const usosOptions = [{ value: "ILIMITADO", label: "Ilimitado" }];

const comissaoOptions = [{ value: "TEMPO", label: "Por tempo" }];

const diasSemana = [{ key: "seg", label: "Seg" }];

const tabs = [
  { id: "detalhes", label: "Detalhes" },
  { id: "servicos", label: "Serviços" },
  { id: "produtos", label: "Produtos" },
];

export default function AssinaturaCadastro() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("detalhes");

  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("89,00");
  const [recorrencia, setRecorrencia] = useState("MENSAL");
  const [formaPagamento, setFormaPagamento] = useState("CARTAO_CREDITO");
  const [disponivelVenda, setDisponivelVenda] = useState(false);

  const [beneficios, setBeneficios] = useState<string[]>([]);
  const [novoBeneficio, setNovoBeneficio] = useState("");

  const [servicosInclusos, setServicosInclusos] = useState<any[]>([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState<any[]>([]);

  const resumo = useMemo(
    () => ({
      recorrenciaLabel: "Mensal",
      totalServicos: servicosInclusos.length,
      totalProdutos: produtosSelecionados.length,
      totalBeneficios: beneficios.length,
    }),
    [servicosInclusos, produtosSelecionados, beneficios],
  );

  return (
    <AppLayout>
      <div className="mx-6 mt-4">
        {/* HEADER */}
        <h1 className="text-xl font-bold">Novo plano</h1>

        {/* RESUMO */}
        <div className="mt-3 flex gap-2 flex-wrap">
          <span className="badge">
            R$ {valor} / {resumo.recorrenciaLabel}
          </span>
          <span className="badge">{resumo.totalServicos} serviços</span>
          <span className="badge">{resumo.totalProdutos} produtos</span>
          <span className="badge">{resumo.totalBeneficios} benefícios</span>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mt-4 border-b">
          {tabs.map((tab) => {
            const count =
              tab.id === "servicos" ? servicosInclusos.length : tab.id === "produtos" ? produtosSelecionados.length : 0;

            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}>
                {tab.label} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* DETALHES */}
        {activeTab === "detalhes" && (
          <div className="grid gap-4 mt-4">
            <div className="card">
              <h2>Identificação e cobrança</h2>
              <TextField label="Nome" value={nome} onChange={setNome} />
            </div>

            <div className="card">
              <h2>Disponibilidade</h2>
              <Switch checked={disponivelVenda} onCheckedChange={setDisponivelVenda} />
            </div>

            <div className="card">
              <h2>Benefícios do plano</h2>

              {/* 🔒 estrutura mantida */}
              <input value={novoBeneficio} onChange={(e) => setNovoBeneficio(e.target.value)} />

              <button
                onClick={() => {
                  setBeneficios([...beneficios, novoBeneficio]);
                  setNovoBeneficio("");
                }}
              >
                Adicionar
              </button>

              <div>
                {beneficios.map((b, i) => (
                  <span key={i}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SERVIÇOS */}
        {activeTab === "servicos" && (
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <h2>Configurar serviço</h2>
            </div>

            <div>
              <h2>Serviços incluídos</h2>

              {servicosInclusos.length === 0 && (
                <div>
                  <p>Nenhum serviço adicionado</p>
                  <p>Selecione um serviço ao lado</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRODUTOS */}
        {activeTab === "produtos" && (
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <h2>Configurar produto</h2>
            </div>

            <div>
              <h2>Produtos incluídos</h2>

              {produtosSelecionados.length === 0 && (
                <div>
                  <p>Nenhum produto adicionado</p>
                  <p>Selecione um produto ao lado</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="fixed bottom-0 right-0 p-4">
          <button>Salvar</button>
        </div>
      </div>
    </AppLayout>
  );
}
