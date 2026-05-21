import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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

  const estreias = filmes.filter(f => f.is_estreia)

  if (carregando) return <div className="loading">Carregando filmes...</div>

  return (
    <div className="home-page">

      {/* HERO BANNER */}
      <section className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">CineMovie</h1>
          <p className="hero-subtitle">O cinema para voce, onde e quando quiser</p>
          <p className="hero-desc">
            Explore nosso catalogo com os melhores filmes em cartaz, descubra estreias
            e monte sua lista de favoritos.
          </p>
          <div className="hero-actions">
            <Link to="/estreia" className="hero-btn hero-btn-primary">Ver Estreias</Link>
            <Link to="/categorias" className="hero-btn hero-btn-secondary">Explorar Generos</Link>
          </div>
        </div>
      </section>

      {/* ESTREIAS EM DESTAQUE */}
      {estreias.length > 0 && (
        <section className="home-section">
          <div className="home-section-header">
            <h2 className="home-section-title">
              <span className="section-icon">&#9733;</span> Estreias em Destaque
            </h2>
            <Link to="/estreia" className="home-section-link">Ver todas &rarr;</Link>
          </div>
          <div className="home-grid destaques-grid">
            {estreias.slice(0, 6).map(filme => (
              <div
                key={filme.id}
                className="filme-card filme-card-destaque"
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
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CATALOGO COM FILTRO */}
      <section className="home-catalogo">
        <div className="home-catalogo-header">
          <h2 className="home-section-title">Catalogo de Filmes</h2>
          <p className="home-section-sub">{filmes.length} filmes disponiveis</p>
        </div>

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
                    className={`filme-card ${filme.is_estreia ? 'filme-card-destaque' : ''}`}
                    onClick={() => navigate(`/filme/${filme.id}`)}
                  >
                    <div className="filme-card-poster-wrap">
                      {filme.poster_url ? (
                        <img src={filme.poster_url} alt={filme.titulo} />
                      ) : (
                        <div className="filme-card-poster-vazio">{filme.titulo}</div>
                      )}
                      {filme.is_estreia && <span className="filme-card-estreia-badge">Estreia</span>}
                    </div>
                    <p className="filme-card-titulo">{filme.titulo}</p>
                    {filme.sessoes && filme.sessoes.length > 0 && (
                      <p className="filme-card-sessoes">
                        {filme.sessoes.length} sessao{filme.sessoes.length > 1 ? 'oes' : ''}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
