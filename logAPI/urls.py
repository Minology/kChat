from django.conf.urls import url
from rest_auth.views import LoginView,LogoutView
from rest_auth.registration.views import VerifyEmailView, RegisterView, ConfirmEmailView

urlpatterns = [
    url(r'^login/$', LoginView.as_view(), name='login'),
    url(r'^logout/$', LogoutView.as_view(), name='logout'),
    url('^registration/$', RegisterView.as_view(), name='register'),
    url(r'^verify-email/$', VerifyEmailView.as_view(), name='account_email_verification_sent'),
    url(r'^confirm-email/(?P<key>[-:\w]+)/$', LoginView.as_view(), name="account_confirm_email"),
]
