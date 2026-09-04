import '../styles/DetalhesDemandaModal.css'
import { useState } from 'react'

import type { Tarefa } from '../types/Tarefas'

import ApontamentoManualModal, {
  type NovoApontamentoManual,
} from '../Modal/ApontamentoManualModal'

type DetalhesDemandaModalProps = {
  tarefa: Tarefa | null

  onFechar: () => void

  onAdicionarComentario: (
    tarefaId: number,
    texto: string
  ) => void

  onAdicionarApontamento: (
    tarefaId: number,
    apontamento: NovoApontamentoManual
  ) => void
}

function DetalhesDemandaModal({
  tarefa,
  onFechar,
  onAdicionarComentario,
  onAdicionarApontamento,
}: DetalhesDemandaModalProps) {
  const [abaAtiva, setAbaAtiva] =
    useState<
      | 'detalhes'
      | 'comentarios'
      | 'tempo'
      | 'historico'
    >('detalhes')

  const [
    novoComentario,
    setNovoComentario,
  ] = useState('')

  const [
    apontamentoAberto,
    setApontamentoAberto,
  ] = useState(false)

  if (!tarefa) {
    return null
  }

  const tarefaAtual = tarefa


const comentarios =
  tarefaAtual.comentarios ?? []

const registrosTempo =
  tarefaAtual.registrosTempo ?? []

const historicoStatus =
  tarefaAtual.historicoStatus ?? []

  function adicionarComentario() {
    if (!novoComentario.trim()) {
      return
    }

    onAdicionarComentario(
      Number(tarefaAtual.id),
      novoComentario.trim()
    )

    setNovoComentario('')
  }

  const tempoRealizadoMinutos =
    registrosTempo.reduce(
      (total, registro) =>
        total +
        Number(
          registro.duracaoMinutos ?? 0
        ),
      0
    )

  const tempoPrevistoMinutos =
  Number(
    tarefaAtual.tempoPrevisto ?? 0
  ) * 60

  const diferencaMinutos =
    tempoRealizadoMinutos -
    tempoPrevistoMinutos

  const variacaoPercentual =
    tempoPrevistoMinutos > 0
      ? (
          diferencaMinutos /
          tempoPrevistoMinutos
        ) * 100
      : 0

  function formatarMinutos(
    minutos: number
  ) {
    const negativo =
      minutos < 0

    const totalSegundos =
      Math.round(
        Math.abs(minutos) * 60
      )

    const horas =
      Math.floor(
        totalSegundos / 3600
      )

    const minutosRestantes =
      Math.floor(
        (totalSegundos % 3600) /
          60
      )

    const segundosRestantes =
      totalSegundos % 60

    let resultado = ''

    if (horas > 0) {
      resultado =
        `${horas}h ` +
        `${minutosRestantes}min ` +
        `${segundosRestantes}s`
    } else if (
      minutosRestantes > 0
    ) {
      resultado =
        `${minutosRestantes}min ` +
        `${segundosRestantes}s`
    } else {
      resultado =
        `${segundosRestantes}s`
    }

    return negativo
      ? `-${resultado}`
      : resultado
  }

  

  return (
    <div className="detalhes-overlay">
      <div className="detalhes-modal">
        <div className="detalhes-header">
          <div>
            <span className="detalhes-id">
              #{tarefaAtual.id}
            </span>

            <h2>
              {tarefaAtual.titulo}
            </h2>
          </div>

          <button
            type="button"
            className="detalhes-fechar"
            onClick={onFechar}
          >
            ×
          </button>
        </div>

        <div className="detalhes-abas">
          <button
            type="button"
            className={
              abaAtiva ===
              'detalhes'
                ? 'ativa'
                : ''
            }
            onClick={() =>
              setAbaAtiva(
                'detalhes'
              )
            }
          >
            Detalhes
          </button>

          <button
            type="button"
            className={
              abaAtiva ===
              'comentarios'
                ? 'ativa'
                : ''
            }
            onClick={() =>
              setAbaAtiva(
                'comentarios'
              )
            }
          >
            Comentários
          </button>

          <button
            type="button"
            className={
              abaAtiva ===
              'tempo'
                ? 'ativa'
                : ''
            }
            onClick={() =>
              setAbaAtiva(
                'tempo'
              )
            }
          >
            Tempo
          </button>

          <button
            type="button"
            className={
              abaAtiva ===
              'historico'
                ? 'ativa'
                : ''
            }
            onClick={() =>
              setAbaAtiva(
                'historico'
              )
            }
          >
            Histórico
          </button>
        </div>

        {abaAtiva ===
          'detalhes' && (
          <>
            <div className="detalhes-grid">
              <div className="detalhes-campo">
                <span>
                  Status
                </span>

                <strong>
                  {tarefaAtual.status}
                </strong>
              </div>

              <div className="detalhes-campo">
                <span>
                  Prioridade
                </span>

                <strong>
                  {
                    tarefaAtual.prioridade
                  }
                </strong>
              </div>

              <div className="detalhes-campo">
                <span>
                  Solicitante
                </span>

                <strong>
                  {
                    tarefaAtual.solicitante
                  }
                </strong>
              </div>

              <div className="detalhes-campo">
                <span>
                  Setor
                </span>

                <strong>
                  {tarefaAtual.setor}
                </strong>
              </div>

              <div className="detalhes-campo">
                <span>
                  Categoria
                </span>

                <strong>
                  {
                    tarefaAtual.categoria
                  }
                </strong>
              </div>

              <div className="detalhes-campo">
                <span>
                  Responsável
                </span>

                <strong>
                  {tarefaAtual.responsavel ||
                    'Sem responsável'}
                </strong>
              </div>

              <div className="detalhes-campo">
                <span>
                  Prazo
                </span>

                <strong>
                  {tarefaAtual.prazo ||
                    'Sem prazo'}
                </strong>
              </div>

              <div className="detalhes-campo">
                <span>
                  Tempo previsto
                </span>

                <strong>
                  {Number(
                    tarefaAtual.tempoPrevisto ??
                      0
                  )}
                  h
                </strong>
              </div>
            </div>

            <div className="detalhes-descricao">
              <span>
                Descrição
              </span>

              <p>
                {
                  tarefaAtual.descricao
                }
              </p>
            </div>

            <div className="detalhes-acoes">
              <button
                type="button"
                onClick={onFechar}
              >
                Fechar
              </button>
            </div>
          </>
        )}

        {abaAtiva ===
          'comentarios' && (
          <div className="comentarios-container">
            <div className="novo-comentario">
              <textarea
                value={
                  novoComentario
                }
                onChange={(
                  event
                ) =>
                  setNovoComentario(
                    event.target
                      .value
                  )
                }
                placeholder="Escreva um comentário..."
                rows={3}
              />

              <button
                type="button"
                onClick={
                  adicionarComentario
                }
              >
                Adicionar comentário
              </button>
            </div>

            <div className="lista-comentarios">
              {comentarios.length ===
              0 ? (
                <p className="sem-comentarios">
                  Nenhum comentário
                  registrado.
                </p>
              ) : (
                comentarios.map(
                  (comentario) => (
                    <div
                      className="comentario"
                      key={
                        comentario.id
                      }
                    >
                      <div className="comentario-header">
                        <strong>
                          {
                            comentario.autor
                          }
                        </strong>

                        <span>
                          {
                            comentario.horario
                          }
                        </span>
                      </div>

                      <p>
                        {
                          comentario.texto
                        }
                      </p>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        )}

        {abaAtiva ===
          'tempo' && (
          <div className="tempo-container">
            <div className="tempo-resumo">
              <div className="tempo-card">
                <span>
                  Previsto
                </span>

                <strong>
                  {formatarMinutos(
                    tempoPrevistoMinutos
                  )}
                </strong>
              </div>

              <div className="tempo-card">
                <span>
                  Realizado
                </span>

                <strong>
                  {formatarMinutos(
                    tempoRealizadoMinutos
                  )}
                </strong>
              </div>

              <div className="tempo-card">
                <span>
                  Diferença
                </span>

                <strong>
                  {diferencaMinutos >
                  0
                    ? '+'
                    : ''}

                  {formatarMinutos(
                    diferencaMinutos
                  )}
                </strong>
              </div>

              <div className="tempo-card">
                <span>
                  Variação
                </span>

                <strong>
                  {variacaoPercentual >
                  0
                    ? '+'
                    : ''}

                  {variacaoPercentual.toFixed(
                    1
                  )}
                  %
                </strong>
              </div>
            </div>

            <div className="tempo-header">
              <h3>
                Apontamentos
              </h3>

              <button
                type="button"
                onClick={() =>
                  setApontamentoAberto(
                    true
                  )
                }
              >
                + Apontamento
                manual
              </button>
            </div>

            <div className="registros-tempo">
              {registrosTempo.length ===
              0 ? (
                <p className="sem-registros-tempo">
                  Nenhum
                  apontamento de
                  tempo registrado.
                </p>
              ) : (
                registrosTempo.map(
                  (registro) => (
                    <div
                      className="registro-tempo"
                      key={
                        registro.id
                      }
                    >
                      <div>
                        <strong>
                          {registro.usuario ||
                            'Usuário'}
                        </strong>

                        <span>
                          {registro.inicio ||
                            '--:--'}{' '}
                          até{' '}
                          {registro.fim ||
                            '--:--'}
                        </span>
                      </div>

                      <strong>
                        {formatarMinutos(
                          Number(
                            registro.duracaoMinutos ??
                              0
                          )
                        )}
                      </strong>
                    </div>
                  )
                )
              )}

              <ApontamentoManualModal
                aberto={
                  apontamentoAberto
                }
                onFechar={() =>
                  setApontamentoAberto(
                    false
                  )
                }
                onSalvar={(
                  apontamento
                ) => {
                  onAdicionarApontamento(
                    Number(
                      tarefaAtual.id
                    ),
                    apontamento
                  )

                  setApontamentoAberto(
                    false
                  )
                }}
              />
            </div>
          </div>
        )}

        {abaAtiva ===
  'historico' && (
  <div className="historico-container">
    {historicoStatus.length ===
    0 ? (
      <p className="sem-historico">
        Nenhuma alteração
        registrada.
      </p>
    ) : (
      <div className="historico-lista">
        {historicoStatus.map(
          (item) => (
            <div
              className="historico-item"
              key={item.id}
            >
              <div className="historico-marcador">
                ●
              </div>

              <div className="historico-conteudo">
                <div className="historico-topo">
                  <strong>
                    {item.usuario}
                  </strong>

                  <span>
                    {new Date(
                      item.criadoEm
                    ).toLocaleString(
                      'pt-BR'
                    )}
                  </span>
                </div>

                <p>
                  {item.statusAnterior
                    ? (
                        <>
                          Alterou de{' '}
                          <strong>
                            {
                              item.statusAnterior
                            }
                          </strong>{' '}
                          para{' '}
                          <strong>
                            {
                              item.statusNovo
                            }
                          </strong>
                        </>
                      )
                    : (
                        <>
                          Status definido
                          como{' '}
                          <strong>
                            {
                              item.statusNovo
                            }
                          </strong>
                        </>
                      )}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    )}
  </div>
)}
      </div>
    </div>
  )
}

export default DetalhesDemandaModal