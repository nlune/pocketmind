from django.contrib import admin
from django.db.models import Max

from .models import Color


class ColorAdmin(admin.ModelAdmin):
    list_display = ('name', 'entry_number', 'hexcode')
    readonly_fields = ('entry_number',)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            max_entry_number = Color.objects.aggregate(Max('entry_number'))['entry_number__max']
            obj.entry_number = 0 if max_entry_number is None else max_entry_number + 1
        super().save_model(request, obj, form, change)

    def delete_model(self, request, obj):
        entry_number_to_delete = obj.entry_number
        super().delete_model(request, obj)

        colors_to_update = Color.objects.filter(entry_number__gt=entry_number_to_delete).order_by('entry_number')
        for color in colors_to_update:
            color.entry_number -= 1
            color.save()

    def delete_queryset(self, request, queryset):
        for color in queryset:
            entry_number_to_delete = color.entry_number
            super().delete_model(request, color)

            colors_to_update = Color.objects.filter(entry_number__gt=entry_number_to_delete).order_by('entry_number')
            for color in colors_to_update:
                color.entry_number -= 1
                color.save()


admin.site.register(Color, ColorAdmin)
