import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const CATEGORIAS = ['Todos', 'Acao', 'Animacao', 'Comedia', 'Drama', 'Ficcao Cientifica', 'Musical', 'Romance', 'Terror']

export default function Home() {
  const [filmes, setFilmes] = useState([])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos')
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/filmes/')
      .then(r => setFilmes(r.data))
      .catch(() => setFilmes([]))
      .finally(() => setCarregando(false))
  }, [])

  const filmesFiltrados = categoriaSelecionada === 'Todos'
    ? filmes
    : filmes.filter(f => f.genero === categoriaSelecionada)

  if (carregando) return <div className="loading">Carregando filmes...</div>

  return (
    <div className="home-wrapper">
      <aside className="sidebar">
        <h3 className="sidebar-titulo">Categorias</h3>
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
        {categoriaSelecionada !== 'Todos' && (
          <p className="filtro-label">
            Exibindo: <strong>{categoriaSelecionada}</strong>
            <button className="filtro-limpar" onClick={() => setCategoriaSelecionada('Todos')}>
              Limpar filtro
            </button>
          </p>
        )}

        {filmesFiltrados.length === 0 ? (
          <p className="vazio-categoria">Nenhum filme nessa categoria.</p>
        ) : (
          <div className="home-grid">
            {filmesFiltrados.map(filme => (
              <div
                key={filme.id}
                className="filme-card"
                onClick={() => navigate(`/filme/${filme.id}`)}
              >
                {filme.poster_url ? (
                  <img src={filme.poster_url} alt={filme.titulo} />
                ) : (
                  <div className="filme-card-poster-vazio">{filme.titulo}</div>
                )}
                <p className="filme-card-titulo">{filme.titulo}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
