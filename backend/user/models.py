from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class User(AbstractUser):
    # Field used for authentication
    USERNAME_FIELD = 'email'

    # Additional fields required to create an user (USERNAME_FIELD and passwords are always required)
    REQUIRED_FIELDS = ['username']

    username = models.CharField(max_length=30, unique=True)

    first_name = models.CharField(max_length=30)

    last_name = models.CharField(max_length=30)

    password = models.CharField(max_length=200)

    password_repeat = models.CharField(max_length=200, null=True)

    email = models.EmailField(unique=True)

    joined_date = models.DateTimeField(auto_now_add=True)

    #profile_picture = models.ImageField(blank=True, null=True)

    def __str__(self):
        return f"User {self.id}: {self.email}"
