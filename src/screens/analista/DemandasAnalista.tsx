import { useState } from 'react'
import {criarTarefa,buscarTarefaPorId,alterarStatusTarefa,} from '../../services/api'
import type { Tarefa } from '../../types/Tarefas'
import type {NovaDemanda} from '../../Modal/NovaDemandaModal'
import {adicionarComentario as adicionarComentarioApi,
} from '../../services/api'
import NovaDemandaModal from '../../Modal/NovaDemandaModal'
import DetalhesDemandaModal from '../../Modal/DetalhesDemandaModal'
import {adicionarRegistroTempo} from '../../services/api'
import type {NovoApontamentoManual} from '../../Modal/ApontamentoManualModal'
import type { UsuarioLogado,} from '../../services/api'

type DemandasAnalistaProps = {
  tarefas: Tarefa[]
  usuario: UsuarioLogado
  setTarefas: React.Dispatch<
    React.SetStateAction<Tarefa[]>
  >
}

function DemandasAnalista({
  tarefas,
  setTarefas,
  usuario,
}: DemandasAnalistaProps) {
  const [
    modalNovaAberto,
    setModalNovaAberto,
  ] = useState(false)

  const [
    tarefaSelecionada,
    setTarefaSelecionada,
  ] = useState<Tarefa | null>(null)

  const [busca, setBusca] =
    useState('')

  const [statusFiltro, setStatusFiltro] =
    useState('Todos')

  const [
    prioridadeFiltro,
    setPrioridadeFiltro,
  ] = useState('Todas')

 async function adicionarTarefa(
  novaDemanda: NovaDemanda
) {
  try {
    const resposta =
      await criarTarefa(
        novaDemanda
      )

    const tarefaCriada: Tarefa = {
      id: resposta.tarefa.id,

      titulo:
        novaDemanda.titulo,

      descricao:
        novaDemanda.descricao,

      solicitante:
        novaDemanda.solicitante,

      setor:
        novaDemanda.setor,

      categoria:
        novaDemanda.categoria,

      prioridade:
        novaDemanda.prioridade,

      responsavel:
        novaDemanda.responsavel,

      prazo:
        novaDemanda.prazo,

      tempoPrevisto:
        novaDemanda.tempoPrevisto,

      status:
        resposta.tarefa.status,

      comentarios: [],

      registrosTempo: [],
    }

    setTarefas(
      (tarefasAtuais) => [
        tarefaCriada,
        ...tarefasAtuais,
      ]
    )

    setModalNovaAberto(false)
  } catch (erro) {
    console.error(
      'Erro ao criar demanda:',
      erro
    )
  }
}

async function adicionarApontamento(
  tarefaId: number,
  apontamento: NovoApontamentoManual
) {
  try {
    await adicionarRegistroTempo(
      tarefaId,
      apontamento,
      usuario.id,
    )

    const resposta =
      await buscarTarefaPorId(
        tarefaId
      )

    setTarefaSelecionada(
      resposta.tarefa
    )

    setTarefas(
      (tarefasAtuais) =>
        tarefasAtuais.map(
          (tarefa) =>
            Number(tarefa.id) ===
            tarefaId
              ? {
                  ...tarefa,
                  registrosTempo:
                    resposta.tarefa
                      .registrosTempo,
                }
              : tarefa
        )
    )
  } catch (erro) {
    console.error(
      'Erro ao adicionar apontamento:',
      erro
    )
  }
}

async function abrirTarefa(
  tarefa: Tarefa
) {
  try {
    const resposta =
      await buscarTarefaPorId(
        Number(tarefa.id)
      )

    setTarefaSelecionada(
      resposta.tarefa
    )
  } catch (erro) {
    console.error(
      'Erro ao abrir tarefa:',
      erro
    )
  }
}

async function alterarStatus(
  id: number,
  novoStatus: string
) {
  const tarefaAtual =
    tarefas.find(
      (tarefa) =>
        Number(tarefa.id) ===
        Number(id)
    )

  if (!tarefaAtual) {
    return
  }

  const statusAnterior =
    tarefaAtual.status

  // altera imediatamente na tela
  setTarefas(
    (tarefasAtuais) =>
      tarefasAtuais.map(
        (tarefa) =>
          Number(tarefa.id) ===
          Number(id)
            ? {
                ...tarefa,
                status: novoStatus,
              }
            : tarefa
      )
  )

  try {
    await alterarStatusTarefa(
      Number(id),
      novoStatus,
      usuario.id,
    )
  } catch (erro) {
    console.error(
      'Erro ao alterar status:',
      erro
    )

    // se o banco falhar,
    // volta para o status anterior
    setTarefas(
      (tarefasAtuais) =>
        tarefasAtuais.map(
          (tarefa) =>
            Number(tarefa.id) ===
            Number(id)
              ? {
                  ...tarefa,
                  status:
                    statusAnterior,
                }
              : tarefa
        )
    )
  }
}

  async function adicionarComentario(
  id: number,
  texto: string
) {
  try {
    const resposta =
      await adicionarComentarioApi(
        id,
        texto,
        usuario.id,
      )

    const novoComentario = {
      id: Number(
        resposta.comentario.id
      ),

      autor:
        resposta.comentario.autor,

      texto:
        resposta.comentario.texto,

      horario:
        new Date(
          resposta.comentario.criadoEm
        ).toLocaleTimeString(
          'pt-BR',
          {
            hour: '2-digit',
            minute: '2-digit',
          }
        ),
    }

    setTarefas(
      (tarefasAtuais) =>
        tarefasAtuais.map(
          (tarefa) =>
            Number(tarefa.id) === id
              ? {
                  ...tarefa,
                  comentarios: [
                    ...(tarefa.comentarios ?? []),
                    novoComentario,
                  ],
                }
              : tarefa
        )
    )

    setTarefaSelecionada(
      (tarefaAtual) => {
        if (
          !tarefaAtual ||
          Number(tarefaAtual.id) !== id
        ) {
          return tarefaAtual
        }

        return {
          ...tarefaAtual,

          comentarios: [
            ...(tarefaAtual.comentarios ?? []),
            novoComentario,
          ],
        }
      }
    )
  } catch (erro) {
    console.error(
      'Erro ao adicionar comentário:',
      erro
    )
  }
}

  const tarefasFiltradas =
    tarefas.filter(
      (tarefa) => {
        const termo =
          busca.toLowerCase()

        const correspondeBusca =
          !busca ||
          tarefa.titulo
            .toLowerCase()
            .includes(termo) ||
          tarefa.solicitante
            .toLowerCase()
            .includes(termo) ||
          tarefa.responsavel
            .toLowerCase()
            .includes(termo)

        const correspondeStatus =
          statusFiltro ===
            'Todos' ||
          tarefa.status ===
            statusFiltro

        const correspondePrioridade =
          prioridadeFiltro ===
            'Todas' ||
          tarefa.prioridade ===
            prioridadeFiltro

        return (
          correspondeBusca &&
          correspondeStatus &&
          correspondePrioridade
        )
      }
    )

  return (
    <>
      <div className="analista-header">
        <div>
          <h1>Demandas</h1>

          <p>
            Gerencie, distribua e
            acompanhe as demandas do
            setor de TI.
          </p>
        </div>
      </div>

      <section className="analista-demandas-topo">
        <div className="analista-demandas-busca">
          <input
            type="text"
            placeholder="Buscar por título, solicitante ou responsável..."
            value={busca}
            onChange={(event) =>
              setBusca(
                event.target.value
              )
            }
          />
        </div>

        <select
          value={statusFiltro}
          onChange={(event) =>
            setStatusFiltro(
              event.target.value
            )
          }
        >
          <option>
            Todos
          </option>

          <option>
            Nova
          </option>

          <option>
            Em análise
          </option>

          <option>
            Planejada
          </option>

          <option>
            Em andamento
          </option>

          <option>
            Aguardando terceiro
          </option>

          <option>
            Aguardando solicitante
          </option>

          <option>
            Bloqueada
          </option>

          <option>
            Concluída
          </option>
        </select>

        <select
          value={
            prioridadeFiltro
          }
          onChange={(event) =>
            setPrioridadeFiltro(
              event.target.value
            )
          }
        >
          <option>
            Todas
          </option>

          <option>
            Baixa
          </option>

          <option>
            Média
          </option>

          <option>
            Alta
          </option>

          <option>
            Crítica
          </option>
        </select>

        <button
          type="button"
          className="analista-nova-demanda"
          onClick={() =>
            setModalNovaAberto(
              true
            )
          }
        >
          + Nova demanda
        </button>
      </section>

      <section className="analista-card analista-demandas-card">
        <div className="analista-demandas-card-header">
          <div>
            <h2>
              Todas as demandas
            </h2>

            <span>
              {
                tarefasFiltradas.length
              }{' '}
              {tarefasFiltradas.length ===
              1
                ? 'demanda encontrada'
                : 'demandas encontradas'}
            </span>
          </div>
        </div>

        {tarefasFiltradas.length ===
        0 ? (
          <div className="analista-demandas-vazio">
            <div>
              📋
            </div>

            <h3>
              Nenhuma demanda
              encontrada
            </h3>

            <p>
              Crie uma nova demanda
              ou altere os filtros.
            </p>
          </div>
        ) : (
          <div className="analista-demandas-lista">
            {tarefasFiltradas.map(
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

                return (
                  <div
                    key={tarefa.id}
                    className="analista-demanda-item"
                    onClick={() =>
                      abrirTarefa(tarefa)
                    }
                  >
                    <div className="analista-demanda-principal">
                      <span className="analista-demanda-id">
                        #{tarefa.id}
                      </span>

                      <div>
                        <strong>
                          {
                            tarefa.titulo
                          }
                        </strong>

                        <span>
                          {
                            tarefa.categoria
                          }
                        </span>
                      </div>
                    </div>

                    <div className="analista-demanda-coluna">
                      <span>
                        Solicitante
                      </span>

                      <strong>
                        {
                          tarefa.solicitante
                        }
                      </strong>
                    </div>

                    <div className="analista-demanda-coluna">
                      <span>
                        Responsável
                      </span>

                      <strong>
                        {tarefa.responsavel ||
                          'Sem responsável'}
                      </strong>
                    </div>

                    <div className="analista-demanda-coluna">
                      <span>
                        Prazo
                      </span>

                      <strong>
                        {tarefa.prazo ||
                          '-'}
                      </strong>
                    </div>

                    <span
                      className={`analista-prioridade prioridade-${prioridadeClasse}`}
                    >
                      {
                        tarefa.prioridade
                      }
                    </span>

                    <select
                      value={
                        tarefa.status
                      }
                      onClick={(
                        event
                      ) =>
                        event.stopPropagation()
                      }
                      onChange={(
                        event
                      ) => {
                        event.stopPropagation()

                        alterarStatus(
                          tarefa.id,
                          event.target
                            .value
                        )
                      }}
                    >
                      <option>
                        Nova
                      </option>

                      <option>
                        Em análise
                      </option>

                      <option>
                        Planejada
                      </option>

                      <option>
                        Em andamento
                      </option>

                      <option>
                        Aguardando terceiro
                      </option>

                      <option>
                        Aguardando solicitante
                      </option>

                      <option>
                        Bloqueada
                      </option>

                      <option>
                        Concluída
                      </option>
                    </select>

                    <button
                      type="button"
                      className="analista-demanda-ver"
                    >
                      Ver →
                    </button>
                  </div>
                )
              }
            )}
          </div>
        )}
      </section>

      {modalNovaAberto && (
        <NovaDemandaModal
          aberto={
            modalNovaAberto
          }
          onFechar={() =>
            setModalNovaAberto(
              false
            )
          }
          onSalvar={
            adicionarTarefa
          }
        />
      )}

      {tarefaSelecionada && (
        <DetalhesDemandaModal
          tarefa={
            tarefaSelecionada
          }
          onFechar={() =>
            setTarefaSelecionada(
              null
            )
          }
          onAdicionarComentario={
            adicionarComentario
          }
          onAdicionarApontamento={(adicionarApontamento)}
        />
      )}
    </>
  )
}

export default DemandasAnalista