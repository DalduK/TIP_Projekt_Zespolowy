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
        print(id)
        queryset = Rooms.objects.filter(id=id)
        return Response(serializers.serialize('json', queryset))

    def destroy(self, request):
        id = request.query_params.get('id')
        queryset = Rooms.objects.filter(id=id)
        self.perform_destroy(queryset)
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserRoomsViewSet(viewsets.ModelViewSet,generics.ListAPIView):
    pagination_class = LimitOffsetPagination
    serializer_class = UserRoomsSerializer
    def get_queryset(self):
        queryset = UsersRooms.objects.all()
        return queryset