# FGS Identity Management

Servicio de gestión de identidad y autenticación construido con **NestJS**, siguiendo los principios de **Arquitectura Hexagonal (Puertos y Adaptadores)**.

## 🚀 Características Principales

- **Arquitectura Hexagonal**: Separación estricta entre dominio, aplicación e infraestructura.
- **Autenticación JWT**: Generación de tokens seguros firmados con RS256.
- **Seguridad Avanzada**: Payload de JWT encriptado con AES-256-GCM.
- **Caché con Redis**: Almacenamiento y reutilización de tokens para optimizar el rendimiento y reducir la carga.
- **Logging Estructurado**: Integración de `internalLogger` para trazabilidad completa de operaciones.
- **Pruebas de Calidad**: Suite completa de pruebas unitarias (100% pass).

## 🏗️ Arquitectura

El proyecto sigue una estructura de capas:

- **Domain**: Entidades, objetos de valor y puertos (interfaces).
- **Application**: Casos de uso (orquestación) y DTOs de aplicación.
- **Infrastructure**: Adaptadores de entrada (HTTP) y salida (Redis, MongoDB, JWT/Crypto).

## 🛠️ Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/fgs-identity
REDIS_HOST=localhost
REDIS_PORT=6381
REDIS_PASSWORD=your_password

# Seguridad
JWT_KEY=your_aes_32_char_key_here
JWT_EXPIRES_IN=3600
```

## 🚀 Ejecución

```bash
# Instalación de dependencias
$ npm install

# Modo desarrollo
$ npm run start:dev

# Producción
$ npm run start:prod
```

## 🧪 Pruebas

```bash
# Ejecutar todas las pruebas unitarias
$ npm run test

# Pruebas del módulo Auth
$ npm run test src/modules/auth

# Cobertura de código
$ npm run test:cov
```

## 📡 Endpoints Principales

### Auth Login
`POST /v1/auth-login`

**Cuerpo (JSON):**
```json
{
  "username": "admin",
  "password": "your_password"
}
```

**Respuesta:**
```json
{
  "accessToken": "ey...",
  "expiresIn": 3600
}
```

## 📝 Registro de Cambios Recientes

1.  **Optimización de Redis**: Se implementó `getWithTTL` usando pipelines para reducir latencia y ruido en los logs.
2.  **Reutilización de Tokens**: El sistema ahora verifica la caché antes de generar un nuevo JWT.
3.  **Suite de Pruebas**: Cobertura completa del flujo de autenticación.

---
Desarrollado con ❤️ siguiendo los estándares de arquitectura limpia.
