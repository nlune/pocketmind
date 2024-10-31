from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from registration.models import RegistrationProfile
from registration.serializers import RegistrationSerializer, RegistrationValidationSerializer, PasswordResetSerializer, \
    PasswordResetValidationSerializer


class RegistrationView(GenericAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        reg_profile, created = RegistrationProfile.objects.get_or_create(email=serializer.validated_data['email'])
        if created or not reg_profile.is_validated:
            reg_profile.save()
            code = reg_profile.code
            send_mail(
                "Pocketmind Validation",
                f"Use this code to verify your email: {code}",
                settings.DEFAULT_FROM_EMAIL,
                [request.data['email']],
                fail_silently=False,
            )
            return Response({"detail": "Code sent"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegistrationValidationView(GenericAPIView):
    serializer_class = RegistrationValidationSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(serializer.validated_data)
        return Response({"detail": "New user created"}, status=status.HTTP_201_CREATED)


class PasswordResetView(GenericAPIView):
    serializer_class = PasswordResetSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        reg_profile = serializer.save()
        send_mail(
            "PocketMind Password Reset code",
            f"Use this code to reset your password: {reg_profile.code}",
            settings.DEFAULT_FROM_EMAIL,
            [request.data['email']],
            fail_silently=False,
        )
        return Response({"detail": "Code sent"}, status=status.HTTP_200_OK)


class PasswordResetValidationView(GenericAPIView):
    serializer_class = PasswordResetValidationSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(serializer.validated_data)
        send_mail(
            "PocketMind password has been reset",
            f"Hi {user.first_name}, your password has been reset.",
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        return Response({"detail": "Password has been reset"}, status=status.HTTP_200_OK)
