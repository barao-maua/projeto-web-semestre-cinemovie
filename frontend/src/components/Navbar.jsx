import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function Navbar({ usuario, setUsuario, isAdmin }) {
  const navigate = useNavigate()

  async function handleLogout() {
    try { await api.post('/sair/') } catch (_) {}
    setUsuario(null)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">CineMovie</Link>

      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/estreia">Estreia</Link>
        <Link to="/categorias">Categorias</Link>
        <Link to="/sobre">Sobre Nos</Link>
      </div>

      <div className="navbar-auth">
        {usuario ? (
          <>
            <span className="navbar-username">Ola, {usuario}</span>
            <Link to="/favoritos" className="btn-nav-link">Meus Favoritos</Link>
            {isAdmin && (
              <Link to="/admin-panel" className="btn-nav-link btn-nav-admin">Painel Admin</Link>
            )}
            <button className="btn-nav" onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <>
            <button className="btn-nav" onClick={() => navigate('/login')}>Entrar</button>
            <button className="btn-nav btn-nav-destaque" onClick={() => navigate('/registro')}>Cadastrar</button>
          </>
        )}
      </div>
    </nav>
  )
}
