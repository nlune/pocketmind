from rest_framework import serializers

from category.serializers import SimpleCategorySerializer
from expense.models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    category = SimpleCategorySerializer(read_only=False)

    class Meta:
        model = Expense
        fields = "__all__"


class CreateExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = "__all__"
