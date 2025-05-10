from rest_framework import serializers
from django.contrib.auth import get_user_model
from application.models import Asset, Item, Department, Location
from django.forms.models import model_to_dict
# from datetime import date
from dev.logger import log_message
# import re
from typing import Type

class AssetViewModelSerializer(serializers.ModelSerializer):
    """
    Asset View Serializer for single items
    
    LEGEND:
        OPTIONAL - The fieldname can be omitted during the request
    
    Class Attributes:
        - department - Foreign key for the Department table. During the request this will be required
            `{ 'department': 'IT' }`
        - item_name - Foreign key for the Item table. During the request this will be required.
            `{ 'item_name': 'Monitor' }`
        - location - Foreign key for the Location table. During the request this will be required.
            `{ 'location': 'IT Room' }`
        - brand - Foreign key for the Item table. During the request this will be required.
            OPTIONAL: `{ 'brand': 'brand name' }`
    
    Instance Methods:
        - create - A custom setting for the response of the serializer 
        - set_status - set the status to be displayed on response
        - validate_department - checks if the department is existing on the Department table before inserting to the DB
        - validate_location - checks if the location is existing on the Location table before inserting to the DB
    """
    
    # remove the write_only on refactor this will make it more cleaner to read
    # write_only parameter tells that the field will not return on the response.
    department = serializers.CharField(write_only=True, required=True, allow_blank=False)
    item_name = serializers.CharField(write_only=True, required=True, allow_blank=False)
    location = serializers.CharField(write_only=True, required=True, allow_blank=False)
    brand = serializers.CharField(write_only=True, required=False, allow_blank=True)
    is_active = serializers.BooleanField(write_only=True, required=True)
    
    class Meta:
        model = Asset
        fields = [
            "item_name",
            "brand",
            "department",
            "is_found",
            "is_active",
            "tag_type",
            "amount_purchased",
            "qr_code_image",
            "purchased_date",
            "location",
            "created_at"
        ]
    
    def create(self, validated_data):
        # removes the department key on before inserting the data to the db
        department_obj = validated_data.pop("department") # validates the incoming requests on the method 'validate_department'
        # validates the incoming request on the method 'validate_location'
        location_obj = validated_data.pop("location") # this are foreign key elements
        item_name = validated_data.pop("item_name") # this are foreign key
        brand = validated_data.pop("brand", None) # this is a foreign key
                
        item_object, _ = Item.objects.get_or_create(
            item_name=item_name, 
            brand=brand
        )
        # log_message(validated_data)
        
        # NOTE: this is assigning value to designated column during creation. 
        validated_data["item_name_pii"] = item_object
        validated_data["department_pii"] = department_obj
        validated_data["location"] = location_obj
        
        # return Asset.objects.create(**validated_data)
        asset = Asset.objects.create(**validated_data)
        
        # Generate QR code image now that asset_id exists
        asset.generate_qr_code_image()
        asset.save(update_fields=["qr_code_image"]) 
        
        # reversed call via related_name
        related_items = item_object.rel_items.all()
        
        return {
            "asset_id": asset.asset_id,
            "amount_purchased": asset.amount_purchased,
            "purchased_date": asset.purchased_date,
            "item_name": item_name,
            "qr_code_image": asset.qr_code_image.url if asset.qr_code_image else None,
            "department": department_obj.department,
            "status": self.set_status(asset),
            "tag_type": asset.tag_type,
            "created_at": asset.created_at,
            "related_items": [
                {
                    "asset_id": a.asset_id,
                    "amount_purchased": a.amount_purchased,
                    "purchased_date": a.purchased_date,
                    # "qr_code_image": a.qr_code_image,
                    "department": a.department_pii.department,
                    "status": self.set_status(a),
                    "item_name": a.item_name_pii.item_name,
                    "tag_type": a.tag_type,
                    "created_at": a.created_at,
                } for a in related_items
            ]
        }
    
    def set_status(self, asset_model: Type[Asset]):
        if asset_model.is_active:
            return "Active"
        return "Retired"

    def validate_department(self, department_value):
        try:
            department_obj = Department.objects.get(department=department_value)
        except Department.DoesNotExist:
            raise serializers.ValidationError({
                "department": f"Department '{department_value}' was not found."
            })
        else:
            return department_obj
        
    def validate_location(self, location_value):
        try:
            location_obj = Location.objects.get(name=location_value)
        except Location.DoesNotExist:
            raise serializers.ValidationError({
                "location": f"Location name '{location_value}' was not found."
            })
        else:
            return location_obj
        
    def validate_is_found(self, value):
        log_message(value)
                
class AssetViewListModelSerializer(serializers.ModelSerializer):
    """
    Asset Serializer for list 
    
    Class Attributes:
        - department - displays the department on response based on the department table `department` column
        - item_name - displays the item name based on the item table `item_name` column
        - brand - displays the brand on response based on the item table `brand` column
        - location - displays the location name on response based on the location table `name` column
            Notes: We used `SerailizerMethodField` and `get_location` method because some location on the existing item is null. We replaced that as `Location not found` to replaced the foreign key expected value  
    
    Instance Method:
        - get_assets_str - returns the obj into a string format(dict[str, Any])
        - get_location - modifies the location.name if obj location is not found.    
    """

    # this will include the relationship columns
    department = serializers.CharField(source="department_pii.department")
    item_name = serializers.CharField(source="item_name_pii.item_name")
    brand = serializers.CharField(source="item_name_pii.brand")
    location = serializers.SerializerMethodField() # we needed to do this because some of the location is null
    
    class Meta:
        model = Asset
        fields = [
            "asset_id",
            "amount_purchased",
            "qr_code_image",
            "purchased_date",
            "department",  # add it here
            "item_name",   # add it here
            "brand",
            "is_found",
            "location",
            "is_active",
            "tag_type",
            "created_at",
        ]
        
    def get_assets_str(self, obj):
        return model_to_dict(obj)
    
    def get_location(self, obj):
        # the location is existing on the asset table as a column
        return obj.location.name if obj.location else None
    
# serializer for department purchased summary
class DateRangeQuerySerializer(serializers.Serializer):
    """
    A date range serializer for the Date Purchased Summary
    
    Date format:
        `YYYY-MM-DD`
    
    Class Attributes:
        - start_date - starting date to query
        - end_date - ending date to query
    """
    
    start_date = serializers.DateField(required=True)
    end_date = serializers.DateField(required=True)
    
    def __str__(self):
        return f"<StartDate: {self.start_date} EndDate: {self.end_date} >"
    

class RegistrationViewSerializer(serializers.Serializer):
    # user model in this class only
    User = get_user_model()
    
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True) # does not return on the response
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    department = serializers.CharField(required=True)
    
    def validate_username(self, value):
        if self.User.objects.filter(username=value).exists():
            raise serializers.ValidationError(f"Username: '{value}' already exists.")
        return value
    
    def validate_department(self, value):
        try:
            department_obj = Department.objects.get(department=value)
        except Department.DoesNotExist:
            raise serializers.ValidationError(f"Department '{value}' does not exists.")
        else:
            return department_obj
    
    def create(self, validated_data):
        # fetch the validated data by using pop method on ('department')
        department_obj = validated_data.pop("department")

        user_obj = self.User.objects.create_user(
            **validated_data,
            department=department_obj
        )
            
        return user_obj        
