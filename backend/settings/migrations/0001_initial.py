# Generated by Django 5.1.1 on 2024-11-10 12:50

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UserSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('goals', models.TextField(blank=True, null=True)),
                ('pocket_enabled', models.BooleanField(default=False)),
            ],
        ),
    ]
