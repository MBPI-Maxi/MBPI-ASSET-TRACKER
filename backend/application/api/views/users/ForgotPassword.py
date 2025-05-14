# from rest_framework.views import APIView
# from rest_framework.response import Response
# from django.contrib.auth.tokens import default_token_generator
# from django.utils.http import urlsafe_base64_encode
# from django.utils.encoding import force_bytes
# from django.core.mail import send_mail
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class ForgotPasswordAPIView(APIView):
#     def post(self, request):
#         email = request.data.get("email")
#         try:
#             user = User.objects.get(email=email)
#         except User.DoesNotExist:
#             return Response({"msg": "User not found."}, status=404)

#         token = default_token_generator.make_token(user)
#         uid = urlsafe_base64_encode(force_bytes(user.pk))
#         reset_link = f"http://your-frontend-domain/reset-password/{uid}/{token}/"

#         send_mail(
#             "Reset Your Password",
#             f"Click the link to reset your password: {reset_link}",
#             "noreply@yourapp.com",
#             [email],
#         )

#         return Response({"msg": "Password reset link sent."})


# from django.utils.http import urlsafe_base64_decode
# from django.utils.encoding import force_str

# class ResetPasswordAPIView(APIView):
#     def post(self, request, uidb64, token):
#         try:
#             uid = force_str(urlsafe_base64_decode(uidb64))
#             user = User.objects.get(pk=uid)
#         except (User.DoesNotExist, ValueError):
#             return Response({"msg": "Invalid link."}, status=400)

#         if not default_token_generator.check_token(user, token):
#             return Response({"msg": "Invalid or expired token."}, status=400)

#         new_password = request.data.get("password")
#         if not new_password:
#             return Response({"msg": "Password is required."}, status=400)

#         user.set_password(new_password)
#         user.save()
#         return Response({"msg": "Password has been reset."})
