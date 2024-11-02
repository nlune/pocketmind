from rest_framework import serializers
from .models import AIInsights, UserQuestion


class AIInsightsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIInsights
        fields = ['tip', 'created_at']


class UserQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserQuestion
        fields = ['question', 'answer', 'created_at']
