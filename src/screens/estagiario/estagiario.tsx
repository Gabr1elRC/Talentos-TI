import { useEffect, useState } from 'react'
import '../../styles/Estagiario.css'
import Sidebar from '../../components/Sidebar'
import type {Tarefa,RegistroTempo,} from '../../types/Tarefas'
import DashboardEstagiario from './DashboardEstagiario'
import MinhasDemandas from './MinhasDemandas'
import MinhaJornada from './MinhaJornada'
import Historico from './Historico'
import type {UsuarioLogado,} from '../../services/api'
import Header from '../../components/header'


type EstagiarioProps = {
  onLogout: () => void

  tarefas: Tarefa[]

  setTarefas: React.Dispatch<
    React.SetStateAction<Tarefa[]>
  >

  usuario: UsuarioLogado
}
function Estagiario({
  onLogout,
  tarefas,
  setTarefas,
  usuario
}: EstagiarioProps) {
  const [paginaAtiva, setPaginaAtiva] =
    useState('dashboard')

  const [atividadeAtual, setAtividadeAtual] =
    useState<Tarefa | null>(null)

  const [segundos, setSegundos] =
    useState(0)

  const [pausado, setPausado] =
    useState(false)

  const [
    atividadeManual,
    setAtividadeManual,
  ] = useState('')

  const [
    descricaoManual,
    setDescricaoManual,
  ] = useState('')

  const [
    atividadeManualEmAndamento,
    setAtividadeManualEmAndamento,
  ] = useState(false)

  const [
    registrosManuais,
  ] = useState<RegistroTempo[]>([])

  useEffect(() => {
    const existeAtividade =
      atividadeAtual !== null ||
      atividadeManualEmAndamento

    if (!existeAtividade || pausado) {
      return
    }

    const intervalo = setInterval(() => {
      setSegundos(
        (valorAtual) =>
          valorAtual + 1
      )
    }, 1000)

    return () => {
      clearInterval(intervalo)
    }
  }, [
    atividadeAtual,
    atividadeManualEmAndamento,
    pausado,
  ])

  const minhasTarefas =
  tarefas.filter(
    (tarefa) =>
      (tarefa.responsavel ?? '')
        .toLowerCase()
        .includes(
          usuario.nome
            .toLowerCase()
        )
  )
  return (
    <div className="dashboard-page">
      <Sidebar
        onLogout={onLogout}
        perfil="estagiario"
        paginaAtiva={paginaAtiva}
        onNavegar={setPaginaAtiva}
      />

      <main className="dashboard-content">
        <Header
          usuario={usuario}
        />
        {paginaAtiva ===
          'dashboard' && (
          <DashboardEstagiario
            tarefas={minhasTarefas}
            usuario={usuario}
          />
        )}

        {paginaAtiva ===
          'demandas' && (
          <MinhasDemandas
            tarefas={minhasTarefas}
            setTarefas={setTarefas}
            usuario={usuario}
            atividadeAtual={
              atividadeAtual
            }
            setAtividadeAtual={
              setAtividadeAtual
            }
          />
        )}

        {paginaAtiva ===
          'jornada' && (
          <MinhaJornada
            tarefas={minhasTarefas}
            setTarefas={setTarefas}
            usuario={usuario}

            atividadeAtual={
              atividadeAtual
            }

            setAtividadeAtual={
              setAtividadeAtual
            }

            segundos={segundos}
            setSegundos={
              setSegundos
            }

            pausado={pausado}
            setPausado={
              setPausado
            }

            atividadeManual={
              atividadeManual
            }

            setAtividadeManual={
              setAtividadeManual
            }

            descricaoManual={
              descricaoManual
            }

            setDescricaoManual={
              setDescricaoManual
            }

            atividadeManualEmAndamento={
              atividadeManualEmAndamento
            }

            setAtividadeManualEmAndamento={
              setAtividadeManualEmAndamento
            }

            registrosManuais={
              registrosManuais
            }
            

          />
        )}

        {paginaAtiva ===
          'historico' && (
          <Historico />
        )}
      </main>
    </div>
  )
}

export default Estagiario