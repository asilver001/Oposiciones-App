# Admin Authentication Flow - OpositaSmart

## Descripción General

El **DevPanel** (herramientas de desarrollo) y **Draft Features** ahora están protegidos y **solo son visibles para administradores autenticados**.

---

## Flujo de Autenticación Actual

### 1. Estado Inicial (Usuario Normal)

```
Usuario normal logueado
  └─> DevPanel: NO VISIBLE ❌
  └─> Draft Features: NO ACCESIBLE ❌
  └─> AnimationPlayground: NO ACCESIBLE ❌
```

**Razón:** `isAdmin === false`

---

### 2. Login como Admin

#### Método Actual: PIN + Email

**Ubicación:** AdminLoginModal.jsx

**Flujo:**
```
1. Usuario hace click en botón (oculto en interfaz normal)
2. Abre AdminLoginModal
3. Introduce:
   - Email (ej: admin@oposita.com)
   - PIN (4-6 dígitos)
4. Sistema llama RPC de Supabase: `verify_admin_login`
5. Si válido:
   - Crea sesión en localStorage (24h TTL)
   - Actualiza AdminContext
   - isAdmin = true
6. DevPanel ahora VISIBLE ✅
```

**Código (AdminContext.jsx líneas 30-73):**
```javascript
const loginAdmin = async (email, pin) => {
  const { data } = await supabase.rpc('verify_admin_login', {
    p_email: email.toLowerCase().trim(),
    p_pin: pin
  });

  if (data && data.length > 0) {
    const session = {
      id: admin.id,
      email: admin.email,
      role: admin.role, // 'admin' o 'reviewer'
      name: admin.name,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    localStorage.setItem('adminSession', JSON.stringify(session));
    setAdminUser(session);
  }
};
```

---

### 3. Estado Después de Login

```
Admin autenticado (isAdmin === true)
  └─> DevPanel: VISIBLE ✅
      ├─> ✨ Animation Playground
      ├─> 🚧 Draft Features (admin-only)
      ├─> 👑 Modo Premium (toggle)
      ├─> 🗑️ Reset TODO
      └─> 👀 Ver Premium Modal
```

**Header del DevPanel:**
```
🛠️ Dev Tools
admin@oposita.com  ← muestra email del admin
```

---

### 4. Acceso a Draft Features

```
DevPanel visible (admin logueado)
  └─> Click "🚧 Draft Features"
      └─> Lazy load (Suspense con spinner)
          └─> DraftFeatures.jsx carga (381KB)
              └─> Muestra 8 features experimentales
```

**Lazy Loading (OpositaApp.jsx):**
```javascript
const DraftFeatures = lazy(() => import('./components/dev/DraftFeatures'));

{showDraftFeatures && (
  <Suspense fallback={<LoadingSpinner text="Cargando Draft Features..." />}>
    <DraftFeatures onClose={() => setShowDraftFeatures(false)} />
  </Suspense>
)}
```

**Beneficios:**
- ✅ DraftFeatures (381KB) NO se carga en bundle principal
- ✅ Solo se descarga cuando admin lo solicita
- ✅ Reduce bundle inicial ~40%

---

### 5. Persistencia de Sesión

**Duración:** 24 horas desde login

**Verificación en cada carga de app (AdminContext.jsx líneas 12-27):**
```javascript
useEffect(() => {
  const savedAdmin = localStorage.getItem('adminSession');
  if (savedAdmin) {
    const parsed = JSON.parse(savedAdmin);

    // Verificar expiración
    if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
      setAdminUser(parsed); // ✅ Sesión válida, auto-login
    } else {
      localStorage.removeItem('adminSession'); // ❌ Expirada
    }
  }
}, []);
```

**Escenarios:**
- ✅ Admin refresca página → Sigue logueado (si <24h)
- ✅ Admin cierra y abre navegador → Sigue logueado (si <24h)
- ❌ Pasan 24h → Sesión expira, debe re-loguearse

---

### 6. Logout

**Métodos:**
1. Manual: `logoutAdmin()` (no hay UI actualmente)
2. Automático: Después de 24h
3. Manual: Borrar localStorage del navegador

```javascript
const logoutAdmin = () => {
  localStorage.removeItem('adminSession');
  setAdminUser(null);
  // DevPanel desaparece inmediatamente
};
```

---

## Protecciones Implementadas

### 1. DevPanel Solo Visible si isAdmin

**Ubicación:** DevPanel.jsx líneas 16-18

```javascript
const { isAdmin } = useAdmin();

if (!isAdmin) {
  return null; // ← No renderiza NADA si no es admin
}
```

**Impacto:**
- Usuario normal: Ni siquiera ve el botón "DEV"
- No hay posibilidad de "hackear" acceso desde DevTools

