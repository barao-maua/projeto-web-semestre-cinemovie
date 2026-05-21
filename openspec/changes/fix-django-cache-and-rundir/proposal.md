## Why

O projeto tem duas causas simultâneas que impedem as rotas de API (`/api/cadastrar/`, etc.) de funcionarem: o Django lê arquivos `.pyc` do `__pycache__` em vez do `urls.py` atualizado, e `python manage.py runserver` rodado fora da pasta `config/` carrega um projeto diferente sem as rotas. Ao corrigir agora evitamos que qualquer membro do time perca tempo com o mesmo problema de ambiente.

## What Changes

- Criação de um script PowerShell (`start-dev.ps1`) na raiz do projeto que:
  - Entra na pasta `config/`
  - Apaga todos os `__pycache__` recursivamente
  - Roda `python manage.py migrate`
  - Inicia `python manage.py runserver`
- Criação de um segundo script (`start-frontend.ps1`) na raiz que entra em `frontend/` e roda `npm run dev`
- Adição de `**/__pycache__/` e `**/*.pyc` ao `.gitignore` raiz para evitar que caches compilados sejam commitados e causem divergências entre máquinas

## Capabilities

### New Capabilities

- `dev-startup-scripts`: Scripts PowerShell de inicialização do ambiente de desenvolvimento que garantem diretório correto, limpeza de cache Python e execução das migrations antes de subir os servidores.

### Modified Capabilities

<!-- Nenhuma capability existente tem seus requisitos alterados -->

## Impact

- Dois novos arquivos na raiz: `start-dev.ps1` e `start-frontend.ps1`
- `.gitignore` na raiz recebe duas novas linhas (ou é criado se não existir)
- Nenhuma mudança em código Python, settings ou URLs — apenas infraestrutura de desenvolvimento
