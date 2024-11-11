from django.urls import path

from color.views import ListCreateColorView, RetrieveUpdateDestroyColorView

urlpatterns = [
    path("", ListCreateColorView.as_view(), name="color-list-create"),
    path('<int:entry_number>/', RetrieveUpdateDestroyColorView.as_view(), name='color-detail'),
]
