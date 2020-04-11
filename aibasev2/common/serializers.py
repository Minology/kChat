from django.contrib.auth import get_user_model
from rest_auth.registration.serializers import RegisterSerializer as RestRegisterSerializer
from rest_auth.serializers import LoginSerializer as RestLoginSerializer, \
    UserDetailsSerializer as RestUserDetailsSerializer
from rest_framework import serializers

from common.models import Category, Role


class RegisterSerializer(RestRegisterSerializer):
    username = None
    first_name = serializers.CharField(max_length=255, required=True)
    last_name = serializers.CharField(max_length=255, required=True)

    def get_cleaned_data(self):
        return {
            'email': self.validated_data.get('email', ''),
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'password1': self.validated_data.get('password1', ''),
        }


class LoginSerializer(RestLoginSerializer):
    username = None


UserModel = get_user_model()


class UserDetailsSerializer(RestUserDetailsSerializer):
    class Meta:
        model = UserModel
        fields = ('id', 'email', 'first_name', 'last_name', 'role')
        read_only_fields = ('email',)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'created_at', 'modified_at', 'name')
