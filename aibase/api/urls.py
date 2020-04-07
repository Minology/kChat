from allauth.socialaccount.providers.google.provider import GoogleProvider
from allauth.utils import import_attribute
from django.conf.urls import include, url
from rest_auth import urls

from rest_auth.views import PasswordResetConfirmView

urlpatterns = [
    # Register, login, logout, user details
    url(r'^auth/registration/', include('rest_auth.registration.urls')),
    url(r'^auth/login/', urls.LoginView.as_view(), name='login'),
    url(r'^auth/logout/', urls.LogoutView.as_view(), name='logout'),
    url(r'^auth/user/', urls.UserDetailsView.as_view(), name='user_details'),

    # Password reset, password change
    url(r'^auth/password/reset/', urls.PasswordResetView.as_view(), name='password_reset'),
    url(
        r'^auth/password/reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    url(r'^auth/password/change/', urls.PasswordChangeView.as_view(), name='password_change'),

    # OAuth (process= {login, connection}
    url(r'oauth/google/login/', import_attribute(GoogleProvider.get_package() + '.views.oauth2_login'),
        name='google_login'),
]
