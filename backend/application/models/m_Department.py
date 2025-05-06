from django.db import models

class Department(models.Model):
    department_id = models.AutoField(primary_key=True)
    department = models.CharField(max_length=100, null=False, blank=False)
    