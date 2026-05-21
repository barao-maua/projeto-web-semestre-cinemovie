import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function MeusFavoritos({ usuario }) {
  const [favoritos, setFavoritos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!usuario) {
      navigate('/login')
      return
    }
    api.get('/meus-favoritos/')
      .then(r => setFavoritos(r.data))
      .catch(() => setFavoritos([]))
      .finally(() => setCarregando(false))
  }, [usuario])

  async function remover(filmeId) {
    try {
      await api.delete(`/filmes/${filmeId}/desfavoritar/`)
      setFavoritos(prev => prev.filter(f => f.id !== filmeId))
    } catch (_) { /* empty */ }
  }

  if (carregando) return <div className="loading">Carregando...</div>

  return (
    <>
      <div className="favoritos-header">Meus Favoritos</div>

      {favoritos.length === 0 ? (
        <div className="vazio-msg">
          <p>Voce ainda nao tem filmes favoritos.</p>
          <p style={{ marginTop: '12px' }}>
            Explore o <Link to="/">catalogo</Link> e adicione seus preferidos.
          </p>
        </div>
      ) : (
        <div className="favoritos-grid">
          {favoritos.map(filme => (
            <div key={filme.id} className="favorito-card">
              <p className="favorito-card-titulo">{filme.titulo}</p>
              <p className="favorito-card-meta">
                {filme.ano_lancamento} &bull; {filme.genero}
              </p>
              <p className="favorito-card-meta">{filme.duracao_minutos} min</p>
              <button className="btn-ver" onClick={() => navigate(`/filme/${filme.id}`)}>
                Ver Detalhes
              </button>
              <button className="btn-remover" onClick={() => remover(filme.id)}>
                Remover dos Favoritos
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
