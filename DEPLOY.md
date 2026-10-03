# Guía de despliegue — La Martillera

## Datos del servidor
- **IP**: 206.81.12.137
- **Usuario**: root
- **Sitio web**: https://lamartillera.cl / https://lamartillera.com
- **Archivos en servidor**: `/var/www/lamartillera/`

---

## 1. Actualizar el sitio (flujo normal)

Cada vez que hagas cambios en el código:

```powershell
# 1. Ir a la carpeta del proyecto
cd "c:\LabCursor\La Martillera"

# 2. Compilar la app
npm run build

# 3. Subir al servidor
scp -r dist/* root@206.81.12.137:/var/www/lamartillera/
```

Listo. No necesitas reiniciar Nginx — los archivos estáticos se sirven directamente.

---

## 2. Conectarse al servidor

```powershell
ssh root@206.81.12.137
```

---

## 3. Comandos útiles en el servidor

```bash
# Ver estado de Nginx
systemctl status nginx

# Reiniciar Nginx
systemctl restart nginx

# Recargar Nginx sin cortar conexiones (después de cambiar configuración)
systemctl reload nginx

# Verificar que la configuración de Nginx no tiene errores
nginx -t

# Ver logs de errores de Nginx en tiempo real
tail -f /var/log/nginx/error.log

# Ver logs de acceso en tiempo real
tail -f /var/log/nginx/access.log

# Ver espacio en disco
df -h

# Ver uso de memoria
free -h

# Ver procesos activos
htop
```

---

## 4. Editar configuración de Nginx

```bash
# Abrir el archivo de configuración
nano /etc/nginx/sites-available/lamartillera

# Después de editar, verificar y recargar
nginx -t && systemctl reload nginx
```

---

## 5. Certificado SSL

El certificado se renueva automáticamente. Si necesitas renovar manualmente:

```bash
certbot renew
systemctl reload nginx
```

Verificar fecha de vencimiento:

```bash
certbot certificates
```

---

## 6. Si el sitio no carga

```bash
# 1. Verificar que Nginx está corriendo
systemctl status nginx

# 2. Verificar la configuración
nginx -t

# 3. Revisar errores
tail -50 /var/log/nginx/error.log

# 4. Reiniciar si es necesario
systemctl restart nginx
```

---

## 7. Agregar un segundo sitio al servidor (futuro)

```bash
# Crear carpeta
mkdir -p /var/www/nombre-sitio

# Crear configuración
nano /etc/nginx/sites-available/nombre-sitio

# Activar
ln -s /etc/nginx/sites-available/nombre-sitio /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Certificado SSL
certbot --nginx -d dominio.cl -d www.dominio.cl
```

---

## 8. Verificar propagación DNS

Cuando cambies nameservers o registros DNS:

- https://dnschecker.org/#A/lamartillera.cl
- https://dnschecker.org/#A/lamartillera.com

En PowerShell local:
```powershell
nslookup lamartillera.cl
```

---

## Variables de entorno (Supabase)

Las credenciales de Supabase están en `.env.local` (no se sube a Git).
El `npm run build` las incluye automáticamente en la compilación.
Si cambias las credenciales, debes volver a compilar y subir.
