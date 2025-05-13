from django.db import models
from application.models.m_Department import Department
from application.models.m_Item import Item
from application.models.m_Location import Location
from django.core.files import File
from django.core.files.storage import default_storage
from io import BytesIO
import json
import qrcode

class Asset(models.Model):
    """
    Asset table model stores the information about the item 

    Class Attributes:
        - asset_id - primary key of the Asset Table
        - item_name_pii - the relationship column for the Item Table
        - department_pii - the relationship column for the Department Table
        - amount_purchased - the amount which the item was bought
        - purchased_date - the date which the item was bought
        - qr_code_image - an imagefield path to the qr image of each asset
        - location - the relationship column for the Location Table
        - generated_by - the current user that generates the value
        - is_found - the status of the asset if 'Found' or 'Missing'
        - is_active - the status of the asset if 'Active' or 'Retired'
        - created_at - timestamp of when the asset was inserted to the db
        - updated_at - timestamp of when the asset was updated to the db
    
    Dundar Methods:
        - __str__ - returns the asset_id value.
    
    Instance Methods:
        - generate_qr_code_image - this generates a QRcode upon submitting the asset form.
    """
    
    asset_id = models.AutoField(primary_key=True)
    item_name_pii = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="rel_items") 
    department_pii = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="rel_items")
    amount_purchased = models.DecimalField(max_digits=19, decimal_places=2, null=True, blank=True)
    purchased_date = models.DateField(null=True, blank=True)
    qr_code_image = models.ImageField(upload_to="qr_codes/", null=True, blank=True) 
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=False, related_name="rel_location")
    is_found = models.BooleanField(default=True, null=True, blank=True) 
    is_active = models.BooleanField(default=False, null=True, blank=True)
    tag_type = models.CharField(max_length=10, choices=[("QR", "QR Code") ,("RFID", "RFID Tag")], default="QR") # tuple('savable value in db', 'the output of the response')
    
    # delay the the string reference of the user
    generated_by = models.ForeignKey("application.Employee", on_delete=models.SET_NULL, null=True, blank=True, related_name="rel_generated_by")
    updated_by = models.ForeignKey("application.Employee", on_delete=models.SET_NULL, null=True, blank=True, related_name="rel_updated_by")
    
    remarks = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.asset_id}"
    
    def generate_qr_code_image(self):
        # Delete the old QR image file if it exists
        if self.qr_code_image and default_storage.exists(self.qr_code_image.name):
            default_storage.delete(self.qr_code_image.name)
        
        data = {
            "asset_id": self.asset_id,
            "department": self.department_pii.department,
            "item_name": self.item_name_pii.item_name,
            "amount_purchased": str(self.amount_purchased),  # convert Decimal to string
            "brand": self.item_name_pii.brand,
            "purchased_date": str(self.purchased_date),  # convert date to string
        }
        
        json_data = json.dumps(data)
        qr = qrcode.make(json_data)
        buffer = BytesIO()
        qr.save(buffer, format="PNG")

        filename = f"AST_{self.asset_id}.png"
        self.qr_code_image.save(filename, File(buffer), save=False)
