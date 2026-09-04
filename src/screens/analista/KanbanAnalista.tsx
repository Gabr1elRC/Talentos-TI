import { useState } from 'react'
import {alterarStatusTarefa,buscarTarefaPorId,adicionarRegistroTempo} from '../../services/api'
import type { Tarefa } from '../../types/Tarefas'
import Kanban from '../../components/Kanban'
import DetalhesDemandaModal from '../../Modal/DetalhesDemandaModal'
import type {NovoApontamentoManual,} from '../../Modal/ApontamentoManualModal'
import type {UsuarioLogado,} from '../../services/api'


type KanbanAnalistaProps = {
  tarefas: Tarefa[]

  setTarefas: React.Dispatch<
    React.SetStateAction<Tarefa[]>
  >

  usuario: UsuarioLogado
}
function KanbanAnalista({
  tarefas,
  setTarefas,
  usuario,
}: KanbanAnalistaProps) {
  const [
    tarefaSelecionada,
    setTarefaSelecionada,
  ] = useState<Tarefa | null>(null)

async function alterarStatus(
  id: number,
  novoStatus: string
) {
  const tarefaAtual = tarefas.find(
    (tarefa) =>
      Number(tarefa.id) === id
  )

  if (!tarefaAtual) {
    return
  }

  const statusAnterior =
    tarefaAtual.status

  // muda imediatamente na tela
  setTarefas(
    (tarefasAtuais) =>
      tarefasAtuais.map(
        (tarefa) =>
          Number(tarefa.id) === id
            ? {
                ...tarefa,
                id: Number(tarefa.id),
                status: novoStatus,
              }
            : tarefa
      )
  )

  setTarefaSelecionada(
    (tarefa) => {
      if (
        !tarefa ||
        Number(tarefa.id) !== id
      ) {
        return tarefa
      }

      return {
        ...tarefa,
        id: Number(tarefa.id),
        status: novoStatus,
      }
    }
  )

  try {
    await alterarStatusTarefa(
      id,
      novoStatus,
      usuario.id
    )
  } catch (erro) {
    console.error(
      'Erro ao alterar status:',
      erro
    )

    // se a API falhar, volta o card
    setTarefas(
      (tarefasAtuais) =>
        tarefasAtuais.map(
          (tarefa) =>
            Number(tarefa.id) === id
              ? {
                  ...tarefa,
                  status:
                    statusAnterior,
                }
              : tarefa
        )
    )

    setTarefaSelecionada(
      (tarefa) => {
        if (
          !tarefa ||
          Number(tarefa.id) !== id
        ) {
          return tarefa
        }

        return {
          ...tarefa,
          status:
            statusAnterior,
        }
      }
    )
  }
}

  function adicionarComentario(
    id: number,
    texto: string
  ) {
    const novoComentario = {
      id: Date.now(),
      autor: 'Analista',
      texto,
      horario:
        new Date().toLocaleTimeString(
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
            tarefa.id === id
              ? {
                  ...tarefa,
                  comentarios: [
                    ...tarefa.comentarios,
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
          tarefaAtual.id !== id
        ) {
          return tarefaAtual
        }

        return {
          ...tarefaAtual,
          comentarios: [
            ...tarefaAtual.comentarios,
            novoComentario,
          ],
        }
      }
    )
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

async function adicionarApontamento(
  tarefaId: number,
  apontamento: NovoApontamentoManual
) {
  try {
    await adicionarRegistroTempo(
      tarefaId,
      apontamento,
      usuario.id
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

  return (
    <>
      <div className="analista-header">
        <div>
          <h1>Kanban</h1>

          <p>
            Organize e acompanhe as demandas
            por etapa.
          </p>
        </div>

        <div className="analista-usuario">
          <div className="analista-avatar">
            👤
          </div>

          <div>
            <strong>Analista</strong>
            <span>Setor de TI</span>
          </div>
        </div>
      </div>

      <section className="analista-card analista-kanban-card">
        <div className="analista-kanban-topo">
          <div>
            <h2>
              Fluxo de demandas
            </h2>

            <span>
              Arraste os cards entre as colunas
              para alterar o status.
            </span>
          </div>

          <div className="analista-kanban-total">
            <span>Total</span>
            <strong>
              {tarefas.length}
            </strong>
          </div>
        </div>

        <Kanban
          tarefas={tarefas}
          onAlterarStatus={
            alterarStatus
          }
          onAbrirTarefa={abrirTarefa}
          modo="analista"
        />
      </section>

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

export default KanbanAnalista