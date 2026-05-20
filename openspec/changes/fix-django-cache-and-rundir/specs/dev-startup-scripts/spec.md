## ADDED Requirements

### Requirement: Script de inicialização do backend limpa cache e sobe Django do diretório correto
O sistema SHALL fornecer um script `start-dev.ps1` na raiz do projeto que, ao ser executado, navegue até `config/`, remova todos os diretórios `__pycache__` e arquivos `.pyc` recursivamente, execute `python manage.py migrate` e em seguida inicie `python manage.py runserver`.

#### Scenario: Execução bem-sucedida do start-dev.ps1
- **WHEN** o usuário executa `.\start-dev.ps1` a partir da raiz do projeto
- **THEN** todos os `__pycache__` dentro de `config/` são removidos antes do servidor iniciar
- **THEN** `python manage.py migrate` é executado automaticamente
- **THEN** o Django sobe em `http://127.0.0.1:8000` com as rotas de API disponíveis

#### Scenario: Script roda corretamente mesmo após edição de urls.py
- **WHEN** o usuário edita `config/config/urls.py` e em seguida executa `.\start-dev.ps1`
- **THEN** os arquivos `.pyc` antigos são apagados antes do servidor subir
- **THEN** o Django carrega a versão atualizada de `urls.py`

### Requirement: Script de inicialização do frontend inicia Vite do diretório correto
O sistema SHALL fornecer um script `start-frontend.ps1` na raiz do projeto que navegue até `frontend/` e execute `npm run dev`.

#### Scenario: Execução bem-sucedida do start-frontend.ps1
- **WHEN** o usuário executa `.\start-frontend.ps1` a partir da raiz do projeto
- **THEN** o Vite sobe em `http://localhost:5173`

### Requirement: Arquivos compilados do Python não são rastreados pelo git
O sistema SHALL garantir que `__pycache__/` e `*.pyc` estejam listados no `.gitignore` da raiz do projeto para que caches compilados não sejam commitados.

#### Scenario: git status não mostra arquivos __pycache__ ou .pyc
- **WHEN** o Python gera arquivos `__pycache__` durante o desenvolvimento
- **THEN** `git status` não lista esses arquivos como untracked ou modificados
