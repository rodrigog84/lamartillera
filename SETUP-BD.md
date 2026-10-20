# Guía de Setup — Base de Datos Real (Supabase)

Todo el código ya está preparado para funcionar con Supabase real.
Solo necesitas seguir estos pasos **una vez**.

---

## Paso 1 — Activar el proyecto Supabase

El proyecto puede estar pausado si lleva días sin actividad (free tier).

1. Ve a → https://supabase.com/dashboard/project/pwivgwttljqsebujxeit
2. Si está pausado, haz clic en **"Restore project"**
3. Espera ~2 minutos hasta que diga "Healthy"

---

## Paso 2 — Crear las tablas (migración SQL)

1. En el dashboard de Supabase, ve a → **SQL Editor** (ícono de terminal en el sidebar)
2. Haz clic en **"New query"**
3. Copia y pega **todo** el contenido del archivo:
   ```
   supabase/migrations/20261020_001_init.sql
   ```
4. Haz clic en **"Run"** (botón verde)
5. Deberías ver `Success. No rows returned.`

Esto crea:
- Tabla `auctions` (remates)
- Tabla `profiles` (datos de usuarios)
- Tabla `user_favorites` (favoritos)
- Políticas RLS de seguridad
- Datos de muestra (11 remates precargados)

---

## Paso 3 — Obtener la Service Role Key

La necesitas para el script de seed (y para crear el usuario admin).

1. En el dashboard de Supabase, ve a → **Project Settings → API**
2. Copia el valor de **`service_role`** (secret)
3. Agrégala a tu `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...tu_clave_aquí
   ```

---

## Paso 4 — Crear usuario administrador

Opción A (recomendada) — via script:
```bash
node scripts/seed-db.mjs
```
Esto crea el admin con:
- Email: `admin@lamartillera.cl`
- Contraseña: `Admin1234!`

O personaliza:
```bash
ADMIN_EMAIL=tu@email.com ADMIN_PASSWORD=TuClave123! node scripts/seed-db.mjs
```

Opción B — Manualmente desde Supabase:
1. Ve a → **Authentication → Users → Add user**
2. Ingresa email y contraseña
3. Marca "Auto Confirm User"

---

## Paso 5 — Activar modo real en el proyecto

Edita `.env.local` y cambia:
```
VITE_MOCK_MODE=false
```

Reinicia el servidor de desarrollo:
```bash
npm run dev
```

---

## Paso 6 (opcional) — Desactivar confirmación de email

Por defecto Supabase requiere que los usuarios confirmen su email.
Para omitirlo en desarrollo:

1. Ve a → **Authentication → Providers → Email**
2. Desactiva **"Confirm email"**

---

## Variables de entorno finales (.env.local)

```
VITE_MOCK_MODE=false
VITE_SUPABASE_URL=https://pwivgwttljqsebujxeit.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...   ← agregar esta
```

---

## ¿Qué cambia al activar modo real?

| Función | Mock (true) | Real (false) |
|---------|-------------|--------------|
| Remates | localStorage | Tabla `auctions` en Supabase |
| Registro | localStorage | `supabase.auth.signUp` |
| Login | cualquier email | email + contraseña real |
| Favoritos | localStorage por usuario | Tabla `user_favorites` |
| Admin | cualquier credencial | email/contraseña del admin real |
| Imágenes | URLs de Unsplash | URLs de Unsplash (subir a Supabase Storage en paso futuro) |
