import { useState } from 'react'
import DemandasDirecao from './DemandasDirecao'
import '../../styles/Direcao.css'
import RelatoriosDirecao from './RelatoriosDirecao'
import Sidebar from '../../components/Sidebar'

import type {
  Tarefa,
} from '../../types/Tarefas'

import IndicadoresDirecao from './IndicadoresDirecao'

type DirecaoProps = {
  onLogout: () => void
  tarefas: Tarefa[]
}

function Direcao({
  onLogout,
  tarefas,
}: DirecaoProps) {
  const [
    paginaAtiva,
    setPaginaAtiva,
  ] = useState('indicadores')

  return (
    <div className="direcao-page">
      <Sidebar
        onLogout={onLogout}
        perfil="direcao"
        paginaAtiva={paginaAtiva}
        onNavegar={setPaginaAtiva}
      />

      <main className="direcao-content">
        {paginaAtiva ===
          'indicadores' && (
          <IndicadoresDirecao
            tarefas={tarefas}
          />
        )}

        {paginaAtiva === 'demandas' && (
          <DemandasDirecao
            tarefas={tarefas}
          />
        )}

        {paginaAtiva === 'relatorios' && (
          <RelatoriosDirecao
            tarefas={tarefas}
          />
        )}
      </main>
    </div>
  )
}

export default Direcao