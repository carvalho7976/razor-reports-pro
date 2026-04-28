export default function ComparativoPrecos() {
  const rows = [
    ["1", "R$57", "R$72", "~R$85", "R$99"],
    ["2", "R$71", "R$89", "~R$130", "R$163"],
    ["3 a 6", "R$91", "R$114", "~R$210", "R$286"],
    ["7 a 12", "R$137", "R$172", "~R$310", "R$397"],
    ["13 a 20", "R$177", "R$221", "~R$420", "R$397+"],
  ];

  return (
    <section className="w-full bg-white px-6 py-20">
      <div className="max-w-6xl">
        <h2 className="mb-2 text-left text-4xl font-semibold tracking-[-0.04em] text-zinc-900">
          Compare antes de decidir
        </h2>

        <p className="mb-8 text-left text-base text-zinc-500">Veja quanto você paga conforme sua equipe cresce.</p>

        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-[0_14px_45px_rgba(0,0,0,0.06)]">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[140px_repeat(4,1fr)] border-b border-zinc-200">
              <div className="flex h-24 items-center justify-start bg-zinc-50 px-5 text-sm font-medium text-zinc-500">
                Agendas
              </div>

              <div className="flex h-24 flex-col items-center justify-center gap-2 bg-white px-5 text-center">
                <div className="text-base font-semibold text-zinc-900">Frizzar+</div>
                <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-500">20% OFF</span>
              </div>

              <div className="flex h-24 items-center justify-center bg-white px-5">
                <img
                  src="https://a.frizzar.com.br/wp-content/uploads/2025/04/LNSPB-e1655256051516.png"
                  alt="Frizzar"
                  className="max-h-7 w-auto object-contain"
                />
              </div>

              <div className="flex h-24 items-center justify-center bg-white px-5">
                <img
                  src="https://djnn6j6gf59xn.cloudfront.net/content/img/novo_portal/logo-topo-rebranding.png"
                  alt="Trinks"
                  className="max-h-8 w-auto object-contain"
                />
              </div>

              <div className="flex h-24 items-center justify-center bg-white px-5">
                <img
                  src="https://cdn.prod.website-files.com/6151e81f5d43e8748b3808c6/6151fb367006fe41eaa186e7_Logo%20Avec.svg"
                  alt="Avec"
                  className="max-h-7 w-auto object-contain"
                />
              </div>
            </div>

            {rows.map(([agendas, frizzarPlus, frizzar, trinks, avec]) => (
              <div
                key={agendas}
                className="grid grid-cols-[140px_repeat(4,1fr)] border-b border-zinc-100 last:border-b-0"
              >
                <div className="flex min-h-16 items-center justify-start bg-zinc-50 px-5 text-sm font-medium text-zinc-600">
                  {agendas}
                </div>

                <div className="flex min-h-16 items-center justify-center bg-white px-5 text-base font-semibold text-red-500">
                  {frizzarPlus}
                </div>

                <div className="flex min-h-16 items-center justify-center bg-red-50/50 px-5 text-sm font-medium text-zinc-400 line-through">
                  {frizzar}
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

        <p className="mt-4 text-left text-sm text-zinc-400">Valores aproximados para comparação comercial.</p>
      </div>
    </section>
  );
}
