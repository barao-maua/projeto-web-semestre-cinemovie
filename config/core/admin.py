from django.contrib import admin
from .models import Filme, Avaliacao, Favorito


@admin.register(Filme)
class FilmeAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'ano_lancamento', 'diretor', 'genero', 'duracao_minutos')
    search_fields = ('titulo', 'diretor', 'genero')
    list_filter = ('genero', 'ano_lancamento')


@admin.register(Avaliacao)
class AvaliacaoAdmin(admin.ModelAdmin):
    list_display = ('filme', 'usuario', 'nota', 'data_avaliacao')
    list_filter = ('nota', 'filme')


@admin.register(Favorito)
class FavoritoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'filme', 'data_favoritado')
