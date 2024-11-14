from django.urls import path

from expense.views import (
    GetExpenseFromInput,
    ListAddExpenses,
    AddExpense,
    ReportsView,
    GetExpenseScannedInput,
    GetCategoryFromDescription,
    ListRecurringView,
    InsightsView,
    AskInsightView, UpdateExpenseCreatedDateView,
    DailyTotalMonthView
)

urlpatterns = [
    path("", ListAddExpenses.as_view(), name="expense-list"),
    path("add-by-user/", AddExpense.as_view(), name="expense-add"),
    path("get-via-input/", GetExpenseFromInput.as_view()),
    path("get-via-scan/", GetExpenseScannedInput.as_view()),
    path("get-category/", GetCategoryFromDescription.as_view()),
    path("get-insight/", InsightsView.as_view()),
    path("get-ask-insight/", AskInsightView.as_view()),
    path("reports/", ReportsView.as_view(), name="expense-report"),
    path("recurring/", ListRecurringView.as_view(), name="list-recurring-expenses"),
    path("daily-totals/", DailyTotalMonthView.as_view()),
    path("<int:pk>/update/", UpdateExpenseCreatedDateView.as_view(), name="expense-date-update"),
]
