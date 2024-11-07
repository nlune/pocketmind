from django.urls import path

from expense.views import GetExpenseFromInput, GetExpenseScannedInput, ListAddExpenses, AddExpense, \
    GetCategoryFromDescription, ReportsView

urlpatterns = [
    path("", ListAddExpenses.as_view(), name="expense-list"),
    path("add-by-user/", AddExpense.as_view(), name="expense-add"),
    path("get-via-input/", GetExpenseFromInput.as_view()),
    path("get-via-scan/", GetExpenseScannedInput.as_view()),
    path("get-category/", GetCategoryFromDescription.as_view()),
    path("reports/", ReportsView.as_view(), name="expense-report"),
]
