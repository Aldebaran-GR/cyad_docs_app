import os
import django

def setup_django():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()

def create_user(username, password, email, role):
    from accounts.models import User
    user, created = User.objects.get_or_create(username=username, defaults={
        'email': email,
        'role': role
    })
    if created:
        user.set_password(password)
        user.save()
        print(f"Usuario '{username}' creado con rol '{role}'.")
    else:
        print(f"Usuario '{username}' ya existe.")
    return user

def create_profesor(user, num_economico, nombre, p_apellido, s_apellido, correo):
    from academics.models import Profesor
    profesor, created = Profesor.objects.get_or_create(
        user=user,
        num_economico=num_economico,
        defaults={
            'nombre': nombre,
            'p_apellido': p_apellido,
            's_apellido': s_apellido,
            'correo': correo
        }
    )
    if created:
        print(f"Profesor '{nombre} {p_apellido}' creado.")
    else:
        print(f"Profesor '{nombre} {p_apellido}' ya existe.")
    return profesor

if __name__ == "__main__":
    setup_django()
    # Crear admin
    create_user("admin", "admin123", "admin@cyad.com", "ADMIN")
