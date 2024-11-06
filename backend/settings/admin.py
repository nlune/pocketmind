from django.contrib import admin
from .models import UserSettings

#admin.site.register(UserSettings)

@admin.register(UserSettings)
class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ('user',                     
                    'goals','pocket_enabled')   # Customize what you want to display