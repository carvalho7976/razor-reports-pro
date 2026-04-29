export default function ComparativoPrecos() {
  const rows = [
    ["1", "12x R$59", "12x R$152", "R$1.116/ano", "~R$85", "R$99"],
    ["2", "12x R$69", "12x R$138", "R$828/ano", "~R$130", "R$163"],
    ["3 a 6", "12x R$79", "12x R$163", "R$1.008/ano", "~R$210", "R$286"],
    ["7 a 12", "12x R$110", "12x R$221", "R$1.332/ano", "~R$310", "R$397"],
    ["13 a 20", "12x R$135", "12x R$270", "R$1.620/ano", "~R$420", "R$397+"],
  ];

  return (
    <section className="w-full bg-white px-6 py-20">
      <div className="max-w-7xl">
        <h2 className="mb-2 text-left text-4xl font-semibold tracking-[-0.04em] text-zinc-900">
          Compare antes de decidir
        </h2>

        <p className="mb-8 text-left text-base text-zinc-500">Veja quanto você paga conforme sua equipe cresce.</p>

        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-[0_14px_45px_rgba(0,0,0,0.06)]">
          <div className="min-w-[1100px]">
            <div className="grid grid-cols-[130px_repeat(5,1fr)] border-b border-zinc-200">
              <div className="flex h-24 items-center justify-start bg-zinc-50 px-5 text-sm font-medium text-zinc-500">
                Agendas
              </div>

              <div className="flex h-24 flex-col items-center justify-center gap-2 bg-white px-5 text-center">
                <div className="text-base font-semibold text-zinc-900">Frizzar Especial</div>
                <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-500">
                  oferta ativa
                </span>
              </div>

              <div className="flex h-24 items-center justify-center bg-white px-5">
                <img
                  src="https://a.frizzar.com.br/wp-content/uploads/2025/04/LNSPB-e1655256051516.png"
                  alt="Frizzar"
                  className="max-h-7 object-contain"
                />
              </div>

              <div className="flex h-24 flex-col items-center justify-center bg-white px-5 text-center text-sm font-medium text-zinc-500">
                Economia
                <span className="mt-1 text-[11px] text-zinc-400">no ano</span>
              </div>

              <div className="flex h-24 items-center justify-center bg-white px-5">
                <img
                  src="https://djnn6j6gf59xn.cloudfront.net/content/img/novo_portal/logo-topo-rebranding.png"
                  alt="Trinks"
                  className="max-h-8 object-contain"
                />
              </div>

              <div className="flex h-24 items-center justify-center bg-white px-5">
                <img
                  src="https://cdn.prod.website-files.com/6151e81f5d43e8748b3808c6/6151fb367006fe41eaa186e7_Logo%20Avec.svg"
                  alt="Avec"
                  className="max-h-7 object-contain"
                />
              </div>
            </div>

            {rows.map(([agendas, especial, frizzar, economia, trinks, avec]) => (
              <div
                key={agendas}
                className="grid grid-cols-[130px_repeat(5,1fr)] border-b border-zinc-100 last:border-b-0"
              >
                <div className="flex min-h-16 items-center justify-start bg-zinc-50 px-5 text-sm font-medium text-zinc-600">
                  {agendas}
                </div>

                <div className="flex min-h-16 items-center justify-center bg-white px-5 text-base font-semibold text-red-500">
                  {especial}
                </div>

                <div className="flex min-h-16 items-center justify-center bg-red-50/40 px-5 text-sm font-medium text-zinc-400 line-through">
                  {frizzar}
                </div>

                <div className="flex min-h-16 items-center justify-center bg-emerald-50 px-5 text-sm font-semibold text-emerald-700">
                  {economia}
                </div>

                <div className="flex min-h-16 items-center justify-center bg-white px-5 text-base font-medium text-zinc-700">
                  {trinks}
                </div>

                <div className="flex min-h-16 items-center justify-center bg-white px-5 text-base font-medium text-zinc-700">
                  {avec}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-left text-sm text-zinc-400">
          Economia calculada comparando o valor anual da Frizzar com a condição Frizzar Especial.
        </p>
      </div>
    </section>
  );
}
