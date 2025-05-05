from django.db import models
from application.models import Department, Item

class Asset(models.Model):
    asset_id = models.AutoField(primary_key=True)
    item_name_id = models.ForeignKey(Item, on_delete=models.CASCADE) # this should be a dropdown box
    department_id = models.ForeignKey(Department, on_delete=models.CASCADE) # this should be a drop down box
    
    date_generated = models.DateField(null=True, blank=True) # this column should be auto generated when the item was first inputted
    amount_purchased = models.DecimalField(max_digits=19, decimal_places=2)
    qr_code_data = models.CharField(max_length=300)