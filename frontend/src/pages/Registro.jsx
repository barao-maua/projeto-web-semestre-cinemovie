import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function Registro({ setUsuario }) {
  const [form, setForm] = useState({ username: '', password1: '', password2: '', codigo_admin: '' })
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    try {
      const r = await api.post('/cadastrar/', form)
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
        <h2>CRIAR CONTA</h2>

        {erro && <div className="erro-msg">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grupo">
            <label>Usuario</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Escolha um nome de usuario"
              required
            />
          </div>

          <div className="form-grupo">
            <label>Senha</label>
            <input
              type="password"
              name="password1"
              value={form.password1}
              onChange={handleChange}
              placeholder="Minimo 8 caracteres"
              required
            />
          </div>

          <div className="form-grupo">
            <label>Confirmar Senha</label>
            <input
              type="password"
              name="password2"
              value={form.password2}
              onChange={handleChange}
              placeholder="Repita a senha"
              required
            />
          </div>

          <div className="form-grupo">
            <label>Codigo de Administrador <span style={{ color: '#666', fontWeight: 300 }}>(opcional)</span></label>
            <input
              type="password"
              name="codigo_admin"
              value={form.codigo_admin}
              onChange={handleChange}
              placeholder="Deixe em branco para conta comum"
            />
          </div>

          <button type="submit" className="btn-submit">Cadastrar</button>
        </form>

        <p className="form-link">
          Ja tem conta?<Link to="/login">Fazer login</Link>
        </p>
        <p className="form-link" style={{ marginTop: '10px' }}>
          <Link to="/">Voltar ao inicio</Link>
        </p>
      </div>
    </div>
  )
}
