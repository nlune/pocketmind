from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework import serializers

from registration.models import RegistrationProfile, code_generator

User = get_user_model()


def email_does_not_exist(email):
    try:
        User.objects.get(email=email)
        raise ValidationError(message='This email is taken')
    except User.DoesNotExist:
        return email


def email_does_exist(email):
    try:
        User.objects.get(email=email)
        return email
    except User.DoesNotExist:
        raise ValidationError(message='User does not exist!')


def username_does_not_exist(username):
    try:
        User.objects.get(username=username)
        raise ValidationError(message='This username is taken')
    except User.DoesNotExist:
        return username


def code_is_valid(code):
    try:
        reg_profile = RegistrationProfile.objects.get(code=code)
        if not reg_profile.code_used:
            return code
        else:
            raise ValidationError(message='This code has already been used!')
    except RegistrationProfile.DoesNotExist:
        raise ValidationError(message='This code is not valid!')


class RegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField(validators=[email_does_not_exist])


class RegistrationValidationSerializer(serializers.Serializer):
    email = serializers.EmailField(validators=[email_does_not_exist])
    username = serializers.CharField(validators=[username_does_not_exist])
    code = serializers.CharField(validators=[code_is_valid])
    location = serializers.CharField(label="loc", default="")
    password = serializers.CharField(write_only=True)
    password_repeat = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        code = attrs.get('code')
        reg_profile = RegistrationProfile.objects.get(email=email)
        if not (reg_profile.code == code):
            raise serializers.ValidationError("email and code do not match")
        if attrs.get('password') != attrs.get('password_repeat'):
            raise ValidationError(message='Passwords do not match!')
        return attrs

    def save(self, validated_data):
        data = validated_data.copy()
        del data['password_repeat']
        del data['code']
        user = User.objects.create_user(**data)
        reg_profile = RegistrationProfile.objects.get(email=user.email)
        reg_profile.code_used = True
        reg_profile.user = user
        reg_profile.save()
        return user


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(validators=[email_does_exist])

    def save(self):
        reg_profile = RegistrationProfile.objects.get(email=self.validated_data['email'])
        reg_profile.code = code_generator()
        reg_profile.code_used = False
        reg_profile.save()
        return reg_profile


class PasswordResetValidationSerializer(serializers.Serializer):
    email = serializers.EmailField(validators=[email_does_exist])
    code = serializers.CharField(validators=[code_is_valid])
    password = serializers.CharField(write_only=True)
    password_repeat = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        code = attrs.get('code')
        reg_profile = RegistrationProfile.objects.get(email=email)
        if code != reg_profile.code:
            raise ValidationError(message='Wrong code given')
        if attrs.get('password') != attrs.get('password_repeat'):
            raise ValidationError(message='Passwords do not match!')
        return attrs

    def save(self, validated_data):
        code = validated_data.get('code')
        reg_profile = RegistrationProfile.objects.get(code=code)
        user = reg_profile.user
        user.set_password(validated_data.get('password'))
        reg_profile.code_used = True
        reg_profile.save()
        user.save()
        return user
