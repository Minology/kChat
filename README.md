## 1. List of authentication APIs
* `admin`: Default admin interface
* `api/v1/registration`: Create user with default registration
* `api/v1/auth/login`: Login in with default login
* `api/v1/auth/logout`: Logout
* `api/v1/auth/user`: Get user details
* `api/v1/auth/password/reset`: Forgot password need to be reset
* `api/v1/auth/password/reset/confirm/{uid}/{token}`: Forgot password verification via email
* `api/v1/auth/password/change`: Change password:
* `api/v1/oauth/google/login/?process=login`: Login with Google OAuth
* `api/v1/oauth/google/login/?process=connection`: Connect default user with Google OAuth.
## 2. Configuration:
* Open `settings.py`, config email (email address, password) and MySQL database (user, password, host, port, database name).
* Run command `python manage.py migrate`.
* Create super user by running command `python manage.py createsuperuser`.
* Open `http://127.0.0.1:8000/admin`, login into admin page.
* Choose Social applications, create new Social application.
  * Provider: Google
  * Name: `google-oauth2`
  * Client id: `296933111686-5kcv2p39p9pfahckkcl6scaligbkqsp4.apps.googleusercontent.com`
  * Secret key: `IeJhC95uK23Q_jbByqFwIx9K`
  * Key: 
  * Sites: Double clicks to choose `example.com`.
* Save and start to test the above APIs.
