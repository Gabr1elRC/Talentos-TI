import type {
  Tarefa,
  RegistroTempo,
} from '../../types/Tarefas'

import type {
  UsuarioLogado,
} from '../../services/api'

import {
  alterarStatusTarefa,
  buscarTarefaPorId,
  buscarRegistrosTempoHoje,
  buscarAtividadesAtivas,
  iniciarAtividadeJornada,
  pausarAtividadeJornada,
  retomarAtividadeJornada,
  concluirAtividadeJornada,
} from '../../services/api'

import {
  useEffect,
  useState,
} from 'react'

type MinhaJornadaProps = {
  tarefas: Tarefa[]

  usuario: UsuarioLogado

  atividadeAtual: Tarefa | null

  setAtividadeAtual: React.Dispatch<
    React.SetStateAction<Tarefa | null>
  >

  setTarefas: React.Dispatch<
    React.SetStateAction<Tarefa[]>
  >

  segundos: number

  setSegundos: React.Dispatch<
    React.SetStateAction<number>
  >

  pausado: boolean

  setPausado: React.Dispatch<
    React.SetStateAction<boolean>
  >

  atividadeManual: string

  setAtividadeManual: React.Dispatch<
    React.SetStateAction<string>
  >

  descricaoManual: string

  setDescricaoManual: React.Dispatch<
    React.SetStateAction<string>
  >

  atividadeManualEmAndamento: boolean

  setAtividadeManualEmAndamento:
    React.Dispatch<
      React.SetStateAction<boolean>
    >

  registrosManuais: RegistroTempo[]
}

function MinhaJornada({
  tarefas,

  atividadeAtual,
  setAtividadeAtual,

  setTarefas,

  segundos,
  setSegundos,

  pausado,
  setPausado,

  atividadeManual,
  setAtividadeManual,

  descricaoManual,
  setDescricaoManual,

  atividadeManualEmAndamento,
  setAtividadeManualEmAndamento,

  usuario,
}: MinhaJornadaProps) {
  const [
    registrosHoje,
    setRegistrosHoje,
  ] = useState<any[]>([])

  async function carregarRegistrosHoje() {
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
        'Erro ao carregar jornada:',
        erro
      )
    }
  }

  async function pausarAtividade() {
    try {
      if (pausado) {
        await retomarAtividadeJornada(
          usuario.id
        )

        setPausado(false)
      } else {
        await pausarAtividadeJornada(
          usuario.id
        )

        setPausado(true)
      }
    } catch (erro) {
      console.error(
        'Erro ao alterar pausa:',
        erro
      )
    }
  }

  async function concluirAtividade() {
    if (!atividadeAtual) {
      return
    }

    try {
      await concluirAtividadeJornada(
        usuario.id
      )

      await alterarStatusTarefa(
        Number(atividadeAtual.id),
        'Concluída',
        usuario.id
      )

      const resposta =
        await buscarTarefaPorId(
          Number(
            atividadeAtual.id
          )
        )

      setTarefas(
        (tarefasAtuais) =>
          tarefasAtuais.map(
            (tarefa) =>
              Number(tarefa.id) ===
              Number(
                atividadeAtual.id
              )
                ? resposta.tarefa
                : tarefa
          )
      )

      setAtividadeAtual(null)

      setPausado(false)

      setSegundos(0)

      await carregarRegistrosHoje()
    } catch (erro) {
      console.error(
        'Erro ao concluir atividade:',
        erro
      )
    }
  }

  async function concluirAtividadeManual() {
    try {
      await concluirAtividadeJornada(
        usuario.id
      )

      setAtividadeManualEmAndamento(
        false
      )

      setPausado(false)

      setAtividadeManual('')

      setDescricaoManual('')

      setSegundos(0)

      await carregarRegistrosHoje()
    } catch (erro) {
      console.error(
        'Erro ao concluir atividade manual:',
        erro
      )
    }
  }

  async function iniciarAtividade() {
    if (
      !atividadeManual ||
      !descricaoManual.trim()
    ) {
      console.warn(
        'Preencha a atividade e a descrição.'
      )

      return
    }

    try {
      await iniciarAtividadeJornada({
        usuarioId: usuario.id,

        tarefaId: null,

        atividade:
          atividadeManual,

        descricao:
          descricaoManual.trim(),
      })

      setSegundos(0)

      setPausado(false)

      setAtividadeManualEmAndamento(
        true
      )
    } catch (erro) {
      console.error(
        'Erro ao iniciar atividade:',
        erro
      )
    }
  }

  function formatarTempo(
    totalSegundos: number
  ) {
    const horas =
      Math.floor(
        totalSegundos / 3600
      )

    const minutos =
      Math.floor(
        (
          totalSegundos %
          3600
        ) / 60
      )

    const segundosRestantes =
      totalSegundos % 60

    return [
      horas,
      minutos,
      segundosRestantes,
    ]
      .map((valor) =>
        String(
          valor
        ).padStart(
          2,
          '0'
        )
      )
      .join(':')
  }

  useEffect(() => {
    carregarRegistrosHoje()
  }, [usuario.id])

  useEffect(() => {
    async function recuperarAtividade() {
      try {
        const atividades =
          await buscarAtividadesAtivas()

        const atividade =
          atividades.find(
            (item) =>
              item.usuarioId ===
              usuario.id
          )

        if (!atividade) {
          return
        }

        setSegundos(
          atividade.tempoAtivoSegundos
        )

        setPausado(
          atividade.pausado
        )

        if (
          atividade.tarefaId
        ) {
         let tarefa: Tarefa | null =
          tarefas.find(
            (item) =>
              Number(item.id) ===
              Number(
                atividade.tarefaId
              )
          ) ?? null

        if (!tarefa) {
          const resposta =
            await buscarTarefaPorId(
              atividade.tarefaId
            )

          tarefa =
            resposta.tarefa ?? null
        }

        if (tarefa) {
          setAtividadeAtual(
            tarefa
          )
        }

          setAtividadeManualEmAndamento(
            false
          )
        } else {
          setAtividadeManual(
            atividade.atividade
          )

          setDescricaoManual(
            atividade.descricao ??
              ''
          )

          setAtividadeManualEmAndamento(
            true
          )
        }
      } catch (erro) {
        console.error(
          'Erro ao recuperar atividade:',
          erro
        )
      }
    }

    recuperarAtividade()
  }, [usuario.id])

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>
            Minha Jornada
          </h1>

          <p>
            Registro e acompanhamento
            das atividades do dia
          </p>
        </div>
      </div>

      <div className="jornada-grid">
        <section className="dashboard-bloco jornada-painel-principal">
          <div className="jornada-titulo">
            <span className="jornada-titulo-icone">
              📋
            </span>

            <h2>
              Tarefa atual
            </h2>
          </div>

          {atividadeAtual ? (
            <div className="tarefa-atual-jornada">
              <div className="tarefa-atual-info">
                <span className="tarefa-atual-status">
                  {
                    atividadeAtual.status
                  }
                </span>

                <h3>
                  {
                    atividadeAtual.titulo
                  }
                </h3>

                <p>
                  {
                    atividadeAtual.descricao
                  }
                </p>

                <div className="tarefa-atual-dados">
                  <span>
                    Prioridade:{' '}
                    {
                      atividadeAtual.prioridade
                    }
                  </span>

                  <span>
                    Prazo:{' '}
                    {
                      atividadeAtual.prazo
                    }
                  </span>
                </div>
              </div>

              <div className="tarefa-atual-tempo">
                <span>
                  Tempo atual
                </span>

                <strong>
                  {
                    formatarTempo(
                      segundos
                    )
                  }
                </strong>

                <div className="cronometro-acoes">
                  <button
                    type="button"
                    onClick={
                      pausarAtividade
                    }
                  >
                    {pausado
                      ? 'Continuar'
                      : 'Pausar'}
                  </button>

                  <button
                    type="button"
                    onClick={
                      concluirAtividade
                    }
                  >
                    Concluir
                  </button>
                </div>
              </div>
            </div>
          ) : atividadeManualEmAndamento ? (
            <div className="tarefa-atual-jornada">
              <div className="tarefa-atual-info">
                <span className="tarefa-atual-status">
                  Atividade manual
                </span>

                <h3>
                  {
                    atividadeManual
                  }
                </h3>

                <p>
                  {
                    descricaoManual
                  }
                </p>
              </div>

              <div className="tarefa-atual-tempo">
                <span>
                  Tempo atual
                </span>

                <strong>
                  {
                    formatarTempo(
                      segundos
                    )
                  }
                </strong>

                <div className="cronometro-acoes">
                  <button
                    type="button"
                    onClick={
                      pausarAtividade
                    }
                  >
                    {pausado
                      ? 'Continuar'
                      : 'Pausar'}
                  </button>

                  <button
                    type="button"
                    onClick={
                      concluirAtividadeManual
                    }
                  >
                    Concluir
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="jornada-vazia">
                <div className="jornada-vazia-icone">
                  📋
                </div>

                <h3>
                  Nenhuma tarefa em andamento
                </h3>

                <p>
                  Inicie uma tarefa em
                  "Minhas Demandas"
                  <br />
                  ou registre uma atividade
                  manual.
                </p>
              </div>

              <div className="jornada-divisor" />

              <div className="jornada-manual">
                <div className="jornada-titulo">
                  <span className="jornada-titulo-icone">
                    ✏️
                  </span>

                  <h3>
                    Atividade Manual
                  </h3>
                </div>

                <div className="jornada-formulario">
                  <select
                    id="atividade"
                    value={
                      atividadeManual
                    }
                    onChange={(event) =>
                      setAtividadeManual(
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Selecione uma atividade
                    </option>

                    <option value="Atendimento emergencial">
                      Atendimento emergencial
                    </option>

                    <option value="Reunião">
                      Reunião
                    </option>

                    <option value="Organização do setor">
                      Organização do setor
                    </option>

                    <option value="Treinamento / Estudo">
                      Treinamento / Estudo
                    </option>

                    <option value="Deslocamento">
                      Deslocamento
                    </option>

                    <option value="Aguardando terceiro">
                      Aguardando terceiro
                    </option>

                    <option value="Pausa">
                      Pausa
                    </option>

                    <option value="Outros">
                      Outros
                    </option>
                  </select>

                  <label htmlFor="descricao">
                    O que você está fazendo?
                  </label>

                  <textarea
                    id="descricao"
                    placeholder="Descreva resumidamente a atividade"
                    value={
                      descricaoManual
                    }
                    onChange={(event) =>
                      setDescricaoManual(
                        event.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={
                      iniciarAtividade
                    }
                  >
                    ▶ Iniciar atividade
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        <section className="dashboard-bloco jornada-historico">
          <div className="jornada-titulo jornada-titulo-historico">
            <div>
              <span className="jornada-titulo-icone">
                📅
              </span>

              <h2>
                Atividades de hoje
              </h2>
            </div>

            <span className="jornada-data">
              {new Date().toLocaleDateString(
                'pt-BR'
              )}
            </span>
          </div>

          {registrosHoje.length ===
          0 ? (
            <div className="lista-vazia">
              Nenhuma atividade registrada
              hoje.
            </div>
          ) : (
            <div className="atividades-hoje-lista">
              {registrosHoje.map(
                (registro) => (
                  <div
                    key={
                      registro.id
                    }
                    className="atividade-hoje-item"
                  >
                    <div className="atividade-hoje-icone">
                      🖥️
                    </div>

                    <div className="atividade-hoje-conteudo">
                      <strong>
                        {
                          registro.titulo
                        }
                      </strong>

                      <span>
                        {
                          registro.acao
                        }
                      </span>
                    </div>

                    <div className="atividade-hoje-tempo">
                      <strong>
                        {
                          registro.inicio
                        }
                        {' - '}
                        {
                          registro.fim
                        }
                      </strong>

                      <span>
                        ⏱{' '}
                        {formatarTempo(
                          Math.round(
                            registro
                              .duracaoMinutos *
                              60
                          )
                        )}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          <div className="jornada-total">
            <span>
              ⏱ Total de hoje
            </span>

            <strong>
              {formatarTempo(
                Math.round(
                  registrosHoje.reduce(
                    (
                      total,
                      registro
                    ) =>
                      total +
                      registro
                        .duracaoMinutos,
                    0
                  ) * 60
                )
              )}
            </strong>
          </div>
        </section>
      </div>
    </>
  )
}

export default MinhaJornada