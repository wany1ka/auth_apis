from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth import get_user_model

from .models import CustomUser, InventoryItem
from .serializers import CustomUserSerializer, LoginSerializer, PasswordResetSerializer, InventoryItemSerializer
from django.contrib.auth.tokens import default_token_generator

from rest_framework import generics
from .models import CustomUser
from .serializers import CustomUserSerializer
from .permissions import IsAdminUser, IsManagerUser, IsEmployeeUser
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth.forms import SetPasswordForm

Employee = get_user_model()

class AdminOnlyView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAdminUser]

class StaffOnlyView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsManagerUser]
class EmployeeOnlyView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsEmployeeUser]


class UserListCreateView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [AllowAny]
        return super().get_permissions()

class ObtainTokenPairWithRoleView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        employee = serializer.validated_data["employee"]
        refresh = RefreshToken.for_user(employee)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "role": employee.role
        })
        

class PasswordResetRequestView(APIView):
    serializer_class = PasswordResetSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': 'Password reset email has been sent.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    

def password_reset_confirm(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        employee = Employee.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, Employee.DoesNotExist):
        employee = None

    if employee is not None and default_token_generator.check_token(employee, token):
        if request.method == 'POST':
            form = SetPasswordForm(employee, request.POST)
            if form.is_valid():
                form.save()
                messages.success(request, 'Your password has been reset successfully. You can now log in with your new password.')
                return redirect('login')  # Redirect to login page after successful password reset
        else:
            form = SetPasswordForm(employee)

        return render(request, 'password_reset_confirm.html', {'form': form})
    else:
        messages.error(request, 'The password reset link is invalid or has expired.')
        return redirect('password_reset')  # Redirect to password reset request page
    
class InventoryItemListCreateView(generics.ListCreateAPIView):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer

class InventoryItemRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer

class BulkUpdateDeleteView(APIView):
    def put(self, request, *args, **kwargs):
        items_data = request.data
        response_data = []

        for item_data in items_data:
            item_id = item_data.get('id')
            if not item_id:
                continue

            try:
                item = InventoryItem.objects.get(id=item_id)
            except InventoryItem.DoesNotExist:
                return Response({"error": f"Item with id {item_id} does not exist"}, status=status.HTTP_404_NOT_FOUND)

            serializer = InventoryItemSerializer(item, data=item_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                response_data.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(response_data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        ids = request.data.get('ids', [])
        if not ids:
            return Response({"error": "No IDs provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure all IDs exist before deletion
        existing_ids = InventoryItem.objects.filter(id__in=ids).values_list('id', flat=True)
        non_existing_ids = set(ids) - set(existing_ids)

        if non_existing_ids:
            return Response({"error": f"Items with IDs {list(non_existing_ids)} do not exist"}, status=status.HTTP_404_NOT_FOUND)

        InventoryItem.objects.filter(id__in=ids).delete()
        return Response({"status": "deleted"}, status=status.HTTP_204_NO_CONTENT)