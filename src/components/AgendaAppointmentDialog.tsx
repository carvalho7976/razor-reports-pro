import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Trash2,
  Copy,
  Plus,
  Edit2,
  Eye,
  ExternalLink,
} from "lucide-react";

interface AppointmentData {
  client: string;
  service: string;
  startTime: string;
  endTime: string;
  professionalName: string;
  color: string;
}

interface ComandaItem {
  service: string;
  professional: string;
  price: number;
}

interface PaymentEntry {
  method: string;
  value: number;
}

interface AgendaAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AppointmentData | null;
}

const statusOptions = ["agendado", "confirmado", "em atendimento", "finalizado", "cancelado"];
const paymentMethods = ["Dinheiro", "Cartão Crédito", "Cartão Débito", "PIX", "Transferência"];
const serviceOptions = ["Corte Masculino", "Esmaltação em gel", "Manicure", "Hidratação", "Barba", "Corte + Barba", "Escova", "Coloração"];
const productOptions = ["Shampoo", "Condicionador", "Creme", "Gel"];

export function AgendaAppointmentDialog({
  open,
  onOpenChange,
  appointment,
}: AgendaAppointmentDialogProps) {
  const [status, setStatus] = useState("agendado");
  const [items, setItems] = useState<ComandaItem[]>(() =>
    appointment
      ? [{ service: appointment.service, professional: appointment.professionalName, price: 70 }]
      : []
  );
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState("");
  const [newPaymentValue, setNewPaymentValue] = useState("");
  const [observations, setObservations] = useState("");
  const [showObservations, setShowObservations] = useState(false);

  // Add item form state
  const [addProfessional, setAddProfessional] = useState(appointment?.professionalName || "");
  const [addService, setAddService] = useState("");
  const [addProduct, setAddProduct] = useState("");

  if (!appointment) return null;

  const total = items.reduce((sum, i) => sum + i.price, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.value, 0);
  const remaining = total - totalPaid;

  const handleAddPayment = () => {
    if (newPaymentMethod && newPaymentValue) {
      setPayments([...payments, { method: newPaymentMethod, value: parseFloat(newPaymentValue) }]);
      setNewPaymentMethod("");
      setNewPaymentValue("");
    }
  };

  const handleAddItem = () => {
    if (addService) {
      setItems([...items, { service: addService, professional: addProfessional, price: 50 }]);
      setAddService("");
    }
  };

  const currentDate = "09/03/2026";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
            {/* Header with actions */}
            <div className="flex items-center justify-between">
              <DialogHeader className="space-y-0">
                <DialogTitle className="text-xl font-bold text-foreground">
                  Agendamento
                </DialogTitle>
                <p className="text-sm text-muted-foreground">Data: {currentDate}</p>
              </DialogHeader>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors" title="Remover">
                  <Trash2 className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors" title="Duplicar">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Status + Times Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="toolbar-input w-full px-3 py-2 text-sm"
                >
                  {statusOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Início</label>
                <input
                  type="text"
                  defaultValue={`${currentDate} ${appointment.startTime}`}
                  className="toolbar-input w-full px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Fim</label>
                <input
                  type="text"
                  defaultValue={`${currentDate} ${appointment.endTime}`}
                  className="toolbar-input w-full px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-border" />

            {/* Add Item Section */}
            <div>
              <h3 className="text-base font-bold text-foreground underline mb-3">Adicionar Item</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Profissional</label>
                  <select
                    value={addProfessional}
                    onChange={(e) => setAddProfessional(e.target.value)}
                    className="toolbar-input w-full px-3 py-2 text-sm"
                  >
                    <option value="">Selecione</option>
                    <option>Cesar</option>
                    <option>Claudia</option>
                    <option>Marcia Silva</option>
                    <option>Matheus</option>
                    <option>Vini</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Serviço</label>
                  <select
                    value={addService}
                    onChange={(e) => setAddService(e.target.value)}
                    className="toolbar-input w-full px-3 py-2 text-sm"
                  >
                    <option value="">Selecione</option>
                    {serviceOptions.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Produto</label>
                  <select
                    value={addProduct}
                    onChange={(e) => setAddProduct(e.target.value)}
                    className="toolbar-input w-full px-3 py-2 text-sm"
                  >
                    <option value="">Selecione</option>
                    {productOptions.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAddItem}
                  className="text-info hover:text-info/80 text-sm font-medium flex items-center gap-1 transition-colors pb-2"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-border" />

            {/* Resumo da Comanda */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-foreground underline">Resumo da Comanda</h3>
                <button className="text-info hover:text-info/80 text-sm font-medium flex items-center gap-1 transition-colors">
                  <Edit2 className="h-3.5 w-3.5" />
                  Editar
                </button>
              </div>
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Nenhum item adicionado</p>
              ) : (
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <span className="text-sm font-semibold text-foreground">{item.service}</span>
                        <span className="text-xs text-muted-foreground ml-2">— {item.professional}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        R$ {item.price.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-border" />

            {/* Pagamento */}
            <div>
              <div className="flex items-center gap-4 mb-3 flex-wrap">
                <h3 className="text-base font-bold text-foreground underline">Pagamento</h3>
                <select
                  value={newPaymentMethod}
                  onChange={(e) => setNewPaymentMethod(e.target.value)}
                  className="toolbar-input px-3 py-1.5 text-sm min-w-[130px]"
                >
                  <option value="">Selecione</option>
                  {paymentMethods.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="valor"
                  value={newPaymentValue}
                  onChange={(e) => setNewPaymentValue(e.target.value)}
                  className="toolbar-input px-3 py-1.5 text-sm w-24"
                />
                <button
                  onClick={handleAddPayment}
                  className="text-info hover:text-info/80 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar
                </button>
              </div>
              {payments.length > 0 && (
                <div className="space-y-1 mb-3">
                  {payments.map((p, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{p.method}</span>
                      <span className="text-foreground font-medium">R$ {p.value.toFixed(2).replace(".", ",")}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end items-baseline gap-4 mt-2">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="text-2xl font-bold text-foreground">
                    R$ {total.toFixed(2).replace(".", ",")}
                  </div>
                  {remaining > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Resta: R$ {remaining.toFixed(2).replace(".", ",")}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Observations */}
            <div>
              <button
                onClick={() => setShowObservations(!showObservations)}
                className="text-info hover:text-info/80 text-sm font-medium underline transition-colors"
              >
                Observações
              </button>
              {showObservations && (
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Adicione observações..."
                  className="toolbar-input w-full mt-2 px-3 py-2 text-sm min-h-[60px] resize-y"
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm">
                Salvar
              </button>
              <button className="px-6 py-2.5 rounded-lg bg-success text-success-foreground font-semibold text-sm hover:bg-success/90 transition-colors shadow-sm">
                Comanda
              </button>
              <button className="px-6 py-2.5 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors shadow-sm">
                Checkout Express
              </button>
            </div>
          </div>

          {/* Right Panel — Client Info */}
          <div className="bg-muted/40 border-l border-border p-5 space-y-5 overflow-y-auto max-h-[80vh]">
            {/* Client Header */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-foreground">{appointment.client}</h3>
                <button className="text-info hover:text-info/80 transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Client Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-card rounded-lg p-2 border border-border">
                <div className="text-xs text-muted-foreground">Moedas</div>
                <div className="text-sm font-bold text-warning">0</div>
              </div>
              <div className="bg-card rounded-lg p-2 border border-border">
                <div className="text-xs text-muted-foreground">Packs</div>
                <div className="text-sm font-bold text-info">5</div>
              </div>
              <div className="bg-card rounded-lg p-2 border border-border">
                <div className="text-xs text-muted-foreground">Débitos</div>
                <div className="text-sm font-bold text-foreground">R$ 0</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-card rounded-lg p-2 border border-border">
                <div className="text-xs text-muted-foreground">Ficha</div>
                <button className="text-info">
                  <Eye className="h-3.5 w-3.5 mx-auto mt-0.5" />
                </button>
              </div>
              <div className="bg-card rounded-lg p-2 border border-border">
                <div className="text-xs text-muted-foreground">Créditos</div>
                <div className="text-sm font-bold text-foreground">R$ 0,00</div>
              </div>
            </div>

            {/* Última visita */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 text-center">Última visita</h4>
              <div className="bg-table-header rounded-t-lg px-3 py-1.5">
                <span className="text-xs font-medium text-table-header-foreground">#2866510 29/01/2025</span>
              </div>
              <div className="border border-border border-t-0 rounded-b-lg p-3 bg-card">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-semibold text-foreground">corte</div>
                    <div className="text-xs text-muted-foreground">Claudia</div>
                  </div>
                  <div className="text-sm font-bold text-foreground">R$ 50,00</div>
                </div>
                <div className="border-l-2 border-info ml-0 mt-1" />
              </div>
              <button className="text-info hover:text-info/80 text-xs font-medium mt-2 w-full text-center transition-colors">
                Mais...
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
