## 1. Gitignore

- [x] 1.1 Verificar se existe `.gitignore` na raiz do projeto
- [x] 1.2 Adicionar entradas `**/__pycache__/` e `**/*.pyc` ao `.gitignore` (criar o arquivo se não existir)

## 2. Script de backend

- [x] 2.1 Criar `start-dev.ps1` na raiz com: `Set-Location config`, remoção recursiva de `__pycache__`, `python manage.py migrate` e `python manage.py runserver`

## 3. Script de frontend

- [x] 3.1 Criar `start-frontend.ps1` na raiz com: `Set-Location frontend` e `npm run dev`

## 4. Verificação

- [ ] 4.1 Executar `.\start-dev.ps1` e confirmar que o Django sobe em `http://127.0.0.1:8000` sem erros
- [ ] 4.2 Executar `.\start-frontend.ps1` em outro terminal e confirmar que o Vite sobe em `http://localhost:5173`
- [ ] 4.3 Testar a rota `POST /api/cadastrar/` e confirmar que retorna resposta (sem 404)
- [ ] 4.4 Confirmar que `git status` não mostra arquivos `__pycache__` ou `.pyc` como untracked
