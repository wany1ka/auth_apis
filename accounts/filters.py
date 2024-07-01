import django_filters
from .models import InventoryItem

class InventoryItemFilter(django_filters.FilterSet):
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    stock_min = django_filters.NumberFilter(field_name='quantity', lookup_expr='gte')
    stock_max = django_filters.NumberFilter(field_name='quantity', lookup_expr='lte')
    category = django_filters.CharFilter(field_name='category', lookup_expr='icontains')

    class Meta:
        model = InventoryItem
        fields = ['price_min', 'price_max', 'stock_min', 'stock_max', 'category']
