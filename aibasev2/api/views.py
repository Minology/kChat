from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from common.models import Category
from common.serializers import CategorySerializer


class CategoriesList(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
