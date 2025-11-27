import os
import django
import random

def setup_django():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()

def create_licenciaturas():
    from academics.models import Licenciatura
    nombres = [
        "Licenciatura en Diseño de la Comunicación Gráfica",
        "Licenciatura en Diseño Industrial",
        "Licenciatura en Arquitectura"
    ]
    objs = []
    for nombre in nombres:
        obj, _ = Licenciatura.objects.get_or_create(nombre=nombre)
        objs.append(obj)
    print(f"Licenciaturas creadas: {[l.nombre for l in objs]}")
    return objs

def create_grupos():
    from academics.models import Grupo
    grupos = ["DCG-01", "DCG-02", "ARQ-01"]
    objs = []
    for g in grupos:
        obj, _ = Grupo.objects.get_or_create(nombre_grupo=g)
        objs.append(obj)
    print(f"Grupos creados: {[g.nombre_grupo for g in objs]}")
    return objs

def create_departamentos():
    from academics.models import Departamento
    nombres = [
        "Procesos y Técnicas de Realización",
        "Teoría y Análisis",
        "Representación y Expresión"
    ]
    objs = []
    for nombre in nombres:
        obj, _ = Departamento.objects.get_or_create(nombre=nombre)
        objs.append(obj)
    print(f"Departamentos creados: {[d.nombre for d in objs]}")
    return objs

def create_ueas(licenciaturas, grupos):
    from academics.models import UEA, LicenciaturaUEA
    ueas = [
        ("DCG-101", "Fundamentos de Diseño", "Obligatoria", "https://plataforma.cyad.uam.mx/cursos/dcg101", "1", grupos[0]),
        ("DCG-102", "Expresión Gráfica I", "Obligatoria", "https://plataforma.cyad.uam.mx/cursos/dcg102", "1", grupos[1]),
        ("DCG-201", "Metodología del Diseño", "Obligatoria", "https://plataforma.cyad.uam.mx/cursos/dcg201", "3", grupos[2]),
    ]
    objs = []
    for clave, nombre, tipo, enlace, trimestre, grupo in ueas:
        uea, _ = UEA.objects.get_or_create(
            clave=clave,
            defaults={
                "nombre": nombre,
                "tipo": tipo,
                "enlace": enlace,
                "trimestre": trimestre,
                "grupo": grupo
            }
        )
        # Relacionar licenciaturas según el ejemplo SQL
        if clave == "DCG-101" or clave == "DCG-102":
            lic = next((l for l in licenciaturas if "Comunicación Gráfica" in l.nombre), None)
            if lic:
                LicenciaturaUEA.objects.get_or_create(licenciatura=lic, uea=uea)
        if clave == "DCG-201":
            lic = next((l for l in licenciaturas if "Diseño Industrial" in l.nombre), None)
            if lic:
                LicenciaturaUEA.objects.get_or_create(licenciatura=lic, uea=uea)
        objs.append(uea)
    print(f"UEAs creadas: {[u.nombre for u in objs]}")
    return objs

def create_profesores(departamentos, user_prof):
    from academics.models import Profesor
    from accounts.models import User
    profesores = [
        (1001, "Laura", "García", "Martínez", "laura.garcia@cyad.uam.mx", departamentos[0], "proflaura", "1001"),
        (1002, "Juan", "Pérez", "López", "juan.perez@cyad.uam.mx", departamentos[1], "profjuan", "1002"),
        (1003, "María", "Hernández", "Santos", "maria.hernandez@cyad.uam.mx", departamentos[2], "profmaria", "1003"),
    ]
    objs = []
    for num, nombre, p_ap, s_ap, correo, depto, username, password in profesores:
        user, _ = User.objects.get_or_create(
            username=username,
            defaults={
                "email": correo,
                "role": "PROFESOR"
            }
        )
        user.set_password(password)
        user.save()
        obj, _ = Profesor.objects.get_or_create(
            num_economico=num,
            defaults={
                "user": user,
                "nombre": nombre,
                "p_apellido": p_ap,
                "s_apellido": s_ap,
                "correo": correo,
                "departamento": depto
            }
        )
        objs.append(obj)
    # Relacionar profesores con UEAs (imparte)
    from academics.models import UEA, ProfesorUEA
    uea_dcg101 = UEA.objects.get(clave="DCG-101")
    uea_dcg102 = UEA.objects.get(clave="DCG-102")
    uea_dcg201 = UEA.objects.get(clave="DCG-201")
    ProfesorUEA.objects.get_or_create(profesor=objs[0], uea=uea_dcg101)
    ProfesorUEA.objects.get_or_create(profesor=objs[0], uea=uea_dcg102)
    ProfesorUEA.objects.get_or_create(profesor=objs[1], uea=uea_dcg201)
    ProfesorUEA.objects.get_or_create(profesor=objs[2], uea=uea_dcg102)
    print(f"Profesores creados: {[p.nombre for p in objs]}")
    return objs

