# Generated by Django 4.2.13 on 2024-07-05 06:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_rename_name_sales_inventory_item_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='sales',
            old_name='sale_date',
            new_name='date',
        ),
        migrations.RenameField(
            model_name='sales',
            old_name='inventory_item',
            new_name='item',
        ),
        migrations.RenameField(
            model_name='sales',
            old_name='sale_price',
            new_name='price',
        ),
        migrations.RenameField(
            model_name='sales',
            old_name='quantity_sold',
            new_name='quantity',
        ),
    ]
