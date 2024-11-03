from rest_framework.views import APIView
from rest_framework.response import Response
from budget.models import Budget

# from expenses.models import Expense  # optional
from .serializers import BudgetSerializer, AIInsightSerializer
from .models import AIInsight


class DashboardView(APIView):

    def get(self, request):
        user = request.user

        # Fetch all budgets for the user
        budgets = Budget.objects.filter(user=user)

        # Calculate total limit and total spent across all budgets
        total_limit = sum(budget.limit for budget in budgets)
        total_spent = sum(budget.spend for budget in budgets)
        available_budget = total_limit - total_spent

        # Optional: serialize individual budgets if needed
        budget_serializer = BudgetSerializer(budgets, many=True)

        # Fetch AI insights for the user
        ai_insights = AIInsight.objects.filter(user=user).order_by("-created_at")[
            :2
        ]  # Limit to 2
        ai_serializer = AIInsightSerializer(ai_insights, many=True)

        # Fetch recent expenses (e.g., last 5)
        # recent_expenses = Expense.objects.filter(user=user).order_by('-date')[:5]
        # expense_serializer = ExpenseSerializer(recent_expenses, many=True)

        # Combine the data into the response
        response_data = {
            "total_limit": total_limit,
            "total_spent": total_spent,
            "available_budget": available_budget,
            "budgets": budget_serializer.data,  # give budget breakdown by category
            # "recent_expenses": expense_serializer.data
            "ai_insights": ai_serializer.data,
        }

        return Response(response_data)
