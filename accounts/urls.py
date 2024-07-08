from django.urls import path, include
from accounts.views import *

urlpatterns = [
    path('api/users/', UserListCreateView.as_view(), name='employee-list-create'),
    path('token/', ObtainTokenPairWithRoleView.as_view(), name='token_obtain_pair'),
    path('admin-only/', AdminOnlyView.as_view(), name='admin-only'),
    path('manager-only/', StaffOnlyView.as_view(), name='manager-only'),
    path('api/login/', ObtainTokenPairWithRoleView.as_view(), name='token_obtain_pair'),
    path('api/reset-password/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('reset/<uidb64>/<token>/', password_reset_confirm, name='password_reset_confirm'),
    path('api/inventory/<int:pk>/', InventoryItemRetrieveUpdateDestroyView.as_view(), name='inventory-detail'),
    path('api/inventory/bulk/', BulkUpdateDeleteView.as_view(), name='inventory-bulk'),
    path('api/inventory/bulk/delete/', InventoryBulkDeleteView.as_view(), name='inventory-bulk-delete'),
    path('api/inventory/', InventoryListCreateView.as_view(), name='inventory-list-create'),
    path('api/sales/', SalesList.as_view(), name='sales-list'),
    path('reports/stock-levels/', StockLevelsReport.as_view(), name='stock-levels-report'),
    path('api/sales-trends-report/', SalesTrendsReport.as_view(), name='sales-trends-report'),
    path('reports/low-stock-alerts/', LowStockAlerts.as_view(), name='low-stock-alerts'),
    path('api/contact/', ContactMessageCreate.as_view(), name='contact-message-create'),
]
