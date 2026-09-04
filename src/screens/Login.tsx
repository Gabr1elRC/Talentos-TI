import { useState } from 'react'
import logoTalentos from '../assets/logo-talentos.png'
import '../styles/Login.css'

type LoginProps = {
  onLogin: (
    email: string,
    senha: string
  ) => Promise<void>
}

function Login({
  onLogin,
}: LoginProps) {
  const [email, setEmail] =
    useState('')

  const [senha, setSenha] =
    useState('')

  const [erro, setErro] =
    useState('')

  const [
    carregando,
    setCarregando,
  ] = useState(false)

  async function entrar(
    event: React.FormEvent
  ) {
    event.preventDefault()

    setErro('')

    if (
      !email.trim() ||
      !senha.trim()
    ) {
      setErro(
        'Preencha o e-mail e a senha.'
      )

      return
    }

    try {
      setCarregando(true)

      await onLogin(
        email.trim(),
        senha
      )
    } catch (erro) {
      if (
        erro instanceof Error
      ) {
        setErro(
          erro.message
        )
      } else {
        setErro(
          'Não foi possível realizar o login.'
        )
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img
            src={logoTalentos}
            alt="Colégio Talentos"
            className="login-logo"
          />

          <h1>
            Sistema de Demandas TI
          </h1>

          <p>
            Colégio Talentos
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={entrar}
        >
          <label htmlFor="email">
            E-mail
          </label>

          <input
            id="email"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            autoComplete="email"
            required
          />

          <label htmlFor="senha">
            Senha
          </label>

          <input
            id="senha"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(event) =>
              setSenha(
                event.target.value
              )
            }
            autoComplete="current-password"
            required
          />

          {erro && (
            <div className="login-erro">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
          >
            {carregando
              ? 'Entrando...'
              : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login