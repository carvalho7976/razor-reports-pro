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
import Agenda from "./pages/Agenda";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/movimentacao-comandas" element={<MovimentacaoComandas />} />
          <Route path="/relatorio-clientes" element={<RelatorioClientes />} />
          <Route path="/exclusao-clientes" element={<ExclusaoClientes />} />
          <Route path="/profissionais" element={<ListaProfissionais />} />
          <Route path="/comissoes-pagar" element={<ComissoesPagar />} />
          <Route path="/comissoes-pagas" element={<ComissoesPagas />} />
          <Route path="/adiantamentos" element={<Adiantamentos />} />
          <Route path="/relatorio-profissionais" element={<RelatorioProfissionais />} />
          <Route path="/exclusao-agendamentos" element={<ExclusaoAgendamentos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
