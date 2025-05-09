from django.db import models

class Department(models.Model):
    """
    Department Table that stores the information on different departments

    Class Attributes:
        - department_id - primary key of the Department table
        - department - name of the department
    
    Dundar Methods:
        - __str__ - returns the department name
    """
    department_id = models.AutoField(primary_key=True)
    department = models.CharField(max_length=100, null=False, blank=False)
    
    def __str__(self):
        return self.department