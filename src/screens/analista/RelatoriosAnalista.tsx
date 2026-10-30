import type { Tarefa } from '../../types/Tarefas'

type RelatoriosAnalistaProps = {
  tarefas: Tarefa[]
}

function RelatoriosAnalista({
  tarefas: _tarefas,
}: RelatoriosAnalistaProps) {
  return (
    <>
      <div className="analista-header">
        <div>
          <h1>Relatórios</h1>

          <p>
            Acompanhe os principais indicadores
            operacionais do setor de TI.
          </p>
        </div>
      </div>

      <section className="analista-card relatorios-analista-filtros">
        <div>
          <label>Período inicial</label>

          <input
            type="date"
            defaultValue="2026-08-01"
          />
        </div>

        <div>
          <label>Período final</label>

          <input
            type="date"
            defaultValue="2026-08-31"
          />
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

        <div>
          <label>Status</label>

          <select defaultValue="todos">
            <option value="todos">
              Todos
            </option>

            <option value="Nova">
              Nova
            </option>

            <option value="Em andamento">
              Em andamento
            </option>

            <option value="Concluída">
              Concluída
            </option>

            <option value="Bloqueada">
              Bloqueada
            </option>
          </select>
        </div>

        <button
          type="button"
          className="relatorios-analista-filtrar"
        >
          🔍 Filtrar
        </button>
      </section>

      <section className="relatorios-analista-indicadores">
       
        <div className="analista-indicador">
          <div className="analista-indicador-icone verde">
            ✓
          </div>

          <div>
            <span>Concluídas</span>
            <strong>31</strong>
            <small>74% de conclusão</small>
          </div>
        </div>

        <div className="analista-indicador">
          <div className="analista-indicador-icone laranja">
            ⏱
          </div>

          <div>
            <span>Tempo médio</span>
            <strong>1h 48min</strong>
            <small>Por demanda concluída</small>
          </div>
        </div>

        <div className="analista-indicador">
          <div className="analista-indicador-icone roxo">
            ⚠
          </div>

          <div>
            <span>Atrasadas</span>
            <strong>4</strong>
            <small>Demandas fora do prazo</small>
          </div>
        </div>
      </section>

      <section className="relatorios-analista-grid">
        <div className="analista-card">
          <h2>Demandas por status</h2>

          <div className="relatorios-analista-barras">
            <div>
              <span>Nova</span>

              <div className="relatorios-analista-barra">
                <div style={{ width: '35%' }} />
              </div>

              <strong>8</strong>
            </div>

            <div>
              <span>Em análise</span>

              <div className="relatorios-analista-barra roxa">
                <div style={{ width: '26%' }} />
              </div>

              <strong>6</strong>
            </div>

            <div>
              <span>Planejada</span>

              <div className="relatorios-analista-barra cinza">
                <div style={{ width: '18%' }} />
              </div>

              <strong>4</strong>
            </div>

            <div>
              <span>Em andamento</span>

              <div className="relatorios-analista-barra laranja">
                <div style={{ width: '48%' }} />
              </div>

              <strong>11</strong>
            </div>

            <div>
              <span>Concluída</span>

              <div className="relatorios-analista-barra verde">
                <div style={{ width: '88%' }} />
              </div>

              <strong>31</strong>
            </div>
          </div>
        </div>

        <div className="analista-card">
          <h2>Distribuição por responsável</h2>

          <div className="relatorios-analista-equipe">
            <div>
              <div>
                <strong>Analista</strong>
                <span>29 demandas</span>
              </div>

              <div className="relatorios-analista-progresso">
                <div style={{ width: '69%' }} />
              </div>

              <strong>69%</strong>
            </div>

            <div>
              <div>
                <strong>Estagiário</strong>
                <span>13 demandas</span>
              </div>

              <div className="relatorios-analista-progresso">
                <div style={{ width: '31%' }} />
              </div>

              <strong>31%</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="analista-card relatorios-analista-tabela-card">
        <div className="relatorios-analista-tabela-header">
          <div>
            <h2>Resumo operacional</h2>

            <span>
              Consolidado das principais métricas
            </span>
          </div>

          <button type="button">
            ↓ Exportar
          </button>
        </div>

        <div className="relatorios-analista-tabela-wrapper">
          <table className="relatorios-analista-tabela">
            <thead>
              <tr>
                <th>Responsável</th>
                <th>Recebidas</th>
                <th>Concluídas</th>
                <th>Em andamento</th>
                <th>Atrasadas</th>
                <th>Taxa</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Analista</td>
                <td>29</td>
                <td>22</td>
                <td>5</td>
                <td>2</td>
                <td>
                  <span className="relatorios-analista-taxa">
                    76%
                  </span>
                </td>
              </tr>

              <tr>
                <td>Estagiário</td>
                <td>13</td>
                <td>9</td>
                <td>3</td>
                <td>1</td>
                <td>
                  <span className="relatorios-analista-taxa">
                    69%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default RelatoriosAnalista