import { useState } from 'react'

import type {
  Tarefa,
} from '../../types/Tarefas'

import Kanban from '../../components/Kanban'

import DetalhesDemandaModal from '../../Modal/DetalhesDemandaModal'

import {
  alterarStatusTarefa,
  buscarTarefaPorId,
  adicionarComentario as adicionarComentarioApi,
  adicionarRegistroTempo,
  iniciarAtividadeJornada,
} from '../../services/api'

import type {
  UsuarioLogado,
} from '../../services/api'

import type {
  NovoApontamentoManual,
} from '../../Modal/ApontamentoManualModal'

type MinhasDemandasProps = {
  tarefas: Tarefa[]

  setTarefas: React.Dispatch<
    React.SetStateAction<Tarefa[]>
  >

  atividadeAtual: Tarefa | null

  setAtividadeAtual: React.Dispatch<
    React.SetStateAction<Tarefa | null>
  >

  usuario: UsuarioLogado
}

function MinhasDemandas({
  tarefas,
  setTarefas,
  atividadeAtual,
  setAtividadeAtual,
  usuario,
}: MinhasDemandasProps) {
  const [
    tarefaSelecionada,
    setTarefaSelecionada,
  ] = useState<Tarefa | null>(
    null
  )

  const hoje =
    new Date().toLocaleDateString(
      'sv-SE'
    )

  const emAberto =
    tarefas.filter(
      (tarefa) =>
        tarefa.status !==
          'Concluída' &&
        tarefa.status !==
          'Cancelada'
    ).length

  const paraHoje =
    tarefas.filter(
      (tarefa) =>
        tarefa.prazo === hoje &&
        tarefa.status !==
          'Concluída' &&
        tarefa.status !==
          'Cancelada'
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

  const concluidas =
    tarefas.filter(
      (tarefa) =>
        tarefa.status ===
        'Concluída'
    ).length

  async function alterarStatus(
    id: number,
    novoStatus: string
  ) {
    const tarefaAtual =
      tarefas.find(
        (tarefa) =>
          Number(tarefa.id) ===
          id
      )

    if (!tarefaAtual) {
      return
    }

    const statusAnterior =
      tarefaAtual.status

    setTarefas(
      (tarefasAtuais) =>
        tarefasAtuais.map(
          (tarefa) =>
            Number(tarefa.id) ===
            id
              ? {
                  ...tarefa,
                  status:
                    novoStatus,
                }
              : tarefa
        )
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

      setTarefas(
        (tarefasAtuais) =>
          tarefasAtuais.map(
            (tarefa) =>
              Number(
                tarefa.id
              ) === id
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

  async function iniciarTarefa(
    tarefa: Tarefa
  ) {
    /*
     * Primeiro verificamos o
     * estado local.
     */
    if (atividadeAtual) {
      console.warn(
        'Já existe uma atividade em andamento.'
      )

      return
    }

    const tarefaId =
      Number(tarefa.id)

    const statusAnterior =
      tarefa.status

    try {
      /*
       * Primeiro mudamos a
       * demanda para Em andamento.
       */
      await alterarStatusTarefa(
        tarefaId,
        'Em andamento',
        usuario.id
      )

      /*
       * Agora registramos esta
       * atividade na jornada.
       *
       * A partir daqui o Dashboard
       * do Analista conseguirá ver
       * o que o usuário está fazendo.
       */
      await iniciarAtividadeJornada({
        usuarioId:
          usuario.id,

        tarefaId:
          tarefaId,

        atividade:
          tarefa.titulo,

        descricao:
          tarefa.descricao ||
          `Execução da demanda #${tarefaId}`,
      })

      /*
       * Só depois que o backend
       * confirmar atualizamos a
       * interface.
       */
      const tarefaEmAndamento = {
        ...tarefa,
        status:
          'Em andamento',
      }

      setAtividadeAtual(
        tarefaEmAndamento
      )

      setTarefas(
        (tarefasAtuais) =>
          tarefasAtuais.map(
            (item) =>
              Number(item.id) ===
              tarefaId
                ? {
                    ...item,
                    status:
                      'Em andamento',
                  }
                : item
          )
      )
    } catch (erro) {
      console.error(
        'Erro ao iniciar tarefa:',
        erro
      )

      /*
       * Se a jornada não puder
       * iniciar, tentamos devolver
       * o status da tarefa.
       */
      try {
        await alterarStatusTarefa(
          tarefaId,
          statusAnterior,
          usuario.id
        )
      } catch (
        erroRollback
      ) {
        console.error(
          'Erro ao restaurar status:',
          erroRollback
        )
      }

      setAtividadeAtual(
        null
      )

      setTarefas(
        (tarefasAtuais) =>
          tarefasAtuais.map(
            (item) =>
              Number(item.id) ===
              tarefaId
                ? {
                    ...item,
                    status:
                      statusAnterior,
                  }
                : item
          )
      )
    }
  }

  async function adicionarComentario(
    tarefaId: number,
    texto: string
  ) {
    try {
      await adicionarComentarioApi(
        tarefaId,
        texto,
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
              Number(
                tarefa.id
              ) === tarefaId
                ? {
                    ...tarefa,

                    comentarios:
                      resposta
                        .tarefa
                        .comentarios,
                  }
                : tarefa
          )
      )
    } catch (erro) {
      console.error(
        'Erro ao adicionar comentário:',
        erro
      )
    }
  }

  async function adicionarApontamento(
    tarefaId: number,
    apontamento:
      NovoApontamentoManual
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
              Number(
                tarefa.id
              ) === tarefaId
                ? {
                    ...tarefa,

                    registrosTempo:
                      resposta
                        .tarefa
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
      <div className="dashboard-header">
        <div>
          <h1>
            Minhas Demandas
          </h1>

          <p>
            Demandas atribuídas a você
          </p>
        </div>

        <div className="usuario-card">
          <div className="usuario-avatar">
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

      <section className="cards-indicadores">
        <div className="card-indicador">
          <span>
            Em aberto
          </span>

          <strong>
            {emAberto}
          </strong>
        </div>

        <div className="card-indicador">
          <span>
            Para hoje
          </span>

          <strong>
            {paraHoje}
          </strong>
        </div>

        <div className="card-indicador">
          <span>
            Atrasadas
          </span>

          <strong>
            {atrasadas}
          </strong>
        </div>

        <div className="card-indicador">
          <span>
            Concluídas
          </span>

          <strong>
            {concluidas}
          </strong>
        </div>
      </section>

      <section className="dashboard-bloco kanban-bloco">
        <div className="dashboard-bloco-header">
          <h2>
            Demandas atribuídas
          </h2>
        </div>

        <Kanban
          tarefas={tarefas}
          onAlterarStatus={
            alterarStatus
          }
          onAbrirTarefa={
            abrirTarefa
          }
          modo="estagiario"
          onIniciarTarefa={
            iniciarTarefa
          }
        />
      </section>

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
        onAdicionarApontamento={
          adicionarApontamento
        }
      />
    </>
  )
}

export default MinhasDemandas