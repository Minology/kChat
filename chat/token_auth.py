from channels.auth import AuthMiddlewareStack
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
# from channels.db import database_sync_to_async

def get_user(token_key):
    try:
        token = Token.objects.get(key=token_key)
        close_old_connections()
        return token.user
    except Token.DoesNotExist:
        return AnonymousUser()

class TokenAuthMiddlewareInstance:
    """
    Token authorization middleware for Django Channels 2
    """

    def __init__(self, scope, middleware):
        self.middleware = middleware
        self.scope = dict(scope)
        self.inner = self.middleware.inner

    def __call__(self, receive, send):
        query = dict((x.split('=') for x in self.scope['query_string'].decode().split("&")))
        if 'token' in query:
            token_key = query['token']
            self.scope['user'] = get_user(token_key)
        inner = self.inner(self.scope)
        return inner(receive, send)

class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return TokenAuthMiddlewareInstance(scope, self)

TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))