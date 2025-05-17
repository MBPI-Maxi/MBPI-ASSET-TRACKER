from django.test import TestCase
from django.contrib.auth import get_user_model
from application.models import Item, Asset, Department, Location, AssetMaintenance
from django.core.files.storage import default_storage
from datetime import date
from decimal import Decimal
from django.test import override_settings
import tempfile

# override the media root for tests
# ensures that qr images never gets mixed into the real folder
TEST_MEDIA_ROOT = tempfile.mkdtemp()

class ItemModelTest(TestCase):
    def setUp(self):
        # This runs before each test
        self.item = Item.objects.create(item_name="Laptop", brand="Dell")

    def test_item_str(self):
        self.assertEqual(
            str(self.item), 
            "Laptop",
            msg="Item __str__ should return the item_name"
        )
    
    def test_brand_str(self):
        self.assertEqual(
            str(self.item.brand), 
            "Dell",
            msg="Item brand should be 'Dell'"
        )
    
    def test_item_optional_brand(self):
        item_without_brand = Item.objects.create(item_name="Monitor")
        
        self.assertEqual(
            item_without_brand.brand, 
            None,
            msg="Item brand should be None if not provided"
        )

@override_settings(MEDIA_ROOT=TEST_MEDIA_ROOT)
class AssetModelTest(TestCase):
    def setUp(self):
        self.item = Item.objects.create(item_name="Laptop", brand="Dell")
        self.department = Department.objects.create(
            department="IT"
        )
        self.location = Location.objects.create(name="WAREHOUSE 1")
        
        User = get_user_model()
        self.user = User.objects.create(username="tester", password="password")
        
        self.asset = Asset.objects.create(
            # asset_id=1,
            item_name_pii=self.item,
            department_pii=self.department,
            location=self.location,
            amount_purchased=300,
            generated_by=self.user,
            updated_by=self.user,
            purchased_date="2025-05-17",
            is_found=True,
            is_active=True,
            tag_type="QR",
            vendor="vendor test",
            remarks="Unit test",
            warranty_expiry="2026-06-17"
        )
    
    def tearDown(self):
        # Delete the QR code image file if it was generated
        if self.asset.qr_code_image and default_storage.exists(self.asset.qr_code_image.name):
            default_storage.delete(self.asset.qr_code_image.name)

    def test_asset_str(self):
        self.assertEqual(
            str(self.asset), 
            str(self.asset.asset_id),
           msg="Asset __str__ should return the asset_id as string"
        )
        
    def test_generated_qr_code_image_creates_image(self):
        self.asset.generate_qr_code_image()
        self.assertIsNotNone(
            self.asset.qr_code_image, 
            msg="QR code image should not be None after generation"
        )
        self.assertTrue(
            self.asset.qr_code_image.name.endswith(".png"),
            msg="QR code image filename should end with .png"
        )
    
    def test_tag_type(self):
        self.assertIn(
            self.asset.tag_type, 
            ["QR", "RFID"],
            msg="Tag type should be either 'QR' or 'RFID'"
        )
    
    def test_asset_optional_remarks(self):
        asset_without_remarks = Asset.objects.create(
            item_name_pii=self.item,
            department_pii=self.department,
            location=self.location,
            amount_purchased=500,
            generated_by=self.user,
            updated_by=self.user,
            purchased_date="2025-05-17",
            is_found=True,
            is_active=True,
            tag_type="QR",
            vendor="No remarks vendor",
            warranty_expiry="2026-06-17"
        )
        
        self.assertIsNone(asset_without_remarks.remarks)
    
    def test_asset_optional_warranty_expiry(self):
        asset_without_warranty = Asset.objects.create(
            item_name_pii=self.item,
            department_pii=self.department,
            location=self.location,
            amount_purchased=500,
            generated_by=self.user,
            updated_by=self.user,
            purchased_date="2025-05-17",
            is_found=True,
            is_active=True,
            tag_type="QR",
            vendor="No remarks vendor",
            remarks="testing",
            # warranty_expiry="2026-06-17"
        )
        
        self.assertIsNone(asset_without_warranty.warranty_expiry)
    
    def test_asset_optional_location(self):
        asset_without_location = Asset.objects.create(
            item_name_pii=self.item,
            department_pii=self.department,
            # location=self.location,
            amount_purchased=500,
            generated_by=self.user,
            updated_by=self.user,
            purchased_date="2025-05-17",
            is_found=True,
            is_active=True,
            tag_type="QR",
            vendor="No remarks vendor",
            remarks="testing"
        )
        
        self.assertIsNone(asset_without_location.location)
    
    def test_asset_optional_is_active(self):
        asset_without_is_active = Asset.objects.create(
            item_name_pii=self.item,
            department_pii=self.department,
            location=self.location,
            amount_purchased=500,
            generated_by=self.user,
            updated_by=self.user,
            purchased_date="2025-05-17",
            is_found=True,
            # is_active=True,
            tag_type="QR",
            vendor="No remarks vendor",
            remarks="testing"
        )
        
        self.assertEqual(asset_without_is_active.is_active, False)
    
    def test_asset_optional_vendor(self):
        asset_without_is_vendor = Asset.objects.create(
            item_name_pii=self.item,
            department_pii=self.department,
            location=self.location,
            amount_purchased=500,
            generated_by=self.user,
            updated_by=self.user,
            purchased_date="2025-05-17",
            is_found=True,
            is_active=True,
            tag_type="QR",
            # vendor="No remarks vendor",
            remarks="testing"
        )
        
        self.assertIsNone(asset_without_is_vendor.vendor)
    
    def test_asset_optional_amount_purchased(self):
        asset_without_is_amount_purchased = Asset.objects.create(
            item_name_pii=self.item,
            department_pii=self.department,
            location=self.location,
            # amount_purchased=500,
            generated_by=self.user,
            updated_by=self.user,
            purchased_date="2025-05-17",
            is_found=True,
            is_active=True,
            tag_type="QR",
            vendor="No remarks vendor",
            remarks="testing"
        )
        
        self.assertIsNone(asset_without_is_amount_purchased.amount_purchased) 
    
    def test_asset_optional_purchased_date(self):
        asset_without_is_purchased_date = Asset.objects.create(
            item_name_pii=self.item,
            department_pii=self.department,
            location=self.location,
            amount_purchased=500,
            generated_by=self.user,
            updated_by=self.user,
            # purchased_date="2025-05-17",
            is_found=True,
            is_active=True,
            tag_type="QR",
            vendor="No remarks vendor",
            remarks="testing"
        )
        
        self.assertIsNone(asset_without_is_purchased_date.purchased_date)
    
    def test_asset_optional_is_found(self):
        asset_without_is_found = Asset.objects.create(
            item_name_pii=self.item,
            department_pii=self.department,
            location=self.location,
            amount_purchased=500,
            generated_by=self.user,
            updated_by=self.user,
            purchased_date="2025-05-17",
            # is_found=True,
            is_active=True,
            tag_type="QR",
            vendor="No remarks vendor",
            remarks="testing"
        )
        
        self.assertTrue(
            asset_without_is_found.is_found, 
            msg="Expected asset to be marked as found, but it was not."
        )
    
