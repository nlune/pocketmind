from rest_framework import serializers

from category.serializers import SimpleCategorySerializer
from expense.models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Expense
        fields = "__all__"

    def get_category(self, obj):
        if obj.category:
            return {"id": obj.category.id, "name": obj.category.name}
        return None

    def get_user(self, obj):
        if obj.user:
            return {"id": obj.user.id, "username": obj.user.username}
        return None


class CreateExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = "__all__"


class GetExpenseSerializer(serializers.Serializer):
    category = SimpleCategorySerializer(read_only=False, required=False)
    description = serializers.CharField(max_length=500, allow_blank=True)
    amount = serializers.FloatField()
