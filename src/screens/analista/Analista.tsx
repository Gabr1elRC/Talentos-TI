import { useState } from 'react'
import '../../styles/Header.css' 
import type {
  UsuarioLogado,
} from '../../services/api'
import Header from '../../components/header'
import '../../styles/analista/AnalistaLayout.css'
import ControleSalasAnalista from './ControleSalasAnalista'
import Sidebar from '../../components/Sidebar'


import type {
  Tarefa,
} from '../../types/Tarefas'

import DashboardAnalista from './Dashboardanalista'
import DemandasAnalista from './DemandasAnalista'
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
        <Header
          usuario={usuario}
        />

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

        {paginaAtiva === 'jornada' && (
          <JornadaAnalista
            tarefas={tarefas}
            usuario={usuario}
          />
        )}

        {paginaAtiva === 'equipe' && (
          <UsuariosAnalista />
        )}

        {paginaAtiva === 'relatorios' && (
          <RelatoriosAnalista
            tarefas={tarefas}
          />
        )}

        {paginaAtiva === 'salas' && (
          <ControleSalasAnalista />
        )}
      </main>
    </div>
  )
}

export default Analista