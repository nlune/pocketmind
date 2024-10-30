from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class User(AbstractUser):
    username = models.CharField(blank=True, max_length=5)
    first_name = models.CharField(blank=True, max_length=50)
    last_name = models.CharField(blank=True, max_length=50)
    email = models.EmailField(unique=True)
    goal = models.CharField(blank=True)

    profile_picture = models.ImageField(blank=True, null=True)
    joined_date = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"User {self.id}: {self.email}"
