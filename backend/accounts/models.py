from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Roles(models.TextChoices):
        ADMIN = "ADMIN", "Administrador"
        PROFESOR = "PROFESOR", "Profesor"
        ALUMNO = "ALUMNO", "Alumno"

    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.ALUMNO,
    )

    def __str__(self):
        return f"{self.username} ({self.role})"
