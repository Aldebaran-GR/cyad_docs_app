# CyAD Docs App

Backend: Django + Django REST Framework + SimpleJWT  
Frontend: React (Vite) + Tailwind CSS  
DB: PostgreSQL

## Backend (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r ../requirements.txt

export POSTGRES_DB=cyad_db
export POSTGRES_USER=cyad_user
export POSTGRES_PASSWORD=tu_password
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Frontend (Vite + React + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

Configura la variable `VITE_BACKEND_URL` en un archivo `.env` en `frontend/` para producción.
