from django.db import models

from project.settings import AUTH_USER_MODEL


# Create your models here.
class Expense(models.Model):
    description = models.TextField(max_length=250)
    amount = models.FloatField()
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='expenses')
    category = models.ForeignKey('category.Category', on_delete=models.PROTECT, blank=True, null=True,
                                 related_name='expenses')
    # recurring expenses
    is_recurring = models.BooleanField(default=False)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.description} {str(self.amount)}"
