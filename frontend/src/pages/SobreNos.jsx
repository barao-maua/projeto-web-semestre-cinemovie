export default function SobreNos() {
  return (
    <div className="sobre-container">
      <div className="sobre-header">
        <h1 className="sobre-titulo">Sobre o CineMovie</h1>
        <p className="sobre-subtitulo">O cinema para voce, onde e quando quiser</p>
      </div>

      <div className="sobre-conteudo">
        <section className="sobre-secao">
          <h2>Nossa Historia</h2>
          <p>
            O CineMovie nasceu da paixao pelo cinema e pela vontade de oferecer uma
            experiencia completa para os amantes da setima arte. Fundado em 2026,
            somos um catalogo digital dedicado a reunir os melhores filmes em cartaz,
            conectando o publico com as obras que marcam cada epoca.
          </p>
        </section>

        <section className="sobre-secao">
          <h2>O que oferecemos</h2>
          <ul className="sobre-lista">
            <li>Catalogo atualizado com os filmes mais recentes em cartaz</li>
            <li>Secao de estreias com os lancamentos da temporada</li>
            <li>Filtro por genero para encontrar o filme ideal</li>
            <li>Lista de favoritos personalizada para cada usuario</li>
            <li>Informacoes completas: sinopse, diretor, duracao e genero</li>
          </ul>
        </section>

        <section className="sobre-secao">
          <h2>Nossa Missao</h2>
          <p>
            Acreditamos que o cinema tem o poder de transformar perspectivas e
            conectar pessoas. Nossa missao e facilitar o acesso a informacao sobre
            filmes, ajudando cada espectador a encontrar a historia que vai marcar
            sua vida.
          </p>
        </section>

        <div className="sobre-cards">
          <div className="sobre-card">
            <span className="sobre-card-numero">12+</span>
            <span className="sobre-card-label">Filmes no catalogo</span>
          </div>
          <div className="sobre-card">
            <span className="sobre-card-numero">8</span>
            <span className="sobre-card-label">Generos disponíveis</span>
          </div>
          <div className="sobre-card">
            <span className="sobre-card-numero">2026</span>
            <span className="sobre-card-label">Ano de fundacao</span>
          </div>
        </div>
      </div>
    </div>
  )
}
