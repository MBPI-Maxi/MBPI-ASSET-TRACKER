from django.core.management.base import BaseCommand
from application.models import Department
from enum import Enum

class DepartmentConstant(Enum):
    DEPARTMENTS = [
        "IT",
        "PRODUCTION DEPARTMENT",
        "UTILITY MAINTENANCE",
        "LAB DEPARTMENT",
        "WAREHOUSE DEPARTMENT",
        "PRODUCTION MAINTENANCE",
    ]

class Command(BaseCommand):
    help = "Seeds Department database"
    
    def handle(self, *args, **kwargs):
        for department in DepartmentConstant.DEPARTMENTS.value:
            self.seed(department)

    def seed(self, dept_name):
        if not Department.objects.filter(department=dept_name).exists():
            Department.objects.create(department=dept_name)
            
            self.stdout.write(
                self.style.SUCCESS(f"Seeded Department: {dept_name}")
            )
        else:
            self.stdout.write(
                self.style.WARNING(f"Department '{dept_name}' already exists.")
            )
        
    
    