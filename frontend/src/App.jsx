import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Estreia from './pages/Estreia'
import Categorias from './pages/Categorias'
import SobreNos from './pages/SobreNos'
import FilmeDetalhe from './pages/FilmeDetalhe'
import MeusFavoritos from './pages/MeusFavoritos'
import Login from './pages/Login'
import Registro from './pages/Registro'
import AdminPanel from './pages/AdminPanel'
import api from './api'

export default function App() {
  const [usuario, setUsuario] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    api.get('/eu/')
      .then(r => {
        if (r.data.autenticado) {
          setUsuario(r.data.username)
          setIsAdmin(r.data.is_admin)
        }
      })
      .catch(() => {})
  }, [])

  function handleSetUsuario(dados) {
    if (dados === null) {
      setUsuario(null)
      setIsAdmin(false)
    } else if (typeof dados === 'object') {
      setUsuario(dados.username)
      setIsAdmin(dados.is_admin || false)
    } else {
      setUsuario(dados)
    }
  }

  return (
    <BrowserRouter>
      <Navbar usuario={usuario} setUsuario={handleSetUsuario} isAdmin={isAdmin} />
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/estreia"      element={<Estreia />} />
        <Route path="/categorias"   element={<Categorias />} />
        <Route path="/sobre"        element={<SobreNos />} />
        <Route path="/filme/:id"    element={<FilmeDetalhe usuario={usuario} />} />
        <Route path="/favoritos"    element={<MeusFavoritos usuario={usuario} />} />
        <Route path="/login"        element={<Login setUsuario={handleSetUsuario} />} />
        <Route path="/registro"     element={<Registro setUsuario={handleSetUsuario} />} />
        <Route path="/admin-panel"  element={<AdminPanel isAdmin={isAdmin} />} />
      </Routes>
      <footer className="footer">
        <p>Copyright 2026 CineMovie</p>
      </footer>
    </BrowserRouter>
  )
}
