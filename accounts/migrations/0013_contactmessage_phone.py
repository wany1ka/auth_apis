# Generated by Django 4.2.13 on 2024-07-16 14:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0012_delete_recentactivity'),
    ]

    operations = [
        migrations.AddField(
            model_name='contactmessage',
            name='phone',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]