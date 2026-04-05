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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
