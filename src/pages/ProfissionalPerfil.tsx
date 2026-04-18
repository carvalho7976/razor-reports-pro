<Dialog
  open={servicosOpen}
  onOpenChange={(open) => {
    setServicosOpen(open);
    if (!open) {
      setServicoBusca("");
      setServicosPendentes([]);
    }
  }}
>
  <DialogContent className="w-[calc(100vw-24px)] max-w-5xl gap-0 overflow-hidden rounded-2xl p-0 [&>button]:hidden">
    <div className="border-b border-border px-4 py-4 sm:px-5">
      <h2 className="text-base font-semibold text-foreground">Serviços vinculados</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Adicione os serviços do profissional e ajuste preço, tempo e comissão.
      </p>
    </div>

    <div className="max-h-[75vh] overflow-y-auto p-4 sm:p-5">
      <div className="grid gap-4">
        {/* BLOCO ADICIONAR */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground">Adicionar serviços</h3>
            <p className="mt-1 text-xs text-muted-foreground">Pesquise e selecione os serviços que deseja vincular.</p>
          </div>

          <div className="grid gap-3">
            <div>
              <label className="mb-1 block text-[13px] font-semibold text-foreground">Buscar serviço</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={servicoBusca}
                  onChange={(e) => setServicoBusca(e.target.value)}
                  placeholder="Digite o nome do serviço..."
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-foreground"
                />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background">
              <div className="max-h-56 overflow-y-auto">
                {servicosDispFiltrados.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">Nenhum serviço encontrado</div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleAdicionarTodos}
                      className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left text-sm font-semibold text-foreground transition hover:bg-muted"
                    >
                      Selecionar todos
                    </button>

                    {servicosDispFiltrados.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleServicoPendente(s.id)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-muted"
                      >
                        <Checkbox
                          checked={servicosPendentes.includes(s.id)}
                          className="pointer-events-none h-4 w-4 rounded-md border border-zinc-400 bg-background shadow-sm data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                        />
                        <span className="truncate">{s.nome}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleAdicionarSelecionados}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition hover:bg-foreground/90 active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                Adicionar{servicosPendentes.length > 0 ? ` (${servicosPendentes.length})` : ""}
              </button>
            </div>
          </div>
        </div>

        {/* BLOCO LISTAGEM */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Serviços adicionados</h3>
              <p className="mt-1 text-xs text-muted-foreground">Edite os valores diretamente.</p>
            </div>

            {servicosAdicionados.length > 0 && (
              <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {servicosAdicionados.length} item(ns)
              </span>
            )}
          </div>

          {/* MOBILE */}
          <div className="grid gap-3 md:hidden">
            {servicosAdicionados.length === 0 ? (
              <div className="rounded-lg border border-border px-4 py-8 text-center text-sm text-muted-foreground">
                Nenhum registro encontrado
              </div>
            ) : (
              servicosAdicionados.map((s) => (
                <div key={s.id} className="rounded-lg border border-border p-3">
                  <div className="mb-3 flex items-start gap-3">
                    <Checkbox
                      checked={servicosSelecionados.includes(s.id)}
                      onCheckedChange={() => toggleServicoSelecionado(s.id)}
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground">{s.nome}</div>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="grid gap-1">
                      <span className="text-xs font-medium text-muted-foreground">Preço</span>
                      <input
                        type="text"
                        value={s.preco}
                        onChange={(e) => updateServico(s.id, "preco", e.target.value)}
                        className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                      />
                    </div>

                    <div className="grid gap-1">
                      <span className="text-xs font-medium text-muted-foreground">Tempo</span>
                      <input
                        type="text"
                        value={s.tempo}
                        onChange={(e) => updateServico(s.id, "tempo", e.target.value)}
                        className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                      />
                    </div>

                    <div className="grid gap-1">
                      <span className="text-xs font-medium text-muted-foreground">Comissão</span>
                      <input
                        type="text"
                        value={s.comissao}
                        onChange={(e) => updateServico(s.id, "comissao", e.target.value)}
                        placeholder="Ex: 50%"
                        className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DESKTOP */}
          <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[hsl(0_0%_20%)] text-white">
                  <th className="w-10 px-3 py-2 text-left">
                    <Checkbox
                      checked={
                        servicosAdicionados.length > 0 && servicosSelecionados.length === servicosAdicionados.length
                      }
                      onCheckedChange={toggleTodosServicos}
                      className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-[hsl(0_0%_20%)]"
                    />
                  </th>
                  <th className="px-3 py-2 text-left text-[13px] font-semibold">Nome</th>
                  <th className="px-3 py-2 text-left text-[13px] font-semibold">Preço</th>
                  <th className="px-3 py-2 text-left text-[13px] font-semibold">Tempo</th>
                  <th className="px-3 py-2 text-left text-[13px] font-semibold">Comissão</th>
                </tr>
              </thead>

              <tbody>
                {servicosAdicionados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                      Nenhum registro encontrado
                    </td>
                  </tr>
                ) : (
                  servicosAdicionados.map((s) => (
                    <tr key={s.id} className="border-t border-border transition-colors hover:bg-muted/50">
                      <td className="px-3 py-2">
                        <Checkbox
                          checked={servicosSelecionados.includes(s.id)}
                          onCheckedChange={() => toggleServicoSelecionado(s.id)}
                        />
                      </td>
                      <td className="px-3 py-2 text-foreground">{s.nome}</td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={s.preco}
                          onChange={(e) => updateServico(s.id, "preco", e.target.value)}
                          className="h-8 w-24 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={s.tempo}
                          onChange={(e) => updateServico(s.id, "tempo", e.target.value)}
                          className="h-8 w-24 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={s.comissao}
                          onChange={(e) => updateServico(s.id, "comissao", e.target.value)}
                          placeholder="Ex: 50%"
                          className="h-8 w-24 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {servicosSelecionados.length > 0 && (
            <div className="mt-4 flex items-center justify-center">
              <div className="inline-flex items-center gap-3 rounded-full border border-border bg-background px-4 py-2 shadow-sm">
                <span className="text-sm text-muted-foreground">{servicosSelecionados.length} selecionado(s)</span>
                <button
                  onClick={handleRemoverServicos}
                  className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remover
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="flex flex-col-reverse gap-2 border-t border-border px-4 py-4 sm:flex-row sm:justify-end sm:px-5">
      <button
        type="button"
        onClick={() => setServicosOpen(false)}
        className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-medium text-foreground transition hover:bg-muted"
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={() => setServicosOpen(false)}
        className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-foreground/90"
      >
        Salvar
      </button>
    </div>
  </DialogContent>
</Dialog>;
