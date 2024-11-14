import logging

from rest_framework import generics
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from django.db.models import Sum, Q

from color.models import Color
from .models import Category
from .serializers import CategorySerializer, TotalExpCategorySerializer


class ListCreateCategoryView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def perform_create(self, serializer):
        category = serializer.save(user=self.request.user)
        total_colors = Color.objects.count()
        if total_colors > 0:
            entry_number = (
                (category.id - 1) % total_colors
            )  # modolo to start from start if not enough colors available
            try:
                color = Color.objects.get(entry_number=entry_number)
                category.color = color
                category.save()
            except Color.DoesNotExist:
                logging.error(
                    f"No color found for entry_number {entry_number}. Category ID: {category.id}"
                )
        else:
            logging.error("No available colors to assign to category.")


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


class CategoryTotalView(GenericAPIView):
    serializer_class = TotalExpCategorySerializer

    def get(self, request):
        categories = Category.objects.annotate(
            total=Sum("expenses__amount", filter=Q(expenses__is_recurring=False))
        ).distinct()
        grand_total = categories.aggregate(grand_total=Sum("total"))["grand_total"] or 0

        serializer = self.get_serializer(categories, many=True)

        return Response({"total": grand_total, "categories": serializer.data})
