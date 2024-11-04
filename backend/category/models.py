from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=False, null=False, related_name="categories"
    )

    def __str__(self):
        return self.name
