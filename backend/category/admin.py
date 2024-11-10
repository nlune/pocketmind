from django.contrib import admin
from .models import Category, Color
import logging

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'color', 'user')
    search_fields = ('name',)
    list_filter = ('color', 'user')
    readonly_fields = ('color',)

    def save_model(self, request, obj, form, change):
        # Zuerst speichern, damit das Objekt eine ID hat
        obj.save()

        # Wenn das color-Feld noch nicht zugewiesen ist, weise es zu
        if not obj.color:
            total_colors = Color.objects.count()

            if total_colors > 0:
                entry_number = (obj.id - 1) % total_colors  # Modulo, um aus der verfügbaren Anzahl von Farben auszuwählen
                try:
                    color = Color.objects.get(entry_number=entry_number)
                    obj.color = color  # Zuweisung der Farbe
                    obj.save()  # Speichere die Kategorie mit der zugewiesenen Farbe
                except Color.DoesNotExist:
                    logging.error(f'No color found for entry_number {entry_number}. Category ID: {obj.id}')
            else:
                logging.error('No available colors to assign to category.')

        super().save_model(request, obj, form, change)

# Registrierung des Models im Admin-Bereich
admin.site.register(Category, CategoryAdmin)