from rest_framework import serializers

from user.models import User


class UserSerializer(serializers.ModelSerializer):
    count_reviews = serializers.SerializerMethodField()
    count_comments = serializers.SerializerMethodField()

    def get_count_reviews(self, review):
        return review.fk_review_user.all().count()

    def get_count_comments(self, comment):
        return comment.fk_comment_user.all().count()

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name']


class UserRegistration(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'code', 'username', 'password', 'password_repeat']
