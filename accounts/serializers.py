from rest_auth.registration.serializers import RegisterSerializer as RestRegisterSerializer
from rest_auth.serializers import LoginSerializer as RestLoginSerializer, \
    UserDetailsSerializer as RestUserDetailsSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

class RegisterSerializer(RestRegisterSerializer):
    username = serializers.CharField(max_length = 255, required = True)
    first_name = serializers.CharField(max_length=255, required=True)
    last_name = serializers.CharField(max_length=255, required=True)

    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
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
        fields = ('username', 'email', 'first_name', 'last_name', 'avatar', 'quote', 'place')
        read_only_fields = ('email',)


