import type {
  NovaDemanda,
} from '../Modal/NovaDemandaModal'
import type {
  NovoApontamentoManual,
} from '../Modal/ApontamentoManualModal'

const API_URL = import.meta.env.VITE_API_URL

  console.log(
  'API usada pelo frontend:',
  API_URL
)

export type UsuarioLogado = {
  id: number
  nome: string
  email: string
  perfil: string
  setor: string
  salaId: number | null
}

export async function buscarTarefas() {
  const resposta = await fetch(
    `${API_URL}/tarefas`
  )

  if (!resposta.ok) {
    throw new Error(
      'Erro ao buscar tarefas'
    )
  }

  const dados = await resposta.json()

  return dados.map((tarefa: any) => ({
    ...tarefa,

    id: Number(tarefa.id),

    tempoPrevisto:
      tarefa.tempo_previsto !== null
        ? Number(tarefa.tempo_previsto)
        : 0,
  }))
}

export type UsuarioSistema = {
  id: number
  nome: string
  email: string
  perfil:
    | 'analista'
    | 'estagiario'
    | 'direcao'
  setor: string
  ativo: boolean
}

export async function buscarUsuarios() {
  const resposta = await fetch(
    `${API_URL}/usuarios`
  )

  if (!resposta.ok) {
    const erro =
      await resposta.json()

    throw new Error(
      erro.mensagem ||
        'Erro ao buscar usuários'
    )
  }

  const dados =
    await resposta.json()

  return (
    dados.usuarios ?? []
  ).map((usuario: any) => ({
    ...usuario,
    id: Number(usuario.id),
  })) as UsuarioSistema[]
}

export type NovoUsuario = {
  nome: string
  email: string
  senha: string
  perfil: 'analista' | 'estagiario' | 'direcao'
  setor: string
}

export async function criarUsuario(
  novoUsuario: NovoUsuario
) {
  const resposta = await fetch(
    `${API_URL}/usuarios`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoUsuario),
    }
  )

  const dados = await resposta.json()

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem ||
        'Erro ao criar usuário'
    )
  }

  return {
    ...dados.usuario,
    id: Number(dados.usuario.id),
  } as UsuarioSistema
}

export async function adicionarRegistroTempo(
  tarefaId: number,
  apontamento: NovoApontamentoManual,
  usuarioId: number
) {
  const [horaInicio, minutoInicio] =
    apontamento.inicio
      .split(':')
      .map(Number)

  const [horaFim, minutoFim] =
    apontamento.fim
      .split(':')
      .map(Number)

  const inicioEmMinutos =
    horaInicio * 60 +
    minutoInicio

  const fimEmMinutos =
    horaFim * 60 +
    minutoFim

  const duracaoMinutos =
    fimEmMinutos -
    inicioEmMinutos

  if (duracaoMinutos <= 0) {
    throw new Error(
      'O horário de fim deve ser maior que o horário de início.'
    )
  }

  const inicioCompleto =
    `${apontamento.data}T${apontamento.inicio}:00`

  const fimCompleto =
    `${apontamento.data}T${apontamento.fim}:00`

  const resposta = await fetch(
    `${API_URL}/tarefas/${tarefaId}/tempo`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        usuarioId,

        data:
          apontamento.data,

        inicio:
          inicioCompleto,

        fim:
          fimCompleto,

        duracaoMinutos,

        acao:
          apontamento.acao,

        origem:
          'Manual',

        justificativa:
          apontamento.justificativa,
      }),
    }
  )

  if (!resposta.ok) {
    const erro =
      await resposta.json()

    throw new Error(
      erro.mensagem ||
        'Erro ao registrar tempo'
    )
  }

  return resposta.json()
}

