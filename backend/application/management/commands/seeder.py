from django.core.management.base import BaseCommand
from application.models import Department, Employee, Location
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
    
class EmployeeConstant(Enum):
    EMPLOYEES = [
        # (username, firstn, lastn, dept)
        ("jarick", "jarick", "montojo", "IT"),
        ("francis", "francis", "candelaria", "IT"),
        ("joshua1", "joshua", "eribuagas", "PRODUCTION DEPARTMENT"),
        ("joshua2", "joshua", "dupalco", "PRODUCTION DEPARTMENT"),
        ("maria", "maria", "lopez", "UTILITY MAINTENANCE"),
        ("john", "john", "cruz", "WAREHOUSE DEPARTMENT"),
        ("lisa", "lisa", "reyes", "PRODUCTION MAINTENANCE"),
        ("eric", "eric", "villanueva", "LAB DEPARTMENT"),
        ("karen", "karen", "delosantos", "IT"),
        ("steven", "steven", "torres", "WAREHOUSE DEPARTMENT"),
        ("michelle", "michelle", "navarro", "UTILITY MAINTENANCE"),
        ("ron", "ron", "gutierrez", "PRODUCTION MAINTENANCE"),
        ("ella", "ella", "salazar", "LAB DEPARTMENT"),
        ("paul", "paul", "valdez", "PRODUCTION DEPARTMENT"),
        ("nina", "nina", "fernandez", "IT")
    ]
    
class LocationConstant(Enum):
    LOCATION = [
        "IT ROOM",
        "WAREHOUSE 1",
        "CONFERENCE ROOM"
    ]

def write_notice(instance, table_name):
    instance.stdout.write(instance.style.NOTICE(f"Seeding {table_name} Table..."))

class Command(BaseCommand):
    help = "Seeds Department database"
    
    def handle(self, *args, **kwargs):
        write_notice(self, "Department")
        for department in DepartmentConstant.DEPARTMENTS.value:
            self.seed_department(department)
        
        write_notice(self, "Employee")
        for username, first_name, last_name, department in EmployeeConstant.EMPLOYEES.value:
            self.seed_employee(username, first_name, last_name, department)
            
        write_notice(self, "Location")
        for location in LocationConstant.LOCATION.value:
            self.seed_location(location)

    def seed_department(self, dept_name):
        if not Department.objects.filter(department=dept_name).exists():
            Department.objects.create(department=dept_name)
            
            self.stdout.write(
                self.style.SUCCESS(f"Seeded Department: {dept_name}")
            )
        else:
            self.stdout.write(
                self.style.WARNING(f"Department '{dept_name}' already exists.")
            )
    
    def seed_employee(self, username, first, last, dept):
        if not Employee.objects.filter(username=username).filter(department__department=dept).exists():
            department_obj = Department.objects.get(department=dept)
            
            if department_obj:
                Employee.objects.create(username=username, first_name=first, last_name=last, department=department_obj)
            
                self.stdout.write(
                    self.style.SUCCESS(f"Seeded Asset: {username}")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f"Department obj does not exists in database.")
                )
        else:
            self.stdout.write(
                self.style.WARNING(f"Employee username '{username}' already exists.")
            )
    
    def seed_location(self, location):
        if not Location.objects.filter(name=location).exists():
            Location.objects.create(name=location)
            
            self.stdout.write(
                self.style.SUCCESS(f"Seeded Location: {location}")
            )
        else:
            self.stdout.write(
                self.style.WARNING(f"Location: '{location}' already exists.")
            )
    
    