from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


# Create your models here.
class Expense(models.Model):
    description = models.TextField(max_length=250)
    amount = models.FloatField()
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    category = models.ForeignKey('category.Category', on_delete=models.PROTECT, blank=True, null=True,
                                 related_name='expenses')
    # recurring expenses
    is_recurring = models.BooleanField(default=False)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.description} {str(self.amount)}"
