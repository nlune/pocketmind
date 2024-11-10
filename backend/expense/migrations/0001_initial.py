# Generated by Django 5.1.1 on 2024-11-10 12:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('category', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(max_length=250)),
                ('amount', models.FloatField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('is_recurring', models.BooleanField(default=False)),
                ('start_date', models.DateField(blank=True, null=True)),
                ('end_date', models.DateField(blank=True, null=True)),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT,
                                               related_name='expenses', to='category.category')),
            ],
        ),
    ]
