from rest_framework import serializers

from expense.models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Expense
        fields = "__all__"

    def get_category(self, obj):
        if obj.category:
            return {
                "id": obj.category.id,
                "name": obj.category.name
            }
        return None

    def get_user(self, obj):
        if obj.user:
            return {
                "id": obj.user.id,
                "username": obj.user.username
            }
        return None
