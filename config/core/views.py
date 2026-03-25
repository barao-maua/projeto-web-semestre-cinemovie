from django.shortcuts import render, redirect
from django.contrib import messages

def home(request):
    return render(request, 'index.html')

def filmes(request):
    return render(request, 'Filmes.html')

def sobre(request):
    return render(request, 'sobre.html')

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        if email == 'login@gmail.com' and password == 'admin123':
            return redirect('index')
        else:
            messages.error(request, 'E-mail ou senha incorretos.')
    
    return render(request, 'login.html')

def zootopia(request):
    return render(request, 'zootopia.html')

def panico(request):
    return render(request, 'panico.html')

def questao_tempo(request):
    return render(request, 'questao_tempo.html')

def avatar(request):
    return render(request, 'avatar.html')