export async function adicionarComentario(
  tarefaId: number,
  texto: string,
  usuarioId: number
) {
  const resposta = await fetch(
    `${API_URL}/tarefas/${tarefaId}/comentarios`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texto,
        usuarioId,
      }),
    }
  )

  if (!resposta.ok) {
    const erro = await resposta.json()

    throw new Error(
      erro.mensagem ||
        'Erro ao adicionar comentário'
    )
  }

  return resposta.json()
}

export async function buscarRegistrosTempoHoje(
  usuarioId: number
) {
  const resposta = await fetch(
    `${API_URL}/tarefas/usuarios/${usuarioId}/tempo/hoje`
  )

  if (!resposta.ok) {
    const erro =
      await resposta.json()

    throw new Error(
      erro.mensagem ||
        'Erro ao buscar registros de tempo'
    )
  }

  const dados =
    await resposta.json()

  return (
    dados.registros ?? []
  ).map((registro: any) => ({
    id: Number(registro.id),

    usuarioId: Number(
      registro.usuario_id
    ),

    tarefaId:
      registro.tarefa_id !== null
        ? Number(
            registro.tarefa_id
          )
        : null,

    data: registro.data,

    inicio:
      registro.inicio,

    fim:
      registro.fim,

    duracaoMinutos:
      Number(
        registro.duracao_minutos ??
          0
      ),

    acao:
      registro.acao,

    origem:
      registro.origem,

    justificativa:
      registro.justificativa,

    titulo:
      registro.tarefa_titulo ||
      'Atividade manual',
  }))
}

export async function buscarTarefaPorId(
  id: number
) {
  const resposta = await fetch(
    `${API_URL}/tarefas/${id}`
  )

  if (!resposta.ok) {
    const erro = await resposta.json()

    throw new Error(
      erro.mensagem ||
        'Erro ao buscar detalhes da tarefa'
    )
  }

  const dados = await resposta.json()

  return {
    ...dados,

    tarefa: {
      ...dados.tarefa,

      id: Number(
        dados.tarefa.id
      ),

      tempoPrevisto:
        dados.tarefa
          .tempo_previsto !== null
          ? Number(
              dados.tarefa
                .tempo_previsto
            )
          : 0,

      historicoStatus:
  (
    dados.historicoStatus ?? []
  ).map(
    (item: any) => ({
      id: Number(item.id),

      usuario:
        item.usuario ||
        'Sistema',

      statusAnterior:
        item.status_anterior,

      statusNovo:
        item.status_novo,

      criadoEm:
        item.criado_em,
    })
  ),

      comentarios:
        (
          dados.comentarios ?? []
        ).map(
          (comentario: any) => ({
            id: Number(
              comentario.id
            ),

            autor:
              comentario.autor ||
              'Usuário',

            texto:
              comentario.texto,

            horario:
              new Date(
                comentario.criado_em
              ).toLocaleTimeString(
                'pt-BR',
                {
                  hour:
                    '2-digit',
                  minute:
                    '2-digit',
                }
              ),
          })
        ),

      registrosTempo:
        (
          dados.registrosTempo ??
          []
        ).map(
          (registro: any) => ({
            id: Number(
              registro.id
            ),

            usuario:
              registro.usuario ||
              'Usuário',

            data:
              registro.data,

            inicio:
              registro.inicio,

            fim:
              registro.fim,

            duracaoMinutos:
              Number(
                registro.duracao_minutos ??
                  0
              ),

            acao:
              registro.acao,

            origem:
              registro.origem,

            justificativa:
              registro.justificativa,
          })
        ),
    },

    historicoStatus:
      dados.historicoStatus ?? [],
  }
}

