import {
  useEffect,
  useState,
} from 'react'

import type {
  Tarefa,
} from '../../types/Tarefas'

import {
  buscarAtividadesAtivas,
  buscarRegistrosTempoHoje,
  buscarResumoEquipeHoje,
} from '../../services/api'

import type {
  AtividadeAtiva,
  UsuarioLogado,
  ResumoEquipeHoje,

} from '../../services/api'

type DashboardAnalistaProps = {
  tarefas: Tarefa[]
  usuario: UsuarioLogado
}

function formatarTempo(
  segundos: number
) {
  const horas = Math.floor(
    segundos / 3600
  )

  const minutos = Math.floor(
    (segundos % 3600) / 60
  )

  const segundosRestantes =
    segundos % 60

  return [
    horas,
    minutos,
    segundosRestantes,
  ]
    .map((valor) =>
      String(valor).padStart(2, '0')
    )
    .join(':')
}

function formatarHorario(
  data: string
) {
  return new Date(
    data
  ).toLocaleTimeString(
    'pt-BR',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  )
}

function DashboardAnalista({
  usuario,
  tarefas,
}: DashboardAnalistaProps) {
  const hoje =
    new Date().toLocaleDateString(
      'sv-SE'
    )

  const [
    registrosHoje,
    setRegistrosHoje,
  ] = useState<any[]>([])

  const [
    atividadesAtivas,
    setAtividadesAtivas,
  ] = useState<AtividadeAtiva[]>([])

  const [
    carregandoEquipe,
    setCarregandoEquipe,
  ] = useState(true)

  const [
  resumoEquipe,
  setResumoEquipe,
] = useState<ResumoEquipeHoje[]>([])

  /*
   * TEMPO REGISTRADO HOJE
   * DO ANALISTA LOGADO
   */
  useEffect(() => {
    async function carregarTempoHoje() {
      try {
        const registros =
          await buscarRegistrosTempoHoje(
            usuario.id
          )

        setRegistrosHoje(
          registros
        )
      } catch (erro) {
        console.error(
          'Erro ao carregar tempo do analista:',
          erro
        )
      }
    }

    carregarTempoHoje()
  }, [usuario.id])

  /*
 * ATIVIDADES ATIVAS
 * DA EQUIPE
 */
useEffect(() => {
  async function carregarAtividades() {
    try {
      const atividades =
        await buscarAtividadesAtivas()

      setAtividadesAtivas(
        atividades
      )
    } catch (erro) {
      console.error(
        'Erro ao carregar atividades da equipe:',
        erro
      )
    } finally {
      setCarregandoEquipe(false)
    }
  }

  carregarAtividades()

  const sincronizacao =
    window.setInterval(
      carregarAtividades,
      10000
    )

  return () => {
    window.clearInterval(
      sincronizacao
    )
  }
}, [])

/*
 * RESUMO DA EQUIPE HOJE
 */
useEffect(() => {
  async function carregarResumoEquipe() {
    try {
      const resumo =
        await buscarResumoEquipeHoje()

      setResumoEquipe(
        resumo
      )
    } catch (erro) {
      console.error(
        'Erro ao carregar resumo da equipe:',
        erro
      )
    }
  }

  carregarResumoEquipe()

  const atualizacao =
    window.setInterval(
      carregarResumoEquipe,
      10000
    )

  return () => {
    window.clearInterval(
      atualizacao
    )
  }
}, [])

  /*
   * Faz o cronômetro andar
   * visualmente a cada segundo.
   */
  useEffect(() => {
    const cronometro =
      window.setInterval(() => {
        setAtividadesAtivas(
          (atividadesAtuais) =>
            atividadesAtuais.map(
              (atividade) => {
                if (
                  atividade.pausado
                ) {
                  return atividade
                }

                return {
                  ...atividade,

                  tempoAtivoSegundos:
                    atividade
                      .tempoAtivoSegundos +
                    1,
                }
              }
            )
        )
      }, 1000)

    return () => {
      window.clearInterval(
        cronometro
      )
    }
  }, [])

  /*
   * INDICADORES
   */
  const total = tarefas.length

  const novas =
    tarefas.filter(
      (tarefa) =>
        tarefa.status === 'Nova'
    ).length

  const andamento =
    tarefas.filter(
      (tarefa) =>
        tarefa.status ===
        'Em andamento'
    ).length

  const concluidas =
    tarefas.filter(
      (tarefa) =>
        tarefa.status ===
        'Concluída'
    ).length

  const atrasadas =
    tarefas.filter(
      (tarefa) =>
        tarefa.prazo &&
        tarefa.prazo < hoje &&
        tarefa.status !==
          'Concluída' &&
        tarefa.status !==
          'Cancelada'
    ).length

  /*
   * PRÓXIMOS PRAZOS
   */
  const proximosPrazos =
    tarefas
      .filter(
        (tarefa) =>
          tarefa.prazo &&
          tarefa.prazo >= hoje &&
          tarefa.status !==
            'Concluída' &&
          tarefa.status !==
            'Cancelada'
      )
      .sort((a, b) =>
        a.prazo.localeCompare(
          b.prazo
        )
      )
      .slice(0, 4)

  /*
   * DISTRIBUIÇÃO
   */
  const demandasAnalista =
    tarefas.filter(
      (tarefa) =>
        (
          tarefa.responsavel ?? ''
        )
          .toLowerCase()
          .includes(
            'analista'
          )
    ).length

  const demandasEstagiario =
    tarefas.filter(
      (tarefa) =>
        (
          tarefa.responsavel ?? ''
        )
          .toLowerCase()
          .includes(
            'estagi'
          )
    ).length

  const totalDistribuidas =
    demandasAnalista +
    demandasEstagiario

  const percentualAnalista =
    totalDistribuidas > 0
      ? Math.round(
          (
            demandasAnalista /
            totalDistribuidas
          ) * 100
        )
      : 0

  const percentualEstagiario =
    totalDistribuidas > 0
      ? Math.round(
          (
            demandasEstagiario /
            totalDistribuidas
          ) * 100
        )
      : 0

  /*
   * TEMPO DO ANALISTA HOJE
   */
  const totalMinutosHoje =
    registrosHoje.reduce(
      (
        total,
        registro
      ) =>
        total +
        Number(
          registro
            .duracaoMinutos ??
            0
        ),
      0
    )

  const horasHoje =
    Math.floor(
      totalMinutosHoje / 60
    )

  const minutosHoje =
    Math.round(
      totalMinutosHoje % 60
    )

  const tempoHojeFormatado =
    `${horasHoje}h ${minutosHoje}min`

function formatarMinutos(
  minutos: number
) {
  const horas =
    Math.floor(
      minutos / 60
    )

  const minutosRestantes =
    minutos % 60

  return `${horas}h ${minutosRestantes}min`
}

  return (
    <>
      <div className="analista-header">
        <div>
          <h1>
            Dashboard
          </h1>

          <p>
            Acompanhe as demandas e
            atividades do setor de TI.
          </p>
        </div>

        <div className="analista-usuario">
          <div className="analista-avatar">
            👤
          </div>

          <div>
            <strong>
              {usuario.nome}
            </strong>

            <span>
              {usuario.setor}
            </span>
          </div>
        </div>
      </div>

      <section className="analista-indicadores">
        <div className="analista-indicador">
          <div className="analista-indicador-icone azul">
            📋
          </div>

          <div>
            <span>
              Total de demandas
            </span>

            <strong>
              {total}
            </strong>

            <small>
              Demandas registradas
            </small>
          </div>
        </div>

        <div className="analista-indicador">
          <div className="analista-indicador-icone roxo">
            ✦
          </div>

          <div>
            <span>
              Novas
            </span>

            <strong>
              {novas}
            </strong>

            <small>
              Aguardando análise
            </small>
          </div>
        </div>

        <div className="analista-indicador">
          <div className="analista-indicador-icone laranja">
            ◷
          </div>

          <div>
            <span>
              Em andamento
            </span>

            <strong>
              {andamento}
            </strong>

            <small>
              Demandas em execução
            </small>
          </div>
        </div>

        <div className="analista-indicador">
          <div className="analista-indicador-icone verde">
            ✓
          </div>

          <div>
            <span>
              Concluídas
            </span>

            <strong>
              {concluidas}
            </strong>

            <small>
              Demandas finalizadas
            </small>
          </div>
        </div>
      </section>

      <section className="analista-grid-principal">
        <div className="analista-card analista-equipe-agora">
          <div className="analista-card-header">
            <div>
              <h2>
                Equipe agora
              </h2>

              <span>
                Acompanhamento em
                tempo real
              </span>
            </div>

            <span className="analista-status">
              {
                atividadesAtivas.length
              }{' '}
              em atividade
            </span>
          </div>

          {carregandoEquipe ? (
            <div className="analista-lista-vazia">
              Carregando equipe...
            </div>
          ) : atividadesAtivas.length >
            0 ? (
            <div className="analista-equipe-lista">
              {atividadesAtivas.map(
                (atividade) => (
                  <div
                    key={atividade.id}
                    className="analista-equipe-item"
                  >
                    <div className="analista-equipe-avatar">
                      👤
                    </div>

                    <div className="analista-equipe-conteudo">
                      <div className="analista-equipe-topo">
                        <div>
                          <strong>
                            {
                              atividade.usuarioNome
                            }
                          </strong>

                          <span>
                            {
                              atividade.setor
                            }
                          </span>
                        </div>

                        <div
                          className={
                            atividade.pausado
                              ? 'analista-equipe-situacao pausado'
                              : 'analista-equipe-situacao trabalhando'
                          }
                        >
                          {atividade.pausado
                            ? '⏸ Pausado'
                            : '● Em atividade'}
                        </div>
                      </div>

                      <h3>
                        {
                          atividade.atividade
                        }
                      </h3>

                      {atividade
                        .tarefaTitulo && (
                        <span className="analista-equipe-tarefa">
                          Demanda:{' '}
                          {
                            atividade.tarefaTitulo
                          }
                        </span>
                      )}

                      {atividade.descricao && (
                        <p>
                          {
                            atividade.descricao
                          }
                        </p>
                      )}

                    <div className="analista-equipe-tempo">
                      <div>
                        <span>
                          Início
                        </span>

                        <strong>
                          {formatarHorario(
                            atividade.iniciadaEm
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Tempo atual
                        </span>

                        <strong className="analista-cronometro-equipe">
                          {formatarTempo(
                            atividade.tempoAtivoSegundos
                          )}
                        </strong>
                      </div>

                      {(() => {
                        const resumo =
                          resumoEquipe.find(
                            (item) =>
                              item.usuarioId ===
                              atividade.usuarioId
                          )

                        if (!resumo) {
                          return null
                        }

                        return (
                          <>
                            <div>
                              <span>
                                Atividades hoje
                              </span>

                              <strong>
                                {resumo.atividadesHoje}
                              </strong>
                            </div>

                            <div>
                              <span>
                                Total hoje
                              </span>

                              <strong>
                                {formatarMinutos(
                                  resumo.minutosHoje
                                )}
                              </strong>
                            </div>
                          </>
                        )
                      })()}
                    </div>

                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="analista-atividade-vazia">
              <div>
                👥
              </div>

              <h3>
                Nenhuma atividade em
                andamento
              </h3>

              <p>
                Nenhum membro da equipe
                iniciou uma atividade no
                momento.
              </p>
            </div>
          )}
        </div>

        <div className="analista-card">
          <div className="analista-card-header">
            <h2>
              Próximos prazos
            </h2>
          </div>

          <div className="analista-prazos">
            {proximosPrazos.map(
              (tarefa) => (
                <div
                  key={tarefa.id}
                  className="analista-prazo-item"
                >
                  <div>
                    <strong>
                      {tarefa.titulo}
                    </strong>

                    <span>
                      {tarefa.responsavel ||
                        'Sem responsável'}
                    </span>
                  </div>

                  <span>
                    {tarefa.prazo}
                  </span>
                </div>
              )
            )}

            {proximosPrazos.length ===
              0 && (
              <div className="analista-lista-vazia">
                Nenhum prazo pendente.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="analista-card analista-resumo-equipe-hoje">
  <div className="analista-card-header">
    <div>
      <h2>
        Resumo da equipe hoje
      </h2>

      <span>
        Atividades e tempo registrado
        por usuário
      </span>
    </div>
  </div>

  <div className="analista-resumo-equipe-lista">
    {resumoEquipe.map(
      (membro) => {
        const atividadeAtual =
          atividadesAtivas.find(
            (atividade) =>
              atividade.usuarioId ===
              membro.usuarioId
          )

        return (
          <div
            key={membro.usuarioId}
            className="analista-resumo-equipe-item"
          >
            <div className="analista-resumo-equipe-usuario">
              <div className="analista-equipe-avatar">
                👤
              </div>

              <div>
                <strong>
                  {membro.usuarioNome}
                </strong>

                <span>
                  {membro.setor}
                </span>
              </div>
            </div>

            <div className="analista-resumo-equipe-info">
              <div>
                <span>
                  Situação
                </span>

                <strong>
                  {atividadeAtual
                    ? atividadeAtual.pausado
                      ? '⏸ Pausado'
                      : '🟢 Em atividade'
                    : '⚪ Disponível'}
                </strong>
              </div>

              <div>
                <span>
                  Atividades hoje
                </span>

                <strong>
                  {membro.atividadesHoje}
                </strong>
              </div>

              <div>
                <span>
                  Tempo hoje
                </span>

                <strong>
                  {formatarMinutos(
                    membro.minutosHoje
                  )}
                </strong>
              </div>
            </div>
          </div>
        )
      }
    )}
  </div>
</section>

      <section className="analista-grid-inferior">
        <div className="analista-card">
          <div className="analista-card-header">
            <h2>
              Distribuição das demandas
            </h2>
          </div>

          <div className="analista-distribuicao">
            <div>
              <span>
                Analista
              </span>

              <div className="analista-barra">
                <div
                  style={{
                    width:
                      `${percentualAnalista}%`,
                  }}
                />
              </div>

              <strong>
                {percentualAnalista}%
              </strong>
            </div>

            <div>
              <span>
                Estagiário
              </span>

              <div className="analista-barra secundaria">
                <div
                  style={{
                    width:
                      `${percentualEstagiario}%`,
                  }}
                />
              </div>

              <strong>
                {
                  percentualEstagiario
                }
                %
              </strong>
            </div>
          </div>
        </div>

        <div className="analista-card">
          <div className="analista-card-header">
            <h2>
              Resumo
            </h2>
          </div>

          <div className="analista-resumo">
            <div>
              <span>
                Demandas novas
              </span>

              <strong>
                {novas}
              </strong>
            </div>

            <div>
              <span>
                Em andamento
              </span>

              <strong>
                {andamento}
              </strong>
            </div>

            <div>
              <span>
                Concluídas
              </span>

              <strong>
                {concluidas}
              </strong>
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
        </div>

        <div className="analista-card">
          <div className="analista-card-header">
            <h2>
              Situação do setor
            </h2>
          </div>

          <div className="analista-resumo">
            <div>
              <span>
                📋 Total
              </span>

              <strong>
                {total}
              </strong>
            </div>

            <div>
              <span>
                👨‍💻 Analista
              </span>

              <strong>
                {demandasAnalista}
              </strong>
            </div>

            <div>
              <span>
                👨‍🎓 Estagiário
              </span>

              <strong>
                {
                  demandasEstagiario
                }
              </strong>
            </div>

            <div>
              <span>
                🟢 Trabalhando agora
              </span>

              <strong>
                {
                  atividadesAtivas.length
                }
              </strong>
            </div>

            <div>
              <span>
                ⏱ Tempo registrado hoje
              </span>

              <strong>
                {
                  tempoHojeFormatado
                }
              </strong>
            </div>

            <div>
              <span>
                📅 Atividades hoje
              </span>

              <strong>
                {
                  registrosHoje.length
                }
              </strong>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default DashboardAnalista