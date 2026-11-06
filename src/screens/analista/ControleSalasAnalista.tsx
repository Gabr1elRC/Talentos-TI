import {
  useEffect,
  useState,
} from 'react'

import DetalhesSalaModal from '../../Modal/DetalhesSalaModal'

import '../../styles/analista/ControleSalasAnalista.css'
import '../../styles/analista/DetalhesSalaModal.css'

const API_URL =
  import.meta.env.VITE_API_URL

type SituacaoSala =
  | 'OK'
  | 'SUPORTE'
  | 'RESOLVIDO'
  | 'AGUARDANDO'
  | 'SEM_AULA'
  | 'SEM_TURMA'

type FiltroSituacao =
  | 'TODAS'
  | SituacaoSala

type StatusConexao =
  | 'ONLINE'
  | 'INSTAVEL'
  | 'OFFLINE'

type SalaPainel = {
  sala: {
    id: number
    nome: string
    codigo: string
    ultimoPing: string | null
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

  situacao: SituacaoSala
}

function ControleSalasAnalista() {
  const [salas, setSalas] =
    useState<SalaPainel[]>([])

  const [carregando, setCarregando] =
    useState(true)

  const [erro, setErro] =
    useState('')

  const [
    salaSelecionada,
    setSalaSelecionada,
  ] = useState<SalaPainel | null>(null)

  const [
    filtroSituacao,
    setFiltroSituacao,
  ] = useState<FiltroSituacao>('TODAS')

  async function carregarSalas() {
    try {
      setErro('')

      const resposta =
        await fetch(
          `${API_URL}/salas/painel`
        )

      const dados =
        await resposta.json()

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
            'Erro ao carregar salas.'
        )
      }

      setSalas(
        dados.salas ?? []
      )
    } catch (erro) {
      console.error(
        'Erro ao carregar painel de salas:',
        erro
      )

      setErro(
        'Não foi possível carregar as salas.'
      )
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarSalas()

    const intervalo =
      window.setInterval(
        carregarSalas,
        30000
      )

    return () => {
      window.clearInterval(
        intervalo
      )
    }
  }, [])

  async function alterarStatusAtendimento(
    conferenciaId: number,
    atendimentoStatus:
      | 'PENDENTE'
      | 'EM_ATENDIMENTO'
      | 'RESOLVIDO'
  ) {
    try {
      const resposta =
        await fetch(
          `${API_URL}/salas/conferencias/${conferenciaId}/status`,
          {
            method: 'PATCH',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              atendimentoStatus,
            }),
          }
        )

      const dados =
        await resposta.json()

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
            'Erro ao alterar status.'
        )
      }

      await carregarSalas()

      setSalaSelecionada(
        (salaAtual) => {
          if (
            !salaAtual ||
            !salaAtual.conferencia
          ) {
            return salaAtual
          }

          return {
            ...salaAtual,

            conferencia: {
              ...salaAtual.conferencia,
              atendimentoStatus,
            },

            situacao:
              atendimentoStatus ===
              'RESOLVIDO'
                ? 'RESOLVIDO'
                : 'SUPORTE',
          }
        }
      )
    } catch (erro) {
      console.error(
        'Erro ao alterar atendimento:',
        erro
      )

      alert(
        'Não foi possível alterar o status do atendimento.'
      )
    }
  }

  async function enviarLembreteSala(
    salaId: number
  ) {
    try {
      const resposta =
        await fetch(
          `${API_URL}/salas/${salaId}/lembrete`,
          {
            method: 'POST',
          }
        )

      const dados =
        await resposta.json()

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
            'Erro ao enviar lembrete.'
        )
      }

      alert(
        'Lembrete enviado com sucesso.'
      )
    } catch (erro) {
      console.error(
        'Erro ao enviar lembrete:',
        erro
      )

      alert(
        'Não foi possível enviar o lembrete.'
      )
    }
  }

  function classeStatus(
    situacao: SituacaoSala
  ) {
    if (situacao === 'OK') {
      return 'ok'
    }

    if (
      situacao === 'SUPORTE'
    ) {
      return 'suporte'
    }

    if (
      situacao === 'RESOLVIDO'
    ) {
      return 'resolvido'
    }

    if (
      situacao === 'AGUARDANDO'
    ) {
      return 'aguardando'
    }

    return 'sem-aula'
  }

  function textoStatus(
    situacao: SituacaoSala
  ) {
    if (situacao === 'OK') {
      return 'Tudo OK'
    }

    if (
      situacao === 'SUPORTE'
    ) {
      return 'Suporte solicitado'
    }

    if (
      situacao === 'RESOLVIDO'
    ) {
      return 'Resolvido'
    }

    if (
      situacao === 'AGUARDANDO'
    ) {
      return 'Aguardando conferência'
    }

    if (
      situacao === 'SEM_TURMA'
    ) {
      return 'Sem turma'
    }

    return 'Sem aula'
  }

  /*
   * =========================
   * STATUS DE CONEXÃO
   * =========================
   *
   * Heartbeat da sala:
   * a cada 90 segundos.
   *
   * Até 2 minutos:
   * ONLINE
   *
   * Entre 2 e 5 minutos:
   * INSTÁVEL
   *
   * Acima de 5 minutos:
   * OFFLINE
   */

  function statusConexao(
    ultimoPing:
      | string
      | null
      | undefined
  ): StatusConexao {
    if (!ultimoPing) {
      return 'OFFLINE'
    }

    const dataPing =
      new Date(
        ultimoPing
      ).getTime()

    if (
      Number.isNaN(
        dataPing
      )
    ) {
      return 'OFFLINE'
    }

    const agora =
      Date.now()

    const diferenca =
      agora - dataPing

    const doisMinutos =
      2 * 60 * 1000

    const cincoMinutos =
      5 * 60 * 1000

    if (
      diferenca <=
      doisMinutos
    ) {
      return 'ONLINE'
    }

    if (
      diferenca <=
      cincoMinutos
    ) {
      return 'INSTAVEL'
    }

    return 'OFFLINE'
  }

  function textoConexao(
    status: StatusConexao
  ) {
    if (
      status === 'ONLINE'
    ) {
      return 'Online'
    }

    if (
      status === 'INSTAVEL'
    ) {
      return 'Instável'
    }

    return 'Offline'
  }

  function classeConexao(
    status: StatusConexao
  ) {
    if (
      status === 'ONLINE'
    ) {
      return 'online'
    }

    if (
      status === 'INSTAVEL'
    ) {
      return 'instavel'
    }

    return 'offline'
  }

  function textoUltimoPing(
    ultimoPing:
      | string
      | null
      | undefined
  ) {
    if (!ultimoPing) {
      return 'Nunca conectado'
    }

    const data =
      new Date(
        ultimoPing
      )

    if (
      Number.isNaN(
        data.getTime()
      )
    ) {
      return 'Sem informação'
    }

    return data.toLocaleTimeString(
      'pt-BR',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    )
  }

  const totalSuporte =
    salas.filter(
      (item) =>
        item.situacao ===
        'SUPORTE'
    ).length

  const totalAguardando =
    salas.filter(
      (item) =>
        item.situacao ===
        'AGUARDANDO'
    ).length

  const totalOk =
    salas.filter(
      (item) =>
        item.situacao ===
        'OK'
    ).length

  const totalResolvido =
    salas.filter(
      (item) =>
        item.situacao ===
        'RESOLVIDO'
    ).length

  const salasFiltradas =
    filtroSituacao === 'TODAS'
      ? salas
      : salas.filter(
          (item) =>
            item.situacao ===
            filtroSituacao
        )

  const salasOrdenadas =
    [...salasFiltradas].sort(
      (a, b) => {
        const prioridade: Record<
          SituacaoSala,
          number
        > = {
          SUPORTE: 1,
          AGUARDANDO: 2,
          RESOLVIDO: 3,
          OK: 4,
          SEM_AULA: 5,
          SEM_TURMA: 6,
        }

        return (
          prioridade[a.situacao] -
          prioridade[b.situacao]
        )
      }
    )

  if (carregando) {
    return (
      <div className="analista-card">
        Carregando salas...
      </div>
    )
  }

  return (
    <>
      <div className="analista-header">
        <div>
          <h1>
            Controle de Salas
          </h1>

          <p>
            Acompanhe as aulas em
            andamento, solicitações
            de suporte e conexão
            dos computadores.
          </p>
        </div>
      </div>

      <div className="salas-resumo">

        <div className="salas-resumo-card suporte">
          <span>
            Suporte
          </span>

          <strong>
            {totalSuporte}
          </strong>
        </div>

        <div className="salas-resumo-card aguardando">
          <span>
            Aguardando
          </span>

          <strong>
            {totalAguardando}
          </strong>
        </div>

        <div className="salas-resumo-card resolvido">
          <span>
            Resolvidos
          </span>

          <strong>
            {totalResolvido}
          </strong>
        </div>

        <div className="salas-resumo-card ok">
          <span>
            Tudo OK
          </span>

          <strong>
            {totalOk}
          </strong>
        </div>

      </div>

      <div className="salas-filtros">

        <button
          type="button"
          className={
            filtroSituacao ===
            'TODAS'
              ? 'ativo'
              : ''
          }
          onClick={() =>
            setFiltroSituacao(
              'TODAS'
            )
          }
        >
          Todas
        </button>

        <button
          type="button"
          className={
            filtroSituacao ===
            'SUPORTE'
              ? 'ativo'
              : ''
          }
          onClick={() =>
            setFiltroSituacao(
              'SUPORTE'
            )
          }
        >
          Suporte
        </button>

        <button
          type="button"
          className={
            filtroSituacao ===
            'AGUARDANDO'
              ? 'ativo'
              : ''
          }
          onClick={() =>
            setFiltroSituacao(
              'AGUARDANDO'
            )
          }
        >
          Aguardando
        </button>

        <button
          type="button"
          className={
            filtroSituacao ===
            'RESOLVIDO'
              ? 'ativo'
              : ''
          }
          onClick={() =>
            setFiltroSituacao(
              'RESOLVIDO'
            )
          }
        >
          Resolvido
        </button>

        <button
          type="button"
          className={
            filtroSituacao ===
            'OK'
              ? 'ativo'
              : ''
          }
          onClick={() =>
            setFiltroSituacao(
              'OK'
            )
          }
        >
          Tudo OK
        </button>

        <button
          type="button"
          className={
            filtroSituacao ===
            'SEM_AULA'
              ? 'ativo'
              : ''
          }
          onClick={() =>
            setFiltroSituacao(
              'SEM_AULA'
            )
          }
        >
          Sem aula
        </button>

        <button
          type="button"
          className={
            filtroSituacao ===
            'SEM_TURMA'
              ? 'ativo'
              : ''
          }
          onClick={() =>
            setFiltroSituacao(
              'SEM_TURMA'
            )
          }
        >
          Sem turma
        </button>

      </div>

      {erro && (
        <div className="analista-card">
          {erro}
        </div>
      )}

      <div className="salas-legenda">

        <span>
          <i className="status-dot ok" />
          Tudo OK
        </span>

        <span>
          <i className="status-dot suporte" />
          Suporte solicitado
        </span>

        <span>
          <i className="status-dot aguardando" />
          Aguardando conferência
        </span>

        <span>
          <i className="status-dot resolvido" />
          Resolvido
        </span>

        <span>
          <i className="status-dot sem-aula" />
          Sem aula
        </span>

      </div>

      {salasOrdenadas.length ===
      0 ? (
        <div className="analista-card">
          Nenhuma sala encontrada
          neste filtro.
        </div>
      ) : (
        <section className="salas-grid">

          {salasOrdenadas.map(
            (item) => {
              const statusClasse =
                classeStatus(
                  item.situacao
                )

              const conexao =
                statusConexao(
                  item.sala
                    .ultimoPing
                )

              const conexaoClasse =
                classeConexao(
                  conexao
                )

              return (
                <article
                  key={item.sala.id}
                  className={`sala-controle-card ${statusClasse}`}
                >

                  <div className="sala-controle-topo">

                    <div>

                      <span className="sala-controle-numero">
                        {
                          item
                            .sala.nome
                        }
                      </span>

                      <h2>
                        {item.turma
                          ?.nome ??
                          'Sem turma'}
                      </h2>

                    </div>

                    <div className="sala-status-area">

                      <span
                        className={`sala-conexao-status ${conexaoClasse}`}
                        title={`Último sinal: ${textoUltimoPing(
                          item.sala
                            .ultimoPing
                        )}`}
                      >
                        <i />

                        {textoConexao(
                          conexao
                        )}
                      </span>

                      <span
                        className={`sala-controle-status ${statusClasse}`}
                      >
                        {textoStatus(
                          item.situacao
                        )}
                      </span>

                    </div>

                  </div>

                  <div className="sala-controle-info">

                    <div>
                      <span>
                        Disciplina
                      </span>

                      <strong>
                        {item.aulaAtual
                          ?.disciplina ??
                          '-'}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Professor
                      </span>

                      <strong>
                        {item.aulaAtual
                          ?.professor ??
                          '-'}
                      </strong>
                    </div>

                  </div>

                  {item.aulaAtual && (
                    <div className="sala-controle-horario">

                      {item.aulaAtual
                        .horaInicio
                        .slice(
                          0,
                          5
                        )}

                      {' - '}

                      {item.aulaAtual
                        .horaFim
                        .slice(
                          0,
                          5
                        )}

                    </div>
                  )}

                  <div className="sala-ultimo-ping">

                    <span>
                      Último sinal do PC:
                    </span>

                    <strong>
                      {textoUltimoPing(
                        item.sala
                          .ultimoPing
                      )}
                    </strong>

                  </div>

                  {(
                    item.situacao ===
                      'SUPORTE' ||
                    item.situacao ===
                      'RESOLVIDO'
                  ) &&
                    item.conferencia
                      ?.descricao && (
                      <div
                        className={
                          item.situacao ===
                          'RESOLVIDO'
                            ? 'sala-controle-problema resolvido'
                            : 'sala-controle-problema'
                        }
                      >

                        <span>
                          {item.situacao ===
                          'RESOLVIDO'
                            ? 'Problema resolvido'
                            : 'Problema informado'}
                        </span>

                        <strong>
                          {
                            item
                              .conferencia
                              .descricao
                          }
                        </strong>

                      </div>
                    )}

                  <button
                    type="button"
                    className="sala-controle-abrir"
                    onClick={() =>
                      setSalaSelecionada(
                        item
                      )
                    }
                  >
                    Ver detalhes
                  </button>

                </article>
              )
            }
          )}

        </section>
      )}

      {salaSelecionada && (
        <DetalhesSalaModal
          sala={
            salaSelecionada
          }

          onFechar={() =>
            setSalaSelecionada(
              null
            )
          }

          onAlterarStatus={
            alterarStatusAtendimento
          }

          onEnviarLembrete={
            enviarLembreteSala
          }
        />
      )}

    </>
  )
}

export default ControleSalasAnalista