import {
  useEffect,
  useState,
} from 'react'

import '../../styles/Sala.css'

import Notificacoes from '../../components/Notificacoes'
import SalaAlertaNotificacao from '../../components/SalaAlertaNotificacao'

import type {
  UsuarioLogado,
} from '../../services/api'

const API_URL =
  import.meta.env.VITE_API_URL

type AulaAtual = {
  situacao: string

  sala?: {
    id: number
    nome: string
  }

  turma?: {
    id: number
    nome: string
  }

  aulaAtual?: {
    horarioId: number
    disciplina: string
    professor: string
    horaInicio: string
    horaFim: string
  }
}

type SalaProps = {
  usuario: UsuarioLogado
  onLogout: () => void
}

function Sala({
  usuario,
  onLogout,
}: SalaProps) {
  const salaId =
    usuario.salaId

  const [
    dados,
    setDados,
  ] = useState<AulaAtual | null>(
    null
  )

  const [
    carregando,
    setCarregando,
  ] = useState(true)

  const [
    mostrarSuporte,
    setMostrarSuporte,
  ] = useState(false)

  const [
    descricao,
    setDescricao,
  ] = useState('')

  const [
    mensagem,
    setMensagem,
  ] = useState('')

  /*
   * =========================
   * CARREGAR AULA
   * =========================
   */

  async function carregarAula() {
    if (!salaId) {
      return
    }

    try {
      const resposta =
        await fetch(
          `${API_URL}/salas/${salaId}/aula-atual`
        )

      const resultado =
        await resposta.json()

      setDados(
        resultado
      )
    } catch (erro) {
      console.error(
        'Erro ao carregar aula:',
        erro
      )
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    if (!salaId) {
      setCarregando(false)
      return
    }

    carregarAula()

    const intervalo =
      window.setInterval(
        carregarAula,
        30000
      )

    return () => {
      window.clearInterval(
        intervalo
      )
    }
  }, [salaId])

  /*
   * =========================
   * HEARTBEAT DA SALA
   * =========================
   */

  useEffect(() => {
    if (!salaId) {
      return
    }

    async function enviarPing() {
      try {
        const resposta =
          await fetch(
            `${API_URL}/salas/${salaId}/ping`,
            {
              method: 'POST',
            }
          )

        if (!resposta.ok) {
          console.error(
            'Falha ao registrar ping da sala.'
          )
        }
      } catch (erro) {
        console.error(
          'Erro ao enviar ping da sala:',
          erro
        )
      }
    }

    /*
     * Envia imediatamente
     * quando a tela da sala inicia.
     */
    enviarPing()

    /*
     * Depois envia a cada
     * 90 segundos.
     */
    const intervaloPing =
      window.setInterval(
        enviarPing,
        90000
      )

    return () => {
      window.clearInterval(
        intervaloPing
      )
    }
  }, [salaId])

  /*
   * =========================
   * REGISTRAR CONFERÊNCIA
   * =========================
   */

  async function registrarConferencia(
    status: 'OK' | 'SUPORTE'
  ) {
    if (!salaId) {
      return
    }

    try {
      setMensagem('')

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
                  ? descricao
                  : undefined,
            }),
          }
        )

      const resultado =
        await resposta.json()

      if (!resposta.ok) {
        setMensagem(
          resultado.erro ||
            resultado.mensagem ||
            'Não foi possível registrar.'
        )

        return
      }

      if (status === 'OK') {
        setMensagem(
          'Tudo OK registrado com sucesso.'
        )
      } else {
        setMensagem(
          'Solicitação de suporte enviada.'
        )

        setMostrarSuporte(
          false
        )

        setDescricao('')
      }
    } catch (erro) {
      console.error(
        'Erro ao registrar conferência:',
        erro
      )

      setMensagem(
        'Não foi possível comunicar com o servidor.'
      )
    }
  }

  /*
   * =========================
   * SALA NÃO VINCULADA
   * =========================
   */

  if (!salaId) {
    return (
      <div className="sala-page">

        <div className="sala-card">

          <h1>
            Sala não vinculada
          </h1>

          <p>
            Este usuário não possui
            uma sala vinculada.
          </p>

          <button
            className="sala-btn-logout"
            onClick={onLogout}
          >
            Sair
          </button>

        </div>

      </div>
    )
  }

  /*
   * =========================
   * CARREGANDO
   * =========================
   */

  if (carregando) {
    return (
      <div className="sala-page">
        Carregando...
      </div>
    )
  }

  /*
   * =========================
   * ERRO AO CARREGAR
   * =========================
   */

  if (!dados) {
    return (
      <div className="sala-page">

        <div className="sala-card">

          <h1>
            Não foi possível
            carregar a sala.
          </h1>

          <button
            className="sala-btn-logout"
            onClick={onLogout}
          >
            Sair
          </button>

        </div>

      </div>
    )
  }

  /*
   * =========================
   * SEM TURMA
   * =========================
   */

  if (
    dados.situacao ===
    'SEM_TURMA'
  ) {
    return (
      <div className="sala-page">

        <div className="sala-card">

          <div className="sala-cabecalho">

            <div>
              <h1>
                {dados.sala?.nome ??
                  'Sala'}
              </h1>

              <p>
                Sala sem turma
                vinculada.
              </p>
            </div>

            <div className="sala-cabecalho-acoes">

              <Notificacoes
                usuarioId={
                  usuario.id
                }
              />

              <button
                className="sala-btn-logout"
                onClick={onLogout}
              >
                Sair
              </button>

            </div>

          </div>

        </div>

        <SalaAlertaNotificacao
          usuarioId={usuario.id}
          salaId={salaId}
        />

      </div>
    )
  }

  /*
   * =========================
   * SEM AULA
   * =========================
   */

  if (
    dados.situacao ===
    'SEM_AULA'
  ) {
    return (
      <div className="sala-page">

        <div className="sala-card">

          <div className="sala-cabecalho">

            <div>

              <h1>
                {dados.sala?.nome}
              </h1>

              <p>
                Não há aula neste
                momento.
              </p>

            </div>

            <div className="sala-cabecalho-acoes">

              <Notificacoes
                usuarioId={
                  usuario.id
                }
              />

              <button
                className="sala-btn-logout"
                onClick={onLogout}
              >
                Sair
              </button>

            </div>

          </div>

        </div>

        <SalaAlertaNotificacao
          usuarioId={usuario.id}
          salaId={salaId}
        />

      </div>
    )
  }

  /*
   * =========================
   * AULA EM ANDAMENTO
   * =========================
   */

  return (
    <div className="sala-page">

      <div className="sala-card">

        <div className="sala-cabecalho">

          <div>

            <h1>
              {dados.sala?.nome}
            </h1>

            <p>
              {dados.turma?.nome}
            </p>

          </div>

          <div className="sala-cabecalho-acoes">

            <Notificacoes
              usuarioId={
                usuario.id
              }
            />

            <button
              className="sala-btn-logout"
              onClick={onLogout}
            >
              Sair
            </button>

          </div>

        </div>

        <div className="sala-aula">

          <h2>
            {
              dados.aulaAtual
                ?.disciplina
            }
          </h2>

          <p>
            Prof.{' '}
            {
              dados.aulaAtual
                ?.professor
            }
          </p>

          <strong>

            {dados.aulaAtual
              ?.horaInicio
              .slice(
                0,
                5
              )}

            {' às '}

            {dados.aulaAtual
              ?.horaFim
              .slice(
                0,
                5
              )}

          </strong>

        </div>

        <div className="sala-acoes-principais">

          <button
            className="sala-btn-ok"
            onClick={() =>
              registrarConferencia(
                'OK'
              )
            }
          >
            ✓ TUDO OK
          </button>

          <button
            className="sala-btn-suporte"
            onClick={() =>
              setMostrarSuporte(
                true
              )
            }
          >
            ⚠ SOLICITAR SUPORTE
          </button>

        </div>

        {mostrarSuporte && (
          <div className="sala-suporte">

            <textarea
              placeholder="Descreva o problema encontrado..."
              value={descricao}
              onChange={(evento) =>
                setDescricao(
                  evento.target.value
                )
              }
            />

            <div className="sala-suporte-acoes">

              <button
                type="button"
                onClick={() => {
                  setMostrarSuporte(
                    false
                  )

                  setDescricao('')
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={
                  !descricao.trim()
                }
                onClick={() =>
                  registrarConferencia(
                    'SUPORTE'
                  )
                }
              >
                Enviar suporte
              </button>

            </div>

          </div>
        )}

        {mensagem && (
          <div className="sala-mensagem">
            {mensagem}
          </div>
        )}

      </div>

      <SalaAlertaNotificacao
        usuarioId={usuario.id}
        salaId={salaId}
      />

    </div>
  )
}

export default Sala