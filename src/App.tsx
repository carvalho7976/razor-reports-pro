import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ContasPagar from "./pages/ContasPagar";
import MovimentacaoComandas from "./pages/MovimentacaoComandas";
import RelatorioClientes from "./pages/RelatorioClientes";
import ExclusaoClientes from "./pages/ExclusaoClientes";
import ListaProfissionais from "./pages/ListaProfissionais";
import ComissoesPagar from "./pages/ComissoesPagar";
import ComissoesPagas from "./pages/ComissoesPagas";
import Adiantamentos from "./pages/Adiantamentos";
import RelatorioProfissionais from "./pages/RelatorioProfissionais";
import ExclusaoAgendamentos from "./pages/ExclusaoAgendamentos";
import ListaClientes from "./pages/ListaClientes";
import Assinantes from "./pages/Assinantes";
import Comandas from "./pages/Comandas";
import Avaliacoes from "./pages/Avaliacoes";
import RelatorioAgendamentos from "./pages/RelatorioAgendamentos";
import RelatorioPacotes from "./pages/RelatorioPacotes";
import CancelamentoAssinaturas from "./pages/CancelamentoAssinaturas";
import RelatorioServicos from "./pages/RelatorioServicos";
import RelatorioProdutos from "./pages/RelatorioProdutos";
import HistoricoCompras from "./pages/HistoricoCompras";
import RelatorioDebitos from "./pages/RelatorioDebitos";
import FluxoCaixa from "./pages/FluxoCaixa";
import ListaServicos from "./pages/ListaServicos";
import ListaCategorias from "./pages/ListaCategorias";
import ListaProdutos from "./pages/ListaProdutos";
import ListaPacotes from "./pages/ListaPacotes";
import ListaFormasPagamento from "./pages/ListaFormasPagamento";
import ProfissionalPerfil from "./pages/ProfissionalPerfil";
import NovaCompra from "./pages/NovaCompra";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contasPesquisa" element={<ContasPagar />} />
          <Route path="/relatorioMovimentacaoDiaria" element={<MovimentacaoComandas />} />
          <Route path="/relatorioClientes" element={<RelatorioClientes />} />
          <Route path="/relatorioExclusaoCliente" element={<ExclusaoClientes />} />
          <Route path="/funcionarioPesquisa" element={<ListaProfissionais />} />
          <Route path="/comissao" element={<ComissoesPagar />} />
          <Route path="/comissoesPagas" element={<ComissoesPagar />} />
          <Route path="/adiantamento" element={<Adiantamentos />} />
          <Route path="/relatorioDesempenhoFuncionario" element={<RelatorioProfissionais />} />
          <Route path="/relatorioExclusaoAgendamento" element={<ExclusaoAgendamentos />} />
          <Route path="/clientePesquisa" element={<ListaClientes />} />
          <Route path="/assinantePesquisa" element={<Assinantes />} />
          <Route path="/comandasAbertas" element={<Comandas />} />
          <Route path="/avaliacoes" element={<Avaliacoes />} />
          <Route path="/relatorioAgendamentos" element={<RelatorioAgendamentos />} />
          <Route path="/relatorioCombos" element={<RelatorioPacotes />} />
          <Route path="/relatorioExclusaoAssinante" element={<CancelamentoAssinaturas />} />
          <Route path="/relatorioServicos" element={<RelatorioServicos />} />
          <Route path="/relatorioProdutos" element={<RelatorioProdutos />} />
          <Route path="/comprasPesquisa" element={<HistoricoCompras />} />
          <Route path="/debitoClientes" element={<RelatorioDebitos />} />
          <Route path="/relatorioFluxoCaixaNovo" element={<FluxoCaixa />} />
          <Route path="/servicoPesquisa" element={<ListaServicos />} />
          <Route path="/categoriaServicoPesquisa" element={<ListaCategorias />} />
          <Route path="/produtoPesquisa" element={<ListaProdutos />} />
          <Route path="/comboPesquisa" element={<ListaPacotes />} />
          <Route path="/formaPagamentoPesquisa" element={<ListaFormasPagamento />} />
          <Route path="/profissionalPerfil" element={<ProfissionalPerfil />} />
          <Route path="/novaCompra" element={<NovaCompra />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
