from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from user.serializers import UserSerializer


class CreateUserView(generics.CreateAPIView):
    """Create a new user in the system
    """
    serializer_class = UserSerializer


class UserDetail(APIView):
    """Retrieves User details
    """
    http_method_names = ['get']
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        """Returns objects sorted by name
        """
        return self.request.user

    def get(self, request, format=None):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=HTTP_200_OK)
