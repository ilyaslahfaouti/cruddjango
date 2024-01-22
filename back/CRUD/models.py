from django.contrib.auth.hashers import make_password
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
class Artist(models.Model):
    id_artiste = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    photo = models.CharField(max_length=255)
    bio = models.TextField()

    def __str__(self):
        return self.name

class Album(models.Model):
    id_album = models.AutoField(primary_key=True)
    title=models.CharField(max_length=50, null=True)
    cover = models.ImageField(upload_to='uploads/', null=True)
    release_date = models.DateField()
    def __str__(self):
        return self.title

class AlbumArtist(models.Model):
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    class Meta:
        unique_together = ('album', 'artist')


class Piece(models.Model):
    id_piece = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    duration = models.IntegerField()
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    artist=models.ForeignKey(Artist,on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class Gender(models.Model):
    id_genre = models.AutoField(primary_key=True)
    Title = models.CharField(max_length=255)
    Description = models.TextField()

    def __str__(self):
        return self.Title

class PieceGenre(models.Model):
    piece = models.ForeignKey(Piece, on_delete=models.CASCADE)
    gender = models.ForeignKey(Gender, on_delete=models.CASCADE)
    class Meta:
        unique_together = ('piece', 'gender')


class UtilisateurManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, name, password, **extra_fields)

class Utilisateur(AbstractBaseUser, PermissionsMixin):
    id_user = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UtilisateurManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.name