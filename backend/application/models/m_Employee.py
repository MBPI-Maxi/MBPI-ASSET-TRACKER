from django.db import models
from django.contrib.auth.models import AbstractUser
from application.models import Department

class Employee(AbstractUser):
    """
    A custom user extending the features of Django User Model
    
    Class Attributes:
        - department - foreign key for the Department Table
    
    Instance Methods:
        - __str__ - string representation of the Employee 
    """
    # foreign key din to sa may department class
    # employee = Employee.objects.create(
    #     username="johndoe",
    #     password="password123",  # Don't forget to set a password (Django requires this)
    #     first_name="John",
    #     last_name="Doe",
    #     email="johndoe@example.com",
    #     department=it_department  # Assign the department here (example: it_department = Department.objects.get(name="IT"))
    # )
    
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True, related_name="department_rel")

    # >>> from application.models import Employee, Department
    # >>> department_obj = Department.objects.get(department='IT')
    # >>> department_obj
    # <Department: IT>
    # >>> employee = Employee(username="JohnDoe", department=department_obj)
    # >>> employee.save()
    # >>> department_obj.department_rel.all()
    # <QuerySet [<Employee: JohnDoe>]>

    def __str__(self):
       return self.username