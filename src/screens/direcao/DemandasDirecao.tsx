import type { Tarefa } from '../../types/Tarefas'

type DemandasDirecaoProps = {
  tarefas?: Tarefa[]
}

function DemandasDirecao({
  tarefas = [],
}: DemandasDirecaoProps) {
  function classePrioridade(
    prioridade?: string
  ) {
    if (!prioridade) {
      return 'baixa'
    }

    return prioridade
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  return (
    <>
      <div className="direcao-header">
        <div>
          <h1>Demandas</h1>

          <p>
            Consulte todas as demandas registradas
            pelo setor de TI.
          </p>
        </div>

        <div className="direcao-usuario">
          <div className="direcao-avatar">
            👤
          </div>

          <div>
            <strong>Direção</strong>
            <span>Setor de TI</span>
          </div>
        </div>
      </div>

      <section className="direcao-card direcao-demandas-filtros">
        <div className="direcao-campo-busca">
          <label>Buscar demanda</label>

          <input
            type="text"
            placeholder="Título, solicitante ou responsável..."
          />
        </div>

        <div>
          <label>Status</label>

          <select defaultValue="todos">
            <option value="todos">
              Todos
            </option>

            <option value="Nova">
              Nova
            </option>

            <option value="Em análise">
              Em análise
            </option>

            <option value="Planejada">
              Planejada
            </option>

            <option value="Em andamento">
              Em andamento
            </option>

            <option value="Aguardando terceiro">
              Aguardando terceiro
            </option>

            <option value="Aguardando solicitante">
              Aguardando solicitante
            </option>

            <option value="Bloqueada">
              Bloqueada
            </option>

            <option value="Concluída">
              Concluída
            </option>
          </select>
        </div>

        <div>
          <label>Prioridade</label>

          <select defaultValue="todas">
            <option value="todas">
              Todas
            </option>

            <option value="Baixa">
              Baixa
            </option>

            <option value="Média">
              Média
            </option>

            <option value="Alta">
              Alta
            </option>

            <option value="Crítica">
              Crítica
            </option>
          </select>
        </div>

        <div>
          <label>Responsável</label>

          <select defaultValue="todos">
            <option value="todos">
              Todos
            </option>

            <option value="Analista">
              Analista
            </option>

            <option value="Estagiário">
              Estagiário
            </option>
          </select>
        </div>

        <button
          type="button"
          className="direcao-botao-filtrar"
        >
          🔍 Filtrar
        </button>
      </section>

      <section className="direcao-card direcao-demandas-card">
        <div className="direcao-demandas-header">
          <div>
            <h2>
              Todas as demandas
            </h2>

            <span>
              {tarefas.length}{' '}
              {tarefas.length === 1
                ? 'demanda encontrada'
                : 'demandas encontradas'}
            </span>
          </div>
        </div>

        {tarefas.length === 0 ? (
          <div className="direcao-demandas-vazio">
            <div>
              📋
            </div>

            <h3>
              Nenhuma demanda encontrada
            </h3>

            <p>
              As demandas registradas aparecerão
              aqui.
            </p>
          </div>
        ) : (
          <div className="direcao-demandas-tabela-wrapper">
            <table className="direcao-demandas-tabela">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Demanda</th>
                  <th>Solicitante</th>
                  <th>Setor</th>
                  <th>Responsável</th>
                  <th>Prioridade</th>
                  <th>Status</th>
                  <th>Prazo</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {tarefas.map((tarefa) => {
                  const prioridade =
                    tarefa.prioridade ||
                    'Baixa'

                  const prioridadeClasse =
                    classePrioridade(
                      tarefa.prioridade
                    )

                  return (
                    <tr key={tarefa.id}>
                      <td>
                        #{tarefa.id}
                      </td>

                      <td>
                        <div className="direcao-demanda-titulo">
                          <strong>
                            {tarefa.titulo ||
                              'Sem título'}
                          </strong>

                          <span>
                            {tarefa.categoria ||
                              'Sem categoria'}
                          </span>
                        </div>
                      </td>

                      <td>
                        {tarefa.solicitante ||
                          '-'}
                      </td>

                      <td>
                        {tarefa.setor ||
                          '-'}
                      </td>

                      <td>
                        {tarefa.responsavel ||
                          'Sem responsável'}
                      </td>

                      <td>
                        <span
                          className={`direcao-demanda-prioridade prioridade-${prioridadeClasse}`}
                        >
                          {prioridade}
                        </span>
                      </td>

                      <td>
                        <span className="direcao-demanda-status">
                          {tarefa.status ||
                            'Sem status'}
                        </span>
                      </td>

                      <td>
                        {tarefa.prazo ||
                          '-'}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="direcao-demanda-detalhes"
                        >
                          Ver →
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

export default DemandasDirecao