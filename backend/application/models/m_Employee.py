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
    
    department = models.ForeignKey(
        Department, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name="department_rel"
    )

    def __str__(self):
       return self.username