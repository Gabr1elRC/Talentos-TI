import '../styles/Sidebar.css'
import logoTalentos from '../assets/logo-talentos.png'

type SidebarProps = {
  onLogout: () => void
  perfil: 'estagiario' | 'analista' | 'direcao'
  paginaAtiva: string
  onNavegar: (pagina: string) => void
}

function Sidebar({ onLogout, perfil, paginaAtiva, onNavegar, }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo-triangle">
        <img
          src={logoTalentos}
          alt="Colégio Talentos"
          className="sidebar-logo"
        />
      </div>

      <nav className="sidebar-menu">

  {perfil === 'estagiario' && (
  <>
    <button
      className={`sidebar-item ${
        paginaAtiva === 'dashboard' ? 'ativo' : ''
      }`}
      onClick={() => onNavegar('dashboard')}
    >
      Dashboard
    </button>

    <button
      className={`sidebar-item ${
        paginaAtiva === 'demandas' ? 'ativo' : ''
      }`}
      onClick={() => onNavegar('demandas')}
    >
      Minhas Demandas
    </button>

    <button
      className={`sidebar-item ${
        paginaAtiva === 'jornada' ? 'ativo' : ''
      }`}
      onClick={() => onNavegar('jornada')}
    >
      Minha Jornada
    </button>

    <button
      className={`sidebar-item ${
        paginaAtiva === 'historico' ? 'ativo' : ''
      }`}
      onClick={() => onNavegar('historico')}
    >
      Histórico
    </button>
  </>
  )}

  {perfil === 'analista' && (
  <>
    <button
      className={`sidebar-item ${
        paginaAtiva === 'dashboard' ? 'ativo' : ''
      }`}
      onClick={() => onNavegar('dashboard')}
    >
      Dashboard
    </button>

    <button
      className={`sidebar-item ${
        paginaAtiva === 'demandas' ? 'ativo' : ''
      }`}
      onClick={() => onNavegar('demandas')}
    >
      Demandas
    </button>

    <button
      className={`sidebar-item ${
        paginaAtiva === 'kanban' ? 'ativo' : ''
      }`}
      onClick={() => onNavegar('kanban')}
    >
      Kanban
    </button>

    <button
      className={`sidebar-item ${
        paginaAtiva === 'jornada' ? 'ativo' : ''
      }`}
      onClick={() => onNavegar('jornada')}
    >
      Minha Jornada
    </button>

    <button
      className={`sidebar-item ${
        paginaAtiva === 'usuarios' ? 'ativo' : ''
      }`}
      onClick={() => onNavegar('usuarios')}
    >
      Usuários
    </button>

    <button
      className={`sidebar-item ${
        paginaAtiva === 'relatorios' ? 'ativo' : ''
      }`}
      onClick={() => onNavegar('relatorios')}
    >
      Relatórios
    </button>
  </>
)}

  {perfil === 'direcao' && (
  <>
    <button
      className={`sidebar-item ${
        paginaAtiva === 'indicadores'
          ? 'ativo'
          : ''
      }`}
      onClick={() =>
        onNavegar('indicadores')
      }
    >
      ▦ Indicadores
    </button>

    <button
      className={`sidebar-item ${
        paginaAtiva === 'relatorios'
          ? 'ativo'
          : ''
      }`}
      onClick={() =>
        onNavegar('relatorios')
      }
    >
      📊 Relatórios
    </button>

    <button
      className={`sidebar-item ${
        paginaAtiva === 'demandas'
          ? 'ativo'
          : ''
      }`}
      onClick={() =>
        onNavegar('demandas')
      }
    >
      📋 Demandas
    </button>
  </>
)}
</nav>

      <button
        className="sidebar-sair"
        onClick={onLogout}
      >
        Sair
      </button>
    </aside>
  )
}

export default Sidebar