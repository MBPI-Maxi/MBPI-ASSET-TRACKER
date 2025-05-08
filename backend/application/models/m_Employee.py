from django.db import models
from django.contrib.auth.models import AbstractUser
from application.models import Department

class Employee(AbstractUser):
    # foreign key din to sa may department class
    # employee = Employee.objects.create(
    #     username="johndoe",
    #     password="password123",  # Don't forget to set a password (Django requires this)
    #     first_name="John",
    #     last_name="Doe",
    #     email="johndoe@example.com",
    #     department=it_department  # Assign the department here (example: it_department = Department.objects.get(name="IT"))
    # )
    
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="department_rel")

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