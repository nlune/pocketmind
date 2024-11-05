from django.db import models


# New model for predefined financial tips
class FinancialTip(models.Model):
    category = models.CharField(max_length=255, blank=True, null=True)  # Category of the tip (e.g., groceries, entertainment)
    tip = models.TextField(blank=False, null=False)  # The actual financial tip

    def __str__(self):
        return self.category or "General Tip"
