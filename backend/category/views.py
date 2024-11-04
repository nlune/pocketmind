from rest_framework import generics
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated

from .models import Category
from .serializers import CategorySerializer


class ListCreateCategoryView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RetrieveUpdateDestroyCategoryView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]

    def get_object(self):
        budget_id = self.kwargs.get("category_id")
        try:
            return Category.objects.get(id=budget_id)
        except Category.DoesNotExist:
            raise NotFound("Category not found.")

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)
