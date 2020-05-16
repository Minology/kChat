from django.test import  TestCase
from django.urls import  reverse

class BaseTest(TestCase):
    def setUp(self):
        #Test_register
        self.register_url = reverse('register')
        self.register_user = {
                "username": "annguyenn",
                "email": "quocannnuetcs@gmail.com",
                "password1": "Quocan16@",
                "password2": "Quocan16@",
                "first_name": "An",
                "last_name": "Nguyen"
        }

        self.register_user_with_sort_password = {
            "username": "annguyen",
            "email": "quocanuetcs@gmail.com",
            "password1": "123456",
            "password2": "123456",
            "first_name": "An",
            "last_name": "Nguyen"
        }

        #Testlogin
        self.login_url = reverse('login')
        self.login_user = {
              "email": "quocanuetcs@gmail.com",
               "password": "Quocan16@"
        }

        self.login_user_with_wrong_information = {
            "email": "quocanuetcs@gmail.com",
            "password": "Q"
        }

        self.logout_url = reverse('logout')
        return super().setUp()

class RegisterTest(BaseTest):
    # def test_can_view_page_correctly(self):
    #     response = self.client.post.get(self.register_url)
    #     self.assertEqual(response.status_code, 200)

    def test_regrester_user_with_short_password(selfs):
        response = selfs.client.post(selfs.register_url, selfs.register_user_with_sort_password, format = 'application/json')
        selfs.assertEqual(response.status_code, 400)

    def test_regrester_user_success(selfs):
        response = selfs.client.post(selfs.register_url, selfs.register_user, format = 'application/json')
        selfs.assertEqual(response.status_code, 201)

class LoginTest(BaseTest):
    def test_login_user_success(selfs):
        response = selfs.client.post(selfs.login_url, selfs.login_user, format='application/json')
        selfs.assertEqual(response.status_code, 200)

    def test_login_user_fail(selfs):
        response = selfs.client.post(selfs.login_url, selfs.login_user_with_wrong_information, format='application/json')
        selfs.assertEqual(response.status_code, 400)


class LogoutTest(BaseTest):
    def test_logout_success(selfs):
        response = selfs.client.post(selfs.logout_url)
        selfs.assertEqual(response.status_code, 200)




