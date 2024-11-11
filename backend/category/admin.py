import logging

from django.contrib import admin

from .models import Category, Color


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'color', 'user')
    search_fields = ('name',)
    list_filter = ('color', 'user')
    readonly_fields = ('color',)

    def save_model(self, request, obj, form, change):
        obj.save()

        if not obj.color:
            total_colors = Color.objects.count()

            if total_colors > 0:
                entry_number = (obj.id - 1) % total_colors
                try:
                    color = Color.objects.get(entry_number=entry_number)
                    obj.color = color
                    obj.save()
                except Color.DoesNotExist:
                    logging.error(f'No color found for entry_number {entry_number}. Category ID: {obj.id}')
            else:
                logging.error('No available colors to assign to category.')

        super().save_model(request, obj, form, change)


admin.site.register(Category, CategoryAdmin)
