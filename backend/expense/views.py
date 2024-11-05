# Create your views here.
import json
import logging

from rest_framework import status
from rest_framework.generics import ListCreateAPIView, GenericAPIView
from rest_framework.response import Response

from category.models import Category
from expense.models import Expense
from expense.serializers import ExpenseSerializer, CreateExpenseSerializer
from project.helpers.get_category import get_category
from project.helpers.get_transaction import get_transaction

logger = logging.getLogger(__name__)


class ListAddExpenses(ListCreateAPIView):
    """
    get:
    List all expenses.
    post:
    Add a new expense by sending in correct json format for expense
    """

    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer


class AddExpense(GenericAPIView):
    """
    post:
    Create a new expense by sending description
    """

    serializer_class = CreateExpenseSerializer

    def post(self, request):
        _category = request.data.get("category", "")
        if not _category:
            _category = get_category(request.data["description"])
        category, created = Category.objects.get_or_create(name=_category)
        request.data.update(
            {"category": category.id, "user": request.user.id}
        )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GetExpenseFromInput(GenericAPIView):
    """
    post:
    send text description and get back a suggested transaction
    """

    serializer_class = ExpenseSerializer

    def post(self, request):
        user_entry = request.data["text"]
        data = get_transaction(user_entry)
        data = json.loads(data)
        category = get_category(data["description"])
        # category, created = Category.objects.get_or_create(name=_category)
        data.update({"category": {"name": category}, "user": request.user.id})

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data)
