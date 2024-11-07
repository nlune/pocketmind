from django.urls import path

from .views import user_settings_view

urlpatterns = [
    path('user/settings/', user_settings_view, name='user-settings')
]
