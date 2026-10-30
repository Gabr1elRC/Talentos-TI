import type { Tarefa } from '../../types/Tarefas'
import Notificacoes from '../../components/Notificacoes'
import type {
  UsuarioLogado,
} from '../../services/api'

type DashboardEstagiarioProps = {
  tarefas: Tarefa[]
  usuario: UsuarioLogado
}

function DashboardEstagiario({
  tarefas,
  usuario,
}: DashboardEstagiarioProps) {
  const hoje =
    new Date().toLocaleDateString('sv-SE')

  const minhasDemandas =
    tarefas.length

  const paraHoje =
    tarefas.filter(
      (tarefa) =>
        tarefa.prazo === hoje &&
        tarefa.status !== 'Concluída' &&
        tarefa.status !== 'Cancelada'
    ).length

  const atrasadas =
    tarefas.filter(
      (tarefa) =>
        tarefa.prazo &&
        tarefa.prazo < hoje &&
        tarefa.status !== 'Concluída' &&
        tarefa.status !== 'Cancelada'
    ).length

  const aFazer =
    tarefas.filter(
      (tarefa) =>
        tarefa.status === 'Nova' ||
        tarefa.status === 'Em análise' ||
        tarefa.status === 'Planejada'
    )

  const emAndamento =
    tarefas.filter(
      (tarefa) =>
        tarefa.status === 'Em andamento'
    )

  const concluidas =
    tarefas.filter(
      (tarefa) =>
        tarefa.status === 'Concluída'
    )

  const proximosPrazos =
    tarefas
      .filter(
        (tarefa) =>
          tarefa.prazo &&
          tarefa.prazo >= hoje &&
          tarefa.status !== 'Concluída' &&
          tarefa.status !== 'Cancelada'
      )
      .sort((a, b) =>
        a.prazo.localeCompare(b.prazo)
      )
      .slice(0, 3)

  const atividadeAtual =
    emAndamento[0] ?? null

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>Painel do Estagiário</h1>

          <p>
            Acompanhamento das atividades e
            demandas do dia
          </p>
        </div>
      </div>

      <section className="cards-indicadores">
        <div className="card-indicador novo">
          <div className="card-icone">
            📋
          </div>

          <div>
            <span>
              Minhas demandas
            </span>

            <strong>
              {minhasDemandas}
            </strong>
          </div>
        </div>

        <div className="card-indicador novo">
          <div className="card-icone">
            📅
          </div>

          <div>
            <span>
              Para hoje
            </span>

            <strong>
              {paraHoje}
            </strong>
          </div>
        </div>

        <div className="card-indicador novo">
          <div className="card-icone destaque">
            ⚠
          </div>

          <div>
            <span>
              Atrasadas
            </span>

            <strong>
              {atrasadas}
            </strong>
          </div>
        </div>

        <div className="card-indicador novo">
          <div className="card-icone">
            ✅
          </div>

          <div>
            <span>
              Concluídas
            </span>

            <strong>
              {concluidas.length}
            </strong>
          </div>
        </div>
      </section>

      <section className="dashboard-grid-principal">
        <div className="dashboard-bloco atividade-card">
          <div className="dashboard-bloco-header">
            <h2>Atividade atual</h2>

            <span className="status-chip">
              {atividadeAtual
                ? 'Em andamento'
                : 'Nenhuma em andamento'}
            </span>
          </div>

          {atividadeAtual ? (
            <div className="atividade-conteudo">
              <div className="atividade-ilustracao">
                🖥️
              </div>

              <h3>
                {atividadeAtual.titulo}
              </h3>

              <p>
                {atividadeAtual.descricao}
              </p>

              <span>
                Prazo:{' '}
                {atividadeAtual.prazo || '-'}
              </span>
            </div>
          ) : (
            <div className="atividade-conteudo">
              <div className="atividade-ilustracao">
                📋
              </div>

              <h3>
                Você ainda não iniciou
                nenhuma atividade.
              </h3>

              <p>
                Acesse Minhas Demandas para
                iniciar uma tarefa.
              </p>
            </div>
          )}
        </div>

        <div className="dashboard-bloco">
          <div className="dashboard-bloco-header">
            <h2>
              Próximos prazos
            </h2>
          </div>

          {proximosPrazos.length === 0 ? (
            <div className="painel-vazio">
              <div className="painel-vazio-icone">
                📅
              </div>

              <p>
                Nenhum prazo próximo.
              </p>

              <span>
                Tudo em dia! Continue assim.
              </span>
            </div>
          ) : (
            <div>
              {proximosPrazos.map(
                (tarefa) => (
                  <div
                    key={tarefa.id}
                    className="atividade-hoje-item"
                  >
                    <div>
                      <strong>
                        {tarefa.titulo}
                      </strong>

                      <span>
                        {tarefa.status}
                      </span>
                    </div>

                    <strong>
                      {tarefa.prazo}
                    </strong>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-grid-inferior">
        <div className="dashboard-bloco">
          <div className="dashboard-bloco-header">
            <h2>
              Minhas demandas
            </h2>
          </div>

          <div className="mini-kanban">
            <div className="mini-coluna">
              <div className="mini-coluna-header">
                <span>A fazer</span>

                <strong>
                  {aFazer.length}
                </strong>
              </div>

              {aFazer.length === 0 ? (
                <div className="mini-coluna-vazia">
                  Nenhuma demanda nesta coluna.
                </div>
              ) : (
                aFazer
                  .slice(0, 3)
                  .map((tarefa) => (
                    <div
                      key={tarefa.id}
                      className="mini-card"
                    >
                      {tarefa.titulo}
                    </div>
                  ))
              )}
            </div>

            <div className="mini-coluna andamento">
              <div className="mini-coluna-header">
                <span>
                  Em andamento
                </span>

                <strong>
                  {emAndamento.length}
                </strong>
              </div>

              {emAndamento.length === 0 ? (
                <div className="mini-coluna-vazia">
                  Nenhuma demanda nesta coluna.
                </div>
              ) : (
                emAndamento
                  .slice(0, 3)
                  .map((tarefa) => (
                    <div
                      key={tarefa.id}
                      className="mini-card"
                    >
                      {tarefa.titulo}
                    </div>
                  ))
              )}
            </div>

            <div className="mini-coluna concluida">
              <div className="mini-coluna-header">
                <span>
                  Concluídas
                </span>

                <strong>
                  {concluidas.length}
                </strong>
              </div>

              {concluidas.length === 0 ? (
                <div className="mini-coluna-vazia">
                  Nenhuma demanda nesta coluna.
                </div>
              ) : (
                concluidas
                  .slice(0, 3)
                  .map((tarefa) => (
                    <div
                      key={tarefa.id}
                      className="mini-card"
                    >
                      {tarefa.titulo}
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-bloco">
          <div className="dashboard-bloco-header">
            <h2>
              Resumo
            </h2>
          </div>

          <div className="resumo-dia">
            <div>
              <span>
                📋 Total atribuído
              </span>

              <strong>
                {tarefas.length}
              </strong>
            </div>

            <div>
              <span>
                🕒 Em andamento
              </span>

              <strong>
                {emAndamento.length}
              </strong>
            </div>

            <div>
              <span>
                ✅ Demandas concluídas
              </span>

              <strong>
                {concluidas.length}
              </strong>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default DashboardEstagiario