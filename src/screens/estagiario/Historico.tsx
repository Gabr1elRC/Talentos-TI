import '../../styles/historico.css'
import '../../styles/Estagiario.css'

function Historico() {
  const registros = [
    {
      id: 1,
      data: '20/05/2025',
      horario: '08:15 - 09:30',
      duracao: '1h 15min',
      atividade: 'Desenvolvimento de sistema',
      origem: 'Tarefa',
      status: 'Concluída',
    },
    {
      id: 2,
      data: '20/05/2025',
      horario: '09:45 - 10:15',
      duracao: '30min',
      atividade: 'Reunião de alinhamento',
      origem: 'Manual',
      status: 'Concluída',
    },
    {
      id: 3,
      data: '20/05/2025',
      horario: '10:30 - 12:00',
      duracao: '1h 30min',
      atividade: 'Suporte ao usuário',
      origem: 'Tarefa',
      status: 'Concluída',
    },
    {
      id: 4,
      data: '19/05/2025',
      horario: '13:00 - 14:45',
      duracao: '1h 45min',
      atividade: 'Testes e validações',
      origem: 'Tarefa',
      status: 'Concluída',
    },
    {
      id: 5,
      data: '19/05/2025',
      horario: '15:00 - 15:30',
      duracao: '30min',
      atividade: 'Organização do setor',
      origem: 'Manual',
      status: 'Concluída',
    },
    {
      id: 6,
      data: '16/05/2025',
      horario: '08:00 - 11:20',
      duracao: '3h 20min',
      atividade: 'Desenvolvimento de sistema',
      origem: 'Tarefa',
      status: 'Concluída',
    },
    {
      id: 7,
      data: '16/05/2025',
      horario: '13:30 - 14:00',
      duracao: '30min',
      atividade: 'Treinamento / Estudo',
      origem: 'Manual',
      status: 'Concluída',
    },
    {
      id: 8,
      data: '15/05/2025',
      horario: '09:00 - 12:00',
      duracao: '3h 00min',
      atividade: 'Análise de requisitos',
      origem: 'Tarefa',
      status: 'Concluída',
    },
    {
      id: 9,
      data: '15/05/2025',
      horario: '14:00 - 16:30',
      duracao: '2h 30min',
      atividade: 'Desenvolvimento de sistema',
      origem: 'Tarefa',
      status: 'Concluída',
    },
    {
      id: 10,
      data: '14/05/2025',
      horario: '10:00 - 11:00',
      duracao: '1h 00min',
      atividade: 'Reunião de equipe',
      origem: 'Manual',
      status: 'Concluída',
    },
  ]

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>Histórico</h1>

          <p>
            Consulte o histórico das suas atividades e registros de tempo.
          </p>
        </div>
      </div>

      <section className="dashboard-bloco historico-filtros">
        <div className="historico-filtro-item">
          <label>Período</label>

          <div className="historico-periodo">
            <input
              type="date"
              defaultValue="2025-05-01"
            />

            <span>até</span>

            <input
              type="date"
              defaultValue="2025-05-31"
            />
          </div>
        </div>

        <div className="historico-filtro-item">
          <label>Tipo de atividade</label>

          <select defaultValue="todos">
            <option value="todos">
              Todos
            </option>

            <option value="tarefa">
              Tarefa
            </option>

            <option value="manual">
              Manual
            </option>
          </select>
        </div>

        <div className="historico-filtro-item">
          <label>Origem</label>

          <select defaultValue="todos">
            <option value="todos">
              Todos
            </option>

            <option value="tarefa">
              Tarefa
            </option>

            <option value="manual">
              Manual
            </option>
          </select>
        </div>

        <button
          type="button"
          className="historico-botao-filtrar"
        >
          🔍 Filtrar
        </button>
      </section>

      <div className="historico-indicadores">
        <div className="historico-indicador">
          <div className="historico-indicador-icone azul">
            ⏱
          </div>

          <div>
            <span>Total de horas</span>
            <strong>48h 32min</strong>
          </div>
        </div>

        <div className="historico-indicador">
          <div className="historico-indicador-icone verde">
            ✓
          </div>

          <div>
            <span>Tarefas concluídas</span>
            <strong>12</strong>
          </div>
        </div>

        <div className="historico-indicador">
          <div className="historico-indicador-icone laranja">
            ⏸
          </div>

          <div>
            <span>Tarefas em andamento</span>
            <strong>3</strong>
          </div>
        </div>

        <div className="historico-indicador">
          <div className="historico-indicador-icone roxo">
            📅
          </div>

          <div>
            <span>Total de registros</span>
            <strong>18</strong>
          </div>
        </div>
      </div>

      <section className="dashboard-bloco historico-registros">
        <div className="historico-registros-header">
          <h2>Registros de atividades</h2>

          <button
            type="button"
            className="historico-exportar"
          >
            ↓ Exportar
          </button>
        </div>

        <div className="historico-tabela-wrapper">
          <table className="historico-tabela">
            <thead>
              <tr>
                <th>Data</th>
                <th>Horário</th>
                <th>Duração</th>
                <th>Atividade</th>
                <th>Origem</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {registros.map((registro) => (
                <tr key={registro.id}>
                  <td>{registro.data}</td>

                  <td>
                    {registro.horario}
                  </td>

                  <td>
                    {registro.duracao}
                  </td>

                  <td>
                    {registro.atividade}
                  </td>

                  <td>
                    <span
                      className={`historico-origem ${
                        registro.origem === 'Tarefa'
                          ? 'tarefa'
                          : 'manual'
                      }`}
                    >
                      {registro.origem}
                    </span>
                  </td>

                  <td>
                    <span className="historico-status">
                      {registro.status}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="historico-detalhes"
                    >
                      ›
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="historico-paginacao">
          <span>
            Mostrando 10 de 18 registros
          </span>

          <div>
            <button type="button">
              ‹
            </button>

            <button
              type="button"
              className="ativo"
            >
              1
            </button>

            <button type="button">
              2
            </button>

            <button type="button">
              ›
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Historico