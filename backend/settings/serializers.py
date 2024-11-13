from django.contrib.auth.models import User
from rest_framework import serializers

from .models import UserSettings


class UserSettingsSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)  # Add username field
    email = serializers.EmailField(source='user.email', read_only=True)  # Add email field

    class Meta:
        model = UserSettings
        fields = ['goals', 'pocket_enabled', 'username', 'email']  # Include 'username' and 'email'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']  # Include name and email only
