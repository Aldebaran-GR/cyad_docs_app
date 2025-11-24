from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProfesorAdminViewSet,
    CartaTematicaProfesorViewSet,
    RecuperacionProfesorViewSet,
    AutoevaluacionProfesorViewSet,
    admin_dashboard,
    public_licenciaturas,
    public_trimestres,
    public_ueas,
    public_profesores,
    public_documentos,
)

router = DefaultRouter()
# Rutas para administrador
router.register(r"admin/profesores", ProfesorAdminViewSet, basename="admin-profesores")
# Rutas para profesor
router.register(r"profesor/cartas", CartaTematicaProfesorViewSet, basename="profesor-cartas")
router.register(r"profesor/recuperaciones", RecuperacionProfesorViewSet, basename="profesor-recuperaciones")
router.register(r"profesor/autoevaluaciones", AutoevaluacionProfesorViewSet, basename="profesor-autoevaluaciones")

urlpatterns = [
    path("", include(router.urls)),
    path("admin/dashboard/", admin_dashboard, name="admin-dashboard"),
    path("public/licenciaturas/", public_licenciaturas, name="public-licenciaturas"),
    path("public/trimestres/", public_trimestres, name="public-trimestres"),
    path("public/ueas/", public_ueas, name="public-ueas"),
    path("public/profesores/", public_profesores, name="public-profesores"),
    path("public/documentos/", public_documentos, name="public-documentos"),
]
