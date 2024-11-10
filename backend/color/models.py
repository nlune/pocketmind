from django.core.validators import RegexValidator
from django.db import models


# Create your models here.
class Color(models.Model):
    name = models.CharField(max_length=50)
    entry_number = models.IntegerField(blank=False, null=False)
    hexcode = models.CharField(
        max_length=7,
        validators=[RegexValidator(regex='^#([A-Fa-f0-9]{6})$', message='Enter a valid hex color.')],
        help_text="Color in hex format, e.g., #FF5733",
    )

    def __str__(self):
        return f'Entry {self.entry_number}: {self.name} - Hexcode: {self.hexcode}'
