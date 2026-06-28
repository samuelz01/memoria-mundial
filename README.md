# Memoria Mundial 🌎🇲🇽

Un dispositivo de memoria documental sobre el Mundial en México. Permite a los usuarios subir y explorar documentos y archivos multimedia integrados con Google Drive.

## Tecnologías
- **Frontend:** React (Vite), Tailwind CSS v4
- **Backend:** Node.js, Express
- **Almacenamiento:** Google Drive API (googleapis)

## Configuración Local

1. Instala las dependencias en ambas carpetas:
   - Frontend:
     ```bash
     cd frontend
     npm install
     ```
   - Backend:
     ```bash
     cd backend
     npm install
     ```

2. **Variables de Entorno:**
   - En `frontend/`, crea un archivo `.env` con la siguiente variable:
     ```env
     VITE_API_URL=http://localhost:3000
     ```
   - En `backend/`, crea un archivo `.env` con las credenciales de tu Cuenta de Servicio de Google Cloud y el ID de carpeta de Google Drive:
     ```env
     PORT=3000
     GOOGLE_SERVICE_ACCOUNT_EMAIL="tu-email-servicio@..."
     GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
     GOOGLE_DRIVE_FOLDER_ID="id_de_tu_carpeta_en_drive"
     ```

3. **Levantar los entornos:**
   - Frontend (React + Vite):
     ```bash
     cd frontend
     npm run dev
     ```
   - Backend (Express + Nodemon):
     ```bash
     cd backend
     npm run dev
     ```
