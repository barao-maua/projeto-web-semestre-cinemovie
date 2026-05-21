import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const GENEROS = ['Acao', 'Animacao', 'Comedia', 'Drama', 'Ficcao Cientifica', 'Musical', 'Romance', 'Terror', 'Suspense', 'Documentario']

const formVazio = {
  titulo: '', sinopse: '', ano_lancamento: new Date().getFullYear(),
  diretor: '', genero: 'Acao', duracao_minutos: '', nota: 0,
}

function Estrelas({ valor, onChange }) {
  return (
    <div className="estrelas-editor">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`estrela-btn ${n <= valor ? 'estrela-ativa' : ''}`}
          onClick={() => onChange(n === valor ? 0 : n)}
          title={`${n} estrela${n > 1 ? 's' : ''}`}
        >
          {n <= valor ? '★' : '☆'}
        </button>
      ))}
      {valor > 0 && (
        <span className="estrela-label">{valor}/5</span>
      )}
    </div>
  )
}

export default function AdminPanel({ isAdmin }) {
  const navigate = useNavigate()
  const [filmes, setFilmes] = useState([])
  const [form, setForm] = useState(formVazio)
  const [posterFile, setPosterFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [editandoId, setEditandoId] = useState(null)
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' })
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return }
    carregarFilmes()
  }, [isAdmin])

  function carregarFilmes() {
    api.get('/filmes/')
      .then(r => setFilmes(r.data))
      .catch(() => {})
      .finally(() => setCarregando(false))
  }

  function msg(texto, tipo = 'sucesso') {
    setMensagem({ texto, tipo })
    setTimeout(() => setMensagem({ texto: '', tipo: '' }), 4000)
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handlePoster(e) {
    const file = e.target.files[0]
    if (!file) return
    setPosterFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function iniciarEdicao(filme) {
    setEditandoId(filme.id)
    setForm({
      titulo: filme.titulo,
      sinopse: filme.sinopse,
      ano_lancamento: filme.ano_lancamento,
      diretor: filme.diretor,
      genero: filme.genero,
      duracao_minutos: filme.duracao_minutos,
      nota: filme.nota,
    })
    setPosterFile(null)
    setPreviewUrl(filme.poster_url || null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelarEdicao() {
    setEditandoId(null)
    setForm(formVazio)
    setPosterFile(null)
    setPreviewUrl(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)

    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => data.append(k, v))
    if (posterFile) data.append('poster', posterFile)

    try {
      if (editandoId) {
        await api.put(`/admin/filmes/${editandoId}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        msg('Filme atualizado com sucesso')
      } else {
        await api.post('/admin/filmes/', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        msg('Filme adicionado ao catalogo')
      }
      cancelarEdicao()
      carregarFilmes()
    } catch (e) {
      msg(e.response?.data?.erro || 'Erro ao salvar filme', 'erro')
    } finally {
      setEnviando(false)
    }
  }

  async function handleDeletar(filmeId, titulo) {
    if (!window.confirm(`Remover "${titulo}" do catalogo?`)) return
    try {
      await api.delete(`/admin/filmes/${filmeId}/`)
      msg('Filme removido do catalogo')
      carregarFilmes()
    } catch (e) {
      msg('Erro ao remover filme', 'erro')
    }
  }

  if (!isAdmin) return null
  if (carregando) return <div className="loading">Carregando...</div>

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h1 className="admin-titulo">Painel Administrativo</h1>
        <p className="admin-sub">Gerencie o catalogo de filmes</p>
      </div>

      {mensagem.texto && (
        <div className={`mensagem mensagem-${mensagem.tipo}`}>{mensagem.texto}</div>
      )}

      <div className="admin-layout">
        {/* FORMULARIO */}
        <section className="admin-form-section">
          <h2 className="admin-section-titulo">
            {editandoId ? 'Editar Filme' : 'Adicionar Filme'}
          </h2>

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-grupo">
              <label>Titulo *</label>
              <input name="titulo" value={form.titulo} onChange={handleChange} required placeholder="Nome do filme" />
            </div>

            <div className="admin-form-linha">
              <div className="form-grupo">
                <label>Ano *</label>
                <input name="ano_lancamento" type="number" value={form.ano_lancamento} onChange={handleChange} required min="1900" max="2030" />
              </div>
              <div className="form-grupo">
                <label>Duracao (min)</label>
                <input name="duracao_minutos" type="number" value={form.duracao_minutos} onChange={handleChange} placeholder="Ex: 120" min="1" />
              </div>
            </div>

            <div className="form-grupo">
              <label>Diretor</label>
              <input name="diretor" value={form.diretor} onChange={handleChange} placeholder="Nome do diretor" />
            </div>

            <div className="form-grupo">
              <label>Genero *</label>
              <select name="genero" value={form.genero} onChange={handleChange} className="admin-select">
                {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="form-grupo">
              <label>Sinopse *</label>
              <textarea
                name="sinopse"
                value={form.sinopse}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Descricao do filme..."
                className="admin-textarea"
              />
            </div>

            <div className="form-grupo">
              <label>Nota (estrelas)</label>
              <Estrelas valor={form.nota} onChange={n => setForm(prev => ({ ...prev, nota: n }))} />
            </div>

            <div className="form-grupo">
              <label>Poster (imagem)</label>
              <input type="file" accept="image/*" onChange={handlePoster} className="admin-file-input" />
              {previewUrl && (
                <div className="admin-poster-preview">
                  <img src={previewUrl} alt="Preview" />
                </div>
              )}
            </div>

            <div className="admin-form-acoes">
              <button type="submit" className="btn-admin-salvar" disabled={enviando}>
                {enviando ? 'Salvando...' : editandoId ? 'Salvar Edicao' : 'Adicionar Filme'}
              </button>
              {editandoId && (
                <button type="button" className="btn-admin-cancelar" onClick={cancelarEdicao}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* LISTA DE FILMES */}
        <section className="admin-lista-section">
          <h2 className="admin-section-titulo">
            Catalogo ({filmes.length} filmes)
          </h2>

          <div className="admin-lista">
            {filmes.map(filme => (
              <div key={filme.id} className={`admin-lista-item ${editandoId === filme.id ? 'admin-lista-item-ativo' : ''}`}>
                {filme.poster_url && (
                  <img src={filme.poster_url} alt={filme.titulo} className="admin-lista-thumb" />
                )}
                <div className="admin-lista-info">
                  <p className="admin-lista-titulo">{filme.titulo}</p>
                  <p className="admin-lista-meta">{filme.ano_lancamento} &bull; {filme.genero} &bull; {filme.duracao_minutos}min</p>
                  {filme.nota > 0 && (
                    <p className="admin-lista-nota">
                      {'★'.repeat(filme.nota)}{'☆'.repeat(5 - filme.nota)}
                    </p>
                  )}
                </div>
                <div className="admin-lista-acoes">
                  <button className="btn-admin-editar" onClick={() => iniciarEdicao(filme)}>Editar</button>
                  <button className="btn-admin-deletar" onClick={() => handleDeletar(filme.id, filme.titulo)}>Remover</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
