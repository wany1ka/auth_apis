from django.contrib import admin
from .models import CustomUser, InventoryItem

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(InventoryItem)