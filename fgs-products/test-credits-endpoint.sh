#!/bin/bash

# Script para probar el endpoint de créditos con autenticación

echo "🔐 Obteniendo token de autenticación..."
AUTH_RESPONSE=$(curl -s --location 'http://localhost:3010/v1/auth' \
  --header 'Content-Type: application/json' \
  --data '{
    "username": "Juan",
    "password": "clave1234"
  }')

echo "Respuesta de autenticación: $AUTH_RESPONSE"

# Extraer el token usando jq o grep/sed
TOKEN=$(echo $AUTH_RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')

if [ -z "$TOKEN" ]; then
  echo "❌ Error: No se pudo obtener el token"
  exit 1
fi

echo "✅ Token obtenido: ${TOKEN:0:50}..."

# Extraer expiresIn
EXPIRES_IN=$(echo $AUTH_RESPONSE | grep -o '"expiresIn":[0-9]*' | sed 's/"expiresIn"://')
echo "⏱️  Token expira en: $EXPIRES_IN milisegundos ($(echo "scale=2; $EXPIRES_IN/1000" | bc) segundos)"

echo ""
echo "🚀 Llamando al endpoint de créditos INMEDIATAMENTE..."
CREDITS_RESPONSE=$(curl -s --location 'http://localhost:3000/credits' \
  --header "Authorization: Bearer $TOKEN")

echo "Respuesta del endpoint de créditos:"
echo "$CREDITS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CREDITS_RESPONSE"
