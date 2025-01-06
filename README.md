# Influencer Claims Frontend

Sistema de verificación y análisis de claims de influencers de salud, desarrollado con Next.js y TypeScript.

## 🚀 Funcionalidades Principales

- **Leaderboard de Influencers**
  - Ranking en tiempo real basado en precisión científica
  - Métricas de confianza y transparencia
  - Actualización diaria mediante análisis con IA
  - Visualización de tendencias y estadísticas

- **Análisis de Claims**
  - Verificación automática de afirmaciones
  - Sistema de puntuación de confiabilidad
  - Seguimiento de claims verificados
  - Estadísticas detalladas por influencer

- **Investigación y Verificación**
  - Creación de tareas de investigación
  - Selección de rangos de tiempo
  - Análisis de múltiples fuentes
  - Sistema de notas y observaciones

## 📋 Rutas del Sistema

- `/` - Página principal con el leaderboard
- `/influencers/[id]` - Detalles y análisis de un influencer específico
- `/research/new` - Creación de nuevas tareas de investigación

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone [url-del-repositorio]
cd influencer-claims-frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Copia el archivo de variables de entorno:
```bash
cp .env.example .env
```

4. Configura las variables de entorno en el archivo `.env`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

5. Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo con Turbopack
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 🔧 Tecnologías Principales

- Next.js 15.1.3
- React 19
- TypeScript
- TailwindCSS
- React Query
- Axios
- HeadlessUI
- HeroIcons

## 🔄 API Endpoints

### Influencers
- `GET /api/influencers/stats` - Estadísticas generales
- `GET /api/influencers/list` - Lista de influencers
- `GET /api/influencers/[id]` - Detalles de un influencer
- `POST /api/influencers/verify` - Verificación de influencer

### Investigación
- `POST /api/research/tasks` - Creación de tareas de investigación

## 💻 Requisitos del Sistema

- Node.js 20 o superior
- npm 9 o superior
