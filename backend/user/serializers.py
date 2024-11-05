import random

from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from project import settings

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class UserListSerializer(serializers.ModelSerializer):
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email"]

    def get_reviews_count(self, obj):
        return obj.reviews.count()


class RegisterUserSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        # Custom email validation logic here
        return value


class ValidateRegisteredUserSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6)


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        get_object_or_404(User, email=value)
        return value


class PasswordResetValidationSerializer(serializers.Serializer):
    password_reset_code = serializers.CharField(max_length=6)
    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        password_reset_code = data.get("password_reset_code")
        email = data.get("email")
        user = get_object_or_404(User, email=email)

        if password_reset_code != user.password_reset_code:
            raise serializers.ValidationError({"code": "Invalid validation code."})

        data["user"] = user
        return data


class PasswordResetRequestView(CreateAPIView):
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]

            user = get_object_or_404(User, email=email)

            # Generate a 6-digit password reset code
            user.password_reset_code = "".join(random.choices("0123456789", k=6))
            user.save()

            # Send email with the 6-digit validation code
            send_mail(
                "Password Reset Validation Code",
                f"Please use the following code to reset your password: {user.password_reset_code}",
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

            return Response(
                {"detail": "Password reset validation code sent."},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetValidationView(CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PasswordResetValidationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            new_password = serializer.validated_data["new_password"]

            user.set_password(new_password)
            user.password_reset_code = None  # Clear the reset code after use
            user.save()

            return Response(
                {"detail": "Password has been reset successfully."},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
