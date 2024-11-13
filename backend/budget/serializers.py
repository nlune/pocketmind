from rest_framework import serializers

from budget.models import Budget
from category.models import Category
from category.serializers import CategorySerializer
from color.models import Color
from color.serializers import ColorSerializer


class BudgetSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True
    )
    color = ColorSerializer(read_only=True)
    color_id = serializers.PrimaryKeyRelatedField(
        queryset=Color.objects.all(), source="color", write_only=True
    )
    spend = serializers.DecimalField(max_digits=100, decimal_places=2, default=0)

    class Meta:
        model = Budget
        fields = ["id", "category", "category_id", "limit", "spend", "user", "color", "color_id"]
        read_only_fields = ["id", "user"]

    def validate(self, data):
        # category = data.get('category')
        # user = self.context["request"].user
        #
        # # if Budget.objects.filter(category=category, user=user).exists():
        # #     raise serializers.ValidationError("There is already a budget with that category.")
        return data

    def create(self, validated_data):
        color = validated_data.pop("color", None)
        category = validated_data["category"]

        if color and category.color != color:
            category.color = color
            category.save()

        return Budget.objects.create(color=color or category.color, **validated_data)
