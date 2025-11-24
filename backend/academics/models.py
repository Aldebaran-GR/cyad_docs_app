from django.db import models
from accounts.models import User

class Licenciatura(models.Model):
    nombre = models.CharField(max_length=150)

    def __str__(self):
        return self.nombre

class Grupo(models.Model):
    nombre_grupo = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre_grupo

class Departamento(models.Model):
    nombre = models.CharField(max_length=150)

    def __str__(self):
        return self.nombre

class Profesor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profesor_profile")
    num_economico = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=100)
    p_apellido = models.CharField(max_length=100)
    s_apellido = models.CharField(max_length=100, blank=True, null=True)
    correo = models.EmailField(blank=True, null=True)
    departamento = models.ForeignKey(Departamento, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.nombre} {self.p_apellido} {self.s_apellido or ''}".strip()

class Educacion(models.Model):
    profesor = models.OneToOneField(Profesor, on_delete=models.CASCADE, related_name="educacion")
    grado = models.CharField(max_length=100, blank=True, null=True)
    td = models.CharField(max_length=100, blank=True, null=True)
    nivel = models.CharField(max_length=100, blank=True, null=True)
    categoria = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Educación de {self.profesor}"

class UEA(models.Model):
    nombre = models.CharField(max_length=150)
    tipo = models.CharField(max_length=50, blank=True, null=True)
    clave = models.CharField(max_length=50, unique=True)
    enlace = models.TextField(blank=True, null=True)
    trimestre = models.CharField(max_length=20, blank=True, null=True)
    grupo = models.ForeignKey(Grupo, on_delete=models.SET_NULL, null=True, blank=True)
    licenciaturas = models.ManyToManyField(Licenciatura, through="LicenciaturaUEA", related_name="ueas")

    def __str__(self):
        return f"{self.clave} - {self.nombre}"

class LicenciaturaUEA(models.Model):
    licenciatura = models.ForeignKey(Licenciatura, on_delete=models.CASCADE)
    uea = models.ForeignKey(UEA, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("licenciatura", "uea")

class ProfesorUEA(models.Model):
    profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE, related_name="ueas")
    uea = models.ForeignKey(UEA, on_delete=models.CASCADE, related_name="profesores")

    class Meta:
        unique_together = ("profesor", "uea")

    def __str__(self):
        return f"{self.profesor} imparte {self.uea}"

class CartaTematica(models.Model):
    uea = models.OneToOneField(UEA, on_delete=models.CASCADE, related_name="carta_tematica")
    descripcion = models.TextField(blank=True, null=True)
    contenido_sintetico = models.TextField(blank=True, null=True)
    modalidad_conduccion = models.TextField(blank=True, null=True)
    modalidad_evaluacion = models.TextField(blank=True, null=True)
    conocimientos_previos = models.TextField(blank=True, null=True)
    asesorias = models.TextField(blank=True, null=True)
    bibliografia = models.TextField(blank=True, null=True)
    calendarizacion = models.TextField(blank=True, null=True)
    completado = models.BooleanField(default=False)

    def __str__(self):
        return f"Carta temática de {self.uea}"

class Objetivo(models.Model):
    carta = models.OneToOneField(CartaTematica, on_delete=models.CASCADE, related_name="objetivo")
    aprendizaje = models.TextField(blank=True, null=True)
    general = models.TextField(blank=True, null=True)
    particulares = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Objetivos de {self.carta.uea}"

class Espacio(models.Model):
    lugar = models.CharField(max_length=200, blank=True, null=True)
    liga = models.TextField(blank=True, null=True)
    codigo = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.lugar or self.liga or "Espacio"

class Recuperacion(models.Model):
    uea = models.OneToOneField(UEA, on_delete=models.CASCADE, related_name="recuperacion")
    espacio = models.OneToOneField(Espacio, on_delete=models.CASCADE, related_name="recuperacion")
    duracion = models.CharField(max_length=100, blank=True, null=True)
    material = models.TextField(blank=True, null=True)
    notas = models.TextField(blank=True, null=True)
    requisitos = models.TextField(blank=True, null=True)
    completado = models.BooleanField(default=False)

    def __str__(self):
        return f"Recuperación de {self.uea}"

class Autoevaluacion(models.Model):
    profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE, related_name="autoevaluaciones")
    preguntas = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    completado = models.BooleanField(default=False)

    def __str__(self):
        return f"Autoevaluación {self.id} de {self.profesor}"