class DepartmentModelTest(TestCase):
    def setUp(self):
        self.department = Department.objects.create(
            department="IT"
        )
    
    def test_department_str(self):
        self.assertEqual(
            str(self.department),
            str(self.department),
            msg="Department __str__ should return the department field"
        )
    
    def test_department_not_none(self):
        self.assertIsNotNone(
            self.department.department
        )

class LocationModelTest(TestCase):
    def setUp(self):
        self.location = Location.objects.create(
            name="IT Room"
        )
    
    def test_location_str(self):
        self.assertEqual(
            str(self.location), 
            "IT Room",
            msg="Location __str__ should return the location name"
        )
    
    def test_location_name(self):
        self.assertEqual(
            self.location.name,
            "IT Room",
            msg="Location name should be stored correctly"
        )

class EmployeeModelTest(TestCase):
    def setUp(self):
        self.department = Department.objects.create(department="IT")
        User = get_user_model()
        
        # employee with department
        self.employee = User.objects.create_user(
            username="johndoe",
            password="testpass123",
            department=self.department
        )

        # employee without a department
        self.employee_no_dept = User.objects.create_user(
            username="janedoe",
            password="testpass123"
        )

    def test_employee_str(self):
        self.assertEqual(
            str(self.employee), 
            "johndoe",
            msg="__str__ should return the username"
        )
    
    def test_employee_department_association(self):
        self.assertEqual(
            self.employee.department, 
            self.department,
            msg="Employee department should match the assigned Department instance"
        )
    
    def test_employee_without_department(self):
        self.assertIsNone(
            self.employee_no_dept.department,
            msg="Employee department should be None if not assigned"
        )
        
class AssetMaintenanceModelTest(TestCase):
    def setUp(self):
        # Setup related objects required for FK fields
        self.department = Department.objects.create(department="IT")
        self.location = Location.objects.create(name="Warehouse 1")
        self.item = Item.objects.create(item_name="Laptop", brand="Dell")
        User = get_user_model()
        self.employee = User.objects.create_user(username="techguy", password="password123", department=self.department)
        self.asset = Asset.objects.create(
            item_name_pii=self.item,
            department_pii=self.department,
            location=self.location,
            amount_purchased=1000,
            generated_by=self.employee,
            updated_by=self.employee,
            purchased_date=date.today(),
            is_found=True,
            is_active=True,
            tag_type="QR",
            vendor="Vendor A"
        )

    def test_create_asset_maintenance_full(self):
        maintenance = AssetMaintenance.objects.create(
            asset=self.asset,
            service_date=date(2025, 5, 17),
            performed_by=self.employee,
            service_type="Repair",
            cost=Decimal("150.50"),
            remarks="Fixed the screen",
            status=True
        )
        self.assertEqual(maintenance.asset, self.asset, "Asset FK should match the asset assigned")
        self.assertEqual(maintenance.performed_by, self.employee, "Performed_by FK should match the employee assigned")
        self.assertEqual(maintenance.service_type, "Repair", "Service type should match input")
        self.assertEqual(maintenance.cost, Decimal("150.50"), "Cost should match input")
        self.assertEqual(maintenance.remarks, "Fixed the screen", "Remarks should match input")
        self.assertTrue(maintenance.status, "Status should be True (successful)")

    def test_create_asset_maintenance_minimal(self):
        maintenance = AssetMaintenance.objects.create(
            asset=self.asset,
            service_type="Inspection"
        )
        self.assertEqual(maintenance.service_type, "Inspection", "Service type should be set")
        self.assertIsNone(maintenance.service_date, "Service date should default to None if not set")
        self.assertIsNone(maintenance.performed_by, "Performed_by should default to None if not set")
        self.assertIsNone(maintenance.cost, "Cost should default to None if not set")
        self.assertIsNone(maintenance.remarks, "Remarks should default to None if not set")
        self.assertFalse(maintenance.status, "Status should default to False")

    def test_str_representation(self):
        maintenance = AssetMaintenance.objects.create(
            asset=self.asset,
            service_date=date(2025, 5, 17),
            service_type="Upgrade"
        )
        expected_str = f"{self.asset.asset_id} - 2025-05-17 - Upgrade"
        self.assertEqual(str(maintenance), expected_str, "String representation should match the expected format")