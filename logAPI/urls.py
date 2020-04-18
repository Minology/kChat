from django.conf.urls import url
from rest_auth.views import LoginView,LogoutView
from rest_auth.registration.views import VerifyEmailView, RegisterView
from allauth.account import views

urlpatterns = [
    url(r'^login/$', LoginView.as_view(), name='login'),
    url(r'^logout/$', LogoutView.as_view(), name='logout'),
    url('^auth/registration/$', RegisterView.as_view(), name='register'),
    url(r'^auth/verify-email/$', VerifyEmailView.as_view(), name='account_email_verification_sent'),
    url(r'^auth/confirm-email/(?P<key>[-:\w]+)/$', views.confirm_email, name="account_confirm_email"),
]
