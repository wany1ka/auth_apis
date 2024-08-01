from django.urls import path
from accounts.views import *
from django.urls import re_path
from django.views.generic import TemplateView

urlpatterns = [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
    path('api/users/', UserListCreateView.as_view(), name='employee-list-create'),
    path('api/user-info/', UserInfoView.as_view(), name='user-info'),
    path('token/', ObtainTokenPairWithRoleView.as_view(), name='token_obtain_pair'),
    path('admin-only/', AdminOnlyView.as_view(), name='admin-only'),
    path('api/admin-users/', AdminUserListView.as_view(), name='admin-users'),
    path('manager-only/', ManagerOnlyView.as_view(), name='manager-only'),
    path('employee/', EmployeeOnlyView.as_view(), name='employee-view'),
    path('api/login/', ObtainTokenPairWithRoleView.as_view(), name='token_obtain_pair'),
    path('api/reset-password/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('reset/<uidb64>/<token>/', password_reset_confirm, name='password_reset_confirm'),
    path('api/inventory/<int:pk>/', InventoryItemRetrieveUpdateDestroyView.as_view(), name='inventory-detail'),
    path('api/inventory/bulk/', BulkUpdateDeleteView.as_view(), name='inventory-bulk'),
    path('api/inventory/bulk/delete/', InventoryBulkDeleteView.as_view(), name='inventory-bulk-delete'),
    path('api/inventory/', InventoryListCreateView.as_view(), name='inventory-list-create'),
    path('api/sales/', SalesList.as_view(), name='sales-list'),
    path('reports/stock-levels/', StockLevelsReport.as_view(), name='stock-levels-report'),
    path('api/sales-trends/', SalesTrendsAPIView.as_view(), name='sales-trends'),
    path('reports/low-stock-alerts/', LowStockAlerts.as_view(), name='low-stock-alerts'),
    path('api/export-inventory/', export_inventory_csv, name='export_inventory_csv'),
    path('api/contact/', ContactMessageCreate.as_view(), name='contact'),
]
