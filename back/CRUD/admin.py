from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from CRUD.models import Gender, Artist, Album, Piece, AlbumArtist, PieceGenre, Utilisateur

# Register your models here.

admin.site.register(Artist)
admin.site.register(Album)
admin.site.register(AlbumArtist)
admin.site.register(Piece)
admin.site.register(Gender)
admin.site.register(PieceGenre)

admin.site.register(Utilisateur)
