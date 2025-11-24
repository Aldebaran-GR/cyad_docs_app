from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count
from .models import (
    Licenciatura, Grupo, Departamento, Profesor, UEA,
    CartaTematica, Recuperacion, Autoevaluacion, ProfesorUEA
)
from .serializers import (
    LicenciaturaSerializer, UEASerializer, ProfesorSerializer, ProfesorWriteSerializer,
    CartaTematicaSerializer, CartaTematicaWriteSerializer,
    RecuperacionSerializer, RecuperacionWriteSerializer,
    AutoevaluacionSerializer, AutoevaluacionWriteSerializer
)
from .permissions import IsAdmin, IsProfesor

# ---------- ADMIN VIEWSETS ----------

class ProfesorAdminViewSet(viewsets.ModelViewSet):
    queryset = Profesor.objects.select_related("departamento", "user").all()
    serializer_class = ProfesorWriteSerializer
    permission_classes = [IsAdmin]

# ---------- PROFESOR ENDPOINTS ----------

class CartaTematicaProfesorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsProfesor]

    def get_queryset(self):
        profesor = self.request.user.profesor_profile
        ueas_ids = ProfesorUEA.objects.filter(profesor=profesor).values_list("uea_id", flat=True)
        return CartaTematica.objects.filter(uea_id__in=ueas_ids)

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CartaTematicaWriteSerializer
        return CartaTematicaSerializer

    @action(detail=True, methods=["post"])
    def marcar_completado(self, request, pk=None):
        carta = self.get_object()
        carta.completado = True
        carta.save()
        return Response({"detail": "Carta temática marcada como completada."})

class RecuperacionProfesorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsProfesor]

    def get_queryset(self):
        profesor = self.request.user.profesor_profile
        ueas_ids = ProfesorUEA.objects.filter(profesor=profesor).values_list("uea_id", flat=True)
        return Recuperacion.objects.filter(uea_id__in=ueas_ids)

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return RecuperacionWriteSerializer
        return RecuperacionSerializer

    @action(detail=True, methods=["post"])
    def marcar_completado(self, request, pk=None):
        obj = self.get_object()
        obj.completado = True
        obj.save()
        return Response({"detail": "Recuperación marcada como completada."})

class AutoevaluacionProfesorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsProfesor]

    def get_queryset(self):
        profesor = self.request.user.profesor_profile
        return Autoevaluacion.objects.filter(profesor=profesor)

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return AutoevaluacionWriteSerializer
        return AutoevaluacionSerializer

    def perform_create(self, serializer):
        profesor = self.request.user.profesor_profile
        serializer.save(profesor=profesor)

    @action(detail=True, methods=["post"])
    def marcar_completado(self, request, pk=None):
        obj = self.get_object()
        obj.completado = True
        obj.save()
        return Response({"detail": "Autoevaluación marcada como completada."})

# ---------- DASHBOARD ADMIN ----------

@api_view(["GET"])
@permission_classes([IsAdmin])
def admin_dashboard(request):
    total_profesores = Profesor.objects.count()
    cartas_completadas = CartaTematica.objects.filter(completado=True).count()
    recuperaciones_completadas = Recuperacion.objects.filter(completado=True).count()
    autoevaluaciones_completadas = Autoevaluacion.objects.filter(completado=True).count()

    profesores_cumplidos = Profesor.objects.annotate(
        cartas=Count("ueas__uea__carta_tematica", distinct=True),
    )

    data = {
        "total_profesores": total_profesores,
        "cartas_completadas": cartas_completadas,
        "recuperaciones_completadas": recuperaciones_completadas,
        "autoevaluaciones_completadas": autoevaluaciones_completadas,
    }
    return Response(data)

# ---------- ENDPOINTS PÚBLICOS PARA ALUMNOS ----------

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def public_licenciaturas(request):
    lic = Licenciatura.objects.all()
    return Response(LicenciaturaSerializer(lic, many=True).data)

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def public_trimestres(request):
    licenciatura_id = request.query_params.get("licenciatura_id")
    ueas = UEA.objects.filter(licenciaturas__id=licenciatura_id).exclude(trimestre__isnull=True)
    trimestres = sorted(set(ueas.values_list("trimestre", flat=True)))
    return Response(trimestres)

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def public_ueas(request):
    licenciatura_id = request.query_params.get("licenciatura_id")
    trimestre = request.query_params.get("trimestre")
    ueas = UEA.objects.filter(licenciaturas__id=licenciatura_id, trimestre=trimestre)
    return Response(UEASerializer(ueas, many=True).data)

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def public_profesores(request):
    uea_id = request.query_params.get("uea_id")
    profesores = Profesor.objects.filter(ueas__uea_id=uea_id).distinct()
    return Response(ProfesorSerializer(profesores, many=True).data)

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def public_documentos(request):
    """Devuelve carta temática y recuperación completadas para una UEA y profesor."""
    uea_id = request.query_params.get("uea_id")
    profesor_id = request.query_params.get("profesor_id")

    data = {}
    try:
        carta = CartaTematica.objects.get(uea_id=uea_id, completado=True)
        data["carta_tematica"] = CartaTematicaSerializer(carta).data
    except CartaTematica.DoesNotExist:
        data["carta_tematica"] = None

    try:
        rec = Recuperacion.objects.get(uea_id=uea_id, completado=True)
        data["recuperacion"] = RecuperacionSerializer(rec).data
    except Recuperacion.DoesNotExist:
        data["recuperacion"] = None

    return Response(data)
