from datetime import datetime, timezone

from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.request import HttpRequest
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import BasicAuthentication
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User

from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer

class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')

        if username and User.objects.filter(username=username).exists():
            return Response(
                {"username": ["A user with this username already exists."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        if email and User.objects.filter(email=email).exists():
            return Response(
                {"email": ["A user with this email already exists."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "username": user.username,
            "email": user.email,
        })


class ValidateTokenView(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [AllowAny]

    def get(self, request: HttpRequest):
        authorization_header = request.headers.get("Authorization")

        if not authorization_header:
            return Response({ "non_field_errors": ["Authorization Header is required."] }, status=status.HTTP_400_BAD_REQUEST)

        parts = authorization_header.split('Bearer ')
        token = parts[1] if len(parts) > 1 else None

        if not token:
            return Response({ "non_field_errors": ["Token is required."] }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode the token
            access_token = AccessToken(token) # type: ignore
            user_id = access_token['user_id']
            
            # Extract expiration date
            expiration_timestamp = access_token["exp"]
            expiration_date = datetime.fromtimestamp(int(expiration_timestamp), tz=timezone.utc)

            # Check if the token is expired
            if datetime.now(timezone.utc) > expiration_date:
                return Response({ "valid": False, "expiration": str(expiration_date), "user_id": user_id }, status=status.HTTP_400_BAD_REQUEST)

            return Response({ "valid": True, "expiration": str(expiration_date), "user_id": user_id }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({ "non_field_errors": [str(e)] }, status=status.HTTP_401_UNAUTHORIZED)
        

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({ "message": "Successfully logged out." }, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({ "non_field_errors": [str(e)] }, status=status.HTTP_400_BAD_REQUEST)
    

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

