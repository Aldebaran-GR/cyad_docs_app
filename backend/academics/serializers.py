from rest_framework import serializers
from .models import (
    Licenciatura, Grupo, Departamento, Profesor, Educacion,
    UEA, LicenciaturaUEA, ProfesorUEA,
    CartaTematica, Objetivo, Espacio, Recuperacion, Autoevaluacion
)

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = "__all__"

class ProfesorSerializer(serializers.ModelSerializer):
    departamento = DepartamentoSerializer(read_only=True)

    class Meta:
        model = Profesor
        fields = [
            "num_economico", "nombre", "p_apellido", "s_apellido",
            "correo", "departamento"
        ]

class ProfesorWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profesor
        fields = "__all__"

class LicenciaturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Licenciatura
        fields = "__all__"

class GrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grupo
        fields = "__all__"

class UEASerializer(serializers.ModelSerializer):
    grupo = GrupoSerializer(read_only=True)

    class Meta:
        model = UEA
        fields = ["id", "nombre", "tipo", "clave", "enlace", "trimestre", "grupo"]

class CartaTematicaSerializer(serializers.ModelSerializer):
    uea = UEASerializer(read_only=True)

    class Meta:
        model = CartaTematica
        fields = "__all__"
        read_only_fields = ["completado"]

class CartaTematicaWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartaTematica
        fields = "__all__"

class ObjetivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Objetivo
        fields = "__all__"

class EspacioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Espacio
        fields = "__all__"

class RecuperacionSerializer(serializers.ModelSerializer):
    uea = UEASerializer(read_only=True)
    espacio = EspacioSerializer(read_only=True)

    class Meta:
        model = Recuperacion
        fields = "__all__"
        read_only_fields = ["completado"]

class RecuperacionWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recuperacion
        fields = "__all__"

class AutoevaluacionSerializer(serializers.ModelSerializer):
    profesor = ProfesorSerializer(read_only=True)

    class Meta:
        model = Autoevaluacion
        fields = "__all__"
        read_only_fields = ["completado", "created_at"]

class AutoevaluacionWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autoevaluacion
        fields = "__all__"
