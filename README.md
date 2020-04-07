# kChat
A webchat application

To install packages, run:

``` 
pip install -r requirements.txt
```

To run the backend, install Docker first, then run the following:

```
docker run -p 6379:6379 -d redis:5
python manage.py runserver
```

To demo, create a superuser, 

```
python manage.py createsuperuser
```

then log in the admin site: http://127.0.0.1:8000/admin
then go to a chat: http://127.0.0.1:8000/chat/example/
