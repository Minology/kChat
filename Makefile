.PHONY: all

build:
	docker-compose build

up:
	docker-compose up -d channel

dev:
	docker-compose run --rm --name kchat_web -p 8000:8000 web

<<<<<<< HEAD
=======
>>>>>>> dev
down:
	docker-compose down

bash:
	docker exec -it kchat_web bash

migrate:
	docker exec -it kchat_web python3 manage.py makemigrations
	docker exec -it kchat_web python3 manage.py migrate
    
test:
	docker exec -it utdvn_web bash scripts/test.sh
