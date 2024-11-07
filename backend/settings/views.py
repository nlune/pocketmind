import logging
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import UserSettings
from .serializers import UserSettingsSerializer

logger = logging.getLogger(__name__)


@api_view(['GET', 'PATCH'])
def user_settings_view(request):
    try:
        user = request.user

        # Ensure the user is authenticated
        if not user.is_authenticated:
            logger.error("Unauthorized access attempt by anonymous user.")
            return Response({"detail": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        # Try to get UserSettings, or create if it doesn't exist
        user_settings, created = UserSettings.objects.get_or_create(user=user)

        if request.method == 'GET':
            # Serialize user settings data
            user_serializer = UserSettingsSerializer(user_settings)
            return Response(user_serializer.data, status=status.HTTP_200_OK)

        if request.method == 'PATCH':
            # Handle updates to user settings
            user_serializer = UserSettingsSerializer(user_settings, data=request.data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
                return Response(user_serializer.data, status=status.HTTP_200_OK)
            else:
                logger.error(f"Validation error: {user_serializer.errors}")
                return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.exception(f"Error fetching or creating user settings: {str(e)}")
        return Response({"detail": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
