from django.urls import path
from .views import AIInsightsView

urlpatterns = [
    path('aiinsights/', AIInsightsView.as_view(), name='ai-insights'),  # AI Insights and Ask AI endpoint
]