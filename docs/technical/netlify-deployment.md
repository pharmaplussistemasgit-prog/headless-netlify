# Deployment en Netlify - PharmaPlus Headless

Guía completa para desplegar el proyecto PharmaPlus en Netlify con todas las optimizaciones y mejores prácticas.

---

## 📋 Requisitos Previos

- Cuenta en [Netlify](https://netlify.com)
- Repositorio Git (GitHub, GitLab o Bitbucket)
- Node.js 18+ instalado localmente
- Netlify CLI (opcional, para testing local)

---

## 🚀 Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

Esto instalará:
- `@netlify/plugin-nextjs` - Plugin esencial para Next.js
- `@netlify/functions` - Para scheduled functions

### 2. Variables de Entorno

Configura las siguientes variables en **Netlify UI** → **Site Settings** → **Environment Variables**:

#### WordPress/WooCommerce
```bash
NEXT_PUBLIC_WORDPRESS_API_URL=https://tienda.pharmaplus.com.co/wp-json
NEXT_PUBLIC_WOOCOMMERCE_KEY=ck_xxxxx
WOOCOMMERCE_SECRET=cs_xxxxx
```

#### Supabase
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

#### Otros Servicios
```bash
NEXT_PUBLIC_MAPBOX_TOKEN=xxxxx
RESEND_API_KEY=re_xxxxx
CRON_SECRET=tu-secret-para-cron
```

#### Netlify (Automáticas)
```bash
URL=https://tu-sitio.netlify.app  # Netlify lo configura automáticamente
NEXT_PUBLIC_SITE_URL=https://tu-sitio.netlify.app
```

---

## 📦 Deploy desde Git

### Opción 1: Conectar Repositorio (Recomendado)

1. **Ir a Netlify Dashboard**
2. Click en **"Add new site"** → **"Import an existing project"**
3. Seleccionar tu proveedor Git (GitHub/GitLab/Bitbucket)
4. Autorizar acceso y seleccionar el repositorio
5. Configurar build settings:

```toml
Build command: npm run build
Publish directory: .next
```

6. Agregar variables de entorno (ver sección anterior)
7. Click en **"Deploy site"**

### Opción 2: Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Inicializar sitio
netlify init

# Deploy
netlify deploy --prod
```

---

## ⚙️ Configuración Automática

El archivo `netlify.toml` ya está configurado con:

✅ **Build Settings** - Comando y directorio de publicación  
✅ **Next.js Plugin** - ISR, Image Optimization, Middleware  
✅ **Redirects** - URLs antiguas redirigidas correctamente  
✅ **Security Headers** - CSP, X-Frame-Options, etc.  
✅ **Cache Headers** - Optimización de assets estáticos  
✅ **Scheduled Function** - Sync diario a las 2 AM  

---

## 🔄 Scheduled Functions

### Verificar Configuración

La función `scheduled-sync` está configurada para ejecutarse diariamente a las 2 AM:

**Archivo:** `netlify/functions/scheduled-sync.ts`  
**Schedule:** `0 2 * * *` (cron syntax)

### Monitorear Ejecución

1. **Netlify UI** → **Functions** → **scheduled-sync**
2. Ver logs de ejecución
3. Verificar errores si los hay

### Testing Local

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Ejecutar función localmente
netlify functions:invoke scheduled-sync
```

---

## 🌍 Edge Functions (Geolocalización)

La edge function de geolocalización está **deshabilitada por defecto**.

### Habilitar Edge Function

Descomentar en `netlify.toml`:

```toml
[[edge_functions]]
  function = "geolocation"
  path = "/*"
```

### Usar Datos de Geolocalización

Los headers estarán disponibles en el cliente:

```typescript
// En cualquier componente
const country = headers.get('X-User-Country'); // "CO"
const city = headers.get('X-User-City');       // "Bogotá"
```

---

## 🖼️ Image Optimization

Netlify Image CDN optimiza automáticamente las imágenes:

- ✅ Conversión a WebP/AVIF
- ✅ Redimensionamiento responsive
- ✅ Lazy loading
- ✅ Cache automático

**No requiere configuración adicional**, solo usar `next/image`:

```tsx
import Image from 'next/image';

<Image 
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
/>
```

---

## 🔒 Security Headers

Los siguientes headers de seguridad están configurados automáticamente:

- **X-Frame-Options:** DENY (previene clickjacking)
- **X-Content-Type-Options:** nosniff
- **X-XSS-Protection:** 1; mode=block
- **Referrer-Policy:** strict-origin-when-cross-origin
- **Permissions-Policy:** Deshabilita camera, microphone, etc.
- **Content-Security-Policy:** Política estricta configurada

### Verificar Headers

```bash
curl -I https://tu-sitio.netlify.app
```

---

## 📊 ISR (Incremental Static Regeneration)

El plugin `@netlify/plugin-nextjs` maneja automáticamente ISR.

### Páginas con ISR Configurado

- **Homepage:** `revalidate: 60` (1 minuto)
- **Categorías:** `revalidate: 300` (5 minutos)
- **Tienda:** `revalidate: 300` (5 minutos)

### On-Demand Revalidation

```typescript
// En API Route
import { revalidatePath } from 'next/cache';

export async function POST() {
  revalidatePath('/tienda');
  return Response.json({ revalidated: true });
}
```

---

## 🔍 Deploy Previews

Netlify crea automáticamente **Deploy Previews** para cada Pull Request.

### Beneficios

- ✅ Testing antes de merge
- ✅ URL única por PR
- ✅ Comentarios automáticos en GitHub
- ✅ Rollback fácil si hay problemas

### Acceder a Deploy Previews

1. Crear Pull Request en GitHub
2. Netlify comenta con URL del preview
3. Probar cambios en el preview
4. Merge cuando esté listo

---

## 🐛 Troubleshooting

### Build Falla

**Error:** `Module not found: @netlify/plugin-nextjs`

**Solución:**
```bash
npm install @netlify/plugin-nextjs --save-dev
```

### ISR No Funciona

**Verificar:**
1. Plugin instalado: `@netlify/plugin-nextjs`
2. Configurado en `netlify.toml`
3. `revalidate` configurado en páginas

### Scheduled Function No Ejecuta

**Verificar:**
1. Configuración en `netlify.toml`
2. Variables de entorno configuradas
3. Logs en Netlify UI → Functions

### Imágenes No Optimizan

**Verificar:**
1. Usar `next/image` (no `<img>`)
2. Configuración en `next.config.ts`
3. Dominios remotos en `remotePatterns`

---

## 📈 Performance Monitoring

### Netlify Analytics

Habilitar en **Site Settings** → **Analytics**:
- Pageviews
- Unique visitors
- Top pages
- Bandwidth usage

### Lighthouse CI

Agregar a tu workflow de CI/CD:

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://deploy-preview-${{ github.event.number }}--tu-sitio.netlify.app
```

---

## 🔄 Rollback

Si un deploy causa problemas:

1. **Netlify UI** → **Deploys**
2. Seleccionar deploy anterior
3. Click en **"Publish deploy"**
4. Confirmar rollback

---

## 📝 Checklist Post-Deploy

- [ ] ✅ Build exitoso
- [ ] ✅ Todas las páginas cargan
- [ ] ✅ ISR funciona (verificar revalidación)
- [ ] ✅ Imágenes optimizadas (WebP/AVIF)
- [ ] ✅ Redirects funcionan
- [ ] ✅ Headers de seguridad aplicados
- [ ] ✅ Scheduled function ejecuta
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Performance > 90 en Lighthouse
- [ ] ✅ SEO no afectado

---

## 🔗 Enlaces Útiles

- [Netlify Dashboard](https://app.netlify.com)
- [Netlify Docs - Next.js](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Essential Next.js Plugin](https://github.com/netlify/next-runtime)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Netlify Edge Functions](https://docs.netlify.com/edge-functions/overview/)

---

**Última actualización:** 21 de enero de 2026
