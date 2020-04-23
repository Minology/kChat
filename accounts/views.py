from rest_auth.views import UserDetailsView as RestUserDetailsView
from accounts.serializers import UserDetailsSerializer

class UserDetailsView(RestUserDetailsView):
    serializer_class = UserDetailsSerializer