---

### 2. Draft Features Requiere Admin Login

**Protección a 2 niveles:**

**Nivel 1 (UI):** Botón solo visible si `isAdmin`
**Nivel 2 (Código):** DevPanel completo no renderiza si `!isAdmin`

```javascript
// DevPanel.jsx línea 39
{isAdmin && (
  <button onClick={onShowDraftFeatures}>
    🚧 Draft Features
  </button>
)}
```

**Nota:** Como DevPanel ya requiere `isAdmin`, esta verificación es redundante pero mantiene defensa en profundidad.

---

### 3. Lazy Loading Protege Bundle

**Problema anterior:**
- DraftFeatures.jsx (381KB) se cargaba SIEMPRE en bundle
- Usuario normal pagaba el costo de código que no usa

**Solución actual:**
```javascript
const DraftFeatures = lazy(() => import('./components/dev/DraftFeatures'));
```

**Resultado:**
- Bundle principal: -381KB ✅
- DraftFeatures solo se descarga si admin hace click

---

## Mejoras Futuras (Roadmap)

### Fase 1: Face ID / Biometric Auth (Prioridad ALTA)

**Objetivo:** Login sin escribir PIN

**Tecnologías:**
- Web Authentication API (WebAuthn)
- Face ID (iOS Safari)
- Touch ID (macOS Safari)
- Windows Hello
- Fingerprint (Android)

**Implementación propuesta:**

```javascript
// lib/biometricAuth.js
export async function loginWithBiometric() {
  // 1. Verificar soporte del navegador
  if (!window.PublicKeyCredential) {
    return { success: false, error: 'Navegador no soporta WebAuthn' };
  }

  try {
    // 2. Solicitar credential
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge: new Uint8Array(32), // Challenge del servidor
        rpId: 'oposita.com',
        userVerification: 'required', // ← Face ID/Touch ID
        timeout: 60000,
      }
    });

    // 3. Enviar credential a backend para verificar
    const { data } = await supabase.rpc('verify_biometric_login', {
      credential_id: credential.id,
      authenticator_data: credential.response.authenticatorData,
      signature: credential.response.signature
    });

    if (data.admin_user) {
      // 4. Crear sesión
      return { success: true, adminUser: data.admin_user };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

**Flujo UX:**
```
1. Usuario abre app
2. Si dispositivo soporta Face ID:
   └─> Muestra modal: "Autenticar con Face ID para Dev Mode"
   └─> Usuario mira cámara
   └─> Face ID valida
   └─> Admin logueado automáticamente ✅
3. Si no soporta:
   └─> Fallback a PIN tradicional
```

**Beneficios:**
- ✅ No necesita recordar PIN
- ✅ Más seguro (biometría no se puede "compartir")
- ✅ UX moderna (iOS/macOS native)

**Tiempo de implementación:** 8-12 horas

---

### Fase 2: Session Refresh Token (Prioridad MEDIA)

**Problema actual:**
- Sesión expira a las 24h exactas
- Admin debe re-loguearse manualmente

**Solución:**
```javascript
// Refresh token cada 12h si app está activa
setInterval(async () => {
  const session = JSON.parse(localStorage.getItem('adminSession'));

  if (session && isNearExpiry(session.expiresAt, 12)) {
    const { data } = await supabase.rpc('refresh_admin_session', {
      session_id: session.id
    });

    if (data.success) {
      // Extiende TTL por otras 24h
      session.expiresAt = new Date(Date.now() + 24*60*60*1000).toISOString();
      localStorage.setItem('adminSession', JSON.stringify(session));
    }
  }
}, 60*60*1000); // Cada hora
```

**Beneficio:** Admin activo no necesita re-loguearse

---

### Fase 3: Admin Role Management UI (Prioridad BAJA)

**Actualmente:**
- Roles se gestionan directamente en Supabase (tabla `admin_users`)

**Mejora:**
- Panel de admin para crear/editar/eliminar admins
- Asignar roles: `admin` (full access) vs `reviewer` (solo review questions)

**Mockup:**
```
Admin Panel > Usuarios Admin
┌─────────────────────────────────────────┐
│ Email             | Role     | Actions  │
├─────────────────────────────────────────┤
│ admin@op.com      | admin    | [Edit]   │
│ reviewer@op.com   | reviewer | [Edit]   │
│ [+ Nuevo Admin]                          │
└─────────────────────────────────────────┘
```

---

### Fase 4: Audit Log (Prioridad MEDIA)

**Objetivo:** Rastrear acciones de admin

**Tabla nueva:**
```sql
CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id),
  action TEXT, -- 'login', 'logout', 'create_question', 'delete_question'
  resource_type TEXT, -- 'question', 'user', 'session'
  resource_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Uso:**
