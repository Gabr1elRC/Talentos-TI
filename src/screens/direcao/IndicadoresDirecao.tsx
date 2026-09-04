import type { Tarefa } from '../../types/Tarefas'

type IndicadoresDirecaoProps = {
  tarefas: Tarefa[]
}

function IndicadoresDirecao({
  tarefas: _tarefas,
}: IndicadoresDirecaoProps) {
  const prazosCriticos = [
    {
      id: 1,
      titulo: 'Atualização de firewall',
      setor: 'Infraestrutura',
      responsavel: 'Rafael Lima',
      prazo: '20/05/2025',
      prioridade: 'Alta',
    },
    {
      id: 2,
      titulo: 'Implantação de MFA',
      setor: 'Segurança',
      responsavel: 'Juliana Santos',
      prazo: '22/05/2025',
      prioridade: 'Alta',
    },
    {
      id: 3,
      titulo: 'Backup servidor pedagógico',
      setor: 'Infraestrutura',
      responsavel: 'Carlos Eduardo',
      prazo: '25/05/2025',
      prioridade: 'Média',
    },
    {
      id: 4,
      titulo: 'Licenças Google Workspace',
      setor: 'Administração',
      responsavel: 'Thiago Almeida',
      prazo: '27/05/2025',
      prioridade: 'Média',
    },
  ]

  const movimentacoes = [
    {
      id: 1,
      tipo: 'concluida',
      titulo: 'Demanda #128 concluída',
      descricao:
        'Implantação de nova internet · por Rafael Lima',
      horario: '09:45',
    },
    {
      id: 2,
      tipo: 'nova',
      titulo: 'Nova demanda #129 criada',
      descricao:
        'Substituição de notebook · por Juliana Santos',
      horario: '09:20',
    },
    {
      id: 3,
      tipo: 'analise',
      titulo: 'Demanda #121 em análise',
      descricao:
        'Atualização de antivírus · por Carlos Eduardo',
      horario: '08:55',
    },
    {
      id: 4,
      tipo: 'comentario',
      titulo: 'Comentário em #115',
      descricao:
        'Adicionada exceção de software · por Thiago Almeida',
      horario: '08:30',
    },
  ]

  return (
    <>
      <div className="direcao-header">
        <div>
          <h1>Painel da Direção</h1>

          <p>
            Visão estratégica das demandas e indicadores
            do setor de TI
          </p>
        </div>

        <div className="direcao-usuario">
          <div className="direcao-avatar">
            👤
          </div>

          <div>
            <strong>Direção</strong>
            <span>Setor de TI</span>
          </div>
        </div>
      </div>

      <section className="direcao-indicadores">
        <div className="direcao-indicador">
          <div className="direcao-indicador-icone azul">
            📋
          </div>

          <div>
            <span>Total de demandas</span>
            <strong>128</strong>
            <small>
              Todas as demandas registradas
            </small>
          </div>
        </div>

        <div className="direcao-indicador">
          <div className="direcao-indicador-icone amarelo">
            ◷
          </div>

          <div>
            <span>Em andamento</span>
            <strong>23</strong>
            <small>
              18% do total de demandas
            </small>
          </div>
        </div>

        <div className="direcao-indicador">
          <div className="direcao-indicador-icone vermelho">
            ⏱
          </div>

          <div>
            <span>Atrasadas</span>
            <strong>7</strong>
            <small>
              5% do total de demandas
            </small>
          </div>
        </div>

        <div className="direcao-indicador">
          <div className="direcao-indicador-icone verde">
            ✓
          </div>

          <div>
            <span>Concluídas no mês</span>
            <strong>64</strong>
            <small>
              50% do total de demandas
            </small>
          </div>
        </div>
      </section>

      <section className="direcao-grid-principal">
        <div className="direcao-card direcao-panorama">
          <h2>
            Panorama das demandas
          </h2>

          <div className="direcao-panorama-conteudo">
            <div className="direcao-grafico-donut">
              <div className="direcao-grafico-centro">
                <strong>128</strong>
                <span>Total</span>
              </div>
            </div>

            <div className="direcao-legenda">
              <div>
                <span className="bolinha nova" />
                <span>Nova</span>
                <strong>20</strong>
              </div>

              <div>
                <span className="bolinha analise" />
                <span>Em análise</span>
                <strong>14</strong>
              </div>

              <div>
                <span className="bolinha planejada" />
                <span>Planejada</span>
                <strong>11</strong>
              </div>

              <div>
                <span className="bolinha andamento" />
                <span>Em andamento</span>
                <strong>23</strong>
              </div>

              <div>
                <span className="bolinha terceiro" />
                <span>Aguardando terceiro</span>
                <strong>10</strong>
              </div>

              <div>
                <span className="bolinha bloqueada" />
                <span>Bloqueada</span>
                <strong>6</strong>
              </div>

              <div>
                <span className="bolinha concluida" />
                <span>Concluída</span>
                <strong>44</strong>
              </div>
            </div>
          </div>

          <small className="direcao-atualizacao">
            Atualizado em 20/05/2025 09:54
          </small>
        </div>

        <div className="direcao-card direcao-prazos">
          <h2>
            Prazos críticos
          </h2>

          <div className="direcao-prazos-header">
            <span>Demanda</span>
            <span>Responsável</span>
            <span>Prazo</span>
            <span>Prioridade</span>
          </div>

          {prazosCriticos.map((item) => (
            <div
              key={item.id}
              className="direcao-prazo-item"
            >
              <div className="direcao-prazo-demanda">
                <div className="direcao-prazo-icone">
                  📋
                </div>

                <div>
                  <strong>
                    {item.titulo}
                  </strong>

                  <span>
                    {item.setor}
                  </span>
                </div>
              </div>

              <span>
                {item.responsavel}
              </span>

              <span className="direcao-prazo-data">
                {item.prazo}
              </span>

              <span
                className={`direcao-prioridade ${
                  item.prioridade === 'Alta'
                    ? 'alta'
                    : 'media'
                }`}
              >
                {item.prioridade}
              </span>
            </div>
          ))}

          <button
            type="button"
            className="direcao-link"
          >
            Ver todas as demandas críticas →
          </button>
        </div>
      </section>

      <section className="direcao-grid-inferior">
        <div className="direcao-card">
          <h2>
            Demandas por setor
          </h2>

          <div className="direcao-setores">
            <div>
              <span>Administrativo</span>

              <div className="barra">
                <div
                  style={{
                    width: '90%',
                  }}
                />
              </div>

              <strong>45</strong>
            </div>

            <div>
              <span>Coordenação</span>

              <div className="barra roxa">
                <div
                  style={{
                    width: '62%',
                  }}
                />
              </div>

              <strong>28</strong>
            </div>

            <div>
              <span>Sala Google</span>

              <div className="barra cinza">
                <div
                  style={{
                    width: '49%',
                  }}
                />
              </div>

              <strong>22</strong>
            </div>

            <div>
              <span>Financeiro</span>

              <div className="barra amarela">
                <div
                  style={{
                    width: '40%',
                  }}
                />
              </div>

              <strong>18</strong>
            </div>

            <div>
              <span>Secretaria</span>

              <div className="barra laranja">
                <div
                  style={{
                    width: '33%',
                  }}
                />
              </div>

              <strong>15</strong>
            </div>
          </div>

          <button
            type="button"
            className="direcao-link"
          >
            Total de demandas por setor
          </button>
        </div>

        <div className="direcao-card">
          <h2>
            Desempenho da equipe
          </h2>

          <div className="direcao-equipe-header">
            <span />
            <span>Abertas</span>
            <span>Concluídas</span>
            <span>Taxa</span>
          </div>

          <div className="direcao-equipe-item">
            <strong>
              👤 Analista
            </strong>

            <span>34</span>
            <span>56</span>

            <div>
              <span>62%</span>

              <div className="taxa">
                <div
                  style={{
                    width: '62%',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="direcao-equipe-item">
            <strong>
              👤 Estagiário
            </strong>

            <span>12</span>
            <span>22</span>

            <div>
              <span>65%</span>

              <div className="taxa">
                <div
                  style={{
                    width: '65%',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="direcao-equipe-item">
            <strong>
              👥 Terceiros
            </strong>

            <span>7</span>
            <span>18</span>

            <div>
              <span>72%</span>

              <div className="taxa">
                <div
                  style={{
                    width: '72%',
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="direcao-link"
          >
            Ver desempenho completo →
          </button>
        </div>

        <div className="direcao-card">
          <h2>
            Últimas movimentações
          </h2>

          <div className="direcao-movimentacoes">
            {movimentacoes.map(
              (movimento) => (
                <div
                  key={movimento.id}
                  className="direcao-movimento"
                >
                  <span
                    className={`movimento-ponto ${movimento.tipo}`}
                  />

                  <div>
                    <strong>
                      {movimento.titulo}
                    </strong>

                    <span>
                      {movimento.descricao}
                    </span>
                  </div>

                  <small>
                    {movimento.horario}
                  </small>
                </div>
              )
            )}
          </div>

          <button
            type="button"
            className="direcao-link"
          >
            Ver histórico completo →
          </button>
        </div>
      </section>
    </>
  )
}

export default IndicadoresDirecao