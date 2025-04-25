from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from .views import RegisterView, CurrentUserView, ValidateTokenView, LogoutView, CustomTokenObtainPairView


class NAMES:
    REGISTER = "register"
    LOGIN = "token_obtain_pair"
    REFRESH = "token_refresh"
    CURRENT_USER = "current_user"
    VALIDATE_TOKEN = "validate_token"
    LOGOUT = "logout"

urlpatterns = [
    path('register', RegisterView.as_view(), name=NAMES.REGISTER),
    path('login', CustomTokenObtainPairView.as_view(), name=NAMES.LOGIN),
    path('token/refresh', TokenRefreshView.as_view(), name=NAMES.REFRESH),
    path('current-user', CurrentUserView.as_view(), name=NAMES.CURRENT_USER),
    path('validate-token', ValidateTokenView.as_view(), name=NAMES.VALIDATE_TOKEN),
    path('logout', LogoutView.as_view(), name=NAMES.LOGOUT)
]
