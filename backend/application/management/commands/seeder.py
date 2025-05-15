from django.core.management.base import BaseCommand
from application.models import Department, Employee, Location
from enum import Enum

def write_notice(instance, table_name):
    instance.stdout.write(instance.style.NOTICE(f"Seeding {table_name} Table..."))

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
        # (username, firstn, lastn, dept, password)
        ("jarick", "jarick", "montojo", "IT", "testing"),
        ("francis", "francis", "candelaria", "IT", "testing"),
        ("joshua1", "joshua", "eribuagas", "PRODUCTION DEPARTMENT", "testing"),
        ("joshua2", "joshua", "dupalco", "PRODUCTION DEPARTMENT", "testing"),
        ("maria", "maria", "lopez", "UTILITY MAINTENANCE", "testing"),
        ("john", "john", "cruz", "WAREHOUSE DEPARTMENT", "testing"),
        ("lisa", "lisa", "reyes", "PRODUCTION MAINTENANCE", "testing"),
        ("eric", "eric", "villanueva", "LAB DEPARTMENT", "testing"),
        ("karen", "karen", "delosantos", "IT", "testing"),
        ("steven", "steven", "torres", "WAREHOUSE DEPARTMENT", "testing"),
        ("michelle", "michelle", "navarro", "UTILITY MAINTENANCE", "testing"),
        ("ron", "ron", "gutierrez", "PRODUCTION MAINTENANCE", "testing"),
        ("ella", "ella", "salazar", "LAB DEPARTMENT", "testing"),
        ("paul", "paul", "valdez", "PRODUCTION DEPARTMENT", "testing"),
        ("nina", "nina", "fernandez", "IT", "testing")
    ]
    
class LocationConstant(Enum):
    LOCATION = [
        "IT ROOM",
        "WAREHOUSE 1",
        "CONFERENCE ROOM"
    ]

class Command(BaseCommand):
    # help = "Seeds Department database"
    help = "Seeds initial values in database"
    
    def handle(self, *args, **kwargs):
        write_notice(self, "Department")
        for department in DepartmentConstant.DEPARTMENTS.value:
            self.seed_department(department)
        
        write_notice(self, "Employee")
        for (username, first_name, last_name, department, password) in EmployeeConstant.EMPLOYEES.value:
            self.seed_employee(username, first_name, last_name, department, password)
            
        write_notice(self, "Location")
        for location in LocationConstant.LOCATION.value:
            self.seed_location(location)
            
        # write_notice(self, "Vendor")
        # for vendor, contact in VendorConstants.VENDOR.value:
        #     self.seed_vendor(vendor, contact)

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
    
    def seed_employee(self, username, first, last, dept, password):
        if not Employee.objects.filter(username=username).filter(department__department=dept).exists():
            department_obj = Department.objects.get(department=dept)
            
            if department_obj:
                employee = Employee(
                    username=username, 
                    first_name=first, 
                    last_name=last, 
                    department=department_obj
                )
                employee.set_password(password)
                employee.save()
            
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
    
    # def seed_vendor(self, vendor, contact):
    #     if not Vendor.objects.filter(name=vendor).exists():
    #         Vendor.objects.create(name=vendor, contact_number=contact)

    #         self.stdout.write(
    #             self.style.SUCCESS(f"Seeded Vender: {vendor}")
    #         )
    #     else:
    #         self.stdout.write(
    #             self.style.WARNING(f"Vender: '{vendor}' already exists.")
    #         )