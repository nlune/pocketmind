from django.conf import settings
from django.db import models


# from django.contrib.auth.models import User


class UserSettings(models.Model):
    # user = models.OneToOneField(User, on_delete=models.CASCADE)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,  # AUTH_USER_MODEL
        on_delete=models.CASCADE
    )
    goals = models.TextField(blank=True, null=True)  # To store user goals
    pocket_enabled = models.BooleanField(default=False)  # Pocket feature toggle

    def __str__(self):
        return f"{self.user.username}'s Settings"
