## Context

O projeto tem estrutura de duas camadas: backend Django em `config/` (com `manage.py` dentro) e frontend Vite/React em `frontend/`. O Django usa `ROOT_URLCONF = 'config.urls'`, o que só funciona quando o processo é iniciado de dentro da pasta `config/`. O Python compila arquivos `.py` para `.pyc` e os armazena em `__pycache__`; ao editar `urls.py` ou `api_views.py`, o interpretador pode continuar servindo a versão compilada antiga, fazendo as rotas novas retornarem 404 sem qualquer mensagem de erro clara.

## Goals / Non-Goals

**Goals:**
- Um único comando inicia o backend corretamente (diretório certo + cache limpo + migrate + runserver)
- Um único comando inicia o frontend
- `__pycache__` e `.pyc` não são mais rastreados pelo git

**Non-Goals:**
- Scripts para Linux/macOS (bash)
- Configuração de ambiente de produção ou CI/CD
- Refatoração do layout de pastas do projeto

## Decisions

### Script PowerShell em vez de batch (.bat)

PowerShell está disponível por padrão no Windows 10/11 e fornece `Get-ChildItem -Recurse -Filter "__pycache__"` com remoção nativa. Batch exigiria `for /d /r` com sintaxe frágil e sem tratamento de erros. O projeto já usa PowerShell (scripts em `node_modules/.bin/*.ps1`), então não há nova dependência.

Alternativa descartada: `Makefile` com `make start` — exigiria instalar GNU Make no Windows, adicionando fricção desnecessária.

### Dois scripts separados em vez de um único que abre janelas novas

Backend e frontend precisam de terminais independentes para mostrar logs ao vivo. Abrir janelas novas via `Start-Process` complica permissões de execução e obscurece a saída. Dois scripts simples seguem o fluxo que o time já usa (dois terminais), apenas automatizando os comandos dentro de cada um.

### Limpar `__pycache__` em toda inicialização

Limpar sempre garante que nenhuma mudança em `.py` seja silenciosamente ignorada. O custo (Python recompila os arquivos uma vez ao subir) é imperceptível em desenvolvimento.

## Risks / Trade-offs

- **`PYTHONDONTWRITEBYTECODE=1`** poderia evitar a geração de `__pycache__` completamente. Descartado porque exigiria configurar variável de ambiente em todas as máquinas do time; o script de limpeza é autocontido.
- **Política de execução do PowerShell**: em algumas máquinas o PowerShell pode bloquear scripts `.ps1` de terceiros por padrão. Mitigação: o README de uso orienta rodar `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` uma única vez, ou simplesmente usar `powershell -ExecutionPolicy Bypass -File start-dev.ps1`.
