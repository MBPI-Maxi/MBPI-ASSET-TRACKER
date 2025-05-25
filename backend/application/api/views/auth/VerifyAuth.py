from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class VerifyAuthView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({ "is_authenticated": True })
