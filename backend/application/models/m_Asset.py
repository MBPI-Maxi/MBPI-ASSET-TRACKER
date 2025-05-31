from application.models.m_Department import Department
from application.models.m_Item import Item
from application.models.m_Location import Location
from django.db import models
from django.core.files import File
from django.core.files.storage import default_storage
from io import BytesIO
import json
import qrcode
import qrcode.constants

class Asset(models.Model):
    """
    Instance Methods:
        - `generate_qr_code_image` - this generates a QRcode upon submitting the asset form.
    """
    
    asset_id = models.AutoField(
        primary_key=True
    )
    item_name_pii = models.ForeignKey(
        Item, 
        on_delete=models.CASCADE, 
        related_name="rel_items"
    ) 
    department_pii = models.ForeignKey(
        Department, 
        on_delete=models.CASCADE, 
        related_name="rel_items"
    )
    amount_purchased = models.DecimalField(
        max_digits=19, 
        decimal_places=2, 
        null=True, 
        blank=True
    )
    purchased_date = models.DateField(
        null=True, 
        blank=True
    )
    qr_code_image = models.ImageField(
        upload_to="qr_codes/", 
        null=True, 
        blank=True
    ) 
    location = models.ForeignKey(
        Location, 
        on_delete=models.SET_NULL, 
        null=True,
        blank=False, 
        related_name="rel_location"
    )
    is_found = models.BooleanField(
        default=True, 
        null=True, 
        blank=True,
        help_text="Indicates whether the asset is found or missing."
    ) 
    is_active = models.BooleanField(
        default=False, 
        null=True, 
        blank=True,
        help_text="Indicates whether the asset is active or retired."
    )
    tag_type = models.CharField(
        max_length=10, 
        choices=[("QR", "QR Code") ,("RFID", "RFID Tag")], 
        default="QR"
    ) # tuple('savable value in db', 'the output of the response')
    vendor = models.CharField(
        max_length=100, 
        null=True, 
        blank=True
    )
    
    rs_number = models.CharField(
        null=True,
        blank=True,
        help_text="Reference SNP ID, e.g., rs123456",
    )
    
    # delay the the string reference of the user
    generated_by = models.ForeignKey(
        "application.Employee", 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="rel_generated_by"
    )
    updated_by = models.ForeignKey(
        "application.Employee", 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="rel_updated_by"
    )
    remarks = models.CharField(
        max_length=255, 
        null=True, 
        blank=True
    )
    warranty_expiry = models.DateField(
        null=True, 
        blank=True
    )
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
            "purchased_date": str(self.purchased_date),  # convert date to string,
            "location": self.location.name,
            "created_at": str(self.created_at),
            "generated_by": {
                "first_name": self.generated_by.first_name,
                "last_name": self.generated_by.last_name
            },
            "updated_by": {
                "first_name": self.updated_by.first_name,
                "last_name": self.updated_by.last_name
            },
        }
        
        json_data = json.dumps(data)
        
        qr = qrcode.QRCode(
            version=1,  # Controls the overall size; higher = bigger
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=4,  # Controls how many pixels each box is
            border=4,  # Thickness of white border (in boxes)
        )
        qr.add_data(json_data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format="PNG")

        filename = f"AST_{self.asset_id}.png"
        self.qr_code_image.save(filename, File(buffer), save=False)