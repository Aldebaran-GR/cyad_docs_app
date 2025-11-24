import os
import django
import random

def setup_django():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()

def create_licenciaturas():
    from academics.models import Licenciatura
    nombres = ["Arquitectura", "Diseño Industrial", "Planeación Territorial", "Urbanismo"]
    objs = []
    for nombre in nombres:
        obj, _ = Licenciatura.objects.get_or_create(nombre=nombre)
        objs.append(obj)
    print(f"Licenciaturas creadas: {[l.nombre for l in objs]}")
    return objs

def create_grupos():
    from academics.models import Grupo
    grupos = ["A", "B", "C"]
    objs = []
    for g in grupos:
        obj, _ = Grupo.objects.get_or_create(nombre_grupo=g)
        objs.append(obj)
    print(f"Grupos creados: {[g.nombre_grupo for g in objs]}")
    return objs

def create_departamentos():
    from academics.models import Departamento
    nombres = ["Diseño", "Arquitectura", "Urbanismo"]
    objs = []
    for nombre in nombres:
        obj, _ = Departamento.objects.get_or_create(nombre=nombre)
        objs.append(obj)
    print(f"Departamentos creados: {[d.nombre for d in objs]}")
    return objs

def create_ueas(licenciaturas, grupos):
    from academics.models import UEA, LicenciaturaUEA
    ueas = [
        ("DCG-101", "Dibujo Constructivo", "1"),
        ("MAT-201", "Matemáticas II", "2"),
        ("HIS-301", "Historia del Arte", "3"),
    ]
    objs = []
    for clave, nombre, trimestre in ueas:
        uea, _ = UEA.objects.get_or_create(
            clave=clave,
            defaults={
                "nombre": nombre,
                "tipo": "Obligatoria",
                "trimestre": trimestre,
                "grupo": random.choice(grupos)
            }
        )
        for lic in licenciaturas:
            LicenciaturaUEA.objects.get_or_create(licenciatura=lic, uea=uea)
        objs.append(uea)
    print(f"UEAs creadas: {[u.nombre for u in objs]}")
    return objs

def create_profesores(departamentos, user_prof):
    from academics.models import Profesor
    from accounts.models import User
    profesores = [
        (1001, "Juan", "Pérez", "García", "juan.perez@cyad.com", departamentos[0], "profesor1", "profesor123"),
        (1002, "Ana", "López", "Martínez", "ana.lopez@cyad.com", departamentos[1], "profesor2", "profesor123"),
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
    print(f"Profesores creados: {[p.nombre for p in objs]}")
    return objs

def create_espacios():
    from academics.models import Espacio
    espacios = [
        ("Aula 101", "", "E101"),
        ("Laboratorio 1", "", "L1"),
    ]
    objs = []
    for lugar, liga, codigo in espacios:
        obj, _ = Espacio.objects.get_or_create(lugar=lugar, liga=liga, codigo=codigo)
        objs.append(obj)
    print(f"Espacios creados: {[e.lugar for e in objs]}")
    return objs

def create_cartas_etc(ueas):
    from academics.models import CartaTematica, Objetivo
    for uea in ueas:
        carta, _ = CartaTematica.objects.get_or_create(
            uea=uea,
            defaults={
                "descripcion": f"Descripción de {uea.nombre}",
                "contenido_sintetico": f"Contenido de {uea.nombre}",
                "completado": True
            }
        )
        Objetivo.objects.get_or_create(
            carta=carta,
            defaults={
                "aprendizaje": "Aprender conceptos básicos",
                "general": "Generalidades",
                "particulares": "Detalles"
            }
        )
    print("Cartas temáticas y objetivos creados.")

def create_recuperaciones(ueas, espacios):
    from academics.models import Recuperacion
    for uea, espacio in zip(ueas, espacios):
        Recuperacion.objects.get_or_create(
            uea=uea,
            espacio=espacio,
            defaults={
                "duracion": "2 horas",
                "material": "Material de apoyo",
                "notas": "Notas importantes",
                "requisitos": "Requisitos básicos",
                "completado": True
            }
        )
    print("Recuperaciones creadas.")

def create_autoevaluaciones(profesores):
    from academics.models import Autoevaluacion
    for prof in profesores:
        Autoevaluacion.objects.get_or_create(
            profesor=prof,
            defaults={
                "preguntas": "¿Cómo evalúas tu desempeño?",
                "completado": True
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
