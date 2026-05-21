import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Estreia() {
  const [filmes, setFilmes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/filmes/')
      .then(r => {
        const estreias = r.data
          .filter(f => f.is_estreia)
        setFilmes(estreias)
      })
      .catch(() => setFilmes([]))
      .finally(() => setCarregando(false))
  }, [])

  if (carregando) return <div className="loading">Carregando...</div>

  return (
    <div className="page-section">
      <div className="page-section-header">
        <h2 className="page-section-title">Estreias</h2>
        <p className="page-section-sub">Os filmes mais recentes em cartaz</p>
      </div>

      <div className="home-grid estreias-grid">
        {filmes.map(filme => (
          <div
            key={filme.id}
            className="filme-card"
            onClick={() => navigate(`/filme/${filme.id}`)}
          >
            <div className="filme-card-poster-wrap">
              {filme.poster_url ? (
                <img src={filme.poster_url} alt={filme.titulo} />
              ) : (
                <div className="filme-card-poster-vazio">{filme.titulo}</div>
              )}
              <span className="filme-card-estreia-badge">Estreia</span>
            </div>
            <p className="filme-card-titulo">{filme.titulo}</p>
            <p className="filme-card-ano">{filme.ano_lancamento}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
