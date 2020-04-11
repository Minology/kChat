from rest_auth.views import UserDetailsView as RestUserDetailsView

from common.serializers import UserDetailsSerializer


class UserDetailsView(RestUserDetailsView):
    serializer_class = UserDetailsSerializer
