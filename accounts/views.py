from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth import get_user_model, authenticate

from django.contrib.auth.tokens import default_token_generator

from rest_framework import generics

from .models import *
from .serializers import *
from .permissions import IsAdminUser, IsManagerUser, IsEmployeeUser
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth.forms import SetPasswordForm

from django_filters.rest_framework import DjangoFilterBackend
from .filters import InventoryItemFilter
from django.core.mail import send_mail
from django.db.models import Count, Sum
from django.db.models.functions import TruncDay
from datetime import timedelta
import datetime

from django.utils import timezone

Employee = get_user_model()

class AdminOnlyView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(role='admin')
    serializer_class = CustomUserSerializer
    permission_classes = [IsAdminUser]

class ManagerOnlyView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(role='manager')
    serializer_class = CustomUserSerializer
    permission_classes = [IsManagerUser]

class EmployeeOnlyView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(role='employee')
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
        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "role": user.role
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

class InventoryBulkDeleteView(APIView):
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
    
class InventoryListCreateView(generics.ListCreateAPIView):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = InventoryItemFilter
    ordering_fields = ['name', 'price', 'quantity']
    ordering = ['name']  # Default

    def get_queryset(self):
        queryset = super().get_queryset()
        ordering = self.request.query_params.get('ordering', None)
        if ordering in self.ordering_fields:
            queryset = queryset.order_by(ordering)
        return queryset
    
class InventoryItemList(APIView):
    def get(self, request, format=None):
        inventory_items = InventoryItem.objects.all()
        serializer = InventoryItemSerializer(inventory_items, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            item = InventoryItem.objects.get(pk=pk)
        except InventoryItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = InventoryItemSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            # Update last_modified_by and last_modified_at
            serializer.save(
                last_modified_by=request.user,
                last_modified_at=datetime.now()
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            item = InventoryItem.objects.get(pk=pk)
        except InventoryItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class SalesList(APIView):
    def get(self, request, format=None):
        sales_data = Sales.objects.all()
        serializer = SalesSerializer(sales_data, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = SalesSerializer(data=request.data)
        if serializer.is_valid():
            sale = serializer.save()
            # Update inventory quantity
            item = sale.item
            item.quantity -= sale.quantity
            item.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StockLevelsReport(APIView):
    def get(self, request, format=None):
        inventory_items = InventoryItem.objects.all()
        serializer = InventoryItemSerializer(inventory_items, many=True)
        return Response(serializer.data)

class SalesTrendsAPIView(APIView):
    def get(self, request, *args, **kwargs):
        one_week_ago = timezone.now() - timedelta(days=7)
        sales_data = Sales.objects.filter(date__gte=one_week_ago).values('date').annotate(
            total_sales=Sum('quantity'),
            total_revenue=Sum('price')
        ).order_by('date')

        return Response(sales_data, status=status.HTTP_200_OK)
    
class SalesListCreate(generics.ListCreateAPIView):
    queryset = Sales.objects.all()
    serializer_class = SalesSerializer

class LowStockAlerts(APIView):
    def get(self, request, format=None):
        low_stock_items = InventoryItem.objects.filter(quantity__lt=10)  # Assuming low stock threshold is 10
        serializer = InventoryItemSerializer(low_stock_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        low_stock_items = InventoryItem.objects.filter(quantity__lt=10)
        if low_stock_items:
            # Prepare email content
            message_content = '\n'.join([f'{item.name}: {item.quantity} in stock' for item in low_stock_items])
            
            # Send email
            send_mail(
                'Low Stock Alert',
                f'The following items are low in stock:\n\n{message_content}',
                'markmaina425@gmail.com',  # Replace with your email
                ['markmaina425@gmail.com'],  # Replace with the recipient's email
                fail_silently=False,
            )
            return Response({'message': 'Email sent successfully'}, status=status.HTTP_200_OK)
        return Response({'message': 'No low stock items to report'}, status=status.HTTP_204_NO_CONTENT)
class ContactMessageCreate(APIView):
    def get(self, request, *args, **kwargs):
        messages = ContactMessage.objects.all()
        serializer = ContactMessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            # Optionally send email after saving to database
            name = serializer.validated_data['name']
            email = serializer.validated_data['email']
            phone = serializer.validated_data['phone']
            message = serializer.validated_data['message']

            # Send email
            send_mail(
                'Contact Form Submission',
                f'Name: {name}\nEmail: {email}\nMessage: {message}',
                'markmaina425@gmail.com', #your email
                ['markmaina425@gmail.com'], #recipient email
                fail_silently=False,
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
            'phone': user.phone,
            'role': user.role
        })
    
class AdminUserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = CustomUser.objects.all()
        serializer = UserDetailSerializer(users, many=True)
        return Response(serializer.data)
