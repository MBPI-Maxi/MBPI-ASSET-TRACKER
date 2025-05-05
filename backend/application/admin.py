from django.contrib import admin
from application.models import Department, Asset, Item

# Register your models here.
admin.site.register(Department)
admin.site.register(Asset)
admin.site.register(Item)