import {
  useEffect,
  useState,
} from 'react'
import NovoUsuarioModal from '../../Modal/NovoUsuarioModal'
import {
  buscarUsuarios,
} from '../../services/api'

import type {
  UsuarioSistema,
} from '../../services/api'

function UsuariosAnalista() {
  const [
  usuarios,
  setUsuarios,
] = useState<UsuarioSistema[]>([])

const [modalNovoUsuarioAberto, setModalNovoUsuarioAberto] =
useState(false)


const [
  carregando,
  setCarregando,
] = useState(true)

useEffect(() => {
  async function carregarUsuarios() {
    try {
      const dados =
        await buscarUsuarios()

      setUsuarios(dados)
    } catch (erro) {
      console.error(
        'Erro ao carregar usuários:',
        erro
      )
    } finally {
      setCarregando(false)
    }
  }

  carregarUsuarios()
}, [])


  return (
    <>
      <div className="analista-header">
        <div>
          <h1>Usuários</h1>

          <p>
            Consulte os usuários e perfis de acesso
            do sistema.
          </p>
        </div>

       
      </div>

      <section className="analista-usuarios-topo">
        <div>
          <input
            type="text"
            placeholder="Buscar usuário..."
          />
        </div>

        <select defaultValue="todos">
          <option value="todos">
            Todos os perfis
          </option>

          <option value="analista">
            Analista
          </option>

          <option value="estagiario">
            Estagiário
          </option>

          <option value="direcao">
            Direção
          </option>
        </select>

        <select defaultValue="todos">
          <option value="todos">
            Todos os status
          </option>

          <option value="ativo">
            Ativo
          </option>

          <option value="inativo">
            Inativo
          </option>
        </select>

        <button
          type="button"
          className="analista-btn-novo-usuario"
          onClick={() => setModalNovoUsuarioAberto(true)}
        >
          + Novo usuário
        </button>
      </section>

      <section className="analista-card analista-usuarios-card">
        <div className="analista-usuarios-header">
          <div>
            <h2>Usuários cadastrados</h2>
            <span>
              {usuarios.length} usuários
            </span>
          </div>
        </div>

        {carregando && (
          <div>
            Carregando usuários...
          </div>
        )}

        <div className="analista-usuarios-tabela-wrapper">
          <table className="analista-usuarios-tabela">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Perfil</th>
                <th>Setor</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    <div className="analista-usuario-linha">
                      <div>👤</div>

                      <strong>
                        {usuario.nome}
                      </strong>
                    </div>
                  </td>

                  <td>
                    {usuario.perfil === 'analista'
                    ? 'Analista'
                    :   usuario.perfil === 'estagiario'
                      ? 'Estagiário'
                      : 'Direção'}
                  </td>

                  <td>
                    {usuario.setor}
                  </td>

                  <td>
                    <span className="analista-usuario-status">
                      {usuario.ativo
                        ? 'Ativo'
                        : 'Inativo'}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="analista-usuario-ver"
                    >
                      Ver →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <NovoUsuarioModal
        aberto={modalNovoUsuarioAberto}
        onFechar={() => setModalNovoUsuarioAberto(false)}
        onUsuarioCriado={(usuario) => {
          setUsuarios((usuariosAtuais) =>
            [...usuariosAtuais, usuario].sort((a, b) =>
              a.nome.localeCompare(b.nome)
            )
          )
        }}
      />
    </>
  )


  
}

export default UsuariosAnalista