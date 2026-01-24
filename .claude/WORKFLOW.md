# WORKFLOW - Guía de Flujo de Trabajo

> Este documento responde: "¿Qué debería hacer ahora?"

---

## Al Iniciar Sesión con Claude

Claude automáticamente:
1. Lee `PROJECT_STATUS.md`
2. Revisa el estado del pipeline de preguntas
3. Te presenta las opciones disponibles

---

## Árbol de Decisiones

```
¿Qué quieres hacer hoy?
│
├─▶ 📝 CREAR CONTENIDO
│   ├─▶ Crear preguntas nuevas (tema específico)
│   ├─▶ Reformular preguntas existentes
│   └─▶ Procesar preguntas en draft/
│
├─▶ ✅ REVISAR CONTENIDO
│   ├─▶ Ver preguntas en review/ (revisadas por IA)
│   ├─▶ Revisar preguntas en panel admin
│   └─▶ Ver reportes de usuarios
│
├─▶ 🚀 PUBLICAR
│   ├─▶ Subir preguntas aprobadas a Supabase
│   └─▶ Ver estadísticas de publicación
│
├─▶ 🏗️ DESARROLLO
│   ├─▶ Continuar con el roadmap
│   ├─▶ Revisar arquitectura del proyecto
│   └─▶ Implementar feature específico
│
└─▶ 📊 ANÁLISIS
    ├─▶ Ver métricas del proyecto
    ├─▶ Analizar preguntas rechazadas
    └─▶ Revisar feedback de usuarios
```

---

## Comandos Rápidos

Puedes decirle a Claude:

| Comando | Acción |
|---------|--------|
| "status" | Muestra estado actual del proyecto |
| "crear preguntas tema X" | Activa agente creador para tema X |
| "revisar draft" | Procesa preguntas en draft/ con agente revisor |
| "publicar aprobadas" | Sube preguntas de approved/ a Supabase |
| "siguiente paso" | Sugiere la siguiente tarea del roadmap |
| "revisar arquitectura" | Activa agente de arquitectura |

---

## Pipeline de Preguntas

### Flujo Normal (Pregunta Nueva)

```
1. CREAR
   └─▶ Agente Creator genera preguntas
   └─▶ Se guardan en .claude/questions/draft/
   └─▶ origin_type: "ai_generated"

2. REVISAR (IA) - Automático
   └─▶ Agente Reviewer analiza 7 dimensiones
   └─▶ Asigna confidence_score (0-1)
   └─▶ DECISIÓN AUTOMÁTICA:
       ├─▶ confidence >= 0.95 → Auto-aprobado → approved/
       ├─▶ confidence < 0.95 con corrección clara → Auto-corregido → approved/
       └─▶ confidence < 0.80 sin corrección clara → rejected/ (revisión humana)

3. REVISAR (Humano - solo rejected/)
   └─▶ Solo preguntas donde la IA no puede determinar la corrección
   └─▶ Casos: errores conceptuales, leyes ambiguas, múltiples interpretaciones

4. PUBLICAR
   └─▶ Agente Publisher sube approved/ a Supabase
   └─▶ Actualiza estadísticas
```

### Flujo Reformulación (Pregunta Existente)

```
1. SELECCIONAR
   └─▶ Pregunta original de examen/libro
   └─▶ Se guarda original_text

2. REFORMULAR
   └─▶ Agente Creator genera variante
   └─▶ Mantiene referencia al original
   └─▶ origin_type: "reformulated"

3. REVISAR (IA)
   └─▶ Compara con original_text
   └─▶ Verifica que mantiene esencia legal
   └─▶ Verifica que no es copia directa

4. REVISAR (Humano)
   └─▶ Panel muestra lado a lado: original vs reformulada
   └─▶ Aprobar/Rechazar/Pedir otra reformulación
```

---

## Gestión de Reportes de Usuarios

```
Usuario reporta error
        │
        ▼
┌───────────────────┐
│ question_reports  │
│ status: 'open'    │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ ¿3+ reportes?     │
└────────┬──────────┘
         │
    ┌────┴────┐
    │ SÍ      │ NO
    ▼         ▼
Auto-ocultar  Pendiente
(is_active    revisión
 = false)     manual
```

---

## Prioridades por Defecto

Cuando no sepas qué hacer, sigue este orden:

1. **Reportes críticos** (3+ usuarios) → Resolver primero
2. **Preguntas en rejected/** → Revisar manualmente (las que la IA no pudo resolver)
3. **Preguntas en approved/** → Publicar a Supabase
4. **Preguntas en draft/** → Procesar con agente revisor
5. **Roadmap** → Siguiente tarea de la fase actual
6. **Crear contenido** → Si el banco de preguntas lo necesita

---

## Frecuencia Sugerida de Tareas

| Tarea | Frecuencia |
|-------|------------|
| Revisar reportes de usuarios | Cada sesión |
| Publicar preguntas aprobadas | Cada sesión |
| Crear preguntas nuevas | Según necesidad |
| **Revisar referencias** | Semanal |
| **Auditar preguntas Supabase** | Mensual |
| **Verificar leyes vigentes** | Mensual |
| Revisar arquitectura | Cada 2 semanas |
| Analizar métricas | Semanal |

> Ver `MAINTENANCE.md` para detalles de cada tarea periódica.

---

## Carpeta de Referencias

```
.claude/references/
├── examenes/     # PDFs de exámenes antiguos
├── leyes/        # Textos legales vigentes
└── temario/      # Material de referencia
```

**Uso:**
- Coloca documentos relevantes en estas carpetas
- Claude los revisará periódicamente
- Se usarán para crear/validar preguntas

