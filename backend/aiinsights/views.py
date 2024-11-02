from rest_framework.views import APIView
from rest_framework.response import Response
from .models import AIInsights  # , UserQuestion
from .serializers import AIInsightsSerializer  # , UserQuestionSerializer
# from .services import handle_user_question


# View to show more AI Insights and handle user questions
class AIInsightsView(APIView):

    def get(self, request):
        user = request.user
        # user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)

        # Fetch all AI insights for the user
        ai_insights = AIInsights.objects.filter(user=user).order_by('-created_at')
        ai_serializer = AIInsightsSerializer(ai_insights, many=True)

        return Response({
            "ai_insights": ai_serializer.data
        })

# class AskQuestionView(APIView):
    # def post(self, request):
        # user = request.user
        # question_text = request.data.get('question')

        # if not question_text:
        #    return Response({"error": "No question provided."}, status=400)

        # Get the AI's answer to the user's question
        # answer = handle_user_question(user, question_text)

        # return Response({
        #    "question": question_text,
        #    "answer": answer
        # }status=status.HTTP_200_OK)
