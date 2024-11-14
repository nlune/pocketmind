from django.db.models import Sum
from rest_framework import serializers

from category.models import Category
from color.serializers import ColorSerializer


# import logging
# logger = logging.getLogger(__name__)


class CategorySerializer(serializers.ModelSerializer):
    color = ColorSerializer(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "user", "color"]
        read_only_fields = ["user", "color"]

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["user"] = request.user
        return super().create(validated_data)


class SimpleCategorySerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)


class ExpCategorySerializer(serializers.ModelSerializer):
    color = ColorSerializer(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "color"]


class TotalExpCategorySerializer(serializers.ModelSerializer):
    color = ColorSerializer(read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "color", "total"]

    def get_total(self, obj):
        if obj.expenses:
            # logger.warning(obj.expenses.aggregate(sum=Sum('amount')))
            return obj.expenses.aggregate(sum=Sum("amount"))["sum"]
        else:
            return 0
