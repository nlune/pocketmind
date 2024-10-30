from rest_framework import serializers

from category.serializers import CategorySerializer
from expense.models import Expense


class ExpenseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Expense
        fields = '__all__'
