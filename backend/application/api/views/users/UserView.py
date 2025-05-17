from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from application.api.serializers import EmployeeListSerializer, EmployeeSerializer
from application.models import Employee
from application.api.pagination import BasePageNumberPagination

class UserListAV(APIView):
    permission_classes = [IsAdminUser]
    pagination_classes = BasePageNumberPagination
    
    def get(self, request):
        users = Employee.objects.all()
        serializer = EmployeeListSerializer(users, many=True)
        
        return self.paginated_response(request, serializer.data)

    def paginated_response(self, request, response):
        paginator = self.pagination_classes()
        paginated_data = paginator.paginate_queryset(response, request, view=self)
        
        return paginator.get_paginated_response(paginated_data)

class UserAv(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        username = request.query_params.get("username")
        
        try:
            user = Employee.objects.get(username=username)
            serializer = EmployeeSerializer(user, data=request.data, context={ "request": request })
            serializer.is_valid(raise_exception=True)
        except Employee.DoesNotExist:
            return Response({ "msg": f"Username does not exists." }, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.data, status=status.HTTP_200_OK)
        
    def put(self, request):
        user = Employee.objects.get(username=request.user.username)
        
        serializer = EmployeeSerializer(
            user, 
            data=request.data,
            partial=True, # in a serializer means that not all fields are required when updating an object — you're allowing a partial update.
            context={ "request": request }
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request):
        user_password = request.data.get("password")
        
        if not user_password:
            return Response({ "msg": "Password is required." }, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user 
        
        if not user.check_password(user_password):
            return Response({"msg": "Invalid password."}, status=status.HTTP_403_FORBIDDEN)

        user.delete()
        return Response({"msg": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)   
