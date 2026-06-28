# Memoria Mundial 2026

**Memoria Mundial 2026** es un dispositivo de archivo documental e investigación interdisciplinaria enfocado en analizar de manera crítica el impacto sociopolítico y cultural de la Copa Mundial de Fútbol en México 2026.

## 📌 Ejes de Investigación

Este repositorio centraliza el desarrollo tecnológico de la plataforma visual y el motor de base de datos que hospedará las siguientes líneas de investigación:

1. **Apuestas Deportivas:** Análisis del monopolio de plataformas y la hipercomercialización del deporte.
2. **Desigualdad Estructural:** Impacto en la gentrificación, limpieza social y el precio excluyente de los boletos.
3. **Género y Feminismo:** Condiciones de las jugadoras, dinámicas de acoso y violencia en el ecosistema del fútbol.
4. **Tecnologías y Control:** Comparativa histórica de infraestructuras de vigilancia y medios (1986 vs 2026).
5. **Discursos de Odio:** Racismo, clasismo y xenofobia amplificados en redes sociales.

## 🏗️ Arquitectura del Proyecto (Full-Stack)

El proyecto está dividido en dos aplicaciones principales para una clara separación de responsabilidades:

### 1. Frontend (`/frontend`)
La interfaz visual de cara al usuario final, diseñada bajo un sistema sobrio, editorial y elegante, respetando paletas de colores accesibles tanto en modos claro como oscuro.
- **Tecnologías:** React 19, Vite (v8), Tailwind CSS (v4), Lucide React.
- **Ejecución:** `cd frontend && npm run dev` (Requiere Node.js 22+)

### 2. Backend (`/backend`)
El motor de la aplicación encargado de procesar la lógica de negocio y conectarse como puente al sistema de archivos documentales (Google Drive).
- **Tecnologías:** Node.js, Express (v5), dotenv, cors, googleapis.
- **Ejecución:** `cd backend && npm run dev`

## 🚀 Requisitos Previos

- Node.js versión 20.19+ o 22.12+ (Recomendado usar `nvm` e instalar Node.js 22)
- Gestor de paquetes `npm`

---
*© 2026 Proyecto Universitario Memoria Mundial. Archivo Crítico Documental.*
