# Create your views here.
from rest_framework.exceptions import NotFound
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from budget.models import Budget
from budget.serializers import BudgetSerializer


class ListCreateBudgetView(ListCreateAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


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
