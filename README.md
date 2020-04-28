# kChat :speech_balloon:

A webchat application

## Table of contents

* [Installation](#installation)
* [Usage](#usage)
  * [Logging in the admin site](#logging-in-the-admin-site)
  * [Accessing phpMyAdmin](#accessing-phpMyAdmin)
  * [Chatting](#chatting)
* [Testing](#testing)

## Installation

- Clone the project using git
```Shell
$ git clone https://github.com/Minology/kChat.git
```

- [Install Docker](https://docs.docker.com/install/)<br/>
- Run
```Shell
$ docker-compose up
```

- When all containers are ready you can get bash into your `web` container
```Shell
$ docker-compose exec web bash
```

- Create a superuser
```Shell
$ docker-compose exec web python manage.py createsuperuser
```

## Usage

### Logging in the admin site
- Go to http://127.0.0.1:8000/admin
- To view documentation, go to http://127.0.0.1:8000/admin/doc

### Accessing phpMyAdmin
- To access your MySQL user interface, go to http://127.0.0.1:8888

### Chatting
- Go to http://127.0.0.1:8080

## Testing
- To test the backend:
```Shell
$ docker-compose exec web bash scripts/test.sh
```

- To test the frontend:
```Shell
$ yarn jest --coverage
```