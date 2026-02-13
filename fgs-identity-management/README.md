# FGS Identity Management

Servicio de gestión de identidad y autenticación construido con **NestJS**, siguiendo los principios de **Arquitectura Hexagonal (Puertos y Adaptadores)**.

## 🚀 Características Principales

- **Arquitectura Hexagonal**: Separación estricta entre dominio, aplicación e infraestructura
- **Autenticación JWT**: Generación de tokens seguros firmados con RS256
- **Seguridad Avanzada**: Payload de JWT encriptado con AES-256-GCM
- **Caché con Redis**: Almacenamiento y reutilización de tokens para optimizar el rendimiento
- **Onboarding de Clientes**: Registro de nuevos usuarios con validación de unicidad
- **Logging Estructurado**: Integración de `internalLogger` para trazabilidad completa
- **Pruebas de Calidad**: Suite completa de pruebas unitarias

## 🏗️ Arquitectura

El proyecto sigue una estructura de capas:

- **Domain**: Entidades, objetos de valor y puertos (interfaces)
- **Application**: Casos de uso (orquestación) y DTOs de aplicación
- **Infrastructure**: Adaptadores de entrada (HTTP) y salida (Redis, MongoDB, JWT/Crypto)

## 🛠️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Server Configuration
PORT=3010

# MongoDB Configuration
MONGO_CONNECTION_STRING=mongodb://localhost:27017

# JWT Configuration
JWT_PRIVATE_KEY=<clave_privada_rsa_base64>
JWT_PUBLIC_KEY=<clave_publica_rsa_base64>
JWT_EXPIRES_IN=5m
JWT_KEY=claveRedis

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=claveRedis
```

### Configuración de JWT

#### Formato de `JWT_EXPIRES_IN`

El servicio soporta múltiples formatos para la expiración del token:

- **Segundos**: `3600` (1 hora en segundos)
- **Minutos**: `5m` (5 minutos)
- **Horas**: `1h` (1 hora)
- **Días**: `1d` (1 día)

**Ejemplos:**
```env
JWT_EXPIRES_IN=300      # 5 minutos (300 segundos)
JWT_EXPIRES_IN=5m       # 5 minutos
JWT_EXPIRES_IN=1h       # 1 hora
JWT_EXPIRES_IN=24h      # 24 horas
JWT_EXPIRES_IN=7d       # 7 días
```

#### Generación de Claves RSA

Para generar un nuevo par de claves RSA:

```bash
# Generar clave privada
openssl genrsa -out private.pem 2048

# Extraer clave pública
openssl rsa -in private.pem -pubout -out public.pem

# Convertir a Base64 para .env
cat private.pem | base64 | tr -d '\n'  # JWT_PRIVATE_KEY
cat public.pem | base64 | tr -d '\n'   # JWT_PUBLIC_KEY
```

> **⚠️ IMPORTANTE**: La `JWT_PUBLIC_KEY` debe compartirse con todos los microservicios que necesiten validar tokens (ej: `fgs-products`).

### Dependencias Externas

Este microservicio requiere:

1. **MongoDB** corriendo en `localhost:27017`
2. **Redis** corriendo en `localhost:6379`

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

# Pruebas del módulo Auth
npm run test src/modules/auth

# Cobertura de código
npm run test:cov
```

## 📡 Endpoints Principales

### Autenticación

`POST /v1/auth`

Genera un token JWT para un usuario autenticado.

**Cuerpo (JSON):**
```json
{
  "username": "Juan",
  "password": "clave1234"
}
```

**Ejemplo con curl:**
```bash
curl --location 'http://localhost:3010/v1/auth' \
--header 'Content-Type: application/json' \
--data '{
    "username": "Juan",
    "password": "clave1234"
}'
```

**Respuesta:**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 300000
}
```

**Campos de respuesta:**
- `accessToken`: Token JWT firmado con RS256
- `expiresIn`: Tiempo de expiración en milisegundos (ej: 300000 = 5 minutos)

### Onboarding de Clientes

`POST /v1/onboarding-client`

Registra un nuevo cliente en el sistema.

**Cuerpo (JSON):**
```json
{
  "username": "Juan",
  "name": "Juan",
  "document": 123456795,
  "email": "juan.perez@example.com",
  "amount": 1000,
  "password": "clave1234"
}
```

**Ejemplo con curl:**
```bash
curl --location 'http://localhost:3001/v1/onboarding-client' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "Juan",
    "name": "Juan",
    "document": 123456795,
    "email": "juan.perez@example.com",
    "amount": 1000,
    "password": "clave1234"
}'
```

**Respuesta:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "Juan",
  "name": "Juan",
  "document": 123456795,
  "email": "juan.perez@example.com",
  "amount": 1000,
  "createdAt": "2026-02-12T22:00:00.000Z"
}
```

