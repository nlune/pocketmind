from django.db import models


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100)
    # budget = models.IntegerField(blank=True, null=True)
    # amount_spent = models.FloatField(default=0)

    def __str__(self):
        return self.name
