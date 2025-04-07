from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, CurrentUserView


class NAMES:
    REGISTER = "register"
    LOGIN = "token_obtain_pair"
    REFRESH = "token_refresh"
    CURRENT_USER = "current_user"

urlpatterns = [
    path('register/', RegisterView.as_view(), name=NAMES.REGISTER),
    path('login/', TokenObtainPairView.as_view(), name=NAMES.LOGIN),
    path('token/refresh/', TokenRefreshView.as_view(), name=NAMES.REFRESH),
    path('current-user/', CurrentUserView.as_view(), name=NAMES.CURRENT_USER),
]
