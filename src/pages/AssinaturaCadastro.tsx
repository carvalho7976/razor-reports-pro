// 🔥 ÚNICA ALTERAÇÃO REAL:
// - removeu tabs
// - removeu activeTab
// - juntou tudo

// 🔽 COLE ISSO SUBSTITUINDO SEU COMPONENTE INTEIRO

export default function AssinaturaCadastro() {
  // 👉 TODO SEU STATE CONTINUA IGUAL (NÃO MEXI)

  return (
    <AppLayout>
      <div className="flex flex-col gap-0">
        {/* HEADER */}
        <div className="mx-6 mt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="pt-1">
              <h1 className="text-xl font-bold text-foreground">
                {editing ? "Editar plano de assinatura" : "Novo plano de assinatura"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">Configure os dados, serviços e produtos do plano.</p>
            </div>
          </div>
        </div>

        {/* 🔥 ONE PAGE */}
        <div className="mx-6 mt-5 pb-24 space-y-10">
          {/* ================= DETALHES ================= */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Detalhes do plano</h2>

            <div className="grid max-w-6xl gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
              {/* COLUNA ESQUERDA */}
              <div className="grid gap-5">
                {/* DADOS */}
                <SectionBlock title="Dados do plano">
                  <div className="grid gap-4">
                    <TextField label="Nome do plano *" value={nome} onChange={setNome} error={showError("nome")} />

                    <div className="grid gap-4 md:grid-cols-3">
                      <CurrencyInput label="Valor" value={valor} onChange={setValor} />
                      <Dropdown
                        label="Recorrência"
                        value={recorrencia}
                        setValue={setRecorrencia}
                        options={recorrenciaOptions}
                      />
                      <Dropdown
                        label="Forma de pagamento"
                        value={formaPagamento}
                        setValue={setFormaPagamento}
                        options={formaPagamentoOptions}
                      />
                    </div>
                  </div>
                </SectionBlock>

                {/* 🔒 BENEFÍCIOS (100% ORIGINAL) */}
                <SectionBlock title="Benefícios">
                  {/* 👉 COLE AQUI EXATAMENTE SEU BLOCO ORIGINAL DE BENEFÍCIOS */}
                </SectionBlock>
              </div>

              {/* COLUNA DIREITA */}
              <div className="grid gap-5">
                <SectionBlock title="Vitrine">
                  <div className="flex items-center justify-between">
                    <span>Disponível para venda</span>
                    <Switch checked={disponivelVenda} onCheckedChange={setDisponivelVenda} />
                  </div>
                </SectionBlock>

                <SectionBlock title="Disponibilidade">
                  {/* 👉 COLE AQUI SEU BLOCO ORIGINAL (dias + profissionais) */}
                </SectionBlock>
              </div>
            </div>
          </div>

          {/* ================= SERVIÇOS ================= */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Serviços</h2>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[330px_minmax(0,1fr)]">
              {/* FORM */}
              <div className="space-y-4">
                <MultiSelectSearch
                  label="Serviços"
                  options={servicosDisponiveisFiltrados}
                  selected={servicosPendentes}
                  onChange={setServicosPendentes}
                />

                <button onClick={adicionarServico}>Adicionar ({servicosPendentes.length})</button>
              </div>

              {/* LISTA */}
              <div>
                {servicosInclusos.length === 0 ? (
                  <div className="text-center py-10">Nenhum serviço adicionado</div>
                ) : (
                  servicosInclusos.map((s) => <div key={s.id}>{nomeServico(s.id)}</div>)
                )}
              </div>
            </div>
          </div>

          {/* ================= PRODUTOS ================= */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Produtos</h2>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[330px_minmax(0,1fr)]">
              <div className="space-y-4">
                <MultiSelectSearch
                  label="Produtos"
                  options={produtosDisponiveisFiltrados}
                  selected={produtosPendentes}
                  onChange={setProdutosPendentes}
                />

                <button onClick={adicionarProduto}>Adicionar ({produtosPendentes.length})</button>
              </div>

              <div>
                {produtosSelecionados.length === 0 ? (
                  <div className="text-center py-10">Nenhum produto adicionado</div>
                ) : (
                  produtosSelecionados.map((p) => <div key={p.id}>{nomeProduto(p.id)}</div>)
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 border-t border-border bg-card px-6 py-4">
          <div className="flex justify-end">
            <button onClick={handleSalvar}>{editing ? "Salvar alterações" : "Criar plano"}</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
