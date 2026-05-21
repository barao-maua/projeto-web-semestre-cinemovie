from django.db import models
from django.contrib.auth.models import User


class Filme(models.Model):
    titulo = models.CharField(max_length=200)
    sinopse = models.TextField()
    ano_lancamento = models.IntegerField()
    diretor = models.CharField(max_length=100)
    genero = models.CharField(max_length=50)
    duracao_minutos = models.IntegerField()
    poster_imagem = models.CharField(max_length=100, blank=True)       # ref. imagem estatica (legado)
    poster = models.ImageField(upload_to='posters/', blank=True, null=True)  # upload real
    nota = models.IntegerField(default=0)                               # 0 = sem nota, 1-5 estrelas
    data_cadastro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titulo} ({self.ano_lancamento})"


class Avaliacao(models.Model):
    NOTAS = [(i, str(i)) for i in range(1, 6)]

    filme = models.ForeignKey(Filme, on_delete=models.CASCADE, related_name='avaliacoes')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='avaliacoes')
    nota = models.IntegerField(choices=NOTAS)
    comentario = models.TextField(blank=True)
    data_avaliacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.username} - {self.filme.titulo} ({self.nota}/5)"


class Favorito(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    filme = models.ForeignKey(Filme, on_delete=models.CASCADE)
    data_favoritado = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'filme')

    def __str__(self):
        return f"{self.usuario.username} - {self.filme.titulo}"
