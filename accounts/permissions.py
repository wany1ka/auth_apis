from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.employee and request.employee.role in ['admin', 'superadmin']

class IsManagerUser(BasePermission):
    def has_permission(self, request, view):
        return request.employee and request.employee.role == 'manager'

class IsEmployeeUser(BasePermission):
    def has_permission(self, request, view):
        return request.employee and request.employee.role == 'employee'
