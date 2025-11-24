from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView
from .views import LoginView, MeView, CustomTokenRefreshView

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("me/", MeView.as_view(), name="me"),
]
