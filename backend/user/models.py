from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    location = models.CharField(max_length=250, blank=True)
    joined_date = models.DateTimeField(auto_now_add=True)
    password_reset_code = models.CharField(max_length=255, null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]


class RegistrationProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    is_validated = models.BooleanField(default=False)
    code = models.CharField(max_length=6, editable=False)
