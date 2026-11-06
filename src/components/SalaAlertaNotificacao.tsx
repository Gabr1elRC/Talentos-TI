import {
  useEffect,
  useState,
} from 'react'

import {
  buscarNotificacoes,
  marcarNotificacaoLida,
} from '../services/api'

import type {
  Notificacao,
} from '../services/api'

import '../styles/analista/SalaAlertaNotificacao.css'

const API_URL =
  import.meta.env.VITE_API_URL

type Props = {
  usuarioId: number
  salaId: number
}

function SalaAlertaNotificacao({
  usuarioId,
  salaId,
}: Props) {
  const [
    notificacao,
    setNotificacao,
  ] = useState<Notificacao | null>(
    null
  )

  const [
    mostrarSuporte,
    setMostrarSuporte,
  ] = useState(false)

  const [
    descricao,
    setDescricao,
  ] = useState('')

  const [
    enviando,
    setEnviando,
  ] = useState(false)

  const [
    erro,
    setErro,
  ] = useState('')

  async function carregar() {
    try {
      const dados =
        await buscarNotificacoes(
          usuarioId
        )

      const importantes =
        dados.filter(
          (
            item: Notificacao
          ) =>
            !item.lida &&
            (
              item.tipo ===
                'lembrete_sala' ||
              item.tipo ===
                'suporte_sala_status'
            )
        )

      if (
        importantes.length > 0
      ) {
        setNotificacao(
          importantes[0]
        )
      } else {
        setNotificacao(null)
      }
    } catch (erro) {
      console.error(
        'Erro ao buscar alerta da sala:',
        erro
      )
    }
  }

  useEffect(() => {
    carregar()

    const intervalo =
      window.setInterval(
        carregar,
        5000
      )

    return () => {
      window.clearInterval(
        intervalo
      )
    }
  }, [usuarioId])

  async function marcarComoLida() {
    if (!notificacao) {
      return
    }

    await marcarNotificacaoLida(
      notificacao.id
    )

    setNotificacao(null)
    setMostrarSuporte(false)
    setDescricao('')
    setErro('')

    await carregar()
  }

  async function confirmarEntendido() {
    try {
      await marcarComoLida()
    } catch (erro) {
      console.error(
        'Erro ao confirmar notificação:',
        erro
      )
    }
  }

  async function registrarConferencia(
    status: 'OK' | 'SUPORTE'
  ) {
    if (!notificacao) {
      return
    }

    if (
      status === 'SUPORTE' &&
      !descricao.trim()
    ) {
      setErro(
        'Descreva o problema encontrado.'
      )

      return
    }

    try {
      setEnviando(true)
      setErro('')

      const resposta =
        await fetch(
          `${API_URL}/salas/${salaId}/conferencias`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              status,

              descricao:
                status === 'SUPORTE'
                  ? descricao.trim()
                  : null,
            }),
          }
        )

      const dados =
        await resposta.json()

      /*
       * Se a aula já tiver sido
       * conferida, o lembrete não
       * precisa continuar aparecendo.
       */
      if (
        resposta.status === 409
      ) {
        await marcarComoLida()

        return
      }

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
            'Não foi possível registrar a conferência.'
        )
      }

      await marcarComoLida()
    } catch (erro) {
      console.error(
        'Erro ao registrar conferência pelo alerta:',
        erro
      )

      if (
        erro instanceof Error
      ) {
        setErro(
          erro.message
        )
      } else {
        setErro(
          'Não foi possível registrar a conferência.'
        )
      }
    } finally {
      setEnviando(false)
    }
  }

  if (!notificacao) {
    return null
  }

  const ehLembrete =
    notificacao.tipo ===
    'lembrete_sala'

  return (
    <div className="sala-alerta-overlay">

      <div className="sala-alerta-card">

        <div className="sala-alerta-icone">
          {ehLembrete
            ? '🔔'
            : '🛠️'}
        </div>

        <span className="sala-alerta-label">
          {ehLembrete
            ? 'CONFIRMAÇÃO DA SALA'
            : 'ATUALIZAÇÃO DO TI'}
        </span>

        <h2>
          {notificacao.titulo}
        </h2>

        <p>
          {notificacao.mensagem}
        </p>

        {erro && (
          <div className="sala-alerta-erro">
            {erro}
          </div>
        )}

        {ehLembrete ? (
          <>
            {!mostrarSuporte ? (
              <div className="sala-alerta-acoes">

                <button
                  type="button"
                  className="sala-alerta-ok"
                  disabled={enviando}
                  onClick={() =>
                    registrarConferencia(
                      'OK'
                    )
                  }
                >
                  ✓ TUDO OK
                </button>

                <button
                  type="button"
                  className="sala-alerta-suporte"
                  disabled={enviando}
                  onClick={() => {
                    setMostrarSuporte(
                      true
                    )

                    setErro('')
                  }}
                >
                  ⚠ PRECISO DE SUPORTE
                </button>

              </div>
            ) : (
              <div className="sala-alerta-form-suporte">

                <label>
                  Descreva o problema:
                </label>

                <textarea
                  value={descricao}
                  disabled={enviando}
                  autoFocus
                  placeholder="Ex.: computador sem internet, projetor não liga..."
                  onChange={(evento) =>
                    setDescricao(
                      evento.target.value
                    )
                  }
                />

                <div className="sala-alerta-acoes">

                  <button
                    type="button"
                    className="sala-alerta-voltar"
                    disabled={enviando}
                    onClick={() => {
                      setMostrarSuporte(
                        false
                      )

                      setDescricao('')
                      setErro('')
                    }}
                  >
                    Voltar
                  </button>

                  <button
                    type="button"
                    className="sala-alerta-suporte"
                    disabled={enviando}
                    onClick={() =>
                      registrarConferencia(
                        'SUPORTE'
                      )
                    }
                  >
                    {enviando
                      ? 'Enviando...'
                      : '⚠ ENVIAR SUPORTE'}
                  </button>

                </div>

              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={
              confirmarEntendido
            }
          >
            ✓ Entendi
          </button>
        )}

      </div>

    </div>
  )
}

export default SalaAlertaNotificacao