from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from CRUD.models import Gender, Album, Piece, Artist, Utilisateur


class AlbumSerializers(serializers.ModelSerializer):
    class Meta:
        model=Album
        fields='__all__'
class GenderSerializers(serializers.ModelSerializer):
    class Meta:
        model=Gender
        fields='__all__'

class PieceSerializers(serializers.ModelSerializer):
    class Meta:
        model=Piece
        fields='__all__'

class ArtistSerializers(serializers.ModelSerializer):
    class Meta:
        model=Artist
        fields='__all__'

class UtilisateurSerializers(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = '__all__'


