from rest_framework import serializers
from .models import UserSettings
from django.contrib.auth.models import User


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ['goals', 'pocket_enabled']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']  # Include name and email only
