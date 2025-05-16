from django.db import models
from application.models.m_Asset import Asset
from application.models.m_Employee import Employee

class AssetMaintenance(models.Model):
    class Meta:
        db_table = "application_asset_maintenance"
    
    maintenance_id = models.AutoField(primary_key=True)
    
    asset = models.ForeignKey(
        Asset, 
        on_delete=models.CASCADE, 
        related_name="rel_maintenance_record",
        help_text="Select the asset that this maintenance record belongs to."
    )
    service_date = models.DateField(
        null=True, 
        blank=True,
        help_text="Date when the maintenance service was performed."
    )
    performed_by = models.ForeignKey(
        Employee, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        help_text="Employee who performed the maintenance service (optional)."
    )
    service_type = models.CharField(
        max_length=100, 
        null=False, 
        blank=False,
        help_text="Type of maintenance service, e.g., Inspection, Repair, Upgrade."
    )
    cost = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Cost of the maintenance service in your currency."
    )
    remarks = models.CharField(
        max_length=255, 
        null=True, 
        blank=True,
        help_text="Additional notes or remarks about the maintenance."
    )
    status = models.BooleanField(
        default=False,
        null=True,
        blank=True,
        help_text="Indicates if the maintenance was successful (True) or not (False)."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when this maintenance record was created."
    )

    def __str__(self):
        return f"{self.asset.asset_id} - {self.service_date} - {self.service_type}"
