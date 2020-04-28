from django.conf.urls import url
from rest_auth.views import LoginView,LogoutView
from rest_auth.registration.views import VerifyEmailView, RegisterView
from django.views.generic.base import RedirectView
from accounts.views import UserDetailsView
from allauth.account import views

urlpatterns = [
    url(r'^login/$', LoginView.as_view(), name='login'),
    url(r'^logout/$', LogoutView.as_view(), name='logout'),
    url(r'^user/$', UserDetailsView.as_view(), name='user_details'),
    url('^registration/$', RegisterView.as_view(), name='register'),
    url(r'^verify-email/$', VerifyEmailView.as_view(), name='account_email_verification_sent'),
    #url(r'^confirm-email/(?P<key>[-:\w]+)/$', RedirectView.as_view(url='http://127.0.0.1:8000/accounts/login/', permanent=False) , name="account_confirm_email"),
    url(r"^confirm-email/(?P<key>[\s\d\w().+-_',:&]+)/$",views.confirm_email , name="account_confirm_email"),
]
