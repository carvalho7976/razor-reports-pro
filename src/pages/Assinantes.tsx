// IMPORTS (mantém os seus + adiciona esses)
import { Search, RefreshCw, UserPlus } from "lucide-react";

// NOVOS STATES
const [celcoinOpen, setCelcoinOpen] = useState(false);
const [celcoinSearch, setCelcoinSearch] = useState("");
const [celcoinData, setCelcoinData] = useState<any[]>([
  { id: 1, nome: "Eduardo Bezerra", documento: "03788079355", plano: "Barba Club" },
]);

// AÇÃO MOCK
const handleCelcoinSync = () => {
  toast({ title: "Sincronizando Celcoin..." });
};

const handleCelcoinAdd = (cliente: any) => {
  const novo: Assinante = {
    id: Math.max(0, ...allData.map((a) => a.id)) + 1,
    nome: cliente.nome.toUpperCase(),
    telefone: "",
    plano: cliente.plano,
    inicio: new Date().toLocaleDateString("pt-BR"),
    vencimento: new Date().toLocaleDateString("pt-BR"),
    valor: 0,
    status: "Em dia",
  };

  setAllData((prev) => [novo, ...prev]);
  toast({ title: "Cliente importado da Celcoin!" });
};
