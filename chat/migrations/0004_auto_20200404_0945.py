# Generated by Django 2.2 on 2020-04-04 02:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_auto_20200404_0929'),
    ]

    operations = [
        migrations.RenameField(
            model_name='attachment',
            old_name='message_id',
            new_name='message',
        ),
        migrations.RenameField(
            model_name='conversation',
            old_name='creator_id',
            new_name='creator',
        ),
        migrations.RenameField(
            model_name='message',
            old_name='conversation_id',
            new_name='conversation',
        ),
        migrations.RenameField(
            model_name='message',
            old_name='sender_id',
            new_name='sender',
        ),
        migrations.RenameField(
            model_name='participant',
            old_name='conversation_id',
            new_name='conversation',
        ),
        migrations.RenameField(
            model_name='participant',
            old_name='user_id',
            new_name='user',
        ),
    ]
