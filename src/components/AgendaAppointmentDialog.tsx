import { useState, useEffect } from "react";
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
  const [items, setItems] = useState<ComandaItem[]>([]);
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState("");
  const [newPaymentValue, setNewPaymentValue] = useState("");
  const [observations, setObservations] = useState("");
  const [showObservations, setShowObservations] = useState(false);

  // Add item form state
  const [addProfessional, setAddProfessional] = useState("");
  const [addService, setAddService] = useState("");
  const [addProduct, setAddProduct] = useState("");

  // Reset state when appointment changes
  useEffect(() => {
    if (appointment) {
      setItems([{ service: appointment.service, professional: appointment.professionalName, price: 70 }]);
      setAddProfessional(appointment.professionalName);
      setStatus("agendado");
      setPayments([]);
      setObservations("");
      setShowObservations(false);
    }
  }, [appointment]);

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

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleRemovePayment = (idx: number) => {
    setPayments(payments.filter((_, i) => i !== idx));
  };

  const currentDate = "09/03/2026";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
          {/* Main Content */}
          <div className="p-5 space-y-5 overflow-y-auto max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between">
              <DialogHeader className="space-y-0">
                <DialogTitle className="text-lg font-bold text-foreground">
                  Agendamento
                </DialogTitle>
                <p className="text-xs text-muted-foreground">Data: {currentDate}</p>
              </DialogHeader>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors" title="Remover">
                  <Trash2 className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors" title="Duplicar">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Status + Times */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
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
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Início</label>
                <input
                  type="text"
                  defaultValue={`${currentDate} ${appointment.startTime}`}
                  className="toolbar-input w-full px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Fim</label>
                <input
                  type="text"
                  defaultValue={`${currentDate} ${appointment.endTime}`}
                  className="toolbar-input w-full px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-border" />

            {/* Add Item */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Adicionar Item</h3>
              <div className="grid grid-cols-4 gap-2 items-end">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Profissional</label>
                  <select
                    value={addProfessional}
                    onChange={(e) => setAddProfessional(e.target.value)}
                    className="toolbar-input w-full px-2 py-1.5 text-sm"
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
                    className="toolbar-input w-full px-2 py-1.5 text-sm"
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
                    className="toolbar-input w-full px-2 py-1.5 text-sm"
                  >
                    <option value="">Selecione</option>
                    {productOptions.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAddItem}
                  className="px-3 py-1.5 rounded-lg bg-info text-info-foreground text-sm font-medium flex items-center justify-center gap-1 hover:bg-info/90 transition-colors"
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
              <h3 className="text-sm font-bold text-foreground mb-2">Resumo da Comanda</h3>
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Nenhum item adicionado</p>
              ) : (
                <div className="bg-muted/30 rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-table-header text-table-header-foreground text-xs">
                        <th className="text-left px-3 py-2 font-medium">Serviço</th>
                        <th className="text-left px-3 py-2 font-medium">Profissional</th>
                        <th className="text-right px-3 py-2 font-medium">Valor</th>
                        <th className="w-8 px-2 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={idx} className="border-t border-border">
                          <td className="px-3 py-2 text-foreground font-medium">{item.service}</td>
                          <td className="px-3 py-2 text-muted-foreground">{item.professional}</td>
                          <td className="px-3 py-2 text-right text-foreground font-semibold">
                            R$ {item.price.toFixed(2).replace(".", ",")}
                          </td>
                          <td className="px-2 py-2">
                            <button
                              onClick={() => handleRemoveItem(idx)}
                              className="text-destructive/60 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-border" />

            {/* Pagamento */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Pagamento</h3>
              <div className="flex items-center gap-2 mb-3">
                <select
                  value={newPaymentMethod}
                  onChange={(e) => setNewPaymentMethod(e.target.value)}
                  className="toolbar-input px-2 py-1.5 text-sm flex-1"
                >
                  <option value="">Forma de pagamento</option>
                  {paymentMethods.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Valor"
                  value={newPaymentValue}
                  onChange={(e) => setNewPaymentValue(e.target.value)}
                  className="toolbar-input px-2 py-1.5 text-sm w-28"
                />
                <button
                  onClick={handleAddPayment}
                  className="px-3 py-1.5 rounded-lg bg-info text-info-foreground text-sm font-medium flex items-center gap-1 hover:bg-info/90 transition-colors shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar
                </button>
              </div>

              {payments.length > 0 && (
                <div className="space-y-1 mb-3">
                  {payments.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm py-1 px-2 rounded bg-muted/40">
                      <span className="text-muted-foreground">{p.method}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-medium">R$ {p.value.toFixed(2).replace(".", ",")}</span>
                        <button
                          onClick={() => handleRemovePayment(idx)}
                          className="text-destructive/60 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Totals */}
              <div className="flex justify-end">
                <div className="text-right space-y-0.5">
                  <div className="text-sm text-muted-foreground">
                    Total: <span className="text-xl font-bold text-foreground ml-1">R$ {total.toFixed(2).replace(".", ",")}</span>
                  </div>
                  {totalPaid > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Pago: R$ {totalPaid.toFixed(2).replace(".", ",")}
                    </div>
                  )}
                  {remaining > 0 && totalPaid > 0 && (
                    <div className="text-xs text-warning font-medium">
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
                className="text-info hover:text-info/80 text-xs font-medium transition-colors"
              >
                {showObservations ? "▾" : "▸"} Observações
              </button>
              {showObservations && (
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Adicione observações..."
                  className="toolbar-input w-full mt-2 px-3 py-2 text-sm min-h-[50px] resize-y"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
                Salvar
              </button>
              <button className="px-5 py-2 rounded-lg bg-success text-success-foreground font-semibold text-sm hover:bg-success/90 transition-colors">
                Comanda
              </button>
              <button className="px-5 py-2 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors">
                Checkout Express
              </button>
            </div>
          </div>

          {/* Right Panel — Client Info */}
          <div className="bg-muted/40 border-l border-border p-4 space-y-4 overflow-y-auto max-h-[85vh]">
            {/* Client Header */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-base font-bold text-foreground">{appointment.client}</h3>
                <button className="text-info hover:text-info/80 transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Client Stats */}
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-card rounded-lg p-2 border border-border">
                <div className="text-[10px] text-muted-foreground">Moedas</div>
                <div className="text-sm font-bold text-warning">0</div>
              </div>
              <div className="bg-card rounded-lg p-2 border border-border">
                <div className="text-[10px] text-muted-foreground">Packs</div>
                <div className="text-sm font-bold text-info">5</div>
              </div>
              <div className="bg-card rounded-lg p-2 border border-border">
                <div className="text-[10px] text-muted-foreground">Débitos</div>
                <div className="text-sm font-bold text-foreground">R$ 0</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-center">
              <div className="bg-card rounded-lg p-2 border border-border">
                <div className="text-[10px] text-muted-foreground">Ficha</div>
                <button className="text-info">
                  <Eye className="h-3.5 w-3.5 mx-auto mt-0.5" />
                </button>
              </div>
              <div className="bg-card rounded-lg p-2 border border-border">
                <div className="text-[10px] text-muted-foreground">Créditos</div>
                <div className="text-sm font-bold text-foreground">R$ 0,00</div>
              </div>
            </div>

            {/* Última visita */}
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2 text-center">Última visita</h4>
              <div className="bg-table-header rounded-t-lg px-3 py-1.5">
                <span className="text-[10px] font-medium text-table-header-foreground">#2866510 29/01/2025</span>
              </div>
              <div className="border border-border border-t-0 rounded-b-lg p-2.5 bg-card">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-semibold text-foreground">corte</div>
                    <div className="text-xs text-muted-foreground">Claudia</div>
                  </div>
                  <div className="text-sm font-bold text-foreground">R$ 50,00</div>
                </div>
              </div>
              <button className="text-info hover:text-info/80 text-xs font-medium mt-1.5 w-full text-center transition-colors">
                Mais...
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
