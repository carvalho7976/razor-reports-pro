import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column } from "@/components/DataTable";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { User } from "lucide-react";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface ComissaoPaga {
  dataAcerto: string;
  profissional: string;
  cliente: string;
  celular: string;
  servico: string;
  dataAtendimento: string;
  valorComanda: number;
  tipo: string;
  descontoTaxa: number;
  comissaoPaga: number;
}

const data: ComissaoPaga[] = [
  { dataAcerto: "01/03/2026", profissional: "Cesar", cliente: "João Silva", celular: "(41) 99123-4567", servico: "Corte Masculino", dataAtendimento: "28/02/2026", valorComanda: 75, tipo: "Serviço", descontoTaxa: 2.5, comissaoPaga: 36.25 },
  { dataAcerto: "01/03/2026", profissional: "Matheus", cliente: "Pedro Santos", celular: "(41) 99876-5432", servico: "Barba", dataAtendimento: "28/02/2026", valorComanda: 45, tipo: "Serviço", descontoTaxa: 1.5, comissaoPaga: 21.75 },
  { dataAcerto: "01/03/2026", profissional: "Claudia", cliente: "Ana Costa", celular: "(41) 99654-3210", servico: "Hidratação", dataAtendimento: "27/02/2026", valorComanda: 120, tipo: "Serviço", descontoTaxa: 4, comissaoPaga: 58 },
];

const totalValor = data.reduce((s, r) => s + r.valorComanda, 0);
const totalComissao = data.reduce((s, r) => s + r.comissaoPaga, 0);

const columns: Column<ComissaoPaga>[] = [
  { key: "dataAcerto", label: "Data do Acerto" },
  {
    key: "profissional", label: "Profissional",
    render: (v) => (
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <a href="/funcionarioPesquisa" className="hover:underline font-medium">{v}</a>
      </div>
    ),
  },
  {
    key: "cliente", label: "Cliente",
    render: (v, row) => (
      <div className="flex items-center gap-1.5">
        <WhatsAppButton telefone={row.celular} nome={row.cliente} />
        <a href="/clientePesquisa" className="hover:underline font-medium">{v}</a>
      </div>
    ),
  },
  { key: "servico", label: "Serviço" },
  { key: "dataAtendimento", label: "Data Atendimento" },
  { key: "valorComanda", label: "Valor da Comanda", align: "right", render: (v) => R$(v) },
  { key: "tipo", label: "Tipo" },
  { key: "descontoTaxa", label: "Desconto (Taxa Cartão + Assistente)", align: "right", render: (v) => R$(v) },
  { key: "comissaoPaga", label: "Comissão Paga", align: "right", render: (v) => R$(v) },
];

export default function ComissoesPagas() {
  const [aulaOpen, setAulaOpen] = useState(false);
  return (
    <AppLayout>
      <DataTable
        title="Comissões Pagas"
        titleIcon={<AulaButton onOpen={() => setAulaOpen(true)} />}
        data={data}
        columns={columns}
        totalRow={{ valorComanda: R$(totalValor), descontoTaxa: "Valor Total:", comissaoPaga: R$(totalComissao) }}
        showDateFilter={true}
        tableId="comissoes_pagas"
      />
      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Comissões Pagas"
      />
    </AppLayout>
  );
}