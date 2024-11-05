from rest_framework import serializers

from budget.models import Budget  # Import the Budget model
from .models import FinancialTip


# from expense.models import Expense     # Import the Expense model


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ["limit", "spend"]


# class ExpenseSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = Expense
#        fields = ['amount', 'category', 'date']


class FinancialTipSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialTip
        fields = ['category', 'tip']  # Adjust fields as necessary
