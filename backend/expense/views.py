# Create your views here.
import datetime
import json
import logging
from datetime import timedelta

from django.db.models import Sum
from django.utils import timezone
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from category.models import Category
from expense.models import Expense
from expense.serializers import ExpenseSerializer
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

    serializer_class = ExpenseSerializer

    def post(self, request):
        _category = request.data.get("category", "")
        if not _category:
            _category = get_category(request.data["description"])
        category, created = Category.objects.get_or_create(name=_category)
        request.data.update({"category": category.id, "user": request.user.id})

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
        logger.warning(f"user input: {user_entry}")
        data = get_transaction(user_entry)
        data = json.loads(data)
        _category = get_category(data["description"])
        category, created = Category.objects.get_or_create(name=_category)
        data.update({"category": category.id, "user": request.user.id})

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data)


class ReportsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        interval = request.query_params.get('interval', None)
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)

        expenses = Expense.objects.filter(user=user)

        if interval == 'daily':
            today = timezone.now().date()
            expenses = expenses.filter(created__date=today)
        elif interval == 'weekly':
            start_of_week = timezone.now().date() - timedelta(days=timezone.now().weekday())
            expenses = expenses.filter(created__date__gte=start_of_week)
        elif interval == 'monthly':
            start_of_month = timezone.now().replace(day=1)
            expenses = expenses.filter(created__date__gte=start_of_month)
        elif interval == 'custom' and start_date and end_date:
            try:
                start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d').date()
                end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()
                expenses = expenses.filter(created__date__range=(start_date, end_date))
            except ValueError:
                return Response({"error": "Invalid date format. Use 'YYYY-MM-DD'."}, status=400)
        else:
            return Response({"error": "Invalid interval or missing date parameters."}, status=400)


        total_expense = expenses.aggregate(total=Sum('amount'))['total'] or 0.0
        expense_details = ExpenseSerializer(expenses, many=True).data

        return Response({
            "interval": interval,
            "total_expense": total_expense,
            "details": expense_details,
        })