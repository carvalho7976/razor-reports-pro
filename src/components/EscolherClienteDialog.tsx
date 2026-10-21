import { useState } from "react";
import { UserPlus, UserRound } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export type ClienteResumo = { nome: string; telefone?: string; ultimaVisita?: string };

// Clientes de exemplo (mesmos nomes da agenda e da lista de clientes)
const clientesExemplo: ClienteResumo[] = [
  { nome: "Ada Naama", telefone: "(67) 99162-9900", ultimaVisita: "12/10" },
  { nome: "Adriana Quiros", telefone: "(41) 99812-3344", ultimaVisita: "22/04" },
  { nome: "Alice Costa Melis", telefone: "(41) 98877-1020", ultimaVisita: "22/04" },
  { nome: "Andréia Pérez Magalhães", telefone: "(41) 99654-0001" },
  { nome: "Caio César", telefone: "(41) 99000-1234", ultimaVisita: "19/10" },
  { nome: "Carmen Leia", telefone: "(41) 99123-0099" },
  { nome: "Daniel Lucas Santos Araújo", telefone: "(41) 98765-1111", ultimaVisita: "22/04" },
  { nome: "Jean Carlos", telefone: "(41) 99777-2222" },
  { nome: "João Silva", telefone: "(41) 99123-4567", ultimaVisita: "19/10" },
  { nome: "Maria Santos", telefone: "(41) 98765-4321", ultimaVisita: "18/10" },
  { nome: "Sofia Santos Rocha", telefone: "(41) 99555-6789" },
];

const iniciais = (nome: string) =>
  nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

/**
 * Escolha da cliente ao abrir uma comanda: busca por nome ou telefone, cadastro
 * rápido com o nome digitado ou venda sem cadastro (cliente avulso).
 */
export function EscolherClienteDialog({
  open,
  onOpenChange,
  onEscolher,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onEscolher: (cliente: ClienteResumo) => void;
}) {
  const [busca, setBusca] = useState("");

  const escolher = (c: ClienteResumo) => {
    onEscolher(c);
    setBusca("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setBusca("");
      }}
    >
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <DialogHeader className="space-y-0.5 px-5 pb-3 pt-5 text-left">
          <DialogTitle className="text-base">Nova comanda</DialogTitle>
          <DialogDescription className="text-[13px]">Escolha a cliente para abrir a comanda.</DialogDescription>
        </DialogHeader>
        <Command className="rounded-none border-t border-border">
          <CommandInput value={busca} onValueChange={setBusca} placeholder="Nome ou telefone" className="text-sm" />
          <CommandList className="max-h-[320px]">
            <CommandEmpty className="py-4 text-center text-[13px] text-muted-foreground">
              Nenhuma cliente encontrada.
            </CommandEmpty>
            <CommandGroup>
              {clientesExemplo.map((c) => (
                <CommandItem
                  key={c.nome}
                  value={`${c.nome} ${c.telefone ?? ""}`}
                  onSelect={() => escolher(c)}
                  className="gap-3 py-2"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                    {iniciais(c.nome)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{c.nome}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {c.telefone}
                      {c.ultimaVisita && ` · última visita ${c.ultimaVisita}`}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup>
              {busca.trim() && (
                <CommandItem
                  value={`cadastrar ${busca}`}
                  onSelect={() => escolher({ nome: busca.trim() })}
                  className="gap-3 py-2 text-info"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-info/10">
                    <UserPlus className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium">Cadastrar “{busca.trim()}”</span>
                </CommandItem>
              )}
              <CommandItem
                value="cliente avulso sem cadastro"
                onSelect={() => escolher({ nome: "Cliente avulso" })}
                className="gap-3 py-2"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <UserRound className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium">Cliente avulso</span>
                  <span className="block text-xs text-muted-foreground">Venda sem cadastro</span>
                </span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
