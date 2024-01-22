from django.db import models

class Proprietaires(models.Model):
    id_proprietaire = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=150)
    prenom = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    adresse = models.CharField(max_length=255)
    telephone = models.CharField(max_length=20)
    date_inscription = models.DateTimeField(auto_now_add=True)

class Botanistes(models.Model):
    id_botaniste = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=150)
    prenom = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    adresse = models.CharField(max_length=255)
    telephone = models.CharField(max_length=20)
    date_inscription = models.DateTimeField(auto_now_add=True)
    certification = models.CharField(max_length=100, blank=True, null=True)

class GardesPlantes(models.Model):
    id_garde = models.AutoField(primary_key=True)
    proprietaire = models.ForeignKey(Proprietaires, related_name='gardes', on_delete=models.CASCADE)
    gardien = models.ForeignKey(Proprietaires, related_name='gardes_acceptees', on_delete=models.CASCADE)
    titre = models.CharField(max_length=255)
    nom_plante = models.CharField(max_length=100)
    espece = models.CharField(max_length=100)
    description_plante = models.TextField()
    acceptee = models.BooleanField(default=False)
    date_debut = models.DateTimeField()
    date_fin = models.DateTimeField()

class NotesJournalieres(models.Model):
    id = models.AutoField(primary_key=True)
    date_note = models.DateField()

class PostsEtatPlante(models.Model):
    id = models.AutoField(primary_key=True)
    auteur = models.ForeignKey(Proprietaires, on_delete=models.CASCADE)
    titre = models.CharField(max_length=255)
    description_plante = models.TextField()
    date_post = models.DateTimeField(auto_now_add=True)
    note_journaliere = models.ForeignKey(NotesJournalieres, on_delete=models.CASCADE)

class Photos(models.Model):
    id = models.AutoField(primary_key=True)
    post_etat_plante = models.ForeignKey(PostsEtatPlante, on_delete=models.CASCADE)
    image = models.CharField(max_length=255)

class CommentairesBotaniste(models.Model):
    id = models.AutoField(primary_key=True)
    botaniste = models.ForeignKey(Botanistes, on_delete=models.CASCADE)
    post_etat_plante = models.ForeignKey(PostsEtatPlante, on_delete=models.CASCADE)
    commentaire = models.TextField()
    date_commentaire = models.DateTimeField(auto_now_add=True)

class Notifications(models.Model):
    id = models.AutoField(primary_key=True)
    post_etat_plante = models.ForeignKey(PostsEtatPlante, on_delete=models.CASCADE)
    destinataire_proprietaire = models.ForeignKey(Proprietaires, on_delete=models.CASCADE)
    destinataire_botaniste = models.ForeignKey(Botanistes, on_delete=models.CASCADE)
    contenu = models.TextField()
    lue = models.BooleanField(default=False)
    date_notification = models.DateTimeField(auto_now_add=True)

class Messages(models.Model):
    id = models.AutoField(primary_key=True)
    expediteur = models.ForeignKey(Proprietaires, related_name='messages_envoyes', on_delete=models.CASCADE)
    destinataire = models.ForeignKey(Proprietaires, related_name='messages_recus', on_delete=models.CASCADE)
    contenu = models.TextField()
    date_envoi = models.DateTimeField(auto_now_add=True)
    lu = models.BooleanField(default=False)

class Conseils(models.Model):
    id = models.AutoField(primary_key=True)
    titre = models.CharField(max_length=255)
    description = models.TextField()
    date_creation = models.DateTimeField(auto_now_add=True)
    botaniste = models.ForeignKey(Botanistes, on_delete=models.CASCADE)
