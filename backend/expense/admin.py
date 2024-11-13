from django.contrib import admin

from .models import Expense


class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('description', 'amount', 'created', 'user', 'category', 'is_recurring', 'start_date', 'end_date')
    fields = ('description', 'amount', 'created', 'user', 'category', 'is_recurring', 'start_date', 'end_date')
    readonly_fields = ('created',)


admin.site.register(Expense, ExpenseAdmin)
