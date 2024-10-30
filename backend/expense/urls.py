from django.urls import path

from expense.views import ListExpenses

urlpatterns = [
    path('', ListExpenses.as_view(), name='expense-list'),

]
