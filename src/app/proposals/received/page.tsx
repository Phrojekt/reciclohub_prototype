"use client"
import { useEffect, useState } from "react"
import { Clock, CheckCircle, XCircle, User, Package } from "lucide-react"

interface Proposta {
  id: string
  quantidade: string
  frequencia: string
  preco?: string
  mensagem?: string
  tipoTransporte: string
  status: 'PENDENTE' | 'ACEITA' | 'REJEITADA'
  criadaEm: string
  empresaProponente: {
    nome: string
    email: string
    cidade: string
    estado: string
  }
  residuo: {
    descricao: string
    tipoResiduo: string
    quantidade: number
    unidade: string
  }
}

export default function PropostasRecebidasPage() {
  const [propostas, setPropostas] = useState<Proposta[]>([])
  const [loading, setLoading] = useState(true)
  const [processando, setProcessando] = useState<string | null>(null)

  useEffect(() => {
    const empresaId = localStorage.getItem("empresaId")
    if (!empresaId) {
      setLoading(false)
      return
    }

    fetch(`/actions/api/proposals/received?empresaId=${empresaId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPropostas(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setPropostas([])
        setLoading(false)
      })
  }, [])

  const handleResponderProposta = async (propostaId: string, acao: 'aceitar' | 'rejeitar') => {
    const empresaId = localStorage.getItem("empresaId")
    if (!empresaId) return

    setProcessando(propostaId)
    
    try {
      const response = await fetch("/actions/api/proposals/respond", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          propostaId,
          empresaId,
          acao
        })
      })

      if (response.ok) {
        // Atualizar status da proposta localmente
        setPropostas(prev => prev.map(p => 
          p.id === propostaId 
            ? { ...p, status: acao === 'aceitar' ? 'ACEITA' : 'REJEITADA' }
            : p
        ))
        
        if (acao === 'aceitar') {
          alert("Proposta aceita! Um match foi criado.")
        } else {
          alert("Proposta rejeitada.")
        }
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao processar proposta")
      }
    } catch (error) {
      console.error("Erro ao responder proposta:", error)
      alert("Erro ao processar proposta")
    } finally {
      setProcessando(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'ACEITA':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'REJEITADA':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'Pendente'
      case 'ACEITA':
        return 'Aceita'
      case 'REJEITADA':
        return 'Rejeitada'
      default:
        return 'Desconhecido'
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'bg-yellow-50 border-yellow-200'
      case 'ACEITA':
        return 'bg-green-50 border-green-200'
      case 'REJEITADA':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Propostas Recebidas</h1>
          <div className="text-sm text-gray-600">
            {propostas.length} {propostas.length === 1 ? 'proposta' : 'propostas'}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        )}

        {!loading && propostas.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma proposta recebida</h3>
            <p className="text-gray-600">Quando alguém fizer uma proposta para seus resíduos, ela aparecerá aqui.</p>
          </div>
        )}

        {!loading && propostas.length > 0 && (
          <div className="space-y-4">
            {propostas.map((proposta) => (
              <div
                key={proposta.id}
                className={`bg-white rounded-lg border p-6 ${getStatusBgColor(proposta.status)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(proposta.status)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {proposta.residuo.tipoResiduo}
                      </h3>
                      <p className="text-sm text-gray-600">{proposta.residuo.descricao}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      proposta.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-800' :
                      proposta.status === 'ACEITA' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {getStatusText(proposta.status)}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(proposta.criadaEm).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{proposta.empresaProponente.nome}</p>
                        <p className="text-sm text-gray-600">
                          {proposta.empresaProponente.cidade}, {proposta.empresaProponente.estado}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Quantidade:</span>
                        <p className="text-gray-600">{proposta.quantidade}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Frequência:</span>
                        <p className="text-gray-600">{proposta.frequencia}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Transporte:</span>
                        <p className="text-gray-600">{proposta.tipoTransporte}</p>
                      </div>
                      {proposta.preco && (
                        <div>
                          <span className="font-medium text-gray-700">Preço:</span>
                          <p className="text-gray-600">{proposta.preco}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {proposta.mensagem && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Mensagem:</p>
                    <p className="text-sm text-gray-600">{proposta.mensagem}</p>
                  </div>
                )}

                {proposta.status === 'PENDENTE' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleResponderProposta(proposta.id, 'aceitar')}
                      disabled={processando === proposta.id}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                      {processando === proposta.id ? 'Processando...' : 'Aceitar Proposta'}
                    </button>
                    <button
                      onClick={() => handleResponderProposta(proposta.id, 'rejeitar')}
                      disabled={processando === proposta.id}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                      {processando === proposta.id ? 'Processando...' : 'Rejeitar'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
