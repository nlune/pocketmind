from rest_framework import serializers
from .models import Color

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name', 'entry_number', 'hexcode']
        read_only_fields = ['entry_number']