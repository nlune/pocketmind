from django.urls import path

from expense.views import ListExpenses, AddExpense

urlpatterns = [
    path('', ListExpenses.as_view(), name='expense-list'),
    path('add/', AddExpense.as_view(), name='expense-add'),
]
