from rest_framework import serializers
from budget.models import Budget        # Import the Budget model
#from expense.models import Expense     # Import the Expense model
from .models import AIInsight           # AIinsights is assumed

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['limit', 'spend']

#class ExpenseSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = Expense
#        fields = ['amount', 'category', 'date']

class AIInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIInsight
        fields = ['tip']
