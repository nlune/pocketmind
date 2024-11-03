from rest_framework import serializers

from budget.models import Budget
from category.models import Category
from category.serializers import CategorySerializer


class BudgetSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True
    )

    class Meta:
        model = Budget
        fields = ["id", "name", "category", "category_id", "limit", "spend", "user"]
        read_only_fields = ["id", "user"]
