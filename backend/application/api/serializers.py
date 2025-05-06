from rest_framework import serializers
from application.models import Asset, Item, Department
from datetime import date
from dev.logger import log_message
import re

class AssetViewModelSerializer(serializers.ModelSerializer):
    # additional fields for the Asset table 
    department = serializers.CharField(write_only=True)
    item_name = serializers.CharField(write_only=True)
    brand = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = Asset
        fields = [
            "item_name",
            "brand",
            "department",
            "qr_code_date_generated", # optional (auto-generated if not provided)
            "amount_purchased",
            "qr_code_data",
            "purchased_date"
        ]
    
    def create(self, validated_data):
        # removes the department key on before inserting the data to the db
        department_obj = validated_data.pop("department") # validates the incoming requests on the method 'validate_department'
        
        item_name = validated_data.pop("item_name")
        brand = validated_data.pop("brand", None)
        
        item_object, _ = Item.objects.get_or_create(
            item_name=item_name, 
            brand=brand
        )
        
        validated_data["item_name_pii"] = item_object
        validated_data["department_pii"] = department_obj
        
        # return Asset.objects.create(**validated_data)
        asset = Asset.objects.create(**validated_data)
        
        related_assets = item_object.rel_items.all()
        
        return {
            "date_generated": asset.date_generated,
            "amount_purchased": asset.amount_purchased,
            "qr_code_data": asset.qr_code_data,
            "department": department_obj.department,
            "related_assets": [
                {
                    "asset_id": a.asset_id,
                    "amount_purchased": a.amount_purchased,
                    "qr_code_data": a.qr_code_data,
                    "date_generated": a.date_generated
                } for a in related_assets
            ]
        }


    def validate_department(self, department_value):
        try:
            department_obj = Department.objects.get(department=department_value)
        except Department.DoesNotExist:
            raise serializers.ValidationError({
                "department": f"Department '{department_value}' was not found."
            })
        else:
            return department_obj
        
class AssetViewListModelSerializer(serializers.ModelSerializer):
    # this will include the relationship columns
    department = serializers.CharField(source='department_pii.department')
    item_name = serializers.CharField(source='item_name_pii.item_name')

    class Meta:
        model = Asset
        fields = [
            'qr_code_date_generated',
            'amount_purchased',
            'qr_code_data',
            'purchased_date',
            'department', # add it here
            'item_name', # add it here
        ]
        