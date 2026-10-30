import {
  useEffect,
  useState,
} from 'react'

import {
  buscarTarefas,
  fazerLogin as fazerLoginApi,
} from './services/api'

import type {
  UsuarioLogado,
} from './services/api'

import './styles/App.css'

import Login from './screens/Login'
import Analista from './screens/analista/Analista'
import Estagiario from './screens/estagiario/estagiario'
import Direcao from './screens/direcao/direcao'
import Sala from './screens/salas/Sala'

import type {
  Tarefa,
} from './types/Tarefas'

type Perfil =
  | 'estagiario'
  | 'analista'
  | 'direcao'
  | 'sala'
  | null

function App() {
  const [
  usuario,
  setUsuario,
] = useState<UsuarioLogado | null>(
  () => {
    const usuarioSalvo =
      localStorage.getItem(
        'talentos-ti-usuario'
      )

    if (!usuarioSalvo) {
      return null
    }

    try {
      return JSON.parse(
        usuarioSalvo
      )
    } catch {
      return null
    }
  }
)

  const [
  perfil,
  setPerfil,
] = useState<Perfil>(
  () => {
    const usuarioSalvo =
      localStorage.getItem(
        'talentos-ti-usuario'
      )

    if (!usuarioSalvo) {
      return null
    }

    try {
      const usuario =
        JSON.parse(
          usuarioSalvo
        ) as UsuarioLogado

      return usuario.perfil as Perfil
    } catch {
      return null
    }
  }
)

  const [
    tarefas,
    setTarefas,
  ] = useState<Tarefa[]>([])

  useEffect(() => {
  async function carregarTarefas() {
    try {
      const dados =
        await buscarTarefas()

      setTarefas(dados)
    } catch (erro) {
      console.error(
        'Erro ao buscar tarefas:',
        erro
      )
    }
  }

  carregarTarefas()

  const atualizacao =
    window.setInterval(
      carregarTarefas,
      10000
    )

  return () => {
    window.clearInterval(
      atualizacao
    )
  }
}, [])

async function fazerLogin(
  email: string,
  senha: string
) {
  const resposta =
    await fazerLoginApi(
      email,
      senha
    )

  const usuarioLogado =
    resposta.usuario

  localStorage.setItem(
    'talentos-ti-usuario',
    JSON.stringify(
      usuarioLogado
    )
  )

  setUsuario(
    usuarioLogado
  )

  setPerfil(
    usuarioLogado.perfil as Exclude<
      Perfil,
      null
    >
  )
}

  function fazerLogout() {
  localStorage.removeItem(
    'talentos-ti-usuario'
  )

  setUsuario(null)
  setPerfil(null)
}

  if (
    !perfil ||
    !usuario
  ) {
    return (
      <Login
        onLogin={
          fazerLogin
        }
      />
    )
  }

  if (
    perfil ===
    'estagiario'
  ) {
    return (
      <Estagiario
        onLogout={fazerLogout}
        tarefas={tarefas}
        setTarefas={setTarefas}
        usuario={usuario}
      />
    )
  }

  if (
    perfil ===
    'direcao'
  ) {
    return (
      <Direcao
        onLogout={
          fazerLogout
        }
        tarefas={
          tarefas
        }
      />
    )
  }

      if (
      perfil ===
      'sala'
    ) {
      return (
        <Sala  
          usuario={usuario}
          onLogout={fazerLogout}/>
      )
    }

  return (
    <Analista
      onLogout={fazerLogout}
      tarefas={tarefas}
      setTarefas={setTarefas}
      usuario={usuario}
    />
  )
}

export default App