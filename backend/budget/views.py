# Create your views here.
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from budget.models import Budget
from budget.serializers import BudgetSerializer
from color.models import Color


class ListCreateBudgetView(ListCreateAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        category = serializer.validated_data.get("category")
        user = self.request.user

        if Budget.objects.filter(category=category, user=user).exists():
            raise ValidationError({"detail": "There is already a budget with that category"})

        color_id = self.request.data.get("color_id")
        if color_id:
            color = get_object_or_404(Color, id=color_id)

            if category.color != color:
                category.color = color
                category.save()

            serializer.save(user=user, color=color)
        else:
            serializer.save(user=user)


class RetrieveUpdateDestroyBudgetView(RetrieveUpdateDestroyAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]

    def get_object(self):
        budget_id = self.kwargs.get("budget_id")
        try:
            return Budget.objects.get(id=budget_id)
        except Budget.DoesNotExist:
            raise NotFound("Budget not found.")

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)