export async function fazerLogin(
  email: string,
  senha: string
) {
  const resposta = await fetch(
    `${API_URL}/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        email,
        senha,
      }),
    }
  )

  if (!resposta.ok) {
    const erro =
      await resposta.json()

    throw new Error(
      erro.mensagem ||
        'Erro ao realizar login'
    )
  }

  const dados =
    await resposta.json()

  return {
    ...dados,
    usuario: {
      ...dados.usuario,
      id: Number(
        dados.usuario.id
      ),
      usuario: {
  ...dados.usuario,
  id: Number(
    dados.usuario.id
  ),
  salaId:
    dados.usuario.salaId !== null &&
    dados.usuario.salaId !== undefined
      ? Number(
          dados.usuario.salaId
        )
      : null,
},
    },
  }
}

export async function adicionarRegistroTempoManual(
  apontamento: {
    data: string
    inicio: string
    fim: string
    duracaoMinutos: number
    acao: string
    justificativa: string
  },
  usuarioId: number
) {
  const resposta = await fetch(
    `${API_URL}/tarefas/tempo/manual`,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        usuarioId,
        data: apontamento.data,
        inicio: apontamento.inicio,
        fim: apontamento.fim,
        duracaoMinutos:
          apontamento.duracaoMinutos,
        acao: apontamento.acao,
        justificativa:
          apontamento.justificativa,
      }),
    }
  )

  if (!resposta.ok) {
    const erro =
      await resposta.json()

    throw new Error(
      erro.mensagem ||
        'Erro ao registrar atividade manual'
    )
  }

  return resposta.json()
}

export type AtividadeAtiva = {
  id: number
  usuarioId: number
  usuarioNome: string
  perfil: string
  setor: string
  tarefaId: number | null
  tarefaTitulo: string | null
  atividade: string
  descricao: string | null
  iniciadaEm: string
  pausado: boolean
  pausaIniciadaEm: string | null
  totalPausadoSegundos: number
  tempoAtivoSegundos: number
}

export async function buscarAtividadesAtivas() {
  const resposta = await fetch(
    `${API_URL}/jornada/ativas`
  )

  if (!resposta.ok) {
    const erro = await resposta.json()

    throw new Error(
      erro.mensagem ||
        'Erro ao buscar atividades ativas'
    )
  }

  const dados = await resposta.json()

  return (dados.atividades ?? []).map(
    (atividade: any) => ({
      id: Number(atividade.id),

      usuarioId: Number(
        atividade.usuario_id
      ),

      usuarioNome:
        atividade.usuario_nome,

      perfil:
        atividade.perfil,

      setor:
        atividade.setor,

      tarefaId:
        atividade.tarefa_id
          ? Number(
              atividade.tarefa_id
            )
          : null,

      tarefaTitulo:
        atividade.tarefa_titulo,

      atividade:
        atividade.atividade,

      descricao:
        atividade.descricao,

      iniciadaEm:
        atividade.iniciada_em,

      pausado:
        atividade.pausado,

      pausaIniciadaEm:
        atividade.pausa_iniciada_em,

      totalPausadoSegundos:
        Number(
          atividade.total_pausado_segundos
        ),

      tempoAtivoSegundos:
        Number(
          atividade.tempo_ativo_segundos
        ),
    })
  ) as AtividadeAtiva[]
}

export async function alterarStatusTarefa(
  id: number,
  status: string,
  usuarioId: number
) {
  const resposta = await fetch(
    `${API_URL}/tarefas/${id}/status`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        status,
        usuarioId,
      }),
    }
  )

  if (!resposta.ok) {
    const erro =
      await resposta.json()

    throw new Error(
      erro.mensagem ||
        'Erro ao alterar status da tarefa'
    )
  }

  return resposta.json()
}

export async function criarTarefa(
  demanda: NovaDemanda
) {
  const resposta = await fetch(
    `${API_URL}/tarefas`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify(
        demanda
      ),
    }
  )

  if (!resposta.ok) {
    const erro =
      await resposta.json()

    throw new Error(
      erro.mensagem ||
        'Erro ao criar tarefa'
    )
  }

  const dados = await resposta.json()

return {
  ...dados,

  tarefa: {
    ...dados.tarefa,

    id: Number(dados.tarefa.id),
  },
}
}
export async function iniciarAtividadeJornada(
  dados: {
    usuarioId: number
    tarefaId?: number | null
    atividade: string
    descricao?: string | null
  }
) {
  const resposta = await fetch(
    `${API_URL}/jornada/iniciar`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    }
  )

  const retorno = await resposta.json()

  if (!resposta.ok) {
    throw new Error(
      retorno.mensagem ||
        'Erro ao iniciar atividade.'
    )
  }

  return retorno.atividade
}

export async function pausarAtividadeJornada(
  usuarioId: number
) {
  const resposta = await fetch(
    `${API_URL}/jornada/pausar`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuarioId,
      }),
    }
  )

  const retorno = await resposta.json()

  if (!resposta.ok) {
    throw new Error(
      retorno.mensagem ||
        'Erro ao pausar atividade.'
    )
  }

  return retorno.atividade
}

export async function retomarAtividadeJornada(
  usuarioId: number
) {
  const resposta = await fetch(
    `${API_URL}/jornada/retomar`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuarioId,
      }),
    }
  )

  const retorno = await resposta.json()

  if (!resposta.ok) {
    throw new Error(
      retorno.mensagem ||
        'Erro ao retomar atividade.'
    )
  }

  return retorno.atividade
}

export async function concluirAtividadeJornada(
  usuarioId: number
) {
  const resposta = await fetch(
    `${API_URL}/jornada/concluir`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuarioId,
      }),
    }
  )

  const retorno = await resposta.json()

  if (!resposta.ok) {
    throw new Error(
      retorno.mensagem ||
        'Erro ao concluir atividade.'
    )
  }

  return retorno
}

export type ResumoEquipeHoje = {
  usuarioId: number
  usuarioNome: string
  perfil: string
  setor: string
  atividadesHoje: number
  minutosHoje: number
}

export async function buscarResumoEquipeHoje() {
  const resposta = await fetch(
    `${API_URL}/jornada/resumo-hoje`
  )

  const dados = await resposta.json()

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem ||
        'Erro ao buscar resumo da equipe.'
    )
  }

  return (dados.usuarios ?? []).map(
    (item: any) => ({
      usuarioId: Number(
        item.usuario_id
      ),

      usuarioNome:
        item.usuario_nome,

      perfil:
        item.perfil,

      setor:
        item.setor,

      atividadesHoje:
        Number(
          item.atividades_hoje
        ),

      minutosHoje:
        Number(
          item.minutos_hoje
        ),
    })
  ) as ResumoEquipeHoje[]
}

export type Notificacao = {
  id: number
  usuarioId: number
  tarefaId: number | null
  tipo: string
  titulo: string
  mensagem: string
  lida: boolean
  criadoEm: string
  tarefaTitulo: string | null
}

export async function buscarNotificacoes(
  usuarioId: number
) {
  const resposta = await fetch(
    `${API_URL}/notificacoes/usuario/${usuarioId}`
  )

  const dados = await resposta.json()

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem ||
        'Erro ao buscar notificações.'
    )
  }

  return (dados.notificacoes ?? []).map(
    (item: any) => ({
      id: Number(item.id),

      usuarioId: Number(
        item.usuario_id
      ),

      tarefaId:
        item.tarefa_id
          ? Number(item.tarefa_id)
          : null,

      tipo: item.tipo,

      titulo: item.titulo,

      mensagem: item.mensagem,

      lida: Boolean(item.lida),

      criadoEm:
        item.criado_em,

      tarefaTitulo:
        item.tarefa_titulo ?? null,
    })
  ) as Notificacao[]
}

export async function marcarNotificacaoLida(
  notificacaoId: number
) {
  const resposta = await fetch(
    `${API_URL}/notificacoes/${notificacaoId}/lida`,
    {
      method: 'PATCH',
    }
  )

  const dados = await resposta.json()

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem ||
        'Erro ao marcar notificação como lida.'
    )
  }



  return dados.notificacao
}