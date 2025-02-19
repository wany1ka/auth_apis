# Generated by Django 4.2.13 on 2024-07-04 17:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_rename_total_amount_sales_sale_price_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='sales',
            old_name='name',
            new_name='inventory_item',
        ),
        migrations.AlterField(
            model_name='sales',
            name='quantity_sold',
            field=models.PositiveIntegerField(),
        ),
    ]
