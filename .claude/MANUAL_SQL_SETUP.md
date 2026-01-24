# Manual SQL Setup - check_user_role Function

## ⚠️ Acción Requerida

Necesitas ejecutar este SQL manualmente en Supabase para que el login como admin funcione.

---

## 📍 Dónde ejecutar

1. Ve a: https://supabase.com/dashboard/project/yutfgmiyndmhsjhzxkdr/sql/new
2. Pega el SQL de abajo
3. Click "Run" (Ctrl+Enter)

---

## 📝 SQL a Ejecutar

```sql
-- Function to check if user has admin/reviewer role
CREATE OR REPLACE FUNCTION check_user_role(p_email TEXT)
RETURNS TABLE (
  "isAdmin" BOOLEAN,
  "isReviewer" BOOLEAN,
  role TEXT,
  name TEXT,
  id UUID,
  email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (admin_users.role = 'admin') AS "isAdmin",
    (admin_users.role IN ('admin', 'reviewer')) AS "isReviewer",
    admin_users.role,
    admin_users.name,
    admin_users.id,
    admin_users.email
  FROM admin_users
  WHERE LOWER(admin_users.email) = LOWER(p_email)
  LIMIT 1;

  -- If no rows found, return NULL values (user is not admin/reviewer)
  IF NOT FOUND THEN
    RETURN QUERY SELECT
      FALSE AS "isAdmin",
      FALSE AS "isReviewer",
      NULL::TEXT AS role,
      NULL::TEXT AS name,
      NULL::UUID AS id,
      NULL::TEXT AS email;
  END IF;
END;
$$;

-- Grant execute permission to authenticated users and anon
GRANT EXECUTE ON FUNCTION check_user_role(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION check_user_role(TEXT) TO anon;

-- Add comment
COMMENT ON FUNCTION check_user_role(TEXT) IS 'Check if a user email belongs to an admin or reviewer. Returns role information or null values if not found. Used by AuthContext for unified authentication.';
```

---

## ✅ Verificar que funcionó

Después de ejecutar el SQL, ejecuta esto para verificar:

```sql
-- Test 1: Verificar que la función existe
SELECT routine_name
FROM information_schema.routines
WHERE routine_name = 'check_user_role';

-- Test 2: Probar con tu email de admin
SELECT * FROM check_user_role('TU_EMAIL_DE_ADMIN@example.com');
-- Debe retornar: isAdmin=true, isReviewer=true, role='admin', name='...', id='...', email='...'

-- Test 3: Probar con email que NO es admin
SELECT * FROM check_user_role('usuario_normal@example.com');
-- Debe retornar: isAdmin=false, isReviewer=false, role=NULL, name=NULL, id=NULL, email=NULL
```

---

## 🔧 Cómo Funciona

### Antes (Complejo):
```
Login normal → user_profiles
Login admin  → admin_users (PIN separado)
DevPanel     → AdminContext (PIN)
```

### Ahora (Simple):
```
Login único  → auth.users
             → check_user_role(email) verifica si está en admin_users
             → AuthContext detecta automáticamente isAdmin
             → DevPanel aparece si isAdmin=true ✅
```

---

## 🎯 Flujo de Usuario

1. **Usuario normal:**
   ```
   Login con email+password
     → check_user_role retorna isAdmin=false
     → DevPanel NO aparece
   ```

2. **Admin:**
   ```
   Login con email+password (MISMO login que usuario normal)
     → check_user_role retorna isAdmin=true
     → DevPanel aparece automáticamente ✅
   ```

---

## 🐛 Troubleshooting

### DevPanel no aparece después de login

**1. Verificar que tu email está en admin_users:**
```sql
SELECT * FROM admin_users WHERE LOWER(email) = LOWER('tu_email@example.com');
```

Si NO aparece:
```sql
INSERT INTO admin_users (email, role, name, pin_code)
VALUES ('tu_email@example.com', 'admin', 'Tu Nombre', '1234');
```

**2. Verificar que la función retorna datos correctos:**
```sql
SELECT * FROM check_user_role('tu_email@example.com');
```

Debe retornar `isAdmin=true`

**3. Verificar en navegador:**
```javascript
// En DevTools Console después de login:
const { data, error } = await supabase.rpc('check_user_role', { p_email: 'tu_email@example.com' });
console.log(data);
```

**4. Refrescar página:**
Después del login, refresca la página (F5) para que AuthContext cargue el role.

---

## 📊 Ventajas del Nuevo Sistema

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Sistemas de auth** | 2 (user + admin PIN) | 1 (user unificado) |
| **Contraseñas a recordar** | 2 (password + PIN) | 1 (password) |
| **Complejidad** | Alta | Baja |
| **UX** | Confusa (catch-22) | Simple ✅ |
| **Seguridad** | PIN en localStorage | Password de Supabase ✅ |
| **Mantenibilidad** | AdminContext duplicado | AuthContext único ✅ |

---

## 🔐 Seguridad

**¿Es seguro?**

✅ **Más seguro que antes:**
- No hay PIN separado en localStorage
- Usa passwords hasheadas de Supabase
- RLS sigue protegiendo datos
- check_user_role es SECURITY DEFINER (safe)

**Mejoras futuras:**
- Face ID / WebAuthn (elimina passwords)
- 2FA para admins
- Rate limiting en login

---

## 📝 Cambios en Código

**Archivos modificados:**
- `/src/components/dev/DevPanel.jsx` - Usa `useAuth()` en lugar de `useAdmin()`
- `/src/OpositaApp.jsx` - Eliminado atajo de teclado Ctrl+Shift+A (ya no necesario)

**Archivos creados:**
- `/supabase/migrations/007_add_check_user_role_function.sql` - Migración (no aplicada aún)
- `/.claude/MANUAL_SQL_SETUP.md` - Este documento

---

## 🚀 Próximos Pasos

1. **Tú:** Ejecuta el SQL en Supabase dashboard
2. **Tú:** Verifica que funciona con `SELECT * FROM check_user_role('tu_email')`
3. **Yo:** Commit y deploy
4. **Tú:** Login normal con tu email de admin
5. **Resultado:** DevPanel aparece automáticamente ✅

---

**Creado:** 2026-01-24
**Relacionado:** [ADMIN_AUTH_FLOW.md](./ADMIN_AUTH_FLOW.md), [CHANGELOG_DEV_MODE.md](./CHANGELOG_DEV_MODE.md)
