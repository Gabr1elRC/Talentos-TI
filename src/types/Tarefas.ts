export type Prioridade = 'Baixa' | 'Média' | 'Alta' | 'Crítica'

export type Comentario = {
  id: number
  autor: string
  texto: string
  horario: string
}

export type RegistroTempo = {
  id: number
  usuario: string
  data: string
  inicio: string
  fim: string
  duracaoMinutos: number
  acao: string
  origem: 'Cronômetro' | 'Manual'
  justificativa?: string
}

export type Tarefa = {
  id: number
  titulo: string
  descricao: string
  solicitante: string
  setor: string
  categoria: string
  prioridade: Prioridade
  responsavel: string
  prazo: string
  tempoPrevisto: number
  status: string
  comentarios: Comentario[]
  registrosTempo:RegistroTempo[]
  historicoStatus?: HistoricoStatus[]
}

export type HistoricoStatus = {
  id: number
  usuario: string
  statusAnterior: string | null
  statusNovo: string
  criadoEm: string
}