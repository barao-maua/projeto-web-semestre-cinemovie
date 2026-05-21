import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import Filme, Favorito


def _poster_url(filme):
    if filme.poster and filme.poster.name:
        return f'/media/{filme.poster.name}'
    if filme.poster_imagem:
        return f'/static/images/{filme.poster_imagem}'
    return None


def filme_para_dict(filme, usuario=None):
    is_favorito = False
    if usuario and usuario.is_authenticated:
        is_favorito = Favorito.objects.filter(usuario=usuario, filme=filme).exists()
    return {
        'id': filme.pk,
        'titulo': filme.titulo,
        'sinopse': filme.sinopse,
        'ano_lancamento': filme.ano_lancamento,
        'diretor': filme.diretor,
        'genero': filme.genero,
        'duracao_minutos': filme.duracao_minutos,
        'nota': filme.nota,
        'poster_url': _poster_url(filme),
        'is_favorito': is_favorito,
    }


# ---------- FILMES ----------

def api_filmes(request):
    filmes = Filme.objects.all().order_by('titulo')
    return JsonResponse([filme_para_dict(f, request.user) for f in filmes], safe=False)


def api_filme_detalhe(request, filme_id):
    try:
        filme = Filme.objects.get(pk=filme_id)
    except Filme.DoesNotExist:
        return JsonResponse({'erro': 'Filme nao encontrado'}, status=404)
    return JsonResponse(filme_para_dict(filme, request.user))


# ---------- FAVORITOS ----------

@csrf_exempt
def api_favoritar(request, filme_id):
    if not request.user.is_authenticated:
        return JsonResponse({'erro': 'Login necessario'}, status=401)
    if request.method != 'POST':
        return JsonResponse({'erro': 'Metodo nao permitido'}, status=405)
    try:
        filme = Filme.objects.get(pk=filme_id)
    except Filme.DoesNotExist:
        return JsonResponse({'erro': 'Filme nao encontrado'}, status=404)
    _, criado = Favorito.objects.get_or_create(usuario=request.user, filme=filme)
    msg = 'Filme adicionado aos favoritos' if criado else 'Filme ja esta nos favoritos'
    return JsonResponse({'mensagem': msg, 'is_favorito': True})


@csrf_exempt
def api_desfavoritar(request, filme_id):
    if not request.user.is_authenticated:
        return JsonResponse({'erro': 'Login necessario'}, status=401)
    if request.method != 'DELETE':
        return JsonResponse({'erro': 'Metodo nao permitido'}, status=405)
    try:
        filme = Filme.objects.get(pk=filme_id)
    except Filme.DoesNotExist:
        return JsonResponse({'erro': 'Filme nao encontrado'}, status=404)
    Favorito.objects.filter(usuario=request.user, filme=filme).delete()
    return JsonResponse({'mensagem': 'Filme removido dos favoritos', 'is_favorito': False})


def api_meus_favoritos(request):
    if not request.user.is_authenticated:
        return JsonResponse({'erro': 'Login necessario'}, status=401)
    favoritos = Favorito.objects.filter(usuario=request.user).select_related('filme')
    return JsonResponse([filme_para_dict(f.filme, request.user) for f in favoritos], safe=False)


# ---------- ADMIN - GERENCIAR FILMES ----------

def _requer_admin(request):
    if not request.user.is_authenticated:
        return JsonResponse({'erro': 'Login necessario'}, status=401)
    if not request.user.is_staff:
        return JsonResponse({'erro': 'Acesso restrito a administradores'}, status=403)
    return None


@csrf_exempt
def api_admin_filmes(request):
    negado = _requer_admin(request)
    if negado:
        return negado

    if request.method == 'POST':
        titulo = request.POST.get('titulo', '').strip()
        sinopse = request.POST.get('sinopse', '').strip()
        ano = request.POST.get('ano_lancamento', '').strip()
        diretor = request.POST.get('diretor', '').strip()
        genero = request.POST.get('genero', '').strip()
        duracao = request.POST.get('duracao_minutos', '0').strip()
        nota = request.POST.get('nota', '0').strip()
        poster = request.FILES.get('poster')

        if not titulo or not sinopse or not ano or not genero:
            return JsonResponse({'erro': 'Titulo, sinopse, ano e genero sao obrigatorios'}, status=400)

        try:
            ano = int(ano)
            duracao = int(duracao) if duracao else 0
            nota = max(0, min(5, int(nota) if nota else 0))
        except ValueError:
            return JsonResponse({'erro': 'Ano e duracao devem ser numeros'}, status=400)

        filme = Filme.objects.create(
            titulo=titulo,
            sinopse=sinopse,
            ano_lancamento=ano,
            diretor=diretor,
            genero=genero,
            duracao_minutos=duracao,
            nota=nota,
            poster=poster,
        )
        return JsonResponse({'mensagem': 'Filme adicionado com sucesso', **filme_para_dict(filme)}, status=201)

    return JsonResponse({'erro': 'Metodo nao permitido'}, status=405)


