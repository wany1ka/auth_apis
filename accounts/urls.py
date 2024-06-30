from django.urls import path, include
import accounts
from accounts.views import *



urlpatterns = [
    path('api/users/', UserListCreateView.as_view(), name='employee-list-create'),
    path('token/', ObtainTokenPairWithRoleView.as_view(), name='token_obtain_pair'),
    path('admin-only/', AdminOnlyView.as_view(), name='admin-only'),
    path('manager-only/', StaffOnlyView.as_view(), name='manager-only'),
    path('api/login/', ObtainTokenPairWithRoleView.as_view(), name='token_obtain_pair'),
    path('api/reset-password/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('reset/<uidb64>/<token>/', password_reset_confirm, name='password_reset_confirm'),

]
