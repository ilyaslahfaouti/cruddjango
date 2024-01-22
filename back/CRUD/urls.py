from django.urls import path
from rest_framework_simplejwt.views import token_obtain_pair

from .views import gender_list, update_gender, list_albums, add_song_to_album, \
    get_album, album_songs,  add_album,  update_album, delete_album, \
    register
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [

    path('api/genres', gender_list, name='gender-list'),
    path('api/genres/<int:pk>', update_gender, name='update-gender'),
    path('api/albums', list_albums, name='list_albums'),
    path('api/albums/<int:pk>/', get_album, name='get_album'),
    path('api/albums/create', add_album, name='add_album'),
    path('api/albums/<int:pk>/songs/create', add_song_to_album,name='add_song_to_album'),
    path('api/albums/<int:pk>/songs',album_songs,name='album_songs'),
    path('api/albums/<int:pk>',update_album,name='update_album'),
    path('api/albums/<int:pk>/delete', delete_album, name='delete_album'),
    path('api/users/signup', register, name='register'),


]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)