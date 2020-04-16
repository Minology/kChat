# kChat :speech_balloon:

A webchat application

## Table of contents

* [Installation](#installation)
* [Usage](#usage)
  * [Logging in the admin site](#logging-in-the-admin-site)
  * [Chatting](#chatting)

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

### Chatting
- Go to http://127.0.0.1:8080
