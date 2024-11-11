from django.contrib.auth import get_user_model
from django.db import models

from category.models import Category
from color.models import Color

User = get_user_model()


# Create your models here.
class Budget(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        blank=False,
        null=False,
        related_name="budget",
    )
    limit = models.DecimalField(
        max_digits=100, decimal_places=2, blank=False, null=False
    )

    spend = models.DecimalField(max_digits=100, decimal_places=2, default=0, blank=False, null=False)

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=False, null=False, related_name="budgets"
    )

    color = models.ForeignKey(Color, on_delete=models.PROTECT, related_name="budgets")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["category", "user"], name="unique_category_per_user")
        ]

    def __str__(self):
        return f"{self.category} {self.spend}/{self.limit}"
