from allauth.account import views
from allauth.socialaccount.providers.google.provider import GoogleProvider
from allauth.utils import import_attribute
from django.conf.urls import url
from django.urls import include
from rest_auth.registration.views import VerifyEmailView, RegisterView

from rest_auth.views import PasswordResetConfirmView, LoginView, LogoutView, PasswordResetView, PasswordChangeView

from api.views import CategoriesList

from common.views import UserDetailsView

urlpatterns = [
    # Register
    url(r'^auth/registration/$', RegisterView.as_view(), name='register'),
    url(r'^auth/verify-email/$', VerifyEmailView.as_view(), name='account_email_verification_sent'),
    url(r'^auth/confirm-email/(?P<key>[-:\w]+)/$', views.confirm_email, name="account_confirm_email"),

    # Login, logout, user details
    url(r'^auth/login/$', LoginView.as_view(), name='login'),
    url(r'^auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^auth/user/$', UserDetailsView.as_view(), name='user_details'),

    # Password reset, password change
    url(r'^auth/password/reset/$', PasswordResetView.as_view(), name='password_reset'),
    url(
        r'^auth/password/reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    url(r'^auth/password/change/$', PasswordChangeView.as_view(), name='password_change'),

    # OAuth (process= {login, connection})
    url(r'^oauth/google/login/$', import_attribute(GoogleProvider.get_package() + '.views.oauth2_login'),
        name='google_login'),
    url(r'^oauth/google/login/callback/$', import_attribute(GoogleProvider.get_package() + '.views.oauth2_callback'),
        name='google_callback'),

    url(r'^categories/$', CategoriesList.as_view(), name='categories'),
]
