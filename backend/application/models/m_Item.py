from django.db import models

class Item(models.Model):
    item_id = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=150, null=False)
    brand = models.CharField(max_length=150, unique=False, null=True, blank=True)
    
    def __str__(self):
        return self.item_name
    