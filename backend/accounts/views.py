from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import LoginSerializer, UserSerializer
from .models import User

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)

class MeView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class CustomTokenRefreshView(TokenRefreshView):
    pass
