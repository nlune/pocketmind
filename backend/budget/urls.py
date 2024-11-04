from django.urls import path

from budget.views import ListCreateBudgetView, RetrieveUpdateDestroyBudgetView

urlpatterns = [
    path("", ListCreateBudgetView.as_view(), name="budget-list-create"),
    path(
        "<int:budget_id>/",
        RetrieveUpdateDestroyBudgetView.as_view(),
        name="budget-retrieve-update-destroy",
    ),
]
