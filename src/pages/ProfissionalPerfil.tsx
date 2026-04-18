{
  activeTab === "basicos" && (
    <div className="grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      {/* Coluna principal */}
      <div className="grid gap-5">
        <SectionBlock title="Identificação" description="Informações principais do profissional.">
          <div className="max-w-xl">
            <TextField label="Nome *" value={form.nome} onChange={(v) => update("nome", v)} />
          </div>
        </SectionBlock>

        <SectionBlock title="Contato" description="Dados de comunicação utilizados no sistema.">
          <div className="max-w-xl grid grid-cols-2 gap-4">
            <TextField label="Email *" value={form.email} onChange={(v) => update("email", v)} />
            <TextField
              label="Celular"
              value={form.celular}
              onChange={(v) => update("celular", v)}
              placeholder="(00) 00000-0000"
            />
          </div>
        </SectionBlock>

        <SectionBlock title="Acesso" description="Defina o perfil de acesso do profissional.">
          <div className="max-w-xl">
            <Dropdown
              label="Nível de acesso"
              value={form.nivelAcesso}
              setValue={(v) => update("nivelAcesso", v)}
              options={nivelAcessoOptions}
            />
          </div>
        </SectionBlock>
      </div>

      {/* Coluna lateral */}
      <div className="grid gap-5">
        <SectionBlock title="Permissões" description="Controle o comportamento do profissional dentro do sistema.">
          <div className="grid gap-3">
            {[
              {
                field: "permitirAgendamentoOnline" as const,
                label: "Permitir agendamento online",
              },
              {
                field: "notificarEmail" as const,
                label: "Notificar via email novo agendamento",
              },
              {
                field: "ocultarDados" as const,
                label: "Ocultar dados cadastrais do cliente",
              },
              {
                field: "naoAparecerAgenda" as const,
                label: "Não aparecer na agenda interna",
              },
            ].map((item) => (
              <label key={item.field} className="flex cursor-pointer select-none items-center gap-3">
                <Checkbox
                  checked={form[item.field] as boolean}
                  onCheckedChange={(v) => update(item.field, !!v)}
                  className="h-4 w-4 rounded-md border border-zinc-400 bg-background shadow-sm hover:bg-muted data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white transition-all duration-300"
                />
                <span className="text-sm text-foreground">{item.label}</span>
              </label>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="Configuração rápida" description="Resumo operacional do cadastro atual.">
          <div className="grid gap-3">
            <div className="rounded-lg bg-muted px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Status do cadastro</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {isNew ? "Novo profissional" : "Cadastro existente"}
              </p>
            </div>

            <div className="rounded-lg bg-muted px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Agendamento online</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {form.permitirAgendamentoOnline ? "Permitido" : "Bloqueado"}
              </p>
            </div>
          </div>
        </SectionBlock>

        <SectionBlock title="Ações" description="Configurações complementares do profissional.">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setServicosOpen(true)}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-foreground/90 active:scale-[0.98]"
            >
              Configurar serviços
            </button>
            <button
              onClick={() => setExpedienteOpen(true)}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-foreground/90 active:scale-[0.98]"
            >
              Configurar expediente
            </button>
          </div>
        </SectionBlock>
      </div>
    </div>
  );
}
