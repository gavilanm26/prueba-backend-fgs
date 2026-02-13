# Backend Technical Test

Esta solución está construida siguiendo una **arquitectura de microservicios independientes**.

Para facilitar la evaluación de la prueba técnica, todos los servicios fueron agrupados en un único repositorio, permitiendo levantar toda la solución en un solo comando.


La solución puede ejecutarse de diferentes formas según la necesidad:

1.  **Full Stack con Docker (Recomendado)**: Levanta Frontend + Backend + BDs.
2.  **Solo Backend con Docker**: Levanta solo los servicios y BDs.
3.  **Híbrido / Local**: Ejecuta servicios individualmente (útil para desarrollo).

## 📋 Requisitos

- **Docker**
- **Docker Compose**
- **Node.js** (solo si se ejecuta localmente)

## 🚀 Opción 1 — Ejecutar con Docker (Recomendado)

### 1. Clonar el repositorio:

```bash
git clone https://github.com/usuario/prueba-backend.git
cd prueba-backend
```

### 2. Levantar la infraestructura completa (Frontend + Backend + BDs):

Esta es la opción recomendada, ya que levanta **toda la solución** (incluyendo el frontend) lista para probar.

```bash
docker compose up --build
```

### 3. Servicios disponibles:

| Servicio | URL |
|----------|-----|
| **Identity / Auth / Onboarding** | http://localhost:3001 |
| **Products** | http://localhost:3002 |
| **Frontend** | http://localhost:3000 |

### 4. Infraestructura:

| Servicio | Host |
|----------|------|
| **Redis** | localhost:6379 |
| **MongoDB** | localhost:27017 |

## 🛠️ Opción 2 — Ejecutar servicios localmente

También es posible ejecutar los microservicios de forma local usando `npm run start:dev`.

En este caso **Docker debe estar ejecutándose previamente** para levantar MongoDB y Redis:

```bash
docker compose up -d mongo redis
```

Al ejecutar los servicios localmente, se deben ajustar las variables de entorno:

```env
REDIS_HOST=localhost
MONGO_CONNECTION_STRING=mongodb://localhost:27017
```

Y los puertos pueden modificarse si es necesario para evitar conflictos.

## 🧪 Probar endpoints

### Health check:

```bash
GET http://localhost:3001/health
GET http://localhost:3002/health
```

### Auth y Onboarding:

```bash
# Onboarding de cliente
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

# Autenticación
curl --location 'http://localhost:3001/v1/auth' \
--header 'Content-Type: application/json' \
--data '{
    "username": "Juan",
    "password": "clave1234"
}'
```

### Products:

```bash
GET http://localhost:3002/products
GET http://localhost:3002/products/{id}
```

## 📁 Estructura del Proyecto

```
prueba-backend-fgs/
├── fgs-identity-management/    # Servicio de autenticación y onboarding
├── fgs-products/               # Servicio de productos
├── fgs-frontend/               # Aplicación web frontend (Next.js)
├── docker-compose.yml          # Orquestación de servicios
└── README.md                   # Este archivo
```

## 📚 Documentación de Servicios

Cada microservicio tiene su propia documentación detallada:

- [Identity Management](./fgs-identity-management/README.md)
- [Products](./fgs-products/README.md)
- [Frontend](./fgs-frontend/README.md)

---

Desarrollado con ❤️ siguiendo arquitectura de microservicios.
