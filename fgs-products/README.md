# FGS Products - Microservicio de Gestión de Créditos

Microservicio de gestión de solicitudes de crédito construido con **NestJS**, siguiendo los principios de **Arquitectura Hexagonal (Puertos y Adaptadores)**.

## 🚀 Características Principales

- **Arquitectura Hexagonal**: Separación estricta entre dominio, aplicación e infraestructura
- **Autenticación JWT**: Validación de tokens firmados con RS256
- **MongoDB**: Persistencia de solicitudes de crédito
- **Guards Personalizados**: Validación y desencriptación de tokens JWT
- **Logging Estructurado**: Trazabilidad completa de operaciones

## 🏗️ Arquitectura

El proyecto sigue una estructura de capas:

- **Domain**: Entidades, objetos de valor y puertos (interfaces)
- **Application**: Casos de uso (orquestación) y DTOs
- **Infrastructure**: Adaptadores de entrada (HTTP) y salida (MongoDB)

## 🛠️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Server
PORT=3000

# MongoDB
MONGO_CONNECTION_STRING=mongodb://localhost:27017

# JWT Configuration (debe coincidir con fgs-identity-management)
JWT_PUBLIC_KEY=<clave_publica_base64>
JWT_KEY=claveRedis
```

> **⚠️ IMPORTANTE**: La `JWT_PUBLIC_KEY` debe ser la misma que se usa en el servicio `fgs-identity-management` para que la validación de tokens funcione correctamente.

### Dependencias Externas

Este microservicio requiere:

1. **MongoDB** corriendo en `localhost:27017`
2. **fgs-identity-management** corriendo en `localhost:3010` para autenticación

## 🚀 Ejecución

```bash
# Instalación de dependencias
npm install

# Modo desarrollo
npm run start:dev

# Producción
npm run start:prod
```

## 🧪 Pruebas

```bash
# Ejecutar todas las pruebas unitarias
npm run test

# Cobertura de código
npm run test:cov
```

## 📡 Endpoints

### Autenticación

Todos los endpoints requieren un token JWT válido en el header `Authorization`:

```bash
Authorization: Bearer <token>
```


Para obtener un token, primero debes autenticarte en el servicio `fgs-identity-management`:

```bash
curl --location 'http://localhost:3010/v1/auth' \
  --header 'Content-Type: application/json' \
  --data '{
    "username": "Juan",
    "password": "clave1234"
  }'
```

### Crear Solicitud de Crédito

`POST /credits`

Crea una nueva solicitud de crédito para un cliente.

**Ejemplo de cURL:**
```bash
curl --location 'http://localhost:3000/credits' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <TOKEN_AQUI>' \
  --data '{
    "customerId": "123456795",
    "purpose": "Compra de vehiculo",
    "amount": 50000,
    "term": 48
  }'
```

> **Nota:** Reemplaza `<TOKEN_AQUI>` con el token JWT obtenido del endpoint `/v1/auth`.

**Respuesta exitosa:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "customerId": "123456795",
  "purpose": "Compra de vehiculo",
  "amount": 50000,
  "term": 48,
  "status": "pending",
  "createdAt": "2026-02-12T22:00:00.000Z"
}
```

### Listar Todas las Solicitudes

`GET /credits`

Obtiene todas las solicitudes de crédito registradas en el sistema.

**Ejemplo de cURL:**
```bash
curl --location 'http://localhost:3000/credits' \
  --header 'Authorization: Bearer <TOKEN_AQUI>'
```

> **Nota:** Reemplaza `<TOKEN_AQUI>` con el token JWT obtenido del endpoint `/v1/auth`.

**Respuesta exitosa:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "customerId": "123456795",
    "purpose": "Compra de vehiculo",
    "amount": 50000,
    "term": 48,
    "status": "pending",
    "createdAt": "2026-02-12T22:00:00.000Z"
  }
]
```

### Obtener Solicitudes por Cliente

`GET /credits/:customerId`

Obtiene todas las solicitudes de crédito de un cliente específico.

**Ejemplo de cURL:**
```bash
curl --location 'http://localhost:3000/credits/123456795' \
  --header 'Authorization: Bearer <TOKEN_AQUI>'
```

> **Nota:** Reemplaza `<TOKEN_AQUI>` con el token JWT obtenido del endpoint `/v1/auth`.

**Respuesta exitosa:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "customerId": "123456795",
    "purpose": "Compra de vehiculo",
    "amount": 50000,
    "term": 48,
    "status": "pending",
    "createdAt": "2026-02-12T22:00:00.000Z"
  }
]


**Respuesta:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "customerId": "12345",
    "amount": 5000,
    "term": 12,
    "status": "pending",
    "createdAt": "2026-02-12T22:00:00.000Z"
  }
]
```

### Obtener Solicitudes por Cliente

`GET /credits/:customerId`

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "customerId": "12345",
    "amount": 5000,
    "term": 12,
    "status": "pending",
    "createdAt": "2026-02-12T22:00:00.000Z"
  }
]
```

## 🔐 Autenticación y Seguridad

### Flujo de Autenticación

1. El cliente se autentica en `fgs-identity-management` (`POST /v1/auth`)
2. Recibe un token JWT firmado con RS256 y payload encriptado con AES-256-GCM
3. Incluye el token en el header `Authorization: Bearer <token>` en cada petición
4. El `CreditsTokenGuard` valida:
   - Formato del token (3 partes: header.payload.signature)
   - Algoritmo de firma (RS256)
   - Firma digital usando la clave pública
   - Expiración del token
   - Desencriptación del payload

### Validación del Token

El guard personalizado `CreditsTokenGuard` realiza las siguientes validaciones:

1. **Verificación de firma**: Usando la clave pública RSA
2. **Validación de expiración**: Compara `exp` con el tiempo actual
3. **Desencriptación del payload**: Usando AES-256-GCM con la clave compartida
4. **Extracción de usuario**: Obtiene `sub` (user ID) y `username` del payload desencriptado

## 🛠️ Script de Prueba

Se incluye un script de prueba automatizado para verificar el flujo completo de autenticación:

```bash
./test-credits-endpoint.sh
```

Este script:
1. Obtiene un token del servicio de autenticación
2. Muestra el tiempo de expiración
3. Llama al endpoint `/credits` con el token
4. Muestra la respuesta

## 🐛 Troubleshooting

### Error: "Token expired"

**Causa**: El token JWT ha expirado (duración: 5 minutos)

**Solución**: Obtén un nuevo token del servicio de autenticación

### Error: "Invalid token"

**Causas posibles**:
1. La `JWT_PUBLIC_KEY` no coincide con la del servicio `fgs-identity-management`
2. El token está mal formado
3. La firma no es válida

**Solución**: Verifica que las claves públicas coincidan en ambos servicios

### Token en caché antiguo

Si Redis está cacheando tokens antiguos, limpia el caché:

```bash
redis-cli -a claveRedis FLUSHALL
```

## 📝 Notas Técnicas

- Los tokens JWT tienen una duración de **5 minutos** (300,000 ms)
- El payload del token está encriptado con **AES-256-GCM**
- La firma usa el algoritmo **RS256** (RSA con SHA-256)
- Las claves públicas deben estar sincronizadas entre servicios

---

Desarrollado con ❤️ siguiendo los estándares de arquitectura limpia.