**Validaciones:**
- `username` debe ser único
- `document` debe ser único
- `password` se almacena hasheado

## 🔐 Seguridad del Token JWT

### Estructura del Token

El token JWT generado tiene la siguiente estructura:

```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoi...".signature
│                                      │                  │
│                                      │                  └─ Firma RSA-SHA256
│                                      └─ Payload encriptado
└─ Header (algoritmo RS256)
```

### Proceso de Generación

1. **Creación del payload interno**:
   ```json
   {
     "sub": "user_id",
     "username": "juan_perez"
   }
   ```

2. **Encriptación del payload**: Se encripta con AES-256-GCM usando `JWT_KEY`

3. **Firma del token**: Se firma con la clave privada RSA usando el algoritmo RS256

4. **Resultado final**:
   ```json
   {
     "data": "iv:authTag:encryptedData",
     "iat": 1770951509,
     "exp": 1770951809
   }
   ```

### Validación del Token (en otros servicios)

Los servicios que consumen tokens (ej: `fgs-products`) deben:

1. **Verificar la firma** usando `JWT_PUBLIC_KEY`
2. **Validar la expiración** comparando `exp` con el tiempo actual
3. **Desencriptar el payload** usando `JWT_KEY`
4. **Extraer información del usuario** (`sub`, `username`)

## 🔄 Caché de Tokens en Redis

### Estrategia de Caché

Para optimizar el rendimiento y reducir la carga:

1. **Antes de generar un token nuevo**, el sistema verifica si existe un token válido en caché
2. **Si existe un token válido**, se reutiliza (evita generación innecesaria)
3. **Si no existe o expiró**, se genera un nuevo token y se almacena en Redis

### Estructura de Caché

```
Key: token:{userId}
Value: {
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 300000,
  "createdAt": 1770951509000
}
TTL: Tiempo de expiración del token
```

### Limpiar Caché

Si necesitas invalidar todos los tokens en caché:

```bash
redis-cli -a claveRedis FLUSHALL
```

## 🔗 Integración con Otros Microservicios

### Compartir Claves Públicas

Para que otros servicios puedan validar los tokens:

1. Copia el valor de `JWT_PUBLIC_KEY` del `.env` de este servicio
2. Pégalo en el `.env` del servicio consumidor (ej: `fgs-products`)
3. Asegúrate de que `JWT_KEY` también coincida en ambos servicios

**Ejemplo de configuración en `fgs-products`:**

```env
# Debe coincidir con fgs-identity-management
JWT_PUBLIC_KEY=LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0K...
JWT_KEY=claveRedis
```

## 🐛 Troubleshooting

### Tokens con expiración incorrecta

**Síntoma**: Los tokens expiran inmediatamente o tienen una duración incorrecta

**Causa**: Error en el parseo de `JWT_EXPIRES_IN`

**Solución**: Verifica que el formato sea correcto (ej: `5m`, `1h`, `3600`)

### Error: "Invalid token" en servicios consumidores

**Causas posibles**:
1. Las claves públicas no coinciden entre servicios
2. La clave `JWT_KEY` no coincide
3. El token está corrupto

**Solución**: 
1. Verifica que `JWT_PUBLIC_KEY` sea idéntica en ambos servicios
2. Verifica que `JWT_KEY` sea idéntica en ambos servicios
3. Limpia el caché de Redis y genera un nuevo token

### Tokens en caché antiguos

**Síntoma**: Después de cambiar la configuración, los tokens siguen siendo antiguos

**Solución**: Limpia el caché de Redis:

```bash
redis-cli -a claveRedis FLUSHALL
```

## 📝 Registro de Cambios Recientes

1. **Parseo mejorado de `JWT_EXPIRES_IN`**: Soporte para formatos `5m`, `1h`, `1d` además de segundos
2. **Optimización de Redis**: Implementación de `getWithTTL` usando pipelines
3. **Reutilización de Tokens**: Verificación de caché antes de generar nuevos tokens
4. **Onboarding con username único**: Validación de unicidad para `username` y `document`
5. **Suite de Pruebas**: Cobertura completa del flujo de autenticación

## 📚 Documentación Adicional

- [Arquitectura Hexagonal](https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [NestJS Documentation](https://docs.nestjs.com)

---

Desarrollado con ❤️ siguiendo los estándares de arquitectura limpia.
