from django.core import serializers
from django.http import Http404, HttpResponse
from rest_framework import viewsets, generics, authentication, status
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Rooms, UsersRooms
from .serializers import RoomsSerializer, UserRoomsSerializer


class RoomsViewSet(generics.ListCreateAPIView):
    queryset = Rooms.objects.all()
    pagination_class = LimitOffsetPagination
    serializer_class = RoomsSerializer
    def get_queryset(self):
        queryset = Rooms.objects.all()
        return queryset


class RoomsViewDel(generics.RetrieveDestroyAPIView):
    serializer_class = RoomsSerializer

    def get(self, request):
        id = request.query_params.get('id')
        queryset = Rooms.objects.get(id=id)
        serializer = RoomsSerializer(queryset)
        return Response(serializer.data)

    def destroy(self, request):
        id = request.query_params.get('id')
        queryset = Rooms.objects.filter(id=id)
        self.perform_destroy(queryset)
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserRoomsViewSetAll(generics.ListCreateAPIView):
    pagination_class = LimitOffsetPagination
    serializer_class = UserRoomsSerializer
    def get_queryset(self):
        queryset = UsersRooms.objects.all()
        return queryset


class UserRoomsViewSetAllUsers(generics.ListCreateAPIView):
    pagination_class = LimitOffsetPagination
    serializer_class = UserRoomsSerializer
    def get_queryset(self):
        id = self.request.query_params.get('id')
        queryset = UsersRooms.objects.filter(user_id=id)
        return queryset

class UserRoomsViewSet(generics.DestroyAPIView):
    pagination_class = LimitOffsetPagination
    serializer_class = UserRoomsSerializer

    def destroy(self, request):
        id = request.query_params.get('id')
        queryset = UsersRooms.objects.filter(user_id=id)
        self.perform_destroy(queryset)
        return Response(status=status.HTTP_204_NO_CONTENT)