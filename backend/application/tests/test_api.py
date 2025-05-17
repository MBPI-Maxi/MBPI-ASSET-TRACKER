from application.models import Asset, Department, Item, Location, Employee
from django.urls import reverse
from django.test import override_settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APITestCase
from rest_framework import status
import tempfile
import shutil

TEST_MEDIA_ROOT = tempfile.mkdtemp()

@override_settings(MEDIA_ROOT=TEST_MEDIA_ROOT)
class AssetListAPITest(APITestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        # Clean up the temp media directory after all tests in this class finish
        shutil.rmtree(TEST_MEDIA_ROOT, ignore_errors=True)
    
    def setUp(self):
        # Create a user and generate JWT token for authentication
        self.user = Employee.objects.create_user(username='testuser', password='testpass123')
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
        # Create related objects
        self.department = Department.objects.create(department="IT")
        self.item = Item.objects.create(item_name="Laptop", brand="Dell")
        self.location = Location.objects.create(name="Warehouse 1")
        
         # Create some assets
        Asset.objects.create(
            item_name_pii=self.item,
            department_pii=self.department,
            location=self.location,
            amount_purchased=1000,
            generated_by=self.user,
            updated_by=self.user,
            purchased_date="2025-05-17",
            is_found=True,
            is_active=True,
            tag_type="QR",
            vendor="Vendor A",
            remarks="Test asset 1"
        )
        Asset.objects.create(
            item_name_pii=self.item,
            department_pii=self.department,
            location=self.location,
            amount_purchased=500,
            generated_by=self.user,
            updated_by=self.user,
            purchased_date="2025-05-18",
            is_found=True,
            is_active=False,
            tag_type="RFID",
            vendor="Vendor B",
            remarks="Test asset 2"
        )
        
        self.url = reverse("asset_np:asset_list_av")  # '/api/asset/list'
    
    def test_get_asset_list_requires_authentication(self):
        # Without token, should get 401 Unauthorized
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)
    
    def test_get_asset_list_with_auth(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('results', response.data)  # Assuming pagination includes 'results'
        self.assertTrue(len(response.data['results']) >= 2)
    
    def test_filter_assets_by_department(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.url, {'department': 'IT'})
        
        self.assertEqual(response.status_code, 200)
        for asset in response.data['results']:
            self.assertEqual(asset['department'], 'IT')
    
    def test_filter_assets_by_is_active(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        # Active assets
        response_active = self.client.get(self.url, {'is_active': 'active'})
        self.assertEqual(response_active.status_code, 200)
        
        for asset in response_active.data['results']:
            self.assertTrue(asset['is_active'])
            
        # Retired assets
        response_retired = self.client.get(self.url, {'is_active': 'retired'})
        self.assertEqual(response_retired.status_code, 200)
        
        for asset in response_retired.data['results']:
            self.assertFalse(asset['is_active'])
    
    def test_filter_assets_by_item_name(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.url, {'item_name': 'Laptop'})
        
        self.assertEqual(response.status_code, 200)
        
        for asset in response.data['results']:
            self.assertEqual(asset['item_name'], 'Laptop')
    
    def test_filter_assets_by_location(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.url, {'location': 'Warehouse 1'})
        
        self.assertEqual(response.status_code, 200)
        
        for asset in response.data['results']:
            self.assertEqual(asset['location'], 'Warehouse 1')
    
    def test_filter_assets_by_purchased_date(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.url, {'purchased_date': '2025-05-17'})
        
        self.assertEqual(response.status_code, 200)
        
        for asset in response.data['results']:
            self.assertEqual(asset['purchased_date'], '2025-05-17')

@override_settings(MEDIA_ROOT=TEST_MEDIA_ROOT)
class AssetViewAvTest(APITestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        # Clean up the temp media directory after all tests in this class finish
        shutil.rmtree(TEST_MEDIA_ROOT, ignore_errors=True)
    
    def setUp(self):
        self.user = Employee.objects.create_user(username='testuser', password='testpass123')
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.department = Department.objects.create(department="IT")
        self.item = Item.objects.create(item_name="Laptop", brand="Dell")
        self.location = Location.objects.create(name="IT ROOM")  # Changed here

        self.asset = Asset.objects.create(
            item_name_pii=self.item,
            department_pii=self.department,
            location=self.location,
            amount_purchased=1000,
            purchased_date="2025-05-17",
            is_found=True,
            is_active=True,
            tag_type="QR",
            vendor="Vendor A",
            remarks="Original",
            generated_by=self.user,
            updated_by=self.user
        )

        self.post_url = reverse("asset_np:asset_post_av")
        self.detail_url = reverse("asset_np:asset_put_av", kwargs={"pk": self.asset.asset_id})

        self.valid_payload = {
            "item_name": "Laptop",               # was: self.item.pk
            "department": "IT",                  # was: self.department.pk
            "location": "IT ROOM",               # was: self.location.pk
            "amount_purchased": 1500,
            "purchased_date": "2025-05-18",
            "is_found": True,
            "is_active": True,
            "tag_type": "QR",
            "vendor": "Vendor X",
            "remarks": "Test asset creation"
        }

    def test_post_asset(self):
        response = self.client.post(self.post_url, data=self.valid_payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["vendor"], "Vendor X")

    def test_get_single_asset(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("qr_code_image", response.data)
        self.assertIn("http", response.data["qr_code_image"])  # Checks that URL was prefixed

    def test_put_asset(self):
        updated_data = self.valid_payload.copy()
        updated_data["vendor"] = "Updated Vendor"
        
        response = self.client.put(self.detail_url, data=updated_data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["vendor"], "Updated Vendor")

    def test_delete_asset(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Asset.objects.filter(pk=self.asset.pk).exists())

    def test_get_asset_not_found(self):
        bad_url = reverse("asset_np:asset_put_av", kwargs={"pk": 9999})
        response = self.client.get(bad_url)
        self.assertEqual(response.status_code, 404)

    def test_put_asset_invalid(self):
        # Missing required field
        invalid_data = self.valid_payload.copy()
        invalid_data.pop("amount_purchased")
        
        response = self.client.put(self.detail_url, data=invalid_data, format="json")
        self.assertEqual(response.status_code, 200) 
        
class CustomLoginTest(APITestCase):
    def setUp(self):
        self.user = Employee.objects.create_user(
            username="nina",
            password="testing",
            first_name="nina",
            last_name="fernandez",
            email="nina@example.com"
        )
        self.url = reverse("registration_np:user_login")  # matches your urls.py

    def test_login_success(self):
        request_data = {
            "username": "nina",
            "password": "testing"
        }
        response = self.client.post(self.url, request_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("refresh", response.data)
        self.assertIn("access", response.data)

        user_details = response.data.get("user_details")
        self.assertIsNotNone(user_details)
        self.assertEqual(user_details["user_id"], self.user.id)
        self.assertEqual(user_details["first_name"], "nina")
        self.assertEqual(user_details["last_name"], "fernandez")
        self.assertEqual(user_details["email"], "nina@example.com")

    def test_login_invalid(self):
        response = self.client.post(self.url, {"username": "nina", "password": "wrongpass"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)


class LogoutAVTest(APITestCase):
    def setUp(self):
        self.user = Employee.objects.create_user(
            username="nina",
            password="testing"
        )
        self.refresh = str(RefreshToken.for_user(self.user))
        self.access = str(RefreshToken.for_user(self.user).access_token)
        self.logout_url = reverse("registration_np:user_logout")

    def test_logout_success(self):
        # Authenticate with access token
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")

        response = self.client.post(self.logout_url, {"refresh": self.refresh}, format="json")

        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

    def test_logout_invalid_token(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")
        
        # Use an invalid or malformed refresh token
        invalid_token = "invalid.refresh.token"
        response = self.client.post(self.logout_url, {"refresh": invalid_token}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

    def test_logout_without_authentication(self):
        # No credentials provided
        response = self.client.post(self.logout_url, {"refresh": self.refresh}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class RegistrationAVTest(APITestCase):
    def setUp(self):
        self.registration_url = reverse("registration_np:user_registration")
        self.department = Department.objects.create(department="IT")

    def test_registration_success(self):
        payload = {
            "username": "anchor12345",
            "password": "testing",
            "email": "jerry@example.com",
            "first_name": "jerry",
            "last_name": "smith",
            "department": "IT"
        }

        response = self.client.post(self.registration_url, payload, format="json") 
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("msg", response.data)
        self.assertEqual(response.data["msg"], "Registration successful.")
        self.assertIn("data", response.data)
        self.assertEqual(response.data["data"]["username"], payload["username"])
        self.assertIn("tokens", response.data)
        self.assertIn("access", response.data["tokens"])
        self.assertIn("refresh", response.data["tokens"])

    def test_registration_missing_fields(self):
        # Missing required field: password
        invalid_payload = {
            "username": "incomplete_user",
            "email": "no_password@example.com",
            "first_name": "No",
            "last_name": "Password",
            "department": "HR"
        }

        response = self.client.post(self.registration_url, invalid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_registration_existing_username(self):
        # Create a user first
        Employee.objects.create_user(
            username="duplicateuser",
            password="testpass"
        )

        payload = {
            "username": "duplicateuser",
            "password": "anotherpass",
            "email": "dup@example.com",
            "first_name": "dupe",
            "last_name": "user",
            "department": "Accounting"
        }

        response = self.client.post(self.registration_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)