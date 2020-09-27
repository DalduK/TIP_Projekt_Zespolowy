from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Rooms(models.Model):
    uuid = models.UUIDField(unique=True)
    name = models.CharField(max_length=200)

class UsersRooms(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    room_id = models.ForeignKey(Rooms, on_delete=models.CASCADE)