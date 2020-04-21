#!/bin/bash
# Waits until services have booted then migrate and boot Django server

python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000