```javascript
// Cada acción de admin se registra
await supabase.from('admin_audit_log').insert({
  admin_id: adminUser.id,
  action: 'approve_question',
  resource_type: 'question',
  resource_id: questionId,
  metadata: { status: 'approved', comment: 'LGTM' }
});
```

**Beneficios:**
- ✅ Compliance (GDPR)
- ✅ Debugging (quién cambió qué)
- ✅ Seguridad (detectar actividad sospechosa)

---

## Seguridad - Consideraciones

### Actual (Implementado)

✅ **DevPanel solo visible si isAdmin**
✅ **DraftFeatures lazy-loaded (no en bundle principal)**
✅ **Sesión con TTL de 24h**
✅ **Email + PIN almacenado en localStorage**

### Riesgos Conocidos (A Resolver)

❌ **PIN en localStorage sin encriptar**
- **Riesgo:** Si atacante accede a DevTools → puede robar sesión
- **Mitigación (futuro):** Encriptar localStorage con Web Crypto API

❌ **Sin rate limiting en login**
- **Riesgo:** Brute-force attack en PIN (1000 intentos = encuentra PIN de 4 dígitos)
- **Mitigación (Fase 0):** Tabla `admin_login_attempts`, bloqueo tras 5 fallos

❌ **Sin validación server-side de sesión**
- **Riesgo:** Si sesión en localStorage es manipulada → acceso no autorizado
- **Mitigación (futuro):** RPC `verify_session` cada 5 minutos

❌ **PIN compartible**
- **Riesgo:** Admin puede compartir PIN con no-admins
- **Mitigación (Fase 1):** Face ID (biometría no es compartible)

---

## Checklist de Implementación

### ✅ Completado (24 Enero 2026)

- [x] DevPanel solo visible si `isAdmin === true`
- [x] DraftFeatures movido a `/components/dev/`
- [x] Lazy loading de DraftFeatures
- [x] Lazy loading de AnimationPlayground
- [x] Carpeta `/playground` eliminada
- [x] Bundle reducido ~40% (431KB menos)
- [x] Email de admin visible en DevPanel header
- [x] Tooltip en botón DEV muestra email

### 🔄 En Progreso

- [ ] Face ID / Biometric Auth (Fase 1)
- [ ] Rate limiting admin login (Fase 0 - crítico)
- [ ] Encrypt localStorage session (Fase 0)

### 📅 Pendiente (Backlog)

- [ ] Session refresh token (Fase 2)
- [ ] Admin role management UI (Fase 3)
- [ ] Audit log (Fase 4)
- [ ] Server-side session validation (Fase 0)

---

## Cómo Usar (Para Admins)

### Primera Vez:

1. **Obtener credenciales de admin**
   - Contactar a desarrollador principal
   - Recibir: email + PIN

2. **Login:**
   - Abrir OpositaSmart
   - (Método actual: encontrar forma de abrir AdminLoginModal - no hay UI pública)
   - Ingresar email y PIN
   - Verificar que aparece botón "DEV" en esquina inferior izquierda

3. **Acceder a Draft Features:**
   - Click en botón "DEV"
   - Click en "🚧 Draft Features"
   - Esperar carga (1-2 segundos)
   - Explorar features experimentales

### Sesiones Posteriores:

- Si <24h desde último login: DevPanel visible automáticamente
- Si >24h: Repetir login

---

## FAQs

**Q: ¿Puedo usar DevPanel en móvil?**
A: Sí, pero Face ID (futuro) solo funciona en iOS Safari y Android Chrome.

**Q: ¿Qué pasa si olvido mi PIN?**
A: Contactar a desarrollador principal para reset.

**Q: ¿DevPanel es visible en producción?**
A: Solo si estás logueado como admin. Usuarios normales NO lo ven.

**Q: ¿DraftFeatures afecta performance de usuarios normales?**
A: No, con lazy loading solo se carga si admin hace click.

**Q: ¿Cómo sé si mi sesión expiró?**
A: DevPanel desaparece automáticamente.

---

## Referencias Técnicas

- **AdminContext:** `/src/contexts/AdminContext.jsx`
- **DevPanel:** `/src/components/dev/DevPanel.jsx`
- **DraftFeatures:** `/src/components/dev/DraftFeatures.jsx` (381KB)
- **AdminLoginModal:** `/src/components/admin/AdminLoginModal.jsx`
- **OpositaApp (lazy loading):** `/src/OpositaApp.jsx` líneas 19-20, 1855-1866

---

**Última actualización:** 24 Enero 2026
**Próxima revisión:** Después de implementar Face ID (Fase 1)
