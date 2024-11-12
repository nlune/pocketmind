from rest_framework import serializers

from category.models import Category
from color.serializers import ColorSerializer


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
