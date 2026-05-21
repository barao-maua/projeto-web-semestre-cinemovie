import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const CATEGORIAS = ['Acao', 'Animacao', 'Comedia', 'Drama', 'Ficcao Cientifica', 'Musical', 'Romance', 'Terror']

export default function Categorias() {
  const [filmes, setFilmes] = useState([])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Acao')
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/filmes/')
      .then(r => setFilmes(r.data))
      .catch(() => setFilmes([]))
      .finally(() => setCarregando(false))
  }, [])

  const filmesFiltrados = filmes.filter(f => f.genero === categoriaSelecionada)

  if (carregando) return <div className="loading">Carregando...</div>

  return (
    <div className="home-wrapper">
      <aside className="sidebar">
        <h3 className="sidebar-titulo">Generos</h3>
        <ul className="sidebar-lista">
          {CATEGORIAS.map(cat => (
            <li key={cat}>
              <button
                className={`sidebar-btn ${categoriaSelecionada === cat ? 'sidebar-btn-ativo' : ''}`}
                onClick={() => setCategoriaSelecionada(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="home-conteudo">
        <p className="filtro-label">
          Genero: <strong>{categoriaSelecionada}</strong>
          <span style={{ color: '#999', marginLeft: '10px', fontSize: '13px' }}>
            {filmesFiltrados.length} filme{filmesFiltrados.length !== 1 ? 's' : ''}
          </span>
        </p>

        {filmesFiltrados.length === 0 ? (
          <p className="vazio-categoria">Nenhum filme nessa categoria ainda.</p>
        ) : (
          <div className="home-grid">
            {filmesFiltrados.map(filme => (
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
                </div>
                <p className="filme-card-titulo">{filme.titulo}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
