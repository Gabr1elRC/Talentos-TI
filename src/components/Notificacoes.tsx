import {
  useEffect,
  useState,
} from 'react'
import '../styles/Notificacoes.css'
import {
  buscarNotificacoes,
  marcarNotificacaoLida,
} from '../services/api'

import type {
  Notificacao,
} from '../services/api'

type NotificacoesProps = {
  usuarioId: number
}

function Notificacoes({
  usuarioId,
}: NotificacoesProps) {
  const [
    notificacoes,
    setNotificacoes,
  ] = useState<Notificacao[]>([])

  const [
    aberto,
    setAberto,
  ] = useState(false)

  async function carregarNotificacoes() {
    try {
      const dados =
        await buscarNotificacoes(
          usuarioId
        )

      setNotificacoes(dados)
    } catch (erro) {
      console.error(
        'Erro ao carregar notificações:',
        erro
      )
    }
  }

  useEffect(() => {
    carregarNotificacoes()

    const intervalo =
      window.setInterval(
        carregarNotificacoes,
        10000
      )

    return () => {
      window.clearInterval(
        intervalo
      )
    }
  }, [usuarioId])

  const naoLidas =
    notificacoes.filter(
      (item) => !item.lida
    ).length

  async function abrirNotificacao(
    notificacao: Notificacao
  ) {
    if (!notificacao.lida) {
      try {
        await marcarNotificacaoLida(
          notificacao.id
        )

        setNotificacoes(
          (atuais) =>
            atuais.map(
              (item) =>
                item.id ===
                notificacao.id
                  ? {
                      ...item,
                      lida: true,
                    }
                  : item
            )
        )
      } catch (erro) {
        console.error(
          'Erro ao marcar notificação:',
          erro
        )
      }
    }
  }

  return (
    <div className="notificacoes-container">
      <button
        type="button"
        className="notificacoes-botao"
        onClick={() =>
          setAberto(
            (valor) => !valor
          )
        }
      >
        🔔

        {naoLidas > 0 && (
          <span className="notificacoes-contador">
            {naoLidas > 99
              ? '99+'
              : naoLidas}
          </span>
        )}
      </button>

      {aberto && (
        <div className="notificacoes-painel">
          <div className="notificacoes-header">
            <div>
              <strong>
                Notificações
              </strong>

              <span>
                {naoLidas}{' '}
                não lida
                {naoLidas === 1
                  ? ''
                  : 's'}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setAberto(false)
              }
            >
              ✕
            </button>
          </div>

          <div className="notificacoes-lista">
            {notificacoes.length ===
            0 ? (
             <div className="notificacoes-vazio">
              <strong>
                Tudo em dia
              </strong>
2
              <span>
                Você não possui novas notificações.
              </span>
            </div>
            ) : (
              notificacoes.map(
                (notificacao) => (
                  <button
                    type="button"
                    key={
                      notificacao.id
                    }
                   className={
                      notificacao.tipo === 'demanda_critica'
                        ? notificacao.lida
                          ? 'notificacao-item critica'
                          : 'notificacao-item nao-lida critica'
                        : notificacao.lida
                        ? 'notificacao-item'
                        : 'notificacao-item nao-lida'
                    }
                    onClick={() =>
                      abrirNotificacao(
                        notificacao
                      )
                    }
                  >
                   <div className="notificacao-icone">
                    {notificacao.tipo === 'demanda_critica'
                      ? '🚨'
                      : notificacao.tipo === 'demanda_concluida'
                      ? '✅'
                      : notificacao.tipo === 'nova_demanda'
                      ? '🆕'
                      : notificacao.tipo === 'demanda_atribuida'
                      ? '📌'
                      : notificacao.tipo === 'novo_comentario'
                      ? '💬'
                      : notificacao.tipo === 'status_alterado'
                      ? '🔄'
                      : '🔔'}
                      
                  </div>

                    <div className="notificacao-conteudo">
                      <strong>
                        {
                          notificacao.titulo
                        }
                      </strong>

                      <p>
                        {
                          notificacao.mensagem
                        }
                      </p>

                      <span>
                        {new Date(
                          notificacao.criadoEm
                        ).toLocaleString(
                          'pt-BR',
                          {
                            day: '2-digit',
                            month:
                              '2-digit',
                            hour:
                              '2-digit',
                            minute:
                              '2-digit',
                          }
                        )}
                      </span>
                    </div>

                    {!notificacao.lida && (
                      <span className="notificacao-ponto" />
                    )}
                  </button>
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Notificacoes