import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { ChevronLeft, ChevronRight, Plus, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Professional {
  name: string;
  role: string;
  initials: string;
  color: string;
}

interface Appointment {
  professionalIndex: number;
  startTime: string;
  endTime: string;
  client: string;
  service: string;
  color: string;
}

const professionals: Professional[] = [
  { name: "Cesar", role: "Gerente", initials: "CE", color: "bg-info" },
  { name: "Claudia", role: "Profissional", initials: "CL", color: "bg-primary" },
  { name: "Marcia Silva", role: "Assistente", initials: "MS", color: "bg-warning" },
  { name: "Matheus", role: "Profissional", initials: "MA", color: "bg-success" },
  { name: "Vini", role: "Auxiliar", initials: "VI", color: "bg-accent" },
];

const appointments: Appointment[] = [
  { professionalIndex: 1, startTime: "08:30", endTime: "09:30", client: "Caio", service: "Esmaltação em gel", color: "bg-[hsl(320,45%,55%)]" },
  { professionalIndex: 0, startTime: "10:00", endTime: "10:30", client: "João Silva", service: "Corte Masculino", color: "bg-info" },
  { professionalIndex: 3, startTime: "09:00", endTime: "10:00", client: "Pedro Santos", service: "Barba", color: "bg-success" },
  { professionalIndex: 2, startTime: "11:00", endTime: "12:00", client: "Ana Costa", service: "Hidratação", color: "bg-warning" },
  { professionalIndex: 4, startTime: "14:00", endTime: "15:00", client: "Lucas", service: "Corte + Barba", color: "bg-primary" },
  { professionalIndex: 1, startTime: "10:30", endTime: "11:30", client: "Maria", service: "Manicure", color: "bg-[hsl(280,45%,55%)]" },
];

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00",
];

function getSlotIndex(time: string) {
  return timeSlots.indexOf(time);
}

function getWeekdayName(date: Date) {
  return date.toLocaleDateString("pt-BR", { weekday: "long" });
}

function formatDate(date: Date) {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function Agenda() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 9));
  const [waitingQueue] = useState(0);
  const [viewDays, setViewDays] = useState(1);

  const weekday = getWeekdayName(currentDate);
  const formattedDate = formatDate(currentDate);

  const prevDay = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1));
  const nextDay = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Fila de Espera */}
        <div className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Fila de Espera <span className="text-muted-foreground font-normal">( {waitingQueue} na fila )</span>
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <button className="p-1 rounded hover:bg-muted text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex-1 h-px bg-border" />
              <button className="p-1 rounded hover:bg-muted text-muted-foreground">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <button className="btn-action bg-primary text-primary-foreground rounded-lg font-semibold text-sm shadow-sm">
            <Plus className="h-4 w-4" />
            Adicionar
          </button>
        </div>

        {/* Date Header + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={prevDay} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-foreground capitalize">
              {weekday}, {formattedDate}
            </h1>
            <button onClick={nextDay} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Profissional</label>
              <select className="toolbar-input px-3 py-1.5 text-sm min-w-[140px]">
                <option>Todos</option>
                {professionals.map((p) => (
                  <option key={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Dia:</label>
              <input
                type="date"
                value={`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`}
                onChange={(e) => {
                  const d = new Date(e.target.value + "T12:00:00");
                  if (!isNaN(d.getTime())) setCurrentDate(d);
                }}
                className="toolbar-input px-3 py-1.5 text-sm"
              />
            </div>
          </div>
        </div>

        {/* View Days */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">visualizar dias:</span>
          <select
            value={viewDays}
            onChange={(e) => setViewDays(Number(e.target.value))}
            className="toolbar-input px-2 py-1 text-sm w-16"
          >
            <option value={1}>1</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={7}>7</option>
          </select>
        </div>

        {/* Schedule Grid */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              {/* Professional Headers */}
              <thead>
                <tr className="bg-table-header">
                  <th className="w-16 p-3 border-r border-border/30 text-table-header-foreground">
                    <Clock className="h-4 w-4 mx-auto opacity-60" />
                  </th>
                  {professionals.map((prof) => (
                    <th key={prof.name} className="p-3 border-r border-border/30 last:border-r-0">
                      <div className="flex items-center gap-2.5 justify-start">
                        <div className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0",
                          prof.color
                        )}>
                          {prof.initials}
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-semibold text-table-header-foreground">{prof.name}</div>
                          <div className="text-xs text-table-header-foreground/60 font-normal">{prof.role}</div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Time Slots */}
              <tbody>
                {timeSlots.map((time, rowIdx) => (
                  <tr
                    key={time}
                    className={cn(
                      "border-t border-table-border hover:bg-table-row-hover transition-colors",
                      rowIdx % 2 === 0 && "bg-card",
                      rowIdx % 2 !== 0 && "bg-muted/30"
                    )}
                  >
                    <td className="px-3 py-3 text-xs font-medium text-muted-foreground border-r border-table-border text-center whitespace-nowrap">
                      {time}
                    </td>
                    {professionals.map((_, profIdx) => {
                      // Check if an appointment starts here
                      const appt = appointments.find(
                        (a) => a.professionalIndex === profIdx && a.startTime === time
                      );
                      // Check if this cell is covered by an ongoing appointment
                      const isCovered = appointments.some((a) => {
                        if (a.professionalIndex !== profIdx) return false;
                        const startIdx = getSlotIndex(a.startTime);
                        const endIdx = getSlotIndex(a.endTime);
                        return rowIdx > startIdx && rowIdx < endIdx;
                      });

                      if (isCovered) return null;

                      if (appt) {
                        const startIdx = getSlotIndex(appt.startTime);
                        const endIdx = getSlotIndex(appt.endTime);
                        const span = endIdx - startIdx;

                        return (
                          <td
                            key={profIdx}
                            rowSpan={span}
                            className="border-r border-table-border last:border-r-0 p-1"
                          >
                            <div className={cn(
                              "rounded-lg p-2.5 h-full text-primary-foreground cursor-pointer",
                              "hover:brightness-110 transition-all shadow-sm",
                              appt.color
                            )}>
                              <div className="text-[11px] font-medium opacity-90">
                                {appt.startTime} - {appt.endTime}
                              </div>
                              <div className="text-sm font-semibold mt-0.5">
                                {appt.client} - {appt.service}
                              </div>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={profIdx}
                          className="border-r border-table-border last:border-r-0 p-1 cursor-pointer hover:bg-primary/5 transition-colors"
                        />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
