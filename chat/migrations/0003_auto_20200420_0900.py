# Generated by Django 2.2 on 2020-04-20 02:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_auto_20200420_0842'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='quote',
            field=models.TextField(default='', max_length=50),
        ),
    ]