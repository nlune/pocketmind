"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

BASE_URL = "backend/api/"
schema_view = get_schema_view(
    openapi.Info(
        title="PocketMind Backend API",
        default_version="v1",
        description="By Constructor Team Munich",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="learn@propulsionacademy.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,  # Set to False restrict access to protected endpoints
    permission_classes=(permissions.AllowAny,),  # Permissions for docs access
)

urlpatterns = [
    path(BASE_URL + "admin/", admin.site.urls),
    path(BASE_URL + "docs/", schema_view.with_ui("swagger", cache_timeout=0)),
    path(BASE_URL + "transactions/", include("expense.urls")),
    path(BASE_URL + "budgets/", include("budget.urls")),
    path(BASE_URL + "user/", include("user.urls")),
    path(
        BASE_URL + "auth/token/",
        jwt_views.TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        BASE_URL + "auth/token/refresh/",
        jwt_views.TokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path(
        BASE_URL + "auth/token/verify/",
        jwt_views.TokenVerifyView.as_view(),
        name="token_verify",
    ),
    path(BASE_URL + "home/", include("dashboard.urls")),
    path(BASE_URL + "home/", include("aiinsights.urls")),
    path(BASE_URL + "home/", include("settings.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
