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
    <div className="sidebar-grupo">
      <span className="sidebar-grupo-titulo">
        VISÃO GERAL
      </span>

      <button
        className={`sidebar-item ${
          paginaAtiva === 'dashboard'
            ? 'ativo'
            : ''
        }`}
        onClick={() =>
          onNavegar('dashboard')
        }
      >
        Dashboard
      </button>
    </div>

    <div className="sidebar-grupo">
      <span className="sidebar-grupo-titulo">
        OPERAÇÃO
      </span>

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
        Demandas
      </button>

      <button
        className={`sidebar-item ${
          paginaAtiva === 'salas'
            ? 'ativo'
            : ''
        }`}
        onClick={() =>
          onNavegar('salas')
        }
      >
        Controle de Salas
      </button>
    </div>

    <div className="sidebar-grupo">
      <span className="sidebar-grupo-titulo">
        TRABALHO
      </span>

      <button
        className={`sidebar-item ${
          paginaAtiva === 'jornada'
            ? 'ativo'
            : ''
        }`}
        onClick={() =>
          onNavegar('jornada')
        }
      >
        Minha Jornada
      </button>
    </div>

    <div className="sidebar-grupo">
      <span className="sidebar-grupo-titulo">
        GESTÃO
      </span>

      <button
        className={`sidebar-item ${
          paginaAtiva === 'equipe'
            ? 'ativo'
            : ''
        }`}
        onClick={() =>
          onNavegar('equipe')
        }
      >
        Equipe
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
        Relatórios
      </button>
    </div>
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