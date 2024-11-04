from django.contrib import admin
from .models import FinancialTip

@admin.register(FinancialTip)
class FinancialTipAdmin(admin.ModelAdmin):
    list_display = ['category', 'tip']
