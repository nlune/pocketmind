# from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models

# from django.contrib.auth.models import User
# from django.contrib.auth.models import AbstractUser


# class AIInsight(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)    # Link to the user
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     created_at = models.DateTimeField(auto_now_add=True)
#     tip = models.TextField()                                    # Stores the AI-generated insight/tip

#     def __str__(self):
#        return f"Insight for {self.user}"

# Model to store AI-generated financial insights based on user spending
User = get_user_model()


class AIInsight(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tip = models.TextField()  # The AI-generated insight
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AI Insight for {self.user.username} at {self.created_at}"
