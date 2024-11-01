from django.urls import path

from user import views
from .views import UserProfileView, UserSearchView, UserDetailView

urlpatterns = [
    # Registration
    path('registration/', views.RegisterUserView.as_view(), name='user-registration'),
    path('registration/validate/', views.ValidateRegisteredUserView.as_view(), name='validate-registration'),

    # Authentication

    path('password-reset/', views.PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset/validate/', views.PasswordResetValidationView.as_view(), name='password-reset-validate'),

    # User Profile
    # GET: Get the user profile, PATCH: Update the user profile
    path('me/', UserProfileView.as_view(), name='user-profile'),

    # GET: Search for a user
    path('', UserSearchView.as_view(), name='user-search'),

    # GET: Get a specific user profile
    path('<int:user_id>/', UserDetailView.as_view(), name='user-detail'),

]