def create_espacios():
    from academics.models import Espacio
    espacios = [
        ("Aula B-201, Edificio CyAD", None, None),
        ("Auditorio Principal CyAD", None, None),
        ("Sesión en línea vía Microsoft Teams", "https://teams.microsoft.com/l/meetup-join/recuperacion-dcg102", "RECUP-DCG102"),
    ]
    objs = []
    for lugar, liga, codigo in espacios:
        obj, _ = Espacio.objects.get_or_create(lugar=lugar, liga=liga, codigo=codigo)
        objs.append(obj)
    print(f"Espacios creados: {[e.lugar for e in objs]}")
    return objs

def create_cartas_etc(ueas):
    # Datos dummy detallados para cada carta temática y objetivo
    data = [
        {
            "clave": "DCG-101",
            "descripcion": "Introducción a los principios básicos del diseño para estudiantes de primer ingreso.",
            "contenido": "Revisión de elementos básicos de composición, color, forma, retícula y procesos de bocetaje.",
            "modalidad_conduccion": "Sesiones presenciales teórico-prácticas con ejercicios en aula y trabajo en taller.",
            "modalidad_evaluacion": "Portafolio de proyectos (60%), participación (20%) y examen final (20%).",
            "conocimientos_previos": "Conocimientos básicos de dibujo y manejo de herramientas analógicas.",
            "asesorias": "Martes y jueves de 13:00 a 14:00 en el cubículo del profesor.",
            "bibliografia": "Lupton, E. Pensar con tipos; Wong, W. Fundamentos del diseño.",
            "calendarizacion": "Trimestre de 12 semanas con 2 sesiones por semana.",
            "completado": True,
            "objetivo": {
                "aprendizaje": "Que el estudiante comprenda y aplique los principios básicos del diseño.",
                "general": "Introducir al alumno al lenguaje visual y a la resolución básica de problemas de diseño.",
                "particulares": "Identificar elementos del diseño; aplicar principios de composición; elaborar bocetos funcionales."
            }
        },
        {
            "clave": "DCG-102",
            "descripcion": "Desarrollo de habilidades de representación gráfica a mano y digital.",
            "contenido": "Técnicas de dibujo técnico, perspectivas, sombreados y digitalización básica.",
            "modalidad_conduccion": "Taller práctico con demostraciones y ejercicios guiados en laboratorio de cómputo.",
            "modalidad_evaluacion": "Prácticas entregables (50%), proyecto final (30%), exámenes parciales (20%).",
            "conocimientos_previos": "Fundamentos de diseño y manejo básico de instrumentos de dibujo.",
            "asesorias": "Lunes de 11:00 a 13:00 previa cita por correo electrónico.",
            "bibliografia": "Ching, F. Dibujo y proyectos de arquitectura; manuales internos de CyAD.",
            "calendarizacion": "Actividades distribuidas semanalmente según cronograma del aula virtual.",
            "completado": False,
            "objetivo": {
                "aprendizaje": "Desarrollar habilidades de representación gráfica analógica y digital.",
                "general": "Fortalecer la capacidad de comunicar ideas de diseño mediante dibujo y esquemas.",
                "particulares": "Dominar técnicas de perspectiva; generar láminas de presentación; digitalizar bocetos."
            }
        },
        {
            "clave": "DCG-201",
            "descripcion": "Estudio de metodologías de proyecto aplicadas al diseño.",
            "contenido": "Análisis de problemas de diseño, métodos de investigación y desarrollo de propuestas.",
            "modalidad_conduccion": "Seminario con discusión de lecturas y trabajo en equipo sobre casos de estudio.",
            "modalidad_evaluacion": "Ensayos críticos (40%), proyecto de investigación (40%), participación (20%).",
            "conocimientos_previos": "Lectura académica en nivel intermedio y experiencia previa en proyectos de diseño.",
            "asesorias": "Miércoles de 10:00 a 12:00 en el aula de seminario.",
            "bibliografia": "Cross, N. Métodos de diseño; textos seleccionados de metodología.",
            "calendarizacion": "Plan de trabajo por etapas: planteamiento, investigación, síntesis y evaluación.",
            "completado": False,
            "objetivo": {
                "aprendizaje": "Utilizar metodologías de proyecto para estructurar procesos de diseño complejos.",
                "general": "Promover el pensamiento crítico y la investigación aplicada al diseño.",
                "particulares": "Formular problemas de diseño; seleccionar métodos adecuados; evaluar resultados con criterios claros."
            }
        },
    ]
    from academics.models import UEA, CartaTematica, Objetivo
    for entry in data:
        uea = UEA.objects.get(clave=entry["clave"])
        carta, _ = CartaTematica.objects.get_or_create(
            uea=uea,
            defaults={
                "descripcion": entry["descripcion"],
                "contenido_sintetico": entry["contenido"],
                "modalidad_conduccion": entry["modalidad_conduccion"],
                "modalidad_evaluacion": entry["modalidad_evaluacion"],
                "conocimientos_previos": entry["conocimientos_previos"],
                "asesorias": entry["asesorias"],
                "bibliografia": entry["bibliografia"],
                "calendarizacion": entry["calendarizacion"],
                "completado": entry["completado"]
            }
        )
        Objetivo.objects.get_or_create(
            carta=carta,
            defaults=entry["objetivo"]
        )
    print("Cartas temáticas y objetivos creados.")

