from django.contrib import admin
from application.models import Department, Asset, Item, Location, Employee

# Register your models here.
admin.site.register(Department)
admin.site.register(Asset)
admin.site.register(Item)
admin.site.register(Employee)
admin.site.register(Location)