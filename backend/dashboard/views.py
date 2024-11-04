from rest_framework.views import APIView
from rest_framework.response import Response
from budget.models import Budget
from .serializers import BudgetSerializer, FinancialTipSerializer
from .models import FinancialTip
from rest_framework import status
from decimal import Decimal

class DashboardView(APIView):

    def get(self, request):
        try:
            user = request.user

            # Fetch all budgets for the user
            budgets = Budget.objects.filter(user=user)
            
            # Initialize totals
            total_limit = Decimal(0)  
            total_spent = Decimal(0) 

            # Calculate total limit and total spent across all budgets
            for budget in budgets:
                total_limit += budget.limit 
                total_spent += budget.spend

            available_budget = total_limit - total_spent

            # Serialize individual budgets
            budget_serializer = BudgetSerializer(budgets, many=True)

            # Fetch predefined financial tips (for example, showing general tips)
            financial_tips = FinancialTip.objects.filter(category="General")[:2]  # Fetch 2 tips
            financial_tip_serializer = FinancialTipSerializer(financial_tips, many=True)

            # Combine the data into the response
            response_data = {
                "total_limit": float(total_limit),  # Convert Decimal to float before sending in response
                "total_spent": float(total_spent),  # Convert Decimal to float before sending in response
                "available_budget": float(available_budget),  # Convert Decimal to float
                "budgets": budget_serializer.data,
                "financial_tips": financial_tip_serializer.data,  # Display tips
            }

            return Response(response_data)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
