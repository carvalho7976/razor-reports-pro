## Tarefas identificadas:

### 1. RelatorioClientes - Card "Frequência Média"
Adicionar card de frequência média que muda conforme aba (total/assinantes/avulsos).

### 2. RelatorioProfissionais - Ajustar Resumido/Detalhado
Mover "Clientes atendidos", "Serviços atendidos" e "Produtos vendidos" para a visão Detalhada.

### 3. Dark Mode + Botão de alternância
- CSS dark já existe no index.css ✅
- Criar botão toggle no header (sol/lua)
- Persistir preferência no localStorage

### 4. Modal YouTube ao clicar em "Aula"
Criar componente modal que abre vídeo do YouTube embutido.

### 5. Tooltip no ⓘ + ícones em todas as pastilhas
Verificar que todas as `selectionActions` têm ícone e tooltip funcional.

### 6. Botão "Aula" em todas as telas
Adicionar `titleIcon` com botão Aula em todas as páginas (~25 páginas).

### 7. Modais de "Novo" e ações (modelo ListaFormasPagamento)
Criar modais para todas as telas de lista (clientes, serviços, produtos, pacotes, etc.). ⚠️ Muito extenso.

### 8. Bug: Seleção persiste ao alternar abas
Limpar `selectedRows` no `onTabChange` dentro do DataTable.

### 9. Cards de resumo respondem aos filtros
Os cards devem recalcular baseados nos dados filtrados, não nos dados totais.

---

**Sugestão**: Implementar itens 1-5, 8, 9 agora (são mais focados). Itens 6-7 envolvem ~25 páginas cada e podem ser feitos em etapas posteriores. Posso começar?
