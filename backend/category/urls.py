from django.urls import path

from category.views import ListCreateCategoryView, RetrieveUpdateDestroyCategoryView

urlpatterns = [
    path("", ListCreateCategoryView.as_view(), name="category-list-create"),
    path('<int:category_id>/', RetrieveUpdateDestroyCategoryView.as_view(), name='category-detail'),
]
