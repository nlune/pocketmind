from rest_framework.generics import ListAPIView, RetrieveAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated

from user.models import User
from user.serializers import UserSerializer


# get the list of all users
class ListUsers(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    search_fields = ['username', 'first_name', 'last_name']
    filter_backends = (filters.SearchFilter,)


# get a specific user by the id given in the url
class RetrieveUsersView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field_kwarg = 'id'


# get, update and delete the logged in user
class Me(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    http_method_names = ['get', 'patch', 'delete']

    def get_object(self):
        return self.request.user
