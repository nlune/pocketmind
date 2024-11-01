import random

from user.models import RegistrationProfile
from user.serializers import UserProfileSerializer, UserListSerializer, RegisterUserSerializer, ValidateRegisteredUserSerializer
from user.serializers import PasswordResetRequestSerializer, PasswordResetValidationSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.db.models import Q
from project import settings
from rest_framework import status
from rest_framework.generics import CreateAPIView, get_object_or_404, GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

User = get_user_model()


class UserProfileView(APIView):

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            send_mail(
                'Profile Update Notification',
                'Your profile has been successfully updated.',
                settings.DEFAULT_FROM_EMAIL,
                [request.user.email],  # Send to the user's email
                fail_silently=False,
            )

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.exclude(is_superuser=True)
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data)


class UserSearchView(APIView):
    def get(self, request):
        search_string = request.query_params.get('search', '')
        users = User.objects.filter(
            Q(username__icontains=search_string) | Q(email__icontains=search_string)
        )
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data)


class UserDetailView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = UserProfileSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


User = get_user_model()


class RegisterUserView(CreateAPIView):
    # View for User Registration
    serializer_class = RegisterUserSerializer

    def perform_create(self, serializer):
        # Custom logic for creating a user if necessary
        serializer.save()

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterUserSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            # username = request.data.get('username', email)  # Use provided username, or default to email if not provided

            try:
                # Create user with the provided username or default to email
                user, created = User.objects.get_or_create(email=email)

                # Get or create the registration profile associated with the user
                registration_profile, reg_created = RegistrationProfile.objects.get_or_create(user=user)

                if not reg_created or not registration_profile.is_validated:
                    registration_profile.code = ''.join(
                        [str(random.randint(0, 9)) for _ in range(6)])
                    registration_profile.save()

                    # Send the validation email
                    send_mail(
                        'Validate Your Email',
                        f'Here is your code to validate your email address: {registration_profile.code}',
                        settings.DEFAULT_FROM_EMAIL,
                        [email],
                        fail_silently=False,
                    )

                return Response({'detail': 'Validation code sent.'}, status=status.HTTP_200_OK)

            # Handle any exceptions that may arise during object creation
            except Exception as e:
                return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Return validation errors from the serializer
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ValidateRegisteredUserView(GenericAPIView):
    serializer_class = ValidateRegisteredUserSerializer

    def perform_create(self, serializer):
        # Custom logic for creating a user if necessary
        serializer.save()

    permission_classes = [AllowAny]

    def patch(self, request, *args, **kwargs):
        serializer = ValidateRegisteredUserSerializer(data=request.data)

        if serializer.is_valid():
            # Fetch the registration profile based on the provided code
            registration_profile = get_object_or_404(RegistrationProfile, code=serializer.validated_data['code'])

            user_provided_code = serializer.validated_data['code']
            code = registration_profile.code

            if code != user_provided_code:
                return Response({'detail': 'Validation code does not match.'}, status=status.HTTP_400_BAD_REQUEST)

            # Get or create the user associated with the registration profile
            user, created = User.objects.get_or_create(email=registration_profile.user.email)

            if 'password' in request.data:
                request.data['password'] = make_password(request.data['password'])

            user_serializer = UserProfileSerializer(user, data=request.data, partial=True)

            if user_serializer.is_valid():
                user_serializer.save()  # Save the updated user
            else:
                return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            if not registration_profile.is_validated:
                # Mark the registration as validated
                registration_profile.is_validated = True
                registration_profile.save()

                # Fetch the user_id of the user who owns the code
                user_id = registration_profile.user.id

                return Response({'detail': 'Email successfully validated!', 'user_id': user_id},
                                status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Email is already validated!'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# AUTHENTICATION
class PasswordResetRequestView(CreateAPIView):
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']

            user = get_object_or_404(User, email=email)

            user.password_reset_code = ''.join(
                [str(random.randint(0, 9)) for _ in range(6)])  # Generates a 6-digit code

            user.save()

            # Send email with validation code
            send_mail(
                'Password Reset Validation Code',
                f'Please use the following code to reset your password: {user.password_reset_code}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

            return Response({'detail': 'Password reset validation code sent.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetValidationView(CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PasswordResetValidationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            new_password = serializer.validated_data['new_password']

            user.set_password(new_password)
            user.password_reset_code = None
            user.save()

            return Response({'detail': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
