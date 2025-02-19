# Generated by Django 4.2.13 on 2024-07-02 10:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_inventoryitem'),
    ]

    operations = [
        migrations.CreateModel(
            name='Sales',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity_sold', models.PositiveIntegerField()),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('sale_date', models.DateField()),
                ('name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.inventoryitem')),
            ],
        ),
    ]
