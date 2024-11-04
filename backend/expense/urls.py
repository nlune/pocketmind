from django.urls import path

from expense.views import GetExpenseFromInput, ListAddExpenses, AddExpense

urlpatterns = [
    path("", ListAddExpenses.as_view(), name="expense-list"),
    path("add-by-user/", AddExpense.as_view(), name="expense-add"),
    path("get-via-input/", GetExpenseFromInput.as_view())
]
