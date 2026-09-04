import type { Tarefa } from '../../types/Tarefas'

type RelatoriosDirecaoProps = {
  tarefas: Tarefa[]
}

function RelatoriosDirecao({
  tarefas: _tarefas,
}: RelatoriosDirecaoProps) {
  return (
    <>
      <div className="direcao-header">
        <div>
          <h1>Relatórios</h1>

          <p>
            Acompanhe indicadores de produtividade,
            volume e desempenho do setor de TI.
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

      <section className="direcao-card relatorios-filtros">
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
          <label>Setor</label>

          <select defaultValue="todos">
            <option value="todos">
              Todos
            </option>

            <option value="Administrativo">
              Administrativo
            </option>

            <option value="Coordenação">
              Coordenação
            </option>

            <option value="Financeiro">
              Financeiro
            </option>

            <option value="Secretaria">
              Secretaria
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
          className="relatorios-filtrar"
        >
          🔍 Filtrar
        </button>
      </section>

      <section className="relatorios-indicadores">
        <div className="direcao-indicador">
          <div className="direcao-indicador-icone azul">
            📋
          </div>

          <div>
            <span>Demandas recebidas</span>
            <strong>86</strong>
            <small>No período selecionado</small>
          </div>
        </div>

        <div className="direcao-indicador">
          <div className="direcao-indicador-icone verde">
            ✓
          </div>

          <div>
            <span>Demandas concluídas</span>
            <strong>64</strong>
            <small>74% de conclusão</small>
          </div>
        </div>

        <div className="direcao-indicador">
          <div className="direcao-indicador-icone amarelo">
            ⏱
          </div>

          <div>
            <span>Tempo médio</span>
            <strong>2h 18min</strong>
            <small>Por demanda concluída</small>
          </div>
        </div>

        <div className="direcao-indicador">
          <div className="direcao-indicador-icone vermelho">
            !
          </div>

          <div>
            <span>Atrasadas</span>
            <strong>7</strong>
            <small>Demandas fora do prazo</small>
          </div>
        </div>
      </section>

      <section className="relatorios-grid">
        <div className="direcao-card">
          <h2>
            Demandas por status
          </h2>

          <div className="relatorios-barras">
            <div>
              <span>Nova</span>

              <div className="relatorio-barra">
                <div style={{ width: '32%' }} />
              </div>

              <strong>12</strong>
            </div>

            <div>
              <span>Em análise</span>

              <div className="relatorio-barra roxa">
                <div style={{ width: '24%' }} />
              </div>

              <strong>9</strong>
            </div>

            <div>
              <span>Planejada</span>

              <div className="relatorio-barra cinza">
                <div style={{ width: '18%' }} />
              </div>

              <strong>7</strong>
            </div>

            <div>
              <span>Em andamento</span>

              <div className="relatorio-barra amarela">
                <div style={{ width: '50%' }} />
              </div>

              <strong>19</strong>
            </div>

            <div>
              <span>Concluída</span>

              <div className="relatorio-barra verde">
                <div style={{ width: '90%' }} />
              </div>

              <strong>64</strong>
            </div>
          </div>
        </div>

        <div className="direcao-card">
          <h2>
            Produtividade da equipe
          </h2>

          <div className="relatorios-equipe">
            <div>
              <div>
                <strong>Analista</strong>
                <span>38 demandas concluídas</span>
              </div>

              <div className="relatorio-progresso">
                <div style={{ width: '76%' }} />
              </div>

              <strong>76%</strong>
            </div>

            <div>
              <div>
                <strong>Estagiário</strong>
                <span>26 demandas concluídas</span>
              </div>

              <div className="relatorio-progresso">
                <div style={{ width: '65%' }} />
              </div>

              <strong>65%</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="direcao-card relatorios-tabela-card">
        <div className="relatorios-tabela-header">
          <div>
            <h2>
              Resumo por setor
            </h2>

            <span>
              Visão consolidada das demandas
            </span>
          </div>

          <button type="button">
            ↓ Exportar
          </button>
        </div>

        <div className="relatorios-tabela-wrapper">
          <table className="relatorios-tabela">
            <thead>
              <tr>
                <th>Setor</th>
                <th>Recebidas</th>
                <th>Concluídas</th>
                <th>Em andamento</th>
                <th>Atrasadas</th>
                <th>Taxa de conclusão</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Administrativo</td>
                <td>28</td>
                <td>22</td>
                <td>4</td>
                <td>2</td>
                <td>
                  <span className="relatorio-taxa">
                    79%
                  </span>
                </td>
              </tr>

              <tr>
                <td>Coordenação</td>
                <td>21</td>
                <td>17</td>
                <td>3</td>
                <td>1</td>
                <td>
                  <span className="relatorio-taxa">
                    81%
                  </span>
                </td>
              </tr>

              <tr>
                <td>Financeiro</td>
                <td>14</td>
                <td>10</td>
                <td>3</td>
                <td>1</td>
                <td>
                  <span className="relatorio-taxa">
                    71%
                  </span>
                </td>
              </tr>

              <tr>
                <td>Secretaria</td>
                <td>13</td>
                <td>9</td>
                <td>2</td>
                <td>2</td>
                <td>
                  <span className="relatorio-taxa">
                    69%
                  </span>
                </td>
              </tr>

              <tr>
                <td>Sala Google</td>
                <td>10</td>
                <td>6</td>
                <td>3</td>
                <td>1</td>
                <td>
                  <span className="relatorio-taxa">
                    60%
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

export default RelatoriosDirecao