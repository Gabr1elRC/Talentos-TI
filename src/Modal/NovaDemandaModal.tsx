import { useState } from 'react'
import '../styles/NovaDemandaModal.css'

type Prioridade =
  | 'Baixa'
  | 'Média'
  | 'Alta'
  | 'Crítica'

export type NovaDemanda = {
  titulo: string
  descricao: string
  solicitante: string
  setor: string
  categoria: string
  prioridade: Prioridade
  responsavel: string
  prazo: string
  tempoPrevisto: number
}

type NovaDemandaModalProps = {
  aberto: boolean
  onFechar: () => void
  onSalvar: (
    demanda: NovaDemanda
  ) => void
}

function NovaDemandaModal({
  aberto,
  onFechar,
  onSalvar,
}: NovaDemandaModalProps) {
  const [titulo, setTitulo] =
    useState('')

  const [descricao, setDescricao] =
    useState('')

  const [
    solicitante,
    setSolicitante,
  ] = useState('')

  const [setor, setSetor] =
    useState('')

  const [categoria, setCategoria] =
    useState('')

  const [
    prioridade,
    setPrioridade,
  ] =
    useState<Prioridade>('Média')

  const [
    responsavel,
    setResponsavel,
  ] = useState('')

  const [prazo, setPrazo] =
    useState('')

  const [
    tempoPrevisto,
    setTempoPrevisto,
  ] = useState('')

  if (!aberto) {
    return null
  }

  function salvar(
    event: React.FormEvent
  ) {
    event.preventDefault()

    const novaDemanda: NovaDemanda = {
      titulo,
      descricao,
      solicitante,
      setor,
      categoria,
      prioridade,
      responsavel,
      prazo,
      tempoPrevisto:
        Number(tempoPrevisto),
    }

    onSalvar(novaDemanda)

    limparFormulario()

    onFechar()
  }

  function limparFormulario() {
    setTitulo('')
    setDescricao('')
    setSolicitante('')
    setSetor('')
    setCategoria('')
    setPrioridade('Média')
    setResponsavel('')
    setPrazo('')
    setTempoPrevisto('')
  }

  return (
    <div className="modal-overlay">
      <div className="modal-demanda">
        <div className="modal-header">
          <div>
            <h2>Nova Demanda</h2>

            <p>
              Cadastre uma nova
              solicitação de TI.
            </p>
          </div>

          <button
            type="button"
            className="modal-fechar"
            onClick={onFechar}
          >
            ×
          </button>
        </div>

        <form
          className="demanda-form"
          onSubmit={salvar}
        >
          <div className="form-grupo form-grupo-completo">
            <label htmlFor="titulo">
              Título
            </label>

            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(event) =>
                setTitulo(
                  event.target.value
                )
              }
              placeholder="Digite o título da demanda"
              required
            />
          </div>

          <div className="form-grupo form-grupo-completo">
            <label htmlFor="descricao">
              Descrição
            </label>

            <textarea
              id="descricao"
              rows={4}
              value={descricao}
              onChange={(event) =>
                setDescricao(
                  event.target.value
                )
              }
              placeholder="Descreva a demanda"
              required
            />
          </div>

          <div className="form-grupo">
            <label htmlFor="solicitante">
              Solicitante
            </label>

            <input
              id="solicitante"
              type="text"
              value={solicitante}
              onChange={(event) =>
                setSolicitante(
                  event.target.value
                )
              }
              placeholder="Nome do solicitante"
              required
            />
          </div>

          <div className="form-grupo">
            <label htmlFor="setor">
              Setor
            </label>

            <select
              id="setor"
              value={setor}
              onChange={(event) =>
                setSetor(
                  event.target.value
                )
              }
              required
            >
              <option value="">
                Selecione
              </option>

              <option>
                Secretaria
              </option>

              <option>
                Coordenação
              </option>

              <option>
                Direção
              </option>

              <option>
                Financeiro
              </option>

              <option>
                Pedagógico
              </option>

              <option>
                TI
              </option>
            </select>
          </div>

          <div className="form-grupo">
            <label htmlFor="categoria">
              Categoria
            </label>

            <select
              id="categoria"
              value={categoria}
              onChange={(event) =>
                setCategoria(
                  event.target.value
                )
              }
              required
            >
              <option value="">
                Selecione
              </option>

              <option>
                Hardware
              </option>

              <option>
                Software
              </option>

              <option>
                Rede
              </option>

              <option>
                Impressora
              </option>

              <option>
                Acesso
              </option>

              <option>
                Outros
              </option>
            </select>
          </div>

          <div className="form-grupo">
            <label htmlFor="prioridade">
              Prioridade
            </label>

            <select
              id="prioridade"
              value={prioridade}
              onChange={(event) =>
                setPrioridade(
                  event.target
                    .value as Prioridade
                )
              }
            >
              <option>
                Baixa
              </option>

              <option>
                Média
              </option>

              <option>
                Alta
              </option>

              <option>
                Crítica
              </option>
            </select>
          </div>

          <div className="form-grupo">
            <label htmlFor="responsavel">
              Responsável
            </label>

            <select
              id="responsavel"
              value={responsavel}
              onChange={(event) =>
                setResponsavel(
                  event.target.value
                )
              }
              required
            >
              <option value="">
                Selecione o responsável
              </option>

              <option value="Estagiário">
                Estagiário
              </option>

              <option value="Analista">
                Analista
              </option>
            </select>
          </div>

          <div className="form-grupo">
            <label htmlFor="prazo">
              Prazo
            </label>

            <input
              id="prazo"
              type="date"
              value={prazo}
              onChange={(event) =>
                setPrazo(
                  event.target.value
                )
              }
              required
            />
          </div>

          <div className="form-grupo">
            <label htmlFor="tempoPrevisto">
              Tempo previsto
            </label>

            <input
              id="tempoPrevisto"
              type="number"
              min="0"
              step="0.5"
              value={tempoPrevisto}
              onChange={(event) =>
                setTempoPrevisto(
                  event.target.value
                )
              }
              placeholder="Horas"
              required
            />
          </div>

          <div className="modal-acoes form-grupo-completo">
            <button
              type="button"
              className="botao-cancelar"
              onClick={onFechar}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="botao-salvar"
            >
              Salvar demanda
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NovaDemandaModal