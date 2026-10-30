import {
  useEffect,
  useState,
} from 'react'

import type {
  Tarefa,
} from '../../types/Tarefas'

import type {
  UsuarioLogado,
} from '../../services/api'

import {
  adicionarRegistroTempoManual,
  buscarRegistrosTempoHoje,
} from '../../services/api'

type JornadaAnalistaProps = {
  tarefas: Tarefa[]
  usuario: UsuarioLogado
}

function JornadaAnalista({
  tarefas: _tarefas,
  usuario,
}: JornadaAnalistaProps) {
  const [
    atividadeManual,
    setAtividadeManual,
  ] = useState('')

  const [
    descricaoManual,
    setDescricaoManual,
  ] = useState('')

  const [
    atividadeEmAndamento,
    setAtividadeEmAndamento,
  ] = useState(false)

  const [
    segundos,
    setSegundos,
  ] = useState(0)

  const [
    pausado,
    setPausado,
  ] = useState(false)

  const [
    registrosHoje,
    setRegistrosHoje,
  ] = useState<any[]>([])

  const [
    erroAtividade,
    setErroAtividade,
  ] = useState('')

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

  useEffect(() => {
    carregarRegistrosHoje()
  }, [usuario.id])

  useEffect(() => {
    if (
      !atividadeEmAndamento ||
      pausado
    ) {
      return
    }

    const intervalo =
      setInterval(() => {
        setSegundos(
          (valorAtual) =>
            valorAtual + 1
        )
      }, 1000)

    return () => {
      clearInterval(
        intervalo
      )
    }
  }, [
    atividadeEmAndamento,
    pausado,
  ])

  function iniciarAtividade() {
    setErroAtividade('')

    if (!atividadeManual) {
      setErroAtividade(
        'Selecione uma atividade.'
      )
      return
    }

    if (
      !descricaoManual.trim()
    ) {
      setErroAtividade(
        'Descreva o que você está fazendo.'
      )
      return
    }

    setSegundos(0)
    setPausado(false)

    setAtividadeEmAndamento(
      true
    )
  }

  function pausarAtividade() {
    setPausado(
      (valorAtual) =>
        !valorAtual
    )
  }

  async function concluirAtividade() {
    const agora =
      new Date()

    const inicio =
      new Date(
        agora.getTime() -
          segundos * 1000
      )

    const duracaoMinutos =
      Math.max(
        1,
        Math.round(
          segundos / 60
        )
      )

    try {
      await adicionarRegistroTempoManual(
        {
          data:
            agora.toLocaleDateString(
              'sv-SE'
            ),

          inicio:
            inicio.toISOString(),

          fim:
            agora.toISOString(),

          duracaoMinutos,

          acao:
            `${atividadeManual} - ${descricaoManual}`,

          justificativa:
            'Atividade registrada pela jornada do analista',
        },

        usuario.id
      )

      setAtividadeEmAndamento(
        false
      )

      setPausado(false)

      setAtividadeManual('')
      setDescricaoManual('')

      setSegundos(0)

      await carregarRegistrosHoje()
    } catch (erro) {
      console.error(
        'Erro ao concluir atividade:',
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
      .map(
        (valor) =>
          String(
            valor
          ).padStart(
            2,
            '0'
          )
      )
      .join(':')
  }

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

  return (
    <>
      <div className="analista-header">
        <div>
          <h1>
            Minha Jornada
          </h1>

          <p>
            Registre e acompanhe
            suas atividades do dia.
          </p>
        </div>

        
      </div>

      <div className="analista-jornada-grid">
        <section className="analista-card analista-jornada-principal">
          <div className="analista-jornada-titulo">
            <span>
              📋
            </span>

            <h2>
              Atividade atual
            </h2>
          </div>

          {atividadeEmAndamento ? (
            <div className="analista-jornada-vazia">
              <div className="analista-jornada-icone">
                🖥️
              </div>

              <h3>
                {atividadeManual}
              </h3>

              <p>
                {descricaoManual}
              </p>

              <strong>
                {formatarTempo(
                  segundos
                )}
              </strong>

              <div>
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
          ) : (
            <>
              <div className="analista-jornada-vazia">
                <div className="analista-jornada-icone">
                  🖥️
                </div>

                <h3>
                  Nenhuma atividade
                  em andamento
                </h3>

                <p>
                  Registre uma
                  atividade manual.
                </p>
              </div>

              <div className="analista-jornada-divisor" />

              <div className="analista-jornada-manual">
                <div className="analista-jornada-titulo">
                  <span>
                    ✏️
                  </span>

                  <h3>
                    Atividade manual
                  </h3>
                </div>

                <div className="analista-jornada-formulario">
                  <select
                    value={
                      atividadeManual
                    }
                    onChange={(
                      event
                    ) =>
                      setAtividadeManual(
                        event.target
                          .value
                      )
                    }
                  >
                    <option value="">
                      Selecione uma
                      atividade
                    </option>

                    <option value="Atendimento emergencial">
                      Atendimento
                      emergencial
                    </option>

                    <option value="Reunião">
                      Reunião
                    </option>

                    <option value="Organização do setor">
                      Organização do
                      setor
                    </option>

                    <option value="Treinamento / Estudo">
                      Treinamento /
                      Estudo
                    </option>

                    <option value="Deslocamento">
                      Deslocamento
                    </option>

                    <option value="Aguardando terceiro">
                      Aguardando
                      terceiro
                    </option>

                    <option value="Pausa">
                      Pausa
                    </option>

                    <option value="Outros">
                      Outros
                    </option>
                  </select>

                  <label>
                    O que você está
                    fazendo?
                  </label>

                  <textarea
                    placeholder="Descreva resumidamente a atividade"
                    value={
                      descricaoManual
                    }
                    onChange={(
                      event
                    ) =>
                      setDescricaoManual(
                        event.target
                          .value
                      )
                    }
                  />

                  {erroAtividade && (
                    <div className="jornada-erro">
                      {
                        erroAtividade
                      }
                    </div>
                  )}

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

        <section className="analista-card analista-jornada-historico">
          <div className="analista-jornada-titulo analista-jornada-titulo-linha">
            <div>
              <span>
                📅
              </span>

              <h2>
                Atividades de hoje
              </h2>
            </div>

            <small>
              {new Date()
                .toLocaleDateString(
                  'pt-BR'
                )}
            </small>
          </div>

          {registrosHoje.length ===
          0 ? (
            <div className="analista-jornada-registros-vazio">
              Nenhuma atividade
              registrada hoje.
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
                    <div>
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

                    <strong>
                      {formatarTempo(
                        Math.round(
                          Number(
                            registro
                              .duracaoMinutos ??
                              0
                          ) * 60
                        )
                      )}
                    </strong>
                  </div>
                )
              )}
            </div>
          )}

          <div className="analista-jornada-total">
            <span>
              ⏱ Total de hoje
            </span>

            <strong>
              {formatarTempo(
                Math.round(
                  totalMinutosHoje *
                    60
                )
              )}
            </strong>
          </div>
        </section>
      </div>
    </>
  )
}

export default JornadaAnalista