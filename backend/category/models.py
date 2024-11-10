from django.contrib.auth import get_user_model
from django.db import models

from color.models import Color

User = get_user_model()


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="categories", blank=True, null=True
    )
    color = models.ForeignKey(Color, on_delete=models.PROTECT, related_name="categories", null=True)

    def __str__(self):
        color_str = f"Color: {self.color.name} - {self.color.hexcode}" if self.color else "No Color"
        return f'{self.name} {color_str}'