@csrf_exempt
def api_admin_filme_detalhe(request, filme_id):
    negado = _requer_admin(request)
    if negado:
        return negado

    try:
        filme = Filme.objects.get(pk=filme_id)
    except Filme.DoesNotExist:
        return JsonResponse({'erro': 'Filme nao encontrado'}, status=404)

    if request.method == 'PUT':
        titulo = request.POST.get('titulo', filme.titulo).strip()
        sinopse = request.POST.get('sinopse', filme.sinopse).strip()
        ano = request.POST.get('ano_lancamento', str(filme.ano_lancamento)).strip()
        diretor = request.POST.get('diretor', filme.diretor).strip()
        genero = request.POST.get('genero', filme.genero).strip()
        duracao = request.POST.get('duracao_minutos', str(filme.duracao_minutos)).strip()
        nota = request.POST.get('nota', str(filme.nota)).strip()
        poster = request.FILES.get('poster')

        try:
            filme.titulo = titulo
            filme.sinopse = sinopse
            filme.ano_lancamento = int(ano)
            filme.diretor = diretor
            filme.genero = genero
            filme.duracao_minutos = int(duracao)
            filme.nota = max(0, min(5, int(nota)))
            if poster:
                filme.poster = poster
            filme.save()
        except ValueError:
            return JsonResponse({'erro': 'Valores invalidos'}, status=400)

        return JsonResponse({'mensagem': 'Filme atualizado', **filme_para_dict(filme)})

    if request.method == 'DELETE':
        if filme.poster:
            filme.poster.delete(save=False)
        filme.delete()
        return JsonResponse({'mensagem': 'Filme removido com sucesso'})

    return JsonResponse({'erro': 'Metodo nao permitido'}, status=405)


# ---------- AUTH ----------

@csrf_exempt
def api_login(request):
    if request.method != 'POST':
        return JsonResponse({'erro': 'Metodo nao permitido'}, status=405)
    try:
        corpo = json.loads(request.body)
        username = corpo.get('username', '')
        password = corpo.get('password', '')
    except (json.JSONDecodeError, AttributeError):
        return JsonResponse({'erro': 'JSON invalido'}, status=400)
    usuario = authenticate(request, username=username, password=password)
    if usuario is None:
        return JsonResponse({'erro': 'Usuario ou senha incorretos'}, status=400)
    login(request, usuario)
    return JsonResponse({
        'mensagem': 'Login realizado',
        'username': usuario.username,
        'is_admin': usuario.is_staff,
    })


@csrf_exempt
def api_logout(request):
    if request.method != 'POST':
        return JsonResponse({'erro': 'Metodo nao permitido'}, status=405)
    logout(request)
    return JsonResponse({'mensagem': 'Logout realizado'})


@csrf_exempt
def api_registro(request):
    if request.method != 'POST':
        return JsonResponse({'erro': 'Metodo nao permitido'}, status=405)
    try:
        corpo = json.loads(request.body)
    except (json.JSONDecodeError, AttributeError):
        return JsonResponse({'erro': 'JSON invalido'}, status=400)
    CODIGO_ADMIN = 'CINEMOVIE-ADMIN'

    username = corpo.get('username', '').strip()
    password1 = corpo.get('password1', '')
    password2 = corpo.get('password2', '')
    codigo = corpo.get('codigo_admin', '').strip()

    if not username or not password1:
        return JsonResponse({'erro': 'Preencha todos os campos'}, status=400)
    if password1 != password2:
        return JsonResponse({'erro': 'As senhas nao coincidem'}, status=400)
    if len(password1) < 8:
        return JsonResponse({'erro': 'A senha deve ter ao menos 8 caracteres'}, status=400)
    if User.objects.filter(username=username).exists():
        return JsonResponse({'erro': 'Nome de usuario ja existe'}, status=400)

    is_admin = codigo == CODIGO_ADMIN
    usuario = User.objects.create_user(username=username, password=password1, is_staff=is_admin)
    login(request, usuario)
    return JsonResponse({
        'mensagem': 'Conta criada com sucesso',
        'username': usuario.username,
        'is_admin': is_admin,
    })


def api_me(request):
    if request.user.is_authenticated:
        return JsonResponse({
            'autenticado': True,
            'username': request.user.username,
            'is_admin': request.user.is_staff,
        })
    return JsonResponse({'autenticado': False, 'is_admin': False})
