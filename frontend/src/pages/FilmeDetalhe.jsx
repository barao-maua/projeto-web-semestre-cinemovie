import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'

export default function FilmeDetalhe({ usuario }) {
  const { id } = useParams()
  const [filme, setFilme] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    api.get(`/filmes/${id}/`)
      .then(r => setFilme(r.data))
      .catch(() => setFilme(null))
      .finally(() => setCarregando(false))
  }, [id])

  async function handleFavoritar() {
    try {
      const r = await api.post(`/filmes/${id}/favoritar/`)
      setMensagem(r.data.mensagem)
      setFilme(prev => ({ ...prev, is_favorito: true }))
    } catch (e) {
      setMensagem(e.response?.data?.erro || 'Erro ao favoritar')
    }
  }

  async function handleDesfavoritar() {
    try {
      const r = await api.delete(`/filmes/${id}/desfavoritar/`)
      setMensagem(r.data.mensagem)
      setFilme(prev => ({ ...prev, is_favorito: false }))
    } catch (e) {
      setMensagem(e.response?.data?.erro || 'Erro ao remover favorito')
    }
  }

  if (carregando) return <div className="loading">Carregando...</div>
  if (!filme) return <div className="loading">Filme nao encontrado.</div>

  return (
    <>
      {mensagem && (
        <div className="mensagem mensagem-sucesso">{mensagem}</div>
      )}

      <div className="detalhe-container">
        <div className="detalhe-poster">
          {filme.poster_url ? (
            <img src={filme.poster_url} alt={filme.titulo} />
          ) : (
            <div className="detalhe-poster-vazio">Sem imagem</div>
          )}
        </div>

        <div className="detalhe-info">
          <h1 className="detalhe-titulo">{filme.titulo}</h1>

          <div className="detalhe-meta">
            <span>{filme.ano_lancamento}</span>
            <span>{filme.duracao_minutos} min</span>
            <span className="detalhe-badge">{filme.genero}</span>
          </div>

          <p className="detalhe-diretor">Diretor: {filme.diretor}</p>

          <p className="detalhe-sinopse">{filme.sinopse}</p>

          {usuario ? (
            filme.is_favorito ? (
              <button className="btn-desfavoritar" onClick={handleDesfavoritar}>
                Remover dos Favoritos
              </button>
            ) : (
              <button className="btn-favoritar" onClick={handleFavoritar}>
                Adicionar aos Favoritos
              </button>
            )
          ) : (
            <p className="login-aviso">
              <Link to="/login">Faca login</Link> para adicionar aos favoritos.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
