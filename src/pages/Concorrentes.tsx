export default function ComparativoPrecos() {
  const rows = [
    ["1", "12x R$59", "12x R$152", "R$1.116/ano", "~R$85", "R$99"],
    ["2", "12x R$69", "12x R$138", "R$828/ano", "~R$130", "R$163"],
    ["3 a 6", "12x R$79", "12x R$163", "R$1.008/ano", "~R$210", "R$286"],
    ["7 a 12", "12x R$110", "12x R$221", "R$1.332/ano", "~R$310", "R$397"],
    ["13 a 20", "12x R$135", "12x R$270", "R$1.620/ano", "~R$420", "R$397+"],
  ];

  const features = [
    ["Chatbot", "Incluso", "Custo à parte", "Custo à parte"],
    ["Suporte", "Incluso", "Custo à parte", "Custo à parte"],
    ["Clube de fidelidade", "Incluso", "Custo à parte", "Custo à parte"],
    ["Seu próprio site", "Incluso", "Custo à parte", "Custo à parte"],
    ["Exclusividade de cliente", "Incluso", "Não tem", "Não tem"],
  ];

  return (
    <section className="w-full bg-white px-6 py-20">
      <div className="max-w-7xl">
        <h2 className="mb-2 text-left text-4xl font-semibold tracking-[-0.04em] text-zinc-900">
          Compare antes de decidir
        </h2>

        <p className="mb-8 text-left text-base text-zinc-500">Veja quanto você paga conforme sua equipe cresce.</p>

        {/* TABELA DE PREÇO */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-[0_14px_45px_rgba(0,0,0,0.06)]">
          <div className="min-w-[1100px]">
            <div className="grid grid-cols-[130px_repeat(5,1fr)] border-b border-zinc-200">
              <div className="flex h-24 items-center bg-zinc-50 px-5 text-sm text-zinc-500">Agendas</div>

              <div className="flex h-24 flex-col items-center justify-center gap-2">
                <div className="font-semibold">Frizzar Especial</div>
                <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] text-red-500">oferta ativa</span>
              </div>

              <div className="flex h-24 items-center justify-center">
                <img
                  src="https://a.frizzar.com.br/wp-content/uploads/2025/04/LNSPB-e1655256051516.png"
                  className="max-h-7"
                />
              </div>

              <div className="flex h-24 items-center justify-center text-sm text-zinc-400">Economia / ano</div>

              <div className="flex h-24 items-center justify-center">
                <img
                  src="https://djnn6j6gf59xn.cloudfront.net/content/img/novo_portal/logo-topo-rebranding.png"
                  className="max-h-8"
                />
              </div>

              <div className="flex h-24 items-center justify-center">
                <img
                  src="https://cdn.prod.website-files.com/6151e81f5d43e8748b3808c6/6151fb367006fe41eaa186e7_Logo%20Avec.svg"
                  className="max-h-7"
                />
              </div>
            </div>

            {rows.map(([agendas, especial, frizzar, economia, trinks, avec]) => (
              <div key={agendas} className="grid grid-cols-[130px_repeat(5,1fr)] border-b border-zinc-100">
                <div className="flex items-center bg-zinc-50 px-5 text-sm text-zinc-600">{agendas}</div>
                <div className="flex items-center justify-center text-red-500 font-semibold">{especial}</div>
                <div className="flex items-center justify-center text-zinc-400 line-through">{frizzar}</div>
                <div className="flex items-center justify-center text-emerald-600 font-semibold">{economia}</div>
                <div className="flex items-center justify-center text-zinc-700">{trinks}</div>
                <div className="flex items-center justify-center text-zinc-700">{avec}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DIVISÃO */}
        <div className="my-16 h-px w-full bg-zinc-200" />

        {/* TABELA DE FUNCIONALIDADES */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_14px_45px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-[1.5fr_repeat(3,1fr)] border-b border-zinc-200">
            <div className="px-6 py-4 text-sm text-zinc-500">Funcionalidades</div>
            <div className="px-6 py-4 text-center font-semibold">Frizzar</div>
            <div className="px-6 py-4 text-center text-zinc-500">Trinks</div>
            <div className="px-6 py-4 text-center text-zinc-500">Avec</div>
          </div>

          {features.map(([name, frizzar, trinks, avec]) => (
            <div key={name} className="grid grid-cols-[1.5fr_repeat(3,1fr)] border-b border-zinc-100">
              <div className="px-6 py-4 text-sm text-zinc-600">{name}</div>

              <div className="px-6 py-4 text-center text-emerald-600 font-semibold">{frizzar}</div>

              <div className="px-6 py-4 text-center text-zinc-500">
                {trinks === "Não tem" ? <span className="text-red-500 font-semibold">Não tem</span> : trinks}
              </div>

              <div className="px-6 py-4 text-center text-zinc-500">
                {avec === "Não tem" ? <span className="text-red-500 font-semibold">Não tem</span> : avec}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
