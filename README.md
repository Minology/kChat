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

