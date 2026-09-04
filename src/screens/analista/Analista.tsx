import { useState } from 'react'
import type { UsuarioLogado,} from '../../services/api'
import '../../styles/Analista.css'

import Sidebar from '../../components/Sidebar'

import type { Tarefa } from '../../types/Tarefas'

import DashboardAnalista from './Dashboardanalista'
import DemandasAnalista from './DemandasAnalista'
import KanbanAnalista from './KanbanAnalista'
import JornadaAnalista from './JornadaAnalista'
import UsuariosAnalista from './UsuariosAnalista'
import RelatoriosAnalista from './RelatoriosAnalista'

type AnalistaProps = {
  onLogout: () => void

  tarefas: Tarefa[]

  setTarefas: React.Dispatch<
    React.SetStateAction<Tarefa[]>
  >

  usuario: UsuarioLogado
}

function Analista({
  onLogout,
  tarefas,
  setTarefas,
  usuario,
}: AnalistaProps) {
  const [
    paginaAtiva,
    setPaginaAtiva,   
  ] = useState('dashboard')

  return (
    <div className="analista-page">
      <Sidebar
        onLogout={onLogout}
        perfil="analista"
        paginaAtiva={paginaAtiva}
        onNavegar={setPaginaAtiva}
      />

      <main className="analista-content">
        {paginaAtiva === 'dashboard' && (
          <DashboardAnalista
            tarefas={tarefas}
            usuario={usuario}
          />
        )}

        {paginaAtiva === 'demandas' && (
          <DemandasAnalista
            tarefas={tarefas}
            setTarefas={setTarefas}
            usuario={usuario}
          />
        )}

        {paginaAtiva === 'kanban' && (
          <KanbanAnalista
            tarefas={tarefas}
            setTarefas={setTarefas}
            usuario={usuario}
          />
        )}

        {paginaAtiva === 'jornada' && (
          <JornadaAnalista
            tarefas={tarefas}
            usuario={usuario}
          />
        )}

        {paginaAtiva === 'usuarios' && (
          <UsuariosAnalista />
        )}

        {paginaAtiva === 'relatorios' && (
          <RelatoriosAnalista
            tarefas={tarefas}
          />
        )}
      </main>
    </div>
  )
}

export default Analista