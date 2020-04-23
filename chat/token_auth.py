from channels.auth import AuthMiddlewareStack
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser


class TokenAuthMiddleware:
    """
    Token authorization middleware for Django Channels 2
    """

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        headers = dict(scope["headers"])
        if b"X-Auth-Token" in headers[b"cookie"]:
            try:
                cookies = headers[b"cookie"].decode()
                token_key = re.search(b"X-Auth-Token=(.*)(; )?", cookies).group(1)
                if token_key:
                    token = Token.objects.get(key=token_key)
                    scope["user"] = token.user
                    close_old_connections()
            except Token.DoesNotExist:
                scope["user"] = AnonymousUser()

        return self.inner(scope)

TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))