# Cyberpunk TODO - Docker

Aplicación Angular de gestión de TODOs con estilo Cyberpunk, dockerizada y lista para producción.

## 🐳 Comandos Docker

### Construir la imagen
```bash
docker build -t cyberpunk-todo .
```

### Ejecutar el contenedor
```bash
docker run -d -p 8080:80 --name cyberpunk-todo-app cyberpunk-todo
```

### Usar Docker Compose (Recomendado)
```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down

# Reconstruir
docker-compose up -d --build
```

## 📦 Acceso a la aplicación

Una vez el contenedor esté corriendo, accede a:
- **URL**: http://localhost:8080

## 🛠️ Configuración

### Puertos
- Puerto por defecto: `8080`
- Para cambiar el puerto, modifica el `docker-compose.yml`:
  ```yaml
  ports:
    - "TU_PUERTO:80"
  ```

### Variables de entorno
Puedes agregar variables de entorno en `docker-compose.yml`:
```yaml
environment:
  - API_URL=https://tu-api.com
  - NODE_ENV=production
```

## 📝 Estructura Docker

- **Dockerfile**: Multi-stage build (Node para build + Nginx para servir)
- **nginx.conf**: Configuración optimizada de Nginx para Angular
- **.dockerignore**: Archivos excluidos del build
- **docker-compose.yml**: Orquestación simplificada

## 🚀 Deploy en producción

### Docker Hub
```bash
# Login
docker login

# Tag
docker tag cyberpunk-todo tu-usuario/cyberpunk-todo:latest

# Push
docker push tu-usuario/cyberpunk-todo:latest
```

### Docker Registry privado
```bash
docker tag cyberpunk-todo tu-registry.com/cyberpunk-todo:latest
docker push tu-registry.com/cyberpunk-todo:latest
```

## 📊 Monitoreo

Ver logs en tiempo real:
```bash
docker logs -f cyberpunk-todo-app
```

Ver recursos utilizados:
```bash
docker stats cyberpunk-todo-app
```

## 🔧 Troubleshooting

### La aplicación no carga
```bash
# Verificar que el contenedor está corriendo
docker ps

# Ver logs del contenedor
docker logs cyberpunk-todo-app

# Reiniciar el contenedor
docker restart cyberpunk-todo-app
```

### Reconstruir desde cero
```bash
# Detener y eliminar contenedor
docker-compose down

# Limpiar caché de build
docker builder prune

# Reconstruir
docker-compose up -d --build
```

## 🌐 API

La aplicación consume la API:
- **Endpoint**: https://todoapitest.juansegaliz.com/Todos

## 📄 Licencia

MIT
