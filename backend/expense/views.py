# Create your views here.
from rest_framework.generics import ListAPIView

from expense.models import Expense
from expense.serializers import ExpenseSerializer


class ListExpenses(ListAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
