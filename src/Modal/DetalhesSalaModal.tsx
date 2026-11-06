type SalaPainel = {
  sala: {
    id: number
    nome: string
    codigo: string
  }

  turma: {
    id: number
    nome: string
  } | null

  aulaAtual: {
    horarioId: number
    disciplina: string
    professor: string
    horaInicio: string
    horaFim: string
  } | null

  conferencia: {
    id: number
    status: 'OK' | 'SUPORTE'
    descricao: string | null
    atendimentoStatus:
      | 'PENDENTE'
      | 'EM_ATENDIMENTO'
      | 'RESOLVIDO'
      | null
    registradoEm: string
  } | null

  situacao:
    | 'OK'
    | 'SUPORTE'
    | 'AGUARDANDO'
    | 'SEM_AULA'
    | 'SEM_TURMA'
    | 'RESOLVIDO'
}

type Props = {
  sala: SalaPainel
  onFechar: () => void

  onAlterarStatus: (
    conferenciaId: number,
    atendimentoStatus:
      | 'PENDENTE'
      | 'EM_ATENDIMENTO'
      | 'RESOLVIDO'
  ) => void

  onEnviarLembrete: (
    salaId: number
  ) => void
}

function DetalhesSalaModal({
  sala,
  onFechar,
  onAlterarStatus,
  onEnviarLembrete,
}: Props) {
  return (
    <div className="sala-modal-fundo">
      <div className="sala-modal">

        <div className="sala-modal-topo">
          <div>
            <h2>
              {sala.sala.nome}
            </h2>

            <span>
              {sala.turma?.nome ??
                'Sem turma'}
            </span>
          </div>

          <button
            type="button"
            onClick={onFechar}
          >
            ✕
          </button>
        </div>

        <div className="sala-modal-bloco">
          <span>
            Disciplina
          </span>

          <strong>
            {sala.aulaAtual
              ?.disciplina ??
              '-'}
          </strong>
        </div>

        <div className="sala-modal-bloco">
          <span>
            Professor
          </span>

          <strong>
            {sala.aulaAtual
              ?.professor ??
              '-'}
          </strong>
        </div>

        {sala.aulaAtual && (
          <div className="sala-modal-bloco">
            <span>
              Horário
            </span>

            <strong>
              {sala.aulaAtual
                .horaInicio
                .slice(0, 5)}

              {' - '}

              {sala.aulaAtual
                .horaFim
                .slice(0, 5)}
            </strong>
          </div>
        )}

        {sala.conferencia
          ?.descricao && (
          <div className="sala-modal-problema">
            <span>
              Problema informado
            </span>

            <strong>
              {
                sala.conferencia
                  .descricao
              }
            </strong>
          </div>
        )}

        {sala.conferencia
          ?.status ===
          'SUPORTE' && (
          <div className="sala-modal-atendimento">
            <span>
              Status do atendimento
            </span>

            <div className="sala-modal-acoes">

              <button
                type="button"
                className={
                  sala.conferencia
                    .atendimentoStatus ===
                  'PENDENTE'
                    ? 'ativo'
                    : ''
                }
                onClick={() =>
                  onAlterarStatus(
                    sala.conferencia!.id,
                    'PENDENTE'
                  )
                }
              >
                Pendente
              </button>

              <button
                type="button"
                className={
                  sala.conferencia
                    .atendimentoStatus ===
                  'EM_ATENDIMENTO'
                    ? 'ativo'
                    : ''
                }
                onClick={() =>
                  onAlterarStatus(
                    sala.conferencia!.id,
                    'EM_ATENDIMENTO'
                  )
                }
              >
                Em atendimento
              </button>

              <button
                type="button"
                className={
                  sala.conferencia
                    .atendimentoStatus ===
                  'RESOLVIDO'
                    ? 'ativo'
                    : ''
                }
                onClick={() =>
                  onAlterarStatus(
                    sala.conferencia!.id,
                    'RESOLVIDO'
                  )
                }
              >
                Resolvido
              </button>

            </div>
          </div>
        )}

        {/* ESTE BOTÃO APARECE
            SEMPRE NO MODAL */}
        <div className="sala-modal-lembrete">

  <button
    type="button"
    disabled={!sala.aulaAtual}
    onClick={() =>
      onEnviarLembrete(
        sala.sala.id
      )
    }
  >
    🔔 Enviar lembrete para a sala
  </button>

  {sala.aulaAtual ? (
    <small>
      Solicita ao professor que
      confirme se está tudo certo
      ou informe se precisa de
      suporte.
    </small>
  ) : (
    <small>
      Sem aula em andamento.
      Não é possível solicitar
      conferência neste momento.
    </small>
  )}

</div>

      </div>
    </div>
  )
}

export default DetalhesSalaModal