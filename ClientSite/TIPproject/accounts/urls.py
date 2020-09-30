from django.conf.urls import url
from django.urls import path, include
from .api import RegisterAPI, LoginAPI, UserAPI
from knox import views as knox_views

from .models import Rooms, UsersRooms
from .serializers import RoomsSerializer, UserRoomsSerializer
from .views import RoomsViewSet, UserRoomsViewSet, RoomsViewDel, UserRoomsViewSetAll, UserRoomsViewSetAllUsers

urlpatterns = [
    url('api/auth', include('knox.urls')),
    url('api/auth/register', RegisterAPI.as_view()),
    url('api/auth/login', LoginAPI.as_view()),
    url('api/auth/user', UserAPI.as_view()),
    url('api/auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
    url('api/rooms-del', RoomsViewDel.as_view(queryset=Rooms.objects.all(), serializer_class=RoomsSerializer),
        name="rooms-del"),
    url('api/rooms', RoomsViewSet.as_view(queryset=Rooms.objects.all(), serializer_class=RoomsSerializer), name="rooms-list"),
    url('api/users-rooms', UserRoomsViewSetAllUsers.as_view(queryset=UsersRooms.objects.all(), serializer_class=UserRoomsSerializer), name="users-rooms"),
    # url('api/users',
    #     UserRoomsViewSet.as_view(queryset=UsersRooms.objects.all(), serializer_class=UserRoomsSerializer),
    #     name="users-room"),

]