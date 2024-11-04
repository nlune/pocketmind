import logging

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import UserSettings
from .serializers import UserSettingsSerializer, UserSerializer

# Get the User model
User = get_user_model()

# Set up logger
logger = logging.getLogger(__name__)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_settings_view(request):
    user = request.user  # Request object is only available inside the view function

    # Log user object for debugging
    logger.debug(f"Authenticated user: {user}")

    # Ensure that user is never None
    if user is None:
        logger.error("User is None, cannot get or create UserSettings")
        return Response({"error": "User is not authenticated"}, status=status.HTTP_400_BAD_REQUEST)

    # Handle GET request: Return user settings
    if request.method == 'GET':
        try:
            # Attempt to get user settings, create default if none exist
            user_settings, created = UserSettings.objects.get_or_create(user=user)

            if created:
                logger.debug(f"Created new settings for user: {user.username}")

            # Serialize user and user settings
            user_serializer = UserSerializer(user)
            settings_serializer = UserSettingsSerializer(user_settings)

            # Return both serialized user data and user settings
            return Response({
                "user": user_serializer.data,
                "settings": settings_serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error fetching or creating user settings: {e}")
            return Response({"error": "Error fetching or creating user settings"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle PATCH request: Update user settings
    elif request.method == 'PATCH':
        user_data = request.data.get('user', {})  # User info like name, email
        settings_data = request.data.get('settings', {})  # Settings info like goals, pocket feature
        new_password = request.data.get('password', None)  # New password (if provided)

        # Log incoming data for debugging
        logger.debug(f"User data for update: {user_data}")
        logger.debug(f"Settings data for update: {settings_data}")

        # 1. Update User Information (Name, Email)
        user_serializer = UserSerializer(user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()

        # 2. Update Password (if provided)
        if new_password:
            user.password = make_password(new_password)
            user.save()

        # 3. Update User Settings (Goals, Pocket Feature)
        try:
            user_settings = UserSettings.objects.get(user=user)
        except UserSettings.DoesNotExist:
            logger.error(f"Settings not found for user during PATCH: {user}")
            return Response({"error": "Settings not found"}, status=status.HTTP_404_NOT_FOUND)

        settings_serializer = UserSettingsSerializer(user_settings, data=settings_data, partial=True)
        if settings_serializer.is_valid():
            settings_serializer.save()

        return Response({
            "user": user_serializer.data,
            "settings": settings_serializer.data,
            "message": "Settings updated successfully"
        }, status=status.HTTP_200_OK)
