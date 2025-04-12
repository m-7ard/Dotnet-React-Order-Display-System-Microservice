from datetime import datetime, timezone

from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User

from .serializers import RegisterSerializer


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
    def get(self, request):
        authorization_header = request.headers["Authorization"]

        if not authorization_header:
            return Response({"error": "Authorization Header is required."}, status=status.HTTP_400_BAD_REQUEST)

        token = authorization_header.split('Bearer ')[1]

        if not token:
            return Response({"error": "Token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode the token
            access_token = AccessToken(token)
            
            # Extract expiration date
            expiration_timestamp = access_token["exp"]
            expiration_date = datetime.fromtimestamp(int(expiration_timestamp), tz=timezone.utc)

            # Check if the token is expired
            if datetime.now(timezone.utc) > expiration_date:
                return Response({"valid": False, "expiration": str(expiration_date)}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"valid": True, "expiration": str(expiration_date)}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)