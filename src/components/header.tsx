import Notificacoes from './Notificacoes' 

import type {
  UsuarioLogado,
} from '../services/api'

type HeaderProps = {
  usuario: UsuarioLogado
}

function Header({
  usuario,
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header-usuario">
        <div className="app-header-avatar">
          👤
        </div>

        <div className="app-header-info">
          <strong>
            {usuario.nome}
          </strong>

          <span>
            Setor de {usuario.setor}
          </span>
        </div>

        <Notificacoes
          usuarioId={usuario.id}
        />
      </div>
    </header>
  )
}

export default Header