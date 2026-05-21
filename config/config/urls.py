from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from core import api_views

urlpatterns = [
    path('api/filmes/', api_views.api_filmes),
    path('api/filmes/<int:filme_id>/', api_views.api_filme_detalhe),
    path('api/filmes/<int:filme_id>/favoritar/', api_views.api_favoritar),
    path('api/filmes/<int:filme_id>/desfavoritar/', api_views.api_desfavoritar),
    path('api/filmes/<int:filme_id>/sessoes/', api_views.api_filme_sessoes),
    path('api/meus-favoritos/', api_views.api_meus_favoritos),
    path('api/cadastrar/', api_views.api_registro),
    path('api/entrar/', api_views.api_login),
    path('api/sair/', api_views.api_logout),
    path('api/eu/', api_views.api_me),
    path('api/admin/filmes/', api_views.api_admin_filmes),
    path('api/admin/filmes/<int:filme_id>/', api_views.api_admin_filme_detalhe),
    path('api/admin/filmes/<int:filme_id>/sessoes/', api_views.api_admin_sessoes),
    path('api/admin/sessoes/<int:sessao_id>/', api_views.api_admin_sessao_detalhe),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
