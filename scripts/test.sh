#!/bin/bash

set -e

python manage.py test accounts chat --config=.coveragerc
coverage report -m