from django.urls import path
from .views import AIInsightsView  # , AskQuestionView

urlpatterns = [
    path('aiinsights/', AIInsightsView.as_view(), name='ai-insights'),  # AI Insights and Ask AI endpoint
    # path('ask/', AskQuestionView.as_view(), name='ask-question')  # Endpoint to ask a financial question
]
