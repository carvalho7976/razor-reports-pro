export default function ComparativoPrecos() {
  const priceRows = [
    ["1", "12x R$59", "R$1.116/ano", "12x R$152", "~R$185", "~R$199"],
    ["2", "12x R$69", "R$828/ano", "12x R$138", "~R$230", "~R$263"],
    ["3 a 6", "12x R$79", "R$1.008/ano", "12x R$163", "~R$270", "~R$386"],
    ["7 a 12", "12x R$110", "R$1.332/ano", "12x R$221", "~R$310", "~R$397"],
    ["13 a 20", "12x R$135", "R$1.620/ano", "12x R$270", "~R$420", "~R$497+"],
  ];

  const features = [
    ["Chatbot", "Incluso", "R$49", "Custo à parte", "Custo à parte"],
    ["Suporte", "Incluso", "Incluso", "Custo à parte", "Custo à parte"],
    ["Clube de fidelidade", "Incluso", "Incluso", "Custo à parte", "Custo à parte"],
    ["Seu próprio site", "Incluso", "Incluso", "Custo à parte", "Custo à parte"],
    ["Exclusividade de cliente", "Incluso", "Incluso", "Não tem", "Não tem"],
  ];

  return (
    <section className="w-full bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 text-4xl font-semibold tracking-[-0.04em] text-zinc-900">Compare antes de decidir</h2>

        <p className="mb-10 text-base text-zinc-500">Veja quanto você paga conforme sua equipe cresce.</p>

        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-[150px_repeat(4,1fr)] border-b border-zinc-200 bg-white">
            <div className="px-6 py-6 text-sm text-zinc-500">Agendas</div>

            <div className="flex flex-col items-center justify-center px-6 py-6 text-center">
              <div className="text-lg font-semibold text-zinc-900">Frizzar Especial</div>
              <span className="mt-1 rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-500">
                oferta ativa
              </span>
            </div>

            <div className="flex items-center justify-center px-6 py-6">
              <img
                src="https://a.frizzar.com.br/wp-content/uploads/2025/04/LNSPB-e1655256051516.png"
                className="max-h-8"
              />
            </div>

            <div className="flex items-center justify-center px-6 py-6">
              <img
                src="https://djnn6j6gf59xn.cloudfront.net/content/img/novo_portal/logo-topo-rebranding.png"
                className="max-h-9"
              />
            </div>

            <div className="flex items-center justify-center px-6 py-6">
              <img
                src="https://cdn.prod.website-files.com/6151e81f5d43e8748b3808c6/6151fb367006fe41eaa186e7_Logo%20Avec.svg"
                className="max-h-8"
              />
            </div>
          </div>

          {priceRows.map(([agendas, especial, economia, frizzar, trinks, avec]) => (
            <div key={agendas} className="grid grid-cols-[150px_repeat(4,1fr)] border-b border-zinc-100">
              <div className="flex items-center bg-zinc-50 px-6 py-6 text-sm text-zinc-600">{agendas}</div>

              <div className="flex flex-col items-center justify-center px-6 py-6">
                <div className="text-xl font-semibold text-red-500">{especial}</div>
                <div className="mt-1 text-sm font-medium text-emerald-600">economiza {economia}</div>
              </div>

              <div className="flex items-center justify-center px-6 py-6 text-base text-zinc-400 line-through">
                {frizzar}
              </div>

              <div className="flex items-center justify-center px-6 py-6 text-base text-zinc-700">{trinks}</div>

              <div className="flex items-center justify-center px-6 py-6 text-base text-zinc-700">{avec}</div>
            </div>
          ))}

          <div className="border-y border-zinc-200 bg-zinc-50 px-6 py-4 text-sm font-medium text-zinc-500">
            Funcionalidades incluídas
          </div>

          {features.map(([name, frizzarEspecial, frizzar, trinks, avec]) => (
            <div key={name} className="grid grid-cols-[150px_repeat(4,1fr)] border-b border-zinc-100 last:border-b-0">
              <div className="flex items-center bg-zinc-50 px-6 py-6 text-sm text-zinc-700">{name}</div>

              <div className="flex items-center justify-center px-6 py-6 text-sm font-semibold text-emerald-600">
                {frizzarEspecial}
              </div>

              <div className="flex items-center justify-center px-6 py-6 text-sm font-semibold text-emerald-600">
                {frizzar}
              </div>

              <div className="flex items-center justify-center px-6 py-6 text-sm font-medium text-red-500">
                {trinks}
              </div>

              <div className="flex items-center justify-center px-6 py-6 text-sm font-medium text-red-500">{avec}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
