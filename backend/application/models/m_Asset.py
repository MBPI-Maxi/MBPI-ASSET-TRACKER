from django.db import models
from application.models import Department, Item
from django.core.files import File
from io import BytesIO
import json
import qrcode

class Asset(models.Model):
    asset_id = models.AutoField(primary_key=True)
    item_name_pii = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="rel_items") # this should be a dropdown box
    department_pii = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="rel_items") # this should be a drop down box
    
    amount_purchased = models.DecimalField(max_digits=19, decimal_places=2, null=True, blank=True)
    purchased_date = models.DateField(null=True, blank=True)
    qr_code_date_generated = models.DateField(null=True, blank=True)
    
    # this will save on the qr_codes folder modify you settings.py as well to include media
    qr_code_image = models.ImageField(upload_to="qr_codes/", null=True, blank=True) 
    
    is_active = models.BooleanField(default=False, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.asset_id}"
    
    # this is being called on the serializer after the object instance has been created.  
    # this will create a qr code upon submitting to the 
    def generate_qr_code_image(self):
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
