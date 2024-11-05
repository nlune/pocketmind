from django.db import models

# from django.conf import settings
from django.contrib.auth import get_user_model

# from django.contrib.auth.models import User
# from django.contrib.auth.models import AbstractUser

User = get_user_model()


# class AIInsight(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)    # Link to the user
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     created_at = models.DateTimeField(auto_now_add=True)
#     tip = models.TextField()                                    # Stores the AI-generated insight/tip

#     def __str__(self):
#        return f"Insight for {self.user}"


# New model for predefined financial tips
class FinancialTip(models.Model):
    category = models.CharField(max_length=255, blank=True,
                                null=True)  # Category of the tip (e.g., groceries, entertainment)
    tip = models.TextField(blank=False, null=False)  # The actual financial tip

    def __str__(self):
        return self.category or "General Tip"
