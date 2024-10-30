# Create your views here.
from rest_framework import status
from rest_framework.generics import ListAPIView, GenericAPIView
from rest_framework.response import Response

from category.models import Category
from expense.models import Expense
from expense.serializers import ExpenseSerializer
from project.helpers.get_category import get_category

import logging

logger = logging.getLogger(__name__)

class ListExpenses(ListAPIView):
    """
    get:
    List all expenses.
    """
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

class AddExpense(GenericAPIView):
    """
    post:
    Create a new expense by sending description
    """
    serializer_class = ExpenseSerializer

    def post(self, request):
        _category = get_category(request.data['description'])
        logger.warning(_category)
        category, created = Category.objects.get_or_create(name=_category)
        logger.warning(category)
        request.data.update({"category": category.id,
                             "user": request.user.id})

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)