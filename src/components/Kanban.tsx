import { useState,useRef } from 'react'
import type { DragEvent } from 'react'


import '../styles/Kanban.css'
import type { Tarefa } from '../types/Tarefas'

type KanbanProps = {
  tarefas: Tarefa[]

  onAlterarStatus: (
    id: number,
    novoStatus: string
  ) => void

  onAbrirTarefa: (
    tarefa: Tarefa
  ) => void

  modo?: 'analista' | 'estagiario'

  onIniciarTarefa?: (
    tarefa: Tarefa
  ) => void
}

const colunas = [
  'Nova',
  'Em análise',
  'Planejada',
  'Em andamento',
  'Aguardando terceiro',
  'Aguardando solicitante',
  'Bloqueada',
  'Concluída',
]

function Kanban({
  tarefas,
  onAlterarStatus,
  onAbrirTarefa,
  modo = 'analista',
  onIniciarTarefa,
}: KanbanProps) {
  const [
    colunaSobre,
    setColunaSobre,
  ] = useState<string | null>(null)

  const [
    tarefaArrastando,
    setTarefaArrastando,
  ] = useState<number | null>(null)

 function iniciarArraste(
  event: DragEvent<HTMLDivElement>,
  tarefaId: number
) {
  const id = Number(tarefaId)

  event.dataTransfer.setData(
    'text/plain',
    String(id)
  )

  event.dataTransfer.effectAllowed = 'move'

  setTarefaArrastando(id)

  console.log(
    'ARRASTANDO TAREFA:',
    id
  )
}

  function finalizarArraste() {
    setTarefaArrastando(null)
    setColunaSobre(null)
  }

  function permitirSoltar(
    event: DragEvent<HTMLDivElement>,
    status: string
  ) {
    event.preventDefault()

    event.dataTransfer.dropEffect =
      'move'

    setColunaSobre(status)
  }

  function sairDaColuna(
    event: DragEvent<HTMLDivElement>
  ) {
    const destinoRelacionado =
      event.relatedTarget as Node | null

    if (
      destinoRelacionado &&
      event.currentTarget.contains(
        destinoRelacionado
      )
    ) {
      return
    }

    setColunaSobre(null)
  }

  function soltarTarefa(
  event: DragEvent<HTMLDivElement>,
  novoStatus: string
) {
  event.preventDefault()

  const valorRecebido =
    event.dataTransfer.getData(
      'text/plain'
    )

  const tarefaId =
    Number(valorRecebido)

  console.log(
    'SOLTOU:',
    {
      tarefaId,
      novoStatus,
      valorRecebido,
    }
  )

  if (!tarefaId) {
    console.error(
      'ID da tarefa não foi recebido no drop'
    )

    finalizarArraste()

    return
  }

  const tarefa =
    tarefas.find(
      (item) =>
        Number(item.id) === tarefaId
    )

  console.log(
    'TAREFA ENCONTRADA:',
    tarefa
  )

  if (!tarefa) {
    console.error(
      'Tarefa não encontrada no array'
    )

    finalizarArraste()

    return
  }

  if (
    tarefa.status !== novoStatus
  ) {
    console.log(
      'ALTERANDO STATUS:',
      tarefa.status,
      '→',
      novoStatus
    )

    onAlterarStatus(
      tarefaId,
      novoStatus
    )
  }

  finalizarArraste()
}

const kanbanRef =
  useRef<HTMLDivElement | null>(null)

const [
  arrastandoQuadro,
  setArrastandoQuadro,
] = useState(false)

const inicioArraste =
  useRef({
    x: 0,
    y: 0,
    scrollLeft: 0,
    scrollTop: 0,
  })

function iniciarArrasteQuadro(
  event: React.MouseEvent<HTMLDivElement>
) {
  const alvo =
    event.target as HTMLElement

  /*
   * Não arrasta o quadro quando
   * clicar em botão, select,
   * input ou cartão.
   */
  if (
    alvo.closest('button') ||
    alvo.closest('select') ||
    alvo.closest('input') ||
    alvo.closest('textarea') ||
    alvo.closest('.kanban-card')
  ) {
    return
  }

  const elemento =
    kanbanRef.current

  if (!elemento) {
    return
  }

  setArrastandoQuadro(true)

  inicioArraste.current = {
    x: event.clientX,
    y: event.clientY,

    scrollLeft:
      elemento.scrollLeft,

    scrollTop:
      elemento.scrollTop,
  }
}

function moverQuadro(
  event: React.MouseEvent<HTMLDivElement>
) {
  if (!arrastandoQuadro) {
    return
  }

  const elemento =
    kanbanRef.current

  if (!elemento) {
    return
  }

  const deslocamentoX =
    event.clientX -
    inicioArraste.current.x

  const deslocamentoY =
    event.clientY -
    inicioArraste.current.y

  elemento.scrollLeft =
    inicioArraste.current.scrollLeft -
    deslocamentoX

  elemento.scrollTop =
    inicioArraste.current.scrollTop -
    deslocamentoY
}

function finalizarArrasteQuadro() {
  setArrastandoQuadro(false)
}

  return (
  <div
    ref={kanbanRef}

    className={`kanban ${
      arrastandoQuadro
        ? 'kanban-arrastando'
        : ''
    }`}

    onMouseDown={
      iniciarArrasteQuadro
    }

    onMouseMove={
      moverQuadro
    }

    onMouseUp={
      finalizarArrasteQuadro
    }

    onMouseLeave={
      finalizarArrasteQuadro
    }
  >
      {colunas.map((coluna) => {
        const tarefasDaColuna =
          tarefas.filter(
            (tarefa) =>
              tarefa.status === coluna
          )

        const classeColuna =
          coluna
            .toLowerCase()
            .normalize('NFD')
            .replace(
              /[\u0300-\u036f]/g,
              ''
            )
            .replace(/\s+/g, '-')

        const colunaEstaAtiva =
          colunaSobre === coluna

        return (
          <div
            key={coluna}
            className={`
              kanban-coluna
              coluna-${classeColuna}
              ${
                colunaEstaAtiva
                  ? 'kanban-coluna-destino'
                  : ''
              }
            `}
            onDragOver={(event) =>
              permitirSoltar(
                event,
                coluna
              )
            }
            onDragLeave={
              sairDaColuna
            }
            onDrop={(event) =>
              soltarTarefa(
                event,
                coluna
              )
            }
          >
            <div className="kanban-coluna-header">
              <h3>
                {coluna}
              </h3>

              <span
                className={`contador-${classeColuna}`}
              >
                {
                  tarefasDaColuna.length
                }
              </span>
            </div>

            <div className="kanban-coluna-conteudo">
              {tarefasDaColuna.length ===
              0 ? (
                <div className="kanban-vazio">
                  <span>
                    📭
                  </span>

                  <p>
                    Nenhuma tarefa
                  </p>
                </div>
              ) : (
                tarefasDaColuna.map(
                  (tarefa) => {
                    const prioridadeClasse =
                      tarefa.prioridade
                        .toLowerCase()
                        .normalize(
                          'NFD'
                        )
                        .replace(
                          /[\u0300-\u036f]/g,
                          ''
                        )

                    const estaArrastando =
                      tarefaArrastando ===
                      tarefa.id

                    return (
                      <div
                        key={
                          tarefa.id
                        }
                        className={`
                          tarefa-card
                          prioridade-${prioridadeClasse}
                          ${
                            estaArrastando
                              ? 'tarefa-arrastando'
                              : ''
                          }
                        `}
                        draggable
                        onDragStart={(
                          event
                        ) =>
                          iniciarArraste(
                            event,
                            tarefa.id
                          )
                        }
                        onDragEnd={
                          finalizarArraste
                        }
                        onClick={() =>
                          onAbrirTarefa(
                            tarefa
                          )
                        }
                      >
                        <span className="tarefa-id">
                          #
                          {
                            tarefa.id
                          }
                        </span>

                        <h4>
                          {
                            tarefa.titulo
                          }
                        </h4>

                        <div className="tarefa-info">
                          <span>
                            {tarefa.responsavel ||
                              'Sem responsável'}
                          </span>

                          <span>
                            Prazo:{' '}
                            {
                              tarefa.prazo
                            }
                          </span>
                        </div>

                        <span
                          className={`
                            prioridade-badge
                            prioridade-${prioridadeClasse}
                          `}
                        >
                          {
                            tarefa.prioridade
                          }
                        </span>

                        {modo ===
                        'analista' ? (
                          <select
                            value={
                              tarefa.status
                            }
                            onClick={(
                              event
                            ) =>
                              event.stopPropagation()
                            }
                            onMouseDown={(
                              event
                            ) =>
                              event.stopPropagation()
                            }
                            onChange={(
                              event
                            ) =>
                              onAlterarStatus(
                                tarefa.id,
                                event
                                  .target
                                  .value
                              )
                            }
                          >
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
                        ) : (
                          <span className="status-estagiario">
                            {
                              tarefa.status
                            }
                          </span>
                        )}

                        {modo ===
                          'estagiario' &&
                          onIniciarTarefa && (
                            <button
                              type="button"
                              className="botao-iniciar-tarefa"
                              onClick={(
                                event
                              ) => {
                                event.stopPropagation()

                                onIniciarTarefa(
                                  tarefa
                                )
                              }}
                            >
                              Iniciar tarefa
                            </button>
                          )}

                        <span className="tarefa-ver-detalhes">
                          Ver detalhes →
                        </span>
                      </div>
                    )
                  }
                )
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Kanban