def create_recuperaciones(ueas, espacios):
    # Datos dummy detallados para cada recuperación
    data = [
        {
            "clave": "DCG-101",
            "espacio": "Aula B-201, Edificio CyAD",
            "duracion": "2 horas",
            "material": "Lápices, marcadores, regla, escuadras, compás y cuaderno de bocetos.",
            "notas": "Llegar 15 minutos antes para asignación de lugares; no se permite el uso de dispositivos móviles.",
            "requisitos": "Haber entregado al menos el 50% de las actividades del curso y presentar credencial vigente.",
            "completado": True
        },
        {
            "clave": "DCG-102",
            "espacio": "Sesión en línea vía Microsoft Teams",
            "duracion": "1 hora 30 minutos",
            "material": "Tableta digitalizadora (opcional), hoja blanca, lápiz y acceso estable a internet.",
            "notas": "Encender cámara al inicio de la sesión; el examen se realizará de forma individual.",
            "requisitos": "Registro previo en la plataforma y confirmar asistencia por correo 48 horas antes.",
            "completado": False
        },
        {
            "clave": "DCG-201",
            "espacio": "Auditorio Principal CyAD",
            "duracion": "3 horas",
            "material": "Computadora portátil con presentación del proyecto, memoria USB y bitácora de proceso.",
            "notas": "Los equipos se presentarán en orden alfabético de apellidos del primer integrante.",
            "requisitos": "Entregar versión escrita del proyecto al menos 24 horas antes de la recuperación.",
            "completado": False
        },
    ]
    from academics.models import UEA, Espacio, Recuperacion
    for entry in data:
        uea = UEA.objects.get(clave=entry["clave"])
        espacio = Espacio.objects.get(lugar=entry["espacio"])
        Recuperacion.objects.get_or_create(
            uea=uea,
            espacio=espacio,
            defaults={
                "duracion": entry["duracion"],
                "material": entry["material"],
                "notas": entry["notas"],
                "requisitos": entry["requisitos"],
                "completado": entry["completado"]
            }
        )
    print("Recuperaciones creadas.")

def create_autoevaluaciones(profesores):
    # Datos dummy detallados para cada autoevaluación
    data = [
        (profesores[0], "Autoevaluación 23-O: Reflexión sobre estrategias de evaluación y participación estudiantil.", True),
        (profesores[1], "Autoevaluación 23-O: Análisis de resultados de proyectos de investigación en aula.", False),
        (profesores[2], "Autoevaluación 23-O: Revisión de metodologías activas implementadas en el taller.", False),
    ]
    from academics.models import Autoevaluacion
    for prof, preguntas, completado in data:
        Autoevaluacion.objects.get_or_create(
            profesor=prof,
            defaults={
                "preguntas": preguntas,
                "completado": completado
            }
        )
    print("Autoevaluaciones creadas.")

def main():
    setup_django()
    from accounts.models import User
    # Usa el usuario profesor creado antes si existe
    user_prof = User.objects.filter(username="profesor1").first()
    licenciaturas = create_licenciaturas()
    grupos = create_grupos()
    departamentos = create_departamentos()
    ueas = create_ueas(licenciaturas, grupos)
    profesores = create_profesores(departamentos, user_prof)
    espacios = create_espacios()
    create_cartas_etc(ueas)
    create_recuperaciones(ueas, espacios)
    create_autoevaluaciones(profesores)

if __name__ == "__main__":
    main()
