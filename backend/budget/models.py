from django.contrib.auth import get_user_model
from django.db import models

from category.models import Category

User = get_user_model()

# Create your models here.
class Budget(models.Model):
    name = models.TextField(blank=False, null=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, blank=False, null=False, related_name='budget')
    limit = models.IntegerField(blank=False, null=False)
    spend = models.IntegerField(blank=False, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False, related_name='budgets')
