// Serviços para consumir as APIs de resíduos

export interface Residuo {
  id: number
  tipoResiduo: string
  descricao: string
  quantidade: number
  unidade: string
  condicoes: string
  disponibilidade: string
  preco?: string
  imagens: Array<{
    id: number
    url: string
  }>
  empresa: {
    id: number
    nome: string
    email: string
    telefone: string
    cidade: string
    estado: string
  }
  totalImagens: number
}

export interface ResiduoStats {
  totais: {
    residuos: number
    comImagem: number
    semImagem: number
    percentualComImagem: number
  }
  porTipo: Array<{
    tipo: string
    quantidade: number
  }>
  porDisponibilidade: Array<{
    disponibilidade: string
    quantidade: number
  }>
  quantidadePorUnidade: Array<{
    unidade: string
    quantidade: number
  }>
}

export interface SearchFilters {
  tipoResiduo?: string | string[]
  disponibilidade?: string | string[]
  cidade?: string
  estado?: string
  quantidadeMin?: number
  quantidadeMax?: number
  unidade?: string
  temImagem?: boolean
  search?: string
  page?: number
  limit?: number
}

export class ResiduoService {
  private static baseUrl = '/actions/api/residues'

  // Buscar todos os resíduos com filtros opcionais
  static async getAllResiduos(params?: {
    empresaId?: number
    tipoResiduo?: string
    disponibilidade?: string
    limit?: number
    offset?: number
  }) {
    try {
      const searchParams = new URLSearchParams()
      
      if (params?.empresaId) searchParams.append('empresaId', params.empresaId.toString())
      if (params?.tipoResiduo) searchParams.append('tipoResiduo', params.tipoResiduo)
      if (params?.disponibilidade) searchParams.append('disponibilidade', params.disponibilidade)
      if (params?.limit) searchParams.append('limit', params.limit.toString())
      if (params?.offset) searchParams.append('offset', params.offset.toString())
      
      const url = `${this.baseUrl}/consult-residues?${searchParams.toString()}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar resíduos:', error)
      throw error
    }
  }

  // Buscar um resíduo específico por ID
  static async getResiduoById(id: number) {
    try {
      const response = await fetch(`${this.baseUrl}/consult-residues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar resíduo:', error)
      throw error
    }
  }

  // Buscar resíduos de uma empresa (minhas ofertas)
  static async getMyOffers(empresaId: number, userId?: string) {
    try {
      const searchParams = new URLSearchParams()
      searchParams.append('empresaId', empresaId.toString())
      if (userId) searchParams.append('userId', userId)
      
      const url = `${this.baseUrl}/my-offers?${searchParams.toString()}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar minhas ofertas:', error)
      throw error
    }
  }

  // Buscar estatísticas dos resíduos
  static async getStats(empresaId?: number) {
    try {
      const searchParams = new URLSearchParams()
      if (empresaId) searchParams.append('empresaId', empresaId.toString())
      
      const url = `${this.baseUrl}/stats?${searchParams.toString()}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      throw error
    }
  }

  // Busca avançada com filtros
  static async advancedSearch(filters: SearchFilters) {
    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      })
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Erro na busca avançada:', error)
      throw error
    }
  }

  // Cadastrar novo resíduo
  static async createResiduo(data: {
    tipoResiduo: string
    descricao: string
    quantidade: string
    unidade: string
    condicoes: string
    disponibilidade: string
    preco?: string
    imagens: string[]
    empresaId: number
    userId: string
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/register-residues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `Erro ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Erro ao cadastrar resíduo:', error)
      throw error
    }
  }
}

// Hook React para usar os serviços de resíduo
export function useResiduos() {
  return {
    getAllResiduos: ResiduoService.getAllResiduos,
    getResiduoById: ResiduoService.getResiduoById,
    getMyOffers: ResiduoService.getMyOffers,
    getStats: ResiduoService.getStats,
    advancedSearch: ResiduoService.advancedSearch,
    createResiduo: ResiduoService.createResiduo
  }
}
