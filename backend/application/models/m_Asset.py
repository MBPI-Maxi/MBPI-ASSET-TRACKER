from django.db import models
from application.models import Department, Item

class Asset(models.Model):
    asset_id = models.AutoField(primary_key=True)
    item_name_pii = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="rel_items") # this should be a dropdown box
    department_pii = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="rel_items") # this should be a drop down box
    
    amount_purchased = models.DecimalField(max_digits=19, decimal_places=2, null=True, blank=True)
    purchased_date = models.DateField(null=True, blank=True)
    qr_code_date_generated = models.DateField(null=True, blank=True)
    qr_code_data = models.CharField(max_length=300, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)