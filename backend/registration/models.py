import random

from django.conf import settings
from django.db import models


def code_generator():
    return f'{random.randint(100000, 999999)}'


class RegistrationProfile(models.Model):
    user = models.OneToOneField(
        verbose_name='user',
        on_delete=models.CASCADE,
        related_name='registration_profile',
        to=settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
    )

    email = models.EmailField()

    code = models.CharField(
        verbose_name='code',
        help_text='random code used for registration and for password reset',
        max_length=15,
        default=code_generator
    )

    is_validated = models.BooleanField(default=False)
    code_used = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.email}, {self.code}'
