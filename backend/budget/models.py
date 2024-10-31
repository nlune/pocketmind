from django.contrib.auth import get_user_model
from django.db import models

from category.models import Category

User = get_user_model()


# Create your models here.
class Budget(models.Model):
    name = models.TextField(blank=False, null=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, blank=False, null=False, related_name='budget')
    limit = models.DecimalField(max_digits=100, decimal_places=2, blank=False, null=False)
    spend = models.DecimalField(max_digits=100, decimal_places=2, blank=False, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False, related_name='budgets')

    def __str__(self):
        return f"{self.name} {self.category} {self.spend}/{self.limit} "
