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
- Check out [pyenv](https://realpython.com/intro-to-pyenv/) to install multiple python version
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
- Create a `.env` file from `.env.example` under `/app` and set appropriate environment variables before running the project
- Please check the DB connection and credentials by adding it in `.env` created in above step


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
### Inserting data
Make sure the app is running before performing following
- Register a user by visitng the link `http://localhost:8000/api/users/register/` in the browser
- After you have created the user, we need to generate the Token (to call authenticated APIs) via link `http://localhost:8000/api/users/token/`
### Calling APIs
- via Postman
  - Please import the postman collection to be able to run all APIs, can be located at root under `backend` `Form Fueled.postman_collection.json`