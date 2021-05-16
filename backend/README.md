# Getting Started

### Prerequisites

- Python 3.9.5 or higher
- Up and running PostgreSQL 12.3+ client

### Project setup
- `form-fueled/backend` is the root directory of the project
- `app` is the Django project root folder

### Creating virtual environment

- Install `pipenv` a global python project `pip install pipenv`
- Create a `virtual environment` for this project
```shell
# all python packages are installed at the root directory i.e. under `backend`
$ cd form-fueled/backend
# creating / activating the pipenv environment
$ pipenv shell
# install all dependencies (include -d for installing dev dependencies)
$ pipenv install -d
```
### Configuration

- Create postgesql db / schema in postgresql to start with via command `create database form_fueled;`
- Please check the DB connection and credentials in `app/app/settings.py` `DATABASES` dict


### Running app
```shell
# move to the app directory (django project)
$ cd backend
# activating the pipenv environment
$ pipenv shell
# move to app dir
$ cd app
# run migration via below command so the db schema is created
$ python manage.py migrate
# run the Django serve (localhost:8000)
$ python manage.py runserver
```
### Running Tests
```shell
# move to the app directory (django project)
$ cd backend
# activating the pipenv environment
$ pipenv shell
# move to app dir
$ cd app
# run migration via below command so the db schema is created
$ python manage.py test
```