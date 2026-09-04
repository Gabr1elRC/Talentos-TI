import { useState } from 'react'
import '../styles/ApontamentoManualModal.css'

export type NovoApontamentoManual = {
  data: string
  inicio: string
  fim: string
  acao: string
  justificativa: string
}

type ApontamentoManualModalProps = {
  aberto: boolean
  onFechar: () => void
  onSalvar: (apontamento: NovoApontamentoManual) => void
}

function ApontamentoManualModal({
  aberto,
  onFechar,
  onSalvar,
}: ApontamentoManualModalProps) {
  const [data, setData] = useState('')
  const [inicio, setInicio] = useState('')
  const [fim, setFim] = useState('')
  const [acao, setAcao] = useState('')
  const [justificativa, setJustificativa] = useState('')

  if (!aberto) return null

  function salvar(event: React.FormEvent) {
    event.preventDefault()

    onSalvar({
      data,
      inicio,
      fim,
      acao,
      justificativa,
    })

    limparFormulario()
    onFechar()
  }

  function limparFormulario() {
    setData('')
    setInicio('')
    setFim('')
    setAcao('')
    setJustificativa('')
  }

  return (
    <div className="apontamento-overlay">
      <div className="apontamento-modal">
        <div className="apontamento-header">
          <div>
            <h2>Apontamento Manual</h2>
            <p>
              Registre um período trabalhado que não foi
              contabilizado pelo cronômetro.
            </p>
          </div>

          <button
            type="button"
            className="apontamento-fechar"
            onClick={onFechar}
          >
            ×
          </button>
        </div>

        <form
          className="apontamento-form"
          onSubmit={salvar}
        >
          <div className="apontamento-campo">
            <label htmlFor="apontamento-data">
              Data
            </label>

            <input
              id="apontamento-data"
              type="date"
              value={data}
              onChange={(event) =>
                setData(event.target.value)
              }
              required
            />
          </div>

          <div className="apontamento-horarios">
            <div className="apontamento-campo">
              <label htmlFor="apontamento-inicio">
                Início
              </label>

              <input
                id="apontamento-inicio"
                type="time"
                value={inicio}
                onChange={(event) =>
                  setInicio(event.target.value)
                }
                required
              />
            </div>

            <div className="apontamento-campo">
              <label htmlFor="apontamento-fim">
                Fim
              </label>

              <input
                id="apontamento-fim"
                type="time"
                value={fim}
                onChange={(event) =>
                  setFim(event.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="apontamento-campo">
            <label htmlFor="apontamento-acao">
              Ação executada
            </label>

            <input
              id="apontamento-acao"
              type="text"
              value={acao}
              onChange={(event) =>
                setAcao(event.target.value)
              }
              placeholder="Ex.: Configuração do computador"
              required
            />
          </div>

          <div className="apontamento-campo">
            <label htmlFor="apontamento-justificativa">
              Justificativa
            </label>

            <textarea
              id="apontamento-justificativa"
              value={justificativa}
              onChange={(event) =>
                setJustificativa(event.target.value)
              }
              placeholder="Ex.: Esqueci de iniciar o cronômetro"
              rows={3}
              required
            />
          </div>

          <div className="apontamento-acoes">
            <button
              type="button"
              className="apontamento-cancelar"
              onClick={onFechar}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="apontamento-salvar"
            >
              Salvar apontamento
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ApontamentoManualModal