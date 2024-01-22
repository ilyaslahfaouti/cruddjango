from django.contrib.auth import authenticate, login


from django.contrib.auth.hashers import make_password, check_password
from django.db import transaction
from django.http import QueryDict, JsonResponse
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Gender, Album, Artist, Piece, AlbumArtist, Utilisateur, PieceGenre
from .serializers import GenderSerializers, AlbumSerializers, PieceSerializers, ArtistSerializers, \
    UtilisateurSerializers


@api_view(['GET'])
def gender_list(request):
    if request.method == 'GET':
        genders = Gender.objects.all()
        serializer = GenderSerializers(genders,many=True)
        return Response(serializer.data)






@api_view(['PUT'])
def update_gender(request, pk):
    try:
        gender = Gender.objects.get(pk=pk)
    except Gender.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = GenderSerializers(gender, data=request.data)
        if serializer.is_valid():
            serializer.save()
            genders=Gender.objects.all()
            serializerData=GenderSerializers(genders, many=True)
            return Response(serializerData.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def list_albums(request):
    try:
        albums=Album.objects.all()
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method=='GET':
        serializer=AlbumSerializers(albums,many=True)
        return Response(serializer.data)

@api_view(['GET'])
def get_album(request, pk):
    try:
        album = Album.objects.get(pk=pk)
    except Album.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    artists = Artist.objects.filter(albumartist__album=album)

    if artists:
        serializer_artists = ArtistSerializers(artists, many=True)

    if request.method == 'GET':
        serializer_album = AlbumSerializers(album)
        return Response({
            'album_details': serializer_album.data,
            'artists': serializer_artists.data if artists else []
        })

@api_view(['GET'])
def album_songs(request, pk):
    try:
        album = Album.objects.get(pk=pk)
    except Album.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    songs = Piece.objects.filter(album=album)

    songs_data = []
    for song in songs:

        genres = Gender.objects.filter(piecegenre__piece=song)
        serializer_genres = GenderSerializers(genres, many=True)

        serializer_song = PieceSerializers(song)
        songs_data.append({
            'song': serializer_song.data,
            'genres': serializer_genres.data
        })

    if request.method == 'GET':
        return Response({
            'songs_with_genres': songs_data
        })



@api_view(['POST'])
def add_album(request):
    data = request.data
    artists_ids = data.pop('artists', [])

    serializer = AlbumSerializers(data=data)

    if serializer.is_valid():
        album = serializer.save()

        for artist_id in artists_ids:
            try:
                artist = Artist.objects.get(pk=artist_id)
                AlbumArtist.objects.create(artist=artist, album=album)
            except Artist.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        albums=Album.objects.all()
        serializerAlbums=AlbumSerializers(albums,many=True)

        return Response(serializerAlbums.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def add_song_to_album(request, pk):
    try:
        album = Album.objects.get(pk=pk)
    except Album.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'POST':
        genders_data = request.data.pop('genders', [])  # Récupère les genres sous forme de liste

        serializer = PieceSerializers(data=request.data, partial=True)
        if serializer.is_valid():
            artist_id = request.data.get('artist')
            try:
                artist = Artist.objects.get(pk=artist_id)
            except Artist.DoesNotExist:
                return Response({'error': 'Artist does not exist'}, status=status.HTTP_404_NOT_FOUND)

            piece = serializer.save(album=album, artist=artist)

            genders = Gender.objects.filter(pk__in=genders_data)
            if genders.count() != len(genders_data):
                return Response({'error': 'One or more genders do not exist'}, status=status.HTTP_404_NOT_FOUND)

            for gender in genders:
                PieceGenre.objects.create(piece=piece, gender=gender)  # Associe les genres à la pièce

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_album(request, pk):
    try:
        album = Album.objects.get(pk=pk)
    except Album.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Vérifiez si request.data est un QueryDict avant de le copier
    data = request.data.copy() if isinstance(request.data, QueryDict) else request.data
    artists_ids = data.pop('artists', [])
    AlbumArtist.objects.filter(album=album).delete()

    serializer = AlbumSerializers(album, data=data, partial=True)
    if serializer.is_valid():
        album = serializer.save()

        for artist_id in artists_ids:
            try:
                artist = Artist.objects.get(pk=artist_id)
                AlbumArtist.objects.create(artist=artist, album=album)
            except Artist.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        albums=Album.objects.all()
        serializerData=AlbumSerializers(albums,many=True)

        return Response(serializerData.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def delete_album(request, pk):
    try:
        album = Album.objects.get(pk=pk)
    except Album.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':


        # Imprimez le token d'accès
        print("Access Token:", request.auth)

        Album.delete(album)
        return Response(status=status.HTTP_200_OK)





@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        password = request.data.get('password')
        hashed_password = make_password(password)
        request.data['password'] = hashed_password

        serializer = UtilisateurSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






















