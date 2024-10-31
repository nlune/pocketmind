from django.urls import path

from user.views import ListUsers, RetrieveUsersView, Me

urlpatterns = [
    path('', ListUsers.as_view()),
    path('<int:pk>/', RetrieveUsersView.as_view()),
    path('me/', Me.as_view())
]
