import { useEffect, useState } from 'react'
import '../../styles/Sala.css'

const API_URL = import.meta.env.VITE_API_URL

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

import type {
  UsuarioLogado,
} from '../../services/api'

type SalaProps = {
  usuario: UsuarioLogado
   onLogout: () => void
}

function Sala({
  usuario,
  onLogout,
}: SalaProps) {
  const salaId = usuario.salaId

  const [
    dados,
    setDados,
  ] = useState<AulaAtual | null>(null)

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

  if (!salaId) {
    return (
      <div className="sala-page">
        <div className="sala-card">
          <h1>Sala não vinculada</h1>
          <p>
            Este usuário não possui uma sala vinculada.
          </p>
        </div>
      </div>
    )
  }

 async function carregarAula() {
  try {
    const resposta = await fetch(
      `${API_URL}/salas/${salaId}/aula-atual`
    )

    const resultado = await resposta.json()

    setDados(resultado)
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
  carregarAula()

  const intervalo = setInterval(
    carregarAula,
    30000
  )

  return () =>
    clearInterval(intervalo)
}, [salaId])

  async function registrarConferencia(
    status: 'OK' | 'SUPORTE'
  ) {
    try {
      const resposta = await fetch(
        `${API_URL}/salas/${salaId}/conferencias`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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

      const resultado = await resposta.json()

      if (!resposta.ok) {
        setMensagem(
          resultado.erro ||
          resultado.mensagem ||
          'Não foi possível registrar.'
        )

        return
      }

      if (status === 'OK') {
        setMensagem('Tudo OK registrado com sucesso.')
      } else {
        setMensagem('Solicitação de suporte enviada.')
        setMostrarSuporte(false)
        setDescricao('')
      }
    } catch (erro) {
      console.error(erro)

      setMensagem(
        'Não foi possível comunicar com o servidor.'
      )
    }
  }

  if (carregando) {
    return (
      <div className="sala-page">
        Carregando...
      </div>
    )
  }

  if (!dados) {
    return (
      <div className="sala-page">
        Não foi possível carregar a sala.
      </div>
    )
  }

  if (dados.situacao === 'SEM_TURMA') {
    return (
      <div className="sala-page">
        <div className="sala-card">
          <h1>Sala sem turma vinculada</h1>
        </div>
      </div>
    )
  }

 if (dados.situacao === 'SEM_AULA') {
  return (
    <div className="sala-page">
      <div className="sala-card">

        <div className="sala-cabecalho">
          <div>
            <h1>{dados.sala?.nome}</h1>
            <p>Não há aula neste momento.</p>
          </div>

          <button
            className="sala-btn-logout"
            onClick={onLogout}
          >
            Sair
          </button>
        </div>

      </div>
    </div>
  )
}
  return (
    <div className="sala-page">
      <div className="sala-card">

        <div className="sala-cabecalho">
          <h1>{dados.sala?.nome}</h1>
          <span>{dados.turma?.nome}</span>
        

          <button
            className="sala-btn-logout"
            onClick={onLogout}
          >
            Sair
          </button>
        </div>

        <div className="sala-aula">
          <h2>
            {dados.aulaAtual?.disciplina}
          </h2>

          <p>
            Prof. {dados.aulaAtual?.professor}
          </p>

          <strong>
            {dados.aulaAtual?.horaInicio.slice(0, 5)}
            {' às '}
            {dados.aulaAtual?.horaFim.slice(0, 5)}
          </strong>
        </div>

        <button
          className="sala-btn-ok"
          onClick={() =>
            registrarConferencia('OK')
          }
        >
          ✓ TUDO OK
        </button>

        <button
          className="sala-btn-suporte"
          onClick={() =>
            setMostrarSuporte(true)
          }
        >
          ⚠ SOLICITAR SUPORTE
        </button>

        {mostrarSuporte && (
          <div className="sala-suporte">

            <textarea
              placeholder="Descreva o problema encontrado..."
              value={descricao}
              onChange={(e) =>
                setDescricao(e.target.value)
              }
            />

            <div className="sala-suporte-acoes">

              <button
                onClick={() =>
                  setMostrarSuporte(false)
                }
              >
                Cancelar
              </button>

              <button
                disabled={!descricao.trim()}
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
    </div>
  )
}

export default Sala