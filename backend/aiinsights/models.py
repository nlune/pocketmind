from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


# Model to store AI-generated financial insights based on user spending
class AIInsights(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tip = models.TextField()  # The AI-generated insight
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AI Insight for {self.user.username} at {self.created_at}"


# Model to store user financial questions and AI responses
class UserQuestion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.TextField()  # User's financial question
    answer = models.TextField(blank=True, null=True)  # AI's response to the question
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Question by {self.user.username} at {self.created_at}"
