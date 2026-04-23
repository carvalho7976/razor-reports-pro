export default function MockupPDVFluxo() {
  const comandas = [
    { nome: "Teste da barbearia", hora: "18:45", valor: "R$ 50,00", ativo: true },
    { nome: "Frizzar Demonstração", hora: "18:30", valor: "R$ 120,00" },
    { nome: "Rogério Carvalho", hora: "18:15", valor: "R$ 80,00" },
    { nome: "César", hora: "17:50", valor: "R$ 60,00" },
  ];

  const sugestoes = [
    { nome: "Barba", motivo: "Costuma fazer junto", valor: "R$ 25,00" },
    { nome: "Hidratação", motivo: "Última vez há 30 dias", valor: "R$ 40,00" },
    { nome: "Máscara Facial", motivo: "Boa oferta para hoje", valor: "R$ 20,00" },
  ];

  const acoesCliente = [
    { titulo: "Usar pack", desc: "2 disponíveis" },
    { titulo: "Usar crédito", desc: "R$ 80,00 disponíveis" },
    { titulo: "Agendar retorno", desc: "Deixar próxima visita marcada" },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <div className="h-14 bg-slate-800 text-white flex items-center justify-between px-6 shadow-sm">
        <div className="text-3xl tracking-wide font-serif">
          FRIZZAR<span className="text-red-500">.</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="px-3 py-1.5 rounded-lg bg-white/10">Comandas</div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-600">Gaveta</div>
          <div className="w-8 h-8 rounded-full bg-white/20" />
        </div>
      </div>

      <div className="grid grid-cols-[280px_minmax(0,1fr)_320px] gap-5 p-5">
        <aside className="rounded-2xl bg-white border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-zinc-100">
            <button className="text-emerald-600 font-medium text-sm">+ Nova comanda</button>
            <h2 className="mt-4 text-lg font-semibold">Comandas abertas</h2>
            <input
              className="mt-4 w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none"
              placeholder="Buscar cliente"
            />
          </div>
          <div className="p-3 space-y-2">
            {comandas.map((c) => (
              <div
                key={c.nome}
                className={`rounded-2xl border p-3 ${c.ativo ? "border-blue-500 bg-blue-50" : "border-zinc-200 bg-white"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium leading-tight">{c.nome}</div>
                    <div className="text-sm text-zinc-500 mt-1">{c.hora}</div>
                  </div>
                  <div className="text-sm font-semibold whitespace-nowrap">{c.valor}</div>
                </div>
                {c.ativo && (
                  <div className="mt-3 inline-flex rounded-full bg-blue-600 text-white text-xs px-3 py-1 font-medium">
                    Ativa
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        <main className="space-y-5">
          <section className="rounded-2xl bg-white border border-zinc-200 shadow-sm p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-zinc-500">Cliente em fechamento</div>
                <h1 className="text-4xl font-bold tracking-tight mt-1">Teste da barbearia</h1>
              </div>
              <div className="rounded-2xl bg-zinc-100 px-4 py-2 text-sm text-zinc-600">Fluxo PDV</div>
            </div>

            <div className="mt-8 grid gap-6">
              <div className="rounded-2xl border border-zinc-200 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Itens da comanda</div>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-4">
                        <div>
                          <div className="text-lg font-semibold">Corte Masculino</div>
                          <div className="text-sm text-zinc-500 mt-1">Profissional: Claudia</div>
                        </div>
                        <div className="text-2xl font-bold">R$ 50,00</div>
                      </div>
                    </div>
                  </div>
                  <button className="rounded-xl border border-zinc-200 px-4 py-2 text-sm">Editar</button>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/60 p-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-blue-700">Adicionar rápido</div>
                <div className="mt-4 flex gap-3">
                  <input
                    className="flex-1 rounded-xl border border-blue-200 bg-white px-4 py-3"
                    placeholder="Buscar serviço para adicionar..."
                  />
                  <button className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white">Adicionar</button>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                      Sugestões para vender mais
                    </div>
                    <div className="text-sm text-zinc-600 mt-1">Baseado no padrão de consumo desse cliente</div>
                  </div>
                  <div className="text-sm font-medium text-amber-700">Etapa de upsell</div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {sugestoes.map((s) => (
                    <div key={s.nome} className="rounded-xl border border-amber-200 bg-white p-4">
                      <div className="font-semibold">{s.nome}</div>
                      <div className="text-sm text-zinc-500 mt-1 min-h-[40px]">{s.motivo}</div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="font-bold">{s.valor}</div>
                        <button className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white">
                          + Adicionar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <div className="grid grid-cols-[1fr_320px] gap-6 items-start">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Pagamento</div>
                    <div className="mt-4 grid grid-cols-4 gap-3">
                      {["Dinheiro", "Cartão", "Pix", "Crédito"].map((m, i) => (
                        <button
                          key={m}
                          className={`rounded-xl border px-4 py-4 text-left font-medium ${i === 0 ? "border-emerald-500 bg-white ring-2 ring-emerald-200" : "border-zinc-200 bg-white"}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                    <input
                      className="mt-4 w-full rounded-xl border border-zinc-200 bg-white px-4 py-4 text-xl font-semibold"
                      value="R$ 50,00"
                      readOnly
                    />
                  </div>

                  <div className="rounded-2xl bg-white border border-emerald-200 p-5">
                    <div className="flex items-center justify-between text-sm text-zinc-500">
                      <span>Total</span>
                      <span className="text-3xl font-bold text-zinc-900">R$ 50,00</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-zinc-500">
                      <span>Falta receber</span>
                      <span className="text-xl font-bold text-red-500">R$ 50,00</span>
                    </div>
                    <button className="mt-5 w-full rounded-2xl bg-emerald-600 py-4 text-lg font-bold text-white shadow-sm">
                      FINALIZAR COMANDA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <aside className="space-y-5">
          <section className="rounded-2xl bg-white border border-zinc-200 shadow-sm p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Cliente</div>
            <div className="mt-2 text-3xl font-bold leading-tight">Teste da barbearia</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-zinc-50 p-4">
                <div className="text-sm text-zinc-500">Packs</div>
                <div className="mt-1 text-2xl font-bold">2</div>
              </div>
              <div className="rounded-xl bg-zinc-50 p-4">
                <div className="text-sm text-zinc-500">Créditos</div>
                <div className="mt-1 text-2xl font-bold">R$ 80</div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white border border-zinc-200 shadow-sm p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Ações contextuais</div>
            <div className="mt-4 space-y-3">
              {acoesCliente.map((a) => (
                <button
                  key={a.titulo}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-left hover:bg-zinc-100"
                >
                  <div className="font-semibold">{a.titulo}</div>
                  <div className="text-sm text-zinc-500 mt-1">{a.desc}</div>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
