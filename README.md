# Backend Technical Test

Esta solución está compuesta por **microservicios independientes**, agrupados en un único repositorio únicamente para facilitar la evaluación de la prueba técnica.

Con un solo comando es posible levantar **Frontend + Backend + Bases de datos**.

> ⚠️ **Nota importante**  
> Únicamente para efectos de esta prueba técnica, los archivos `.env` fueron incluidos en el repositorio con el fin de permitir ejecutar la solución inmediatamente sin configuraciones adicionales.  
> En un entorno productivo real, estos archivos **no deben versionarse** y deben gestionarse mediante variables de entorno seguras.

---

## Requisitos

- Docker  
- Docker Compose  
- Node.js (solo si se ejecuta localmente)

---

## Ejecutar la solución completa (Recomendado)

Clonar el repositorio:

git clone https://github.com/usuario/prueba-backend.git  
cd prueba-backend

Levantar todos los servicios:

docker compose up --build -d

---

## Servicios disponibles

Frontend → http://localhost:3000  
Identity / Auth / Onboarding → http://localhost:3001  
Products → http://localhost:3002  

Infraestructura:

Redis → localhost:6379  
MongoDB → localhost:27017  

---

## Endpoints disponibles (curl / Postman)

### Health checks

curl -i http://localhost:3001/health  
curl -i http://localhost:3002/health  

---

## Identity Service (Auth / Onboarding)

### Onboarding de cliente

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

### Autenticación (Login)

curl --location 'http://localhost:3001/v1/auth' \
--header 'Content-Type: application/json' \
--data-raw '{
  "username": "Juan",
  "password": "clave1234"
}'

---

## Products Service

### Crear producto

curl --location 'http://localhost:3002/products' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Producto de prueba",
  "description": "Producto creado desde curl",
  "price": 1500,
  "stock": 10
}'

### Listar productos

curl -i http://localhost:3002/products

### Consultar producto por id

curl -i http://localhost:3002/products/{id}

(Reemplaza `{id}` por un id válido retornado al crear o listar productos)

---

## Ejecutar servicios localmente (Opcional)

Levantar infraestructura:

docker compose up -d mongo redis

Ajustar variables de entorno:

REDIS_HOST=localhost  
MONGO_CONNECTION_STRING=mongodb://localhost:27017  

Ejecutar servicios:

npm run start:dev

---

## Estructura del proyecto

prueba-backend/  
├── fgs-identity-management  
├── fgs-products  
├── fgs-frontend  
├── docker-compose.yml  
└── README.md  

---

Cada microservicio contiene su propia documentación detallada dentro de su carpeta correspondiente.
