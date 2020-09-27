from django.conf.urls import url
from django.urls import path, include
from .api import RegisterAPI, LoginAPI, UserAPI
from knox import views as knox_views

from .models import Rooms
from .serializers import RoomsSerializer
from .views import RoomsViewSet, UserRoomsViewSet, RoomsViewDel

urlpatterns = [
    url('api/auth', include('knox.urls')),
    url('api/auth/register', RegisterAPI.as_view()),
    url('api/auth/login', LoginAPI.as_view()),
    url('api/auth/user', UserAPI.as_view()),
    url('api/auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
    url('api/rooms-del', RoomsViewDel.as_view(queryset=Rooms.objects.all(), serializer_class=RoomsSerializer),
        name="rooms-del"),
    url('api/rooms', RoomsViewSet.as_view(queryset=Rooms.objects.all(), serializer_class=RoomsSerializer), name="rooms-list"),

    # path('api/users', UserRoomsViewSet)
]