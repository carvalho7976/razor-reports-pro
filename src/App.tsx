import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import FichaCliente from "./pages/FichaCliente";
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
import FrenteCaixa from "./pages/FrenteCaixa";
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
import AssinaturaCadastro from "./pages/AssinaturaCadastro";
import PaginaPlanos from "./pages/PaginaPlanos";
import SiteAgendamento from "./pages/SiteAgendamento";
import ConfiguracoesEmpresa from "./pages/ConfiguracoesEmpresa";
import NovoPacote from "./pages/NovoPacote";
import NovoServico from "./pages/NovoServico";
import NovaAgenda2 from "./pages/NovaAgenda2";
import AssinaturaPesquisa from "./pages/AssinaturaPesquisa";
import RelatorioAssinatura from "./pages/RelatorioAssinatura";
import Concorrentes from "./pages/Concorrentes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/clienteFicha" element={<FichaCliente />} />
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
          <Route path="/frenteCaixa" element={<FrenteCaixa />} />
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
          <Route path="/novoServico" element={<NovoServico />} />
          <Route path="/servicoCadastro" element={<NovoServico />} />
          <Route path="/categoriaServicoPesquisa" element={<ListaCategorias />} />
          <Route path="/produtoPesquisa" element={<ListaProdutos />} />
          <Route path="/comboPesquisa" element={<ListaPacotes />} />
          <Route path="/novoPacote" element={<NovoPacote />} />
          <Route path="/comboCadastro" element={<NovoPacote />} />
          <Route path="/formaPagamentoPesquisa" element={<ListaFormasPagamento />} />
          <Route path="/profissionalPerfil" element={<ProfissionalPerfil />} />
          <Route path="/novaCompra" element={<NovaCompra />} />
          <Route path="/assinaturaCadastro" element={<AssinaturaCadastro />} />
          <Route path="/novaAgenda2" element={<NovaAgenda2 />} />
          <Route path="/assinaturaPesquisa" element={<AssinaturaPesquisa />} />
          <Route path="/configuracoes" element={<ConfiguracoesEmpresa />} />
          <Route path="/edicaoUsuario" element={<ConfiguracoesEmpresa />} />
          <Route path="/edicaoUsuario.xhtml" element={<ConfiguracoesEmpresa />} />
          <Route path="/frenteCliente" element={<SiteAgendamento />} />
          <Route path="/frenteCliente.xhtml" element={<SiteAgendamento />} />
          <Route path="/assinaturaConfigFrente" element={<PaginaPlanos />} />
          <Route path="/assinaturaConfigFrente.xhtml" element={<PaginaPlanos />} />
          <Route path="/relatorioAssinatura.xhtml" element={<RelatorioAssinatura />} />
          <Route path="/relatorioAssinatura" element={<RelatorioAssinatura />} />
          <Route path="/concorrentes" element={<Concorrentes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
