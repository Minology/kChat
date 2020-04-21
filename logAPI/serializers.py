from rest_auth.registration.serializers import RegisterSerializer as RestRegisterSerializer
from rest_auth.serializers import LoginSerializer as RestLoginSerializer
from rest_framework import serializers


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

