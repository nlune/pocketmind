# Create your views here.
import datetime
import json
import logging
from datetime import timedelta

from django.db.models import Sum
from django.utils import timezone
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, GenericAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from category.models import Category
from category.serializers import SimpleCategorySerializer
from color.models import Color
from expense.models import Expense
from expense.serializers import (
    ExpenseSerializer,
    CreateExpenseSerializer,
    GetExpenseSerializer,
    InsightExpenseSerializer,
)
from project.helpers.get_ask_insight import get_ask_insight
from project.helpers.get_category import get_category
from project.helpers.get_insight import get_insight
from project.helpers.get_transaction import get_transaction
from project.helpers.get_transaction_scannedTxt import get_transaction_scannedtxt

logger = logging.getLogger(__name__)


class ListAddExpenses(ListCreateAPIView):
    """
    get:
    List all expenses.
    post:
    Add a new expense by sending in correct json format for expense
    """

    queryset = Expense.objects.all().order_by("-created")
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
        category, created = Category.objects.get_or_create(name=_category, user=request.user)

        if created:
            total_colors = Color.objects.count()

            if total_colors > 0:
                entry_number = (category.id - 1) % total_colors

                try:
                    color = Color.objects.get(entry_number=entry_number)
                    category.color = color
                    category.save()
                except Color.DoesNotExist:
                    logging.error(f'No color found for entry_number {entry_number}. Category ID: {category.id}')
            else:
                logging.error('No available colors to assign to category.')

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

    serializer_class = GetExpenseSerializer

    def post(self, request):
        user_entry = request.data["text"]
        data = get_transaction(user_entry)
        data = json.loads(data)
        if data["description"]:
            category = get_category(data["description"])
            data.update({"category": {"name": category}, "user": request.user.id})
        else:
            data.update({"user": request.user.id})

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data)


class GetExpenseScannedInput(GenericAPIView):
    """
    post:
    send text description extracted from scanned receipt and get back a suggested transaction
    """

    serializer_class = GetExpenseSerializer

    def post(self, request):
        user_entry = request.data["text"]
        data = get_transaction_scannedtxt(user_entry)
        data = json.loads(data)

        if data["description"]:
            category = get_category(data["description"])
            data.update({"category": {"name": category}, "user": request.user.id})
        else:
            data.update({"user": request.user.id})

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data)


class GetCategoryFromDescription(GenericAPIView):
    """
    post:
    send description and get back generated category name
    """

    serializer_class = SimpleCategorySerializer

    def post(self, request):
        description = request.data["description"]
        category = get_category(description)
        data = {"name": category}

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data)


class ReportsView(APIView):
    """
    get:
    Get list of all expenses, filtered by given interval
    you can use: daily, weekly, monthly or custom date
    interval examples:
    - /?interval=daily
    - /?interval=weekly
    - /?interval=monthly
    - /?interval=custom&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
    Optional category filter add:
    - &category=<category_id>
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        interval = request.query_params.get("interval", None)
        start_date = request.query_params.get("start_date", None)
        end_date = request.query_params.get("end_date", None)
        category_id = request.query_params.get("category", None)

        expenses = Expense.objects.filter(user=user).order_by("-created")

        if interval == "daily":
            today = timezone.now().date()
            expenses = expenses.filter(created__date=today)
        elif interval == "weekly":
            start_of_week = timezone.now().date() - timedelta(
                days=timezone.now().weekday()
            )
            expenses = expenses.filter(created__date__gte=start_of_week)
        elif interval == "monthly":
            start_of_month = timezone.now().replace(day=1)
            expenses = expenses.filter(created__date__gte=start_of_month)
        elif interval == "custom" and start_date and end_date:
            try:
                start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
                end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d").date()
                expenses = expenses.filter(created__date__range=(start_date, end_date))
            except ValueError:
                return Response(
                    {"error": "Invalid date format. Use 'YYYY-MM-DD'."}, status=400
                )
        else:
            return Response(
                {"error": "Invalid interval or missing date parameters."}, status=400
            )

        if category_id:
            expenses = expenses.filter(category_id=category_id)

        total_expense = expenses.aggregate(total=Sum("amount"))["total"] or 0.0
        expense_details = ExpenseSerializer(expenses, many=True).data

        return Response(
            {
                "interval": interval,
                "category": category_id if category_id else "all",
                "total_expense": total_expense,
                "details": expense_details,
            }
        )


class InsightsView(GenericAPIView):
    """
    get:
    get AI insights based on weekly or monthly transactions:
        /?interval=weekly
        /?interval=monthly
    """

    serializer_class = InsightExpenseSerializer

    def get(self, request, *args, **kwargs):
        user = request.user
        interval = request.query_params.get("interval", None)

        expenses = Expense.objects.filter(user=user)

        if interval == "weekly":
            start_of_week = timezone.now().date() - timedelta(
                days=timezone.now().weekday()
            )
            expenses = expenses.filter(created__date__gte=start_of_week)
        elif interval == "monthly":
            start_of_month = timezone.now().replace(day=1)
            expenses = expenses.filter(created__date__gte=start_of_month)
        else:
            return Response(
                {"error": "Invalid interval or missing date parameters."}, status=400
            )

        serializer = self.get_serializer(expenses, many=True)
        # pass json data to model
        resp = get_insight(serializer.data, interval)

        return Response({"content": resp})


class AskInsightView(GenericAPIView):
    """
    post:
    get AI insights based on monthly transactions and 'user_context' input:

    """

    serializer_class = InsightExpenseSerializer

    def post(self, request):
        user = request.user
        interval = "monthly"
        user_ask = request.data["user_context"]
        expenses = Expense.objects.filter(user=user)

        if interval == "monthly":
            start_of_month = timezone.now().replace(day=1)
            expenses = expenses.filter(created__date__gte=start_of_month)

        serializer = self.get_serializer(expenses, many=True)
        # pass json data to model
        resp = get_ask_insight(user_ask, serializer.data, interval)

        return Response({"content": resp})


class ListRecurringView(ListAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user, is_recurring=True)
