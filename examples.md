# Ejemplos de uso de la API de Sensores

## 1. Crear un sensor individual

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

## 2. Crear múltiples sensores

```bash
curl -X POST http://localhost:3000/api/v1/sensors/bulk \
  -H "Content-Type: application/json" \
  -d '{
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
      },
      {
        "sensor": "temperatura",
        "fecha": "2025-09-03T10:50:10",
        "valor_crudo": 2450,
        "porcentaje": 78.9
      }
    ]
  }'
```

## 3. Obtener todos los sensores

```bash
curl "http://localhost:3000/api/v1/sensors"
```

## 4. Obtener sensores con paginación

```bash
curl "http://localhost:3000/api/v1/sensors?page=1&limit=5"
```

## 5. Filtrar por tipo de sensor

```bash
curl "http://localhost:3000/api/v1/sensors?sensor=sonido"
```

## 6. Filtrar por rango de fechas

```bash
curl "http://localhost:3000/api/v1/sensors?startDate=2025-09-01&endDate=2025-09-30"
```

## 7. Ordenar por campo específico

```bash
curl "http://localhost:3000/api/v1/sensors?sortBy=valor_crudo&sortOrder=desc"
```

## 8. Obtener sensor por ID

```bash
curl "http://localhost:3000/api/v1/sensors/64f8a1b2c3d4e5f6a7b8c9d0"
```

## 9. Actualizar sensor

```bash
curl -X PUT http://localhost:3000/api/v1/sensors/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Content-Type: application/json" \
  -d '{
    "valor_crudo": 2800,
    "porcentaje": 70.5
  }'
```

## 10. Eliminar sensor

```bash
curl -X DELETE http://localhost:3000/api/v1/sensors/64f8a1b2c3d4e5f6a7b8c9d0
```

## 11. Obtener estadísticas generales

```bash
curl "http://localhost:3000/api/v1/sensors/stats"
```

## 12. Obtener estadísticas por tipo de sensor

```bash
curl "http://localhost:3000/api/v1/sensors/stats?sensor=sonido"
```

## 13. Obtener sensores por tipo específico

```bash
curl "http://localhost:3000/api/v1/sensors/type/sonido"
```

## 14. Health check

```bash
curl "http://localhost:3000/health"
```

## 15. Información de la API

```bash
curl "http://localhost:3000/"
```

## Ejemplos con PowerShell (Windows)

```powershell
# Crear sensor
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/sensors" -Method POST -ContentType "application/json" -Body '{
  "sensor": "sonido",
  "fecha": "2025-09-03T10:50:10",
  "valor_crudo": 2675,
  "porcentaje": 65.3
}'

# Obtener sensores
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/sensors" -Method GET
```

## Ejemplos con JavaScript (Node.js)

```javascript
const axios = require('axios');

// Crear sensor
const createSensor = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/v1/sensors', {
      sensor: 'sonido',
      fecha: '2025-09-03T10:50:10',
      valor_crudo: 2675,
      porcentaje: 65.3
    });
    console.log('Sensor creado:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

// Obtener sensores
const getSensors = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/sensors');
    console.log('Sensores:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

createSensor();
getSensors();
```

## Ejemplos con Python

```python
import requests
import json

# Crear sensor
def create_sensor():
    url = "http://localhost:3000/api/v1/sensors"
    data = {
        "sensor": "sonido",
        "fecha": "2025-09-03T10:50:10",
        "valor_crudo": 2675,
        "porcentaje": 65.3
    }
    
    response = requests.post(url, json=data)
    print("Respuesta:", response.json())

# Obtener sensores
def get_sensors():
    url = "http://localhost:3000/api/v1/sensors"
    response = requests.get(url)
    print("Sensores:", response.json())

create_sensor()
get_sensors()
```

## Respuestas esperadas

### Creación exitosa
```json
{
  "success": true,
  "message": "Sensor creado exitosamente",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "sensor": "sonido",
    "fecha": "2025-09-03T10:50:10.000Z",
    "valor_crudo": 2675,
    "porcentaje": 65.3,
    "createdAt": "2025-09-03T10:50:10.000Z",
    "updatedAt": "2025-09-03T10:50:10.000Z"
  }
}
```

### Lista de sensores
```json
{
  "success": true,
  "message": "Sensores obtenidos exitosamente",
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "sensor": "sonido",
      "fecha": "2025-09-03T10:50:10.000Z",
      "valor_crudo": 2675,
      "porcentaje": 65.3,
      "createdAt": "2025-09-03T10:50:10.000Z",
      "updatedAt": "2025-09-03T10:50:10.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### Error de validación
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    "El porcentaje no puede ser mayor a 100"
  ]
}
```
