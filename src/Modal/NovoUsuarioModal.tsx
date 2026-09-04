import { useState } from 'react'
import '../styles/NovoUsuarioModal.css'
import {
  criarUsuario,
} from '../services/api'

import type {
  UsuarioSistema,
} from '../services/api'

type Props = {
  aberto: boolean
  onFechar: () => void
  onUsuarioCriado: (
    usuario: UsuarioSistema
  ) => void
}

function NovoUsuarioModal({
  aberto,
  onFechar,
  onUsuarioCriado,
}: Props) {
  const [nome, setNome] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [senha, setSenha] =
    useState('')

  const [perfil, setPerfil] =
    useState<
      | 'analista'
      | 'estagiario'
      | 'direcao'
    >('estagiario')

  const [setor, setSetor] =
    useState('TI')

  const [salvando, setSalvando] =
    useState(false)

  const [erro, setErro] =
    useState('')

  if (!aberto) {
    return null
  }

  async function salvarUsuario() {
    if (
      !nome.trim() ||
      !email.trim() ||
      !senha.trim()
    ) {
      setErro(
        'Preencha nome, e-mail e senha.'
      )

      return
    }

    try {
      setSalvando(true)
      setErro('')

      const usuario =
        await criarUsuario({
          nome: nome.trim(),
          email: email
            .trim()
            .toLowerCase(),
          senha,
          perfil,
          setor,
        })

      onUsuarioCriado(usuario)

      setNome('')
      setEmail('')
      setSenha('')
      setPerfil('estagiario')
      setSetor('TI')

      onFechar()
    } catch (erro) {
      if (erro instanceof Error) {
        setErro(erro.message)
      } else {
        setErro(
          'Erro ao criar usuário.'
        )
      }
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="novo-usuario-overlay">
      <div className="novo-usuario-modal">
        <div className="novo-usuario-header">
          <div>
            <h2>
              Novo usuário
            </h2>

            <span>
              Cadastre um novo acesso
              ao Talentos TI
            </span>
          </div>

          <button
            type="button"
            onClick={onFechar}
          >
            ✕
          </button>
        </div>

        <div className="novo-usuario-form">
          <label>
            Nome
            <input
              type="text"
              value={nome}
              onChange={(e) =>
                setNome(
                  e.target.value
                )
              }
              placeholder="Nome completo"
            />
          </label>

          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder="usuario@colegiotalentos.com.br"
            />
          </label>

          <label>
            Senha inicial
            <input
              type="password"
              value={senha}
              onChange={(e) =>
                setSenha(
                  e.target.value
                )
              }
              placeholder="Digite a senha inicial"
            />
          </label>

          <label>
            Perfil
            <select
              value={perfil}
              onChange={(e) =>
                setPerfil(
                  e.target
                    .value as
                    | 'analista'
                    | 'estagiario'
                    | 'direcao'
                )
              }
            >
              <option value="estagiario">
                Estagiário
              </option>

              <option value="analista">
                Analista
              </option>

              <option value="direcao">
                Direção
              </option>
            </select>
          </label>

          <label>
            Setor
            <select
              value={setor}
              onChange={(e) =>
                setSetor(
                  e.target.value
                )
              }
            >
              <option value="TI">
                TI
              </option>

              <option value="Direção">
                Direção
              </option>

              <option value="Coordenação">
                Coordenação
              </option>

              <option value="Secretaria">
                Secretaria
              </option>

              <option value="Financeiro">
                Financeiro
              </option>

              <option value="Pedagógico">
                Pedagógico
              </option>
            </select>
          </label>

          {erro && (
            <div className="novo-usuario-erro">
              {erro}
            </div>
          )}
        </div>

        <div className="novo-usuario-footer">
          <button
            type="button"
            onClick={onFechar}
            disabled={salvando}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={salvarUsuario}
            disabled={salvando}
          >
            {salvando
              ? 'Salvando...'
              : 'Cadastrar usuário'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NovoUsuarioModal