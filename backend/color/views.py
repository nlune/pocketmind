from django.db import models
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response

from .models import Color
from .serializers import ColorSerializer

class ListCreateColorView(ListCreateAPIView):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer

    def perform_create(self, serializer):
        max_entry_number = Color.objects.aggregate(models.Max('entry_number'))['entry_number__max']
        next_entry_number = 0 if max_entry_number is None else max_entry_number + 1

        serializer.save(entry_number=next_entry_number)


class RetrieveUpdateDestroyColorView(RetrieveUpdateDestroyAPIView):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
    lookup_field = 'entry_number'

    def perform_destroy(self, instance):
        entry_number_to_delete = instance.entry_number
        super().perform_destroy(instance)

        colors_to_update = Color.objects.filter(entry_number__gt=entry_number_to_delete).order_by('entry_number')
        for color in colors_to_update:
            color.entry_number -= 1
            color.save()

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)