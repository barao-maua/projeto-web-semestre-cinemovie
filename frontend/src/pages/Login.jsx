import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function Login({ setUsuario }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    try {
      const r = await api.post('/entrar/', form)
      setUsuario({ username: r.data.username, is_admin: r.data.is_admin })
      navigate('/')
    } catch (e) {
      if (!e.response) {
        setErro('Servidor nao encontrado. Verifique se o backend Django esta rodando na porta 8000.')
      } else {
        setErro(e.response.data?.erro || `Erro do servidor (${e.response.status})`)
      }
    }
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>ENTRAR</h2>

        {erro && <div className="erro-msg">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grupo">
            <label>Usuario</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Digite seu usuario"
              required
            />
          </div>

          <div className="form-grupo">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit" className="btn-submit">Acessar</button>
        </form>

        <p className="form-link">
          Novo por aqui?<Link to="/registro">Criar conta</Link>
        </p>
        <p className="form-link" style={{ marginTop: '10px' }}>
          <Link to="/">Voltar ao inicio</Link>
        </p>
      </div>
    </div>
  )
}
