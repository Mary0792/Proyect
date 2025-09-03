# API de Sensores - Método MCP

API REST completa para gestión de datos de sensores utilizando el patrón arquitectónico MCP (Model-Controller-Provider) con MongoDB.

## 🏗️ Arquitectura MCP

- **Model**: Define el esquema de datos y validaciones
- **Controller**: Maneja la lógica de negocio y respuestas HTTP
- **Provider**: Gestiona el acceso a datos y operaciones de base de datos

## 🚀 Características

- ✅ CRUD completo para sensores
- ✅ Paginación y filtros avanzados
- ✅ Estadísticas agregadas
- ✅ Validación de datos
- ✅ Manejo de errores robusto
- ✅ Logging y monitoreo
- ✅ Seguridad con Helmet
- ✅ CORS configurado
- ✅ Documentación de API

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd api_sensor
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
```

Editar `.env` con tus configuraciones:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sensor_db
JWT_SECRET=tu_jwt_secret_aqui
```

4. **Iniciar MongoDB**
```bash
# Asegúrate de tener MongoDB instalado y ejecutándose
mongod
```

5. **Ejecutar la aplicación**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📊 Estructura de Datos

### Sensor
```json
{
  "sensor": "sonido",
  "fecha": "2025-09-03T10:50:10",
  "valor_crudo": 2675,
  "porcentaje": 65.3
}
```

### Tipos de Sensor Válidos
- `sonido`
- `luz`
- `temperatura`
- `humedad`
- `presion`

## 🔌 Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### 1. Crear Sensor
```http
POST /sensors
Content-Type: application/json

{
  "sensor": "sonido",
  "fecha": "2025-09-03T10:50:10",
  "valor_crudo": 2675,
  "porcentaje": 65.3
}
```

### 2. Obtener Todos los Sensores
```http
GET /sensors?page=1&limit=10&sensor=sonido&startDate=2025-09-01&endDate=2025-09-30&sortBy=fecha&sortOrder=desc
```

**Parámetros de consulta:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `sensor`: Filtrar por tipo de sensor
- `startDate`: Fecha de inicio (YYYY-MM-DD)
- `endDate`: Fecha de fin (YYYY-MM-DD)
- `sortBy`: Campo para ordenar (default: fecha)
- `sortOrder`: Orden (asc/desc, default: desc)

### 3. Obtener Sensor por ID
```http
GET /sensors/:id
```

### 4. Actualizar Sensor
```http
PUT /sensors/:id
Content-Type: application/json

{
  "valor_crudo": 2800,
  "porcentaje": 70.5
}
```

### 5. Eliminar Sensor
```http
DELETE /sensors/:id
```

### 6. Estadísticas
```http
GET /sensors/stats?sensor=sonido
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "total": 150,
    "avgValorCrudo": 2456.78,
    "avgPorcentaje": 58.92,
    "minValorCrudo": 1200,
    "maxValorCrudo": 3500,
    "minPorcentaje": 25.5,
    "maxPorcentaje": 95.2
  }
}
```

### 7. Sensores por Tipo
```http
GET /sensors/type/sonido
```

### 8. Crear Múltiples Sensores
```http
POST /sensors/bulk
Content-Type: application/json

{
  "sensors": [
    {
      "sensor": "sonido",
      "fecha": "2025-09-03T10:50:10",
      "valor_crudo": 2675,
      "porcentaje": 65.3
    },
    {
      "sensor": "luz",
      "fecha": "2025-09-03T10:50:10",
      "valor_crudo": 1820,
      "porcentaje": 44.4
    }
  ]
}
```

### 9. Health Check
```http
GET /health
```

## 📁 Estructura del Proyecto

```
api_sensor/
├── config/
│   └── database.js          # Configuración de MongoDB
├── controllers/
│   └── SensorController.js  # Lógica de negocio
├── middleware/
│   └── errorHandler.js      # Manejo de errores
├── models/
│   └── Sensor.js           # Esquema de datos
├── providers/
│   └── SensorProvider.js    # Acceso a datos
├── routes/
│   └── sensorRoutes.js      # Definición de rutas
├── .env                     # Variables de entorno
├── env.example             # Ejemplo de variables
├── package.json            # Dependencias
├── README.md               # Documentación
└── server.js               # Servidor principal
```

## 🛠️ Scripts Disponibles

```bash
npm start          # Iniciar en producción
npm run dev        # Iniciar en desarrollo con nodemon
npm test           # Ejecutar pruebas (pendiente)
```

## 🔧 Configuración de Desarrollo

### MongoDB Local
```bash
# Instalar MongoDB
# Windows: https://docs.mongodb.com/manual/installation/
# macOS: brew install mongodb-community
# Linux: sudo apt install mongodb

# Iniciar MongoDB
mongod
```

### MongoDB Atlas (Cloud)
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/sensor_db
```

## 📝 Ejemplos de Uso

### Crear un sensor
```bash
curl -X POST http://localhost:3000/api/v1/sensors \
  -H "Content-Type: application/json" \
  -d '{
    "sensor": "sonido",
    "fecha": "2025-09-03T10:50:10",
    "valor_crudo": 2675,
    "porcentaje": 65.3
  }'
```

### Obtener sensores con filtros
```bash
curl "http://localhost:3000/api/v1/sensors?sensor=sonido&page=1&limit=5"
```

### Obtener estadísticas
```bash
curl "http://localhost:3000/api/v1/sensors/stats?sensor=sonido"
```

## 🚨 Manejo de Errores

La API devuelve respuestas consistentes:

```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": ["Error 1", "Error 2"]  // Solo en errores de validación
}
```

### Códigos de Estado HTTP
- `200`: Operación exitosa
- `201`: Recurso creado
- `400`: Error de validación o datos inválidos
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

## 🔒 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configuración de origen cruzado
- **Validación**: Validación de entrada en modelo y controlador
- **Sanitización**: Limpieza de datos de entrada

## 📈 Monitoreo

- **Morgan**: Logging de requests HTTP
- **Health Check**: Endpoint para verificar estado del servicio
- **Métricas**: Estadísticas de sensores disponibles

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 🆘 Soporte

Para soporte, email: tu-email@ejemplo.com

---

**Desarrollado con ❤️ usando Node.js, Express, MongoDB y el patrón MCP**
