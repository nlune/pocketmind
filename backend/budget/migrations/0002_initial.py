# Generated by Django 5.1.1 on 2024-11-05 09:46

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('budget', '0001_initial'),
        ('category', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='budget',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='budget', to='category.category'),
        ),
